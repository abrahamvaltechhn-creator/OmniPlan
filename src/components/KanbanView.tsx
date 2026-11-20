import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Scale,
  Bell,
  PenTool,
  FileText,
  Briefcase,
  Users,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { LegalArea, Priority, Task } from '../types/planner';

export const KanbanView: React.FC = () => {
  const {
    activeRubro,
    tasks,
    openTaskModal,
    moveTask,
    searchQuery,
    filterPriority,
  } = usePlanner();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColId, setActiveDropColId] = useState<string | null>(null);
  const [selectedLegalArea, setSelectedLegalArea] = useState<string>('todas');

  // Active mobile column tab
  const [selectedMobileColId, setSelectedMobileColId] = useState<string>(
    activeRubro.columns[0]?.id || ''
  );

  // Keep mobile column synced if active rubro changes
  React.useEffect(() => {
    if (!activeRubro.columns.some((c) => c.id === selectedMobileColId)) {
      setSelectedMobileColId(activeRubro.columns[0]?.id || '');
    }
  }, [activeRubro, selectedMobileColId]);

  // Filter tasks for current rubro and search/priority filters
  const rubroTasks = tasks.filter((task) => {
    if (task.rubroId !== activeRubro.id) return false;
    if (activeRubro.id === 'legal' && selectedLegalArea !== 'todas') {
      if (task.legalArea !== selectedLegalArea) return false;
    }
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchTags = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const getLegalAreaBadge = (area?: LegalArea) => {
    switch (area) {
      case 'laboral':
        return {
          label: 'Laboral',
          icon: Briefcase,
          color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/60',
          borderColor: 'border-sky-200 dark:border-sky-900/60 hover:border-sky-400',
        };
      case 'civil':
        return {
          label: 'Civil',
          icon: Scale,
          color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60',
          borderColor: 'border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-400',
        };
      case 'familia':
        return {
          label: 'Familia',
          icon: Users,
          color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
          borderColor: 'border-rose-200 dark:border-rose-900/60 hover:border-rose-400',
        };
      case 'penal':
        return {
          label: 'Penal',
          icon: ShieldAlert,
          color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
          borderColor: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400',
        };
      default:
        return null;
    }
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'critica':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'alta':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'media':
        return 'text-sky-600 dark:text-sky-400';
      case 'baja':
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'critica':
        return 'Crítica';
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColId !== colId) {
      setActiveDropColId(colId);
    }
  };

  const handleDragLeave = (_e: React.DragEvent, colId: string) => {
    if (activeDropColId === colId) {
      setActiveDropColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTask(taskId, targetColId);
    }
    setDraggedTaskId(null);
    setActiveDropColId(null);
  };

  // Compact, summarized cause card (Solo personal, no assignees, zero emojis, pastel aesthetic)
  const renderTaskCard = (task: Task, colIdx: number) => {
    const isDragging = draggedTaskId === task.id;
    const nextColumn = activeRubro.columns[colIdx + 1];
    const areaBadge = getLegalAreaBadge(task.legalArea);
    const AreaIcon = areaBadge?.icon;

    return (
      <motion.div
        key={task.id}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: isDragging ? 0.35 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        draggable
        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
        onClick={() => openTaskModal(task)}
        className={`group p-3 rounded-xl bg-white dark:bg-slate-900 border transition-all cursor-pointer select-none shadow-2xs hover:shadow-xs ${
          areaBadge ? areaBadge.borderColor : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-400'
        } ${isDragging ? 'rotate-1' : ''}`}
      >
        {/* Top line: Materia chip in soft pastel + Expediente + Next Column Quick Arrow */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {areaBadge && AreaIcon && (
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${areaBadge.color} shrink-0`}
              >
                <AreaIcon className="w-3 h-3 shrink-0" />
                <span>{areaBadge.label}</span>
              </span>
            )}
            {task.caseNumber && (
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
                {task.caseNumber}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className={`text-[10px] ${getPriorityStyle(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
            {nextColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveTask(task.id, nextColumn.id);
                }}
                className="min-h-[26px] min-w-[26px] p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                title={`Avanzar a "${nextColumn.title}"`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task / Cause Title (compact, crisp font) */}
        <h3 className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white line-clamp-2 leading-snug mb-2">
          {task.title}
        </h3>

        {/* Bottom line: Key Date (hearing or due date) + Brief Status */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            {task.hearingDate ? (
              <span className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/70 dark:border-amber-800/60">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{task.hearingDate.substring(5)} {task.hearingTime ? `· ${task.hearingTime}` : ''}</span>
              </span>
            ) : task.dueDate ? (
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{task.dueDate.substring(5)}</span>
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            {task.writtenBriefStatus && (
              <span className="text-slate-500 dark:text-slate-400">
                {task.writtenBriefStatus === 'presentado'
                  ? 'Presentado'
                  : task.writtenBriefStatus === 'listo_para_firma'
                  ? 'Listo firma'
                  : task.writtenBriefStatus === 'en_redaccion'
                  ? 'En redacción'
                  : 'Pendiente'}
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="text-slate-400 dark:text-slate-500 font-mono">
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Upcoming hearings sorted by date
  const upcomingHearings = rubroTasks
    .filter((t) => t.hearingDate)
    .sort((a, b) => (a.hearingDate! > b.hearingDate! ? 1 : -1));

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-hidden pb-20 lg:pb-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-0.5 sm:mb-1">
            <span>{activeRubro.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{rubroTasks.length} causas / tareas</span>
            {upcomingHearings.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  <span>{upcomingHearings.length} audiencias con fecha</span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tablero de Flujo Continuo
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openTaskModal(undefined, activeRubro.columns[0]?.id)}
            className="min-h-[42px] flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Causa / Tarea</span>
          </button>
        </div>
      </div>

      {/* Materia Filter Bar for Legal Rubro */}
      {activeRubro.id === 'legal' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none shrink-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
            Filtrar por Materia:
          </span>
          {[
            { id: 'todas', label: 'Todas las materias', icon: Layers },
            { id: 'laboral', label: 'Laboral', icon: Briefcase },
            { id: 'civil', label: 'Civil', icon: Scale },
            { id: 'familia', label: 'Familia', icon: Users },
            { id: 'penal', label: 'Penal', icon: ShieldAlert },
          ].map((materia) => {
            const IconComp = materia.icon;
            const count = materia.id === 'todas'
              ? tasks.filter((t) => t.rubroId === 'legal').length
              : tasks.filter((t) => t.rubroId === 'legal' && t.legalArea === materia.id).length;
            const isSelected = selectedLegalArea === materia.id;
            return (
              <button
                key={materia.id}
                onClick={() => setSelectedLegalArea(materia.id)}
                className={`min-h-[32px] px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 opacity-80 shrink-0" />
                <span>{materia.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected
                      ? 'bg-slate-700 text-slate-200 dark:bg-slate-300 dark:text-slate-900 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Aviso de Audiencias Señaladas (Alert Strip) */}
      {upcomingHearings.length > 0 && (
        <div className="mb-3.5 p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Aviso de Próximas Audiencias Señaladas ({upcomingHearings.length})
              </span>
            </div>
            <span className="text-[11px] text-amber-800/80 dark:text-amber-300 hidden sm:inline">
              Control judicial de términos y preparación de escritos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {upcomingHearings.slice(0, 3).map((hTask) => (
              <div
                key={hTask.id}
                onClick={() => openTaskModal(hTask)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer shadow-xs group text-left"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-900 dark:text-white mb-1">
                  <span className="truncate pr-1 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Scale className="w-3 h-3 shrink-0" />
                    <span className="truncate">{hTask.hearingType || 'Audiencia Señalada'}</span>
                    {hTask.legalArea && getLegalAreaBadge(hTask.legalArea) && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-semibold border ${getLegalAreaBadge(hTask.legalArea)!.color}`}>
                        {getLegalAreaBadge(hTask.legalArea)!.label}
                      </span>
                    )}
                  </span>
                  <span className="font-mono tabular-nums text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold shrink-0">
                    {hTask.hearingDate} {hTask.hearingTime ? `· ${hTask.hearingTime}h` : ''}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate mb-1">
                  {hTask.caseNumber ? `${hTask.caseNumber} - ` : ''}{hTask.title}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[130px]">{hTask.courtBranch || 'Juzgado'}</span>
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                    <PenTool className="w-3 h-3" />
                    <span>Trabajar escrito</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE ONLY: Horizontal Column Stage Switcher Carousel */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 scrollbar-none shrink-0">
        {activeRubro.columns.map((column) => {
          const isSelected = selectedMobileColId === column.id;
          const count = rubroTasks.filter((t) => t.columnId === column.id).length;

          return (
            <button
              key={column.id}
              onClick={() => setSelectedMobileColId(column.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{column.title}</span>
              <span
                className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
              {column.isFinal && <Sparkles className="w-3 h-3 text-amber-300" />}
            </button>
          );
        })}
      </div>

      {/* MOBILE ONLY: Focused Single Column View */}
      <div className="lg:hidden flex-1 overflow-y-auto space-y-3">
        {(() => {
          const currentCol =
            activeRubro.columns.find((c) => c.id === selectedMobileColId) ||
            activeRubro.columns[0];
          const colIdx = activeRubro.columns.findIndex((c) => c.id === currentCol?.id);
          const colTasks = rubroTasks.filter((t) => t.columnId === currentCol?.id);

          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {colTasks.length} {colTasks.length === 1 ? 'tarea' : 'tareas'} en {currentCol?.title}
                </span>
                <button
                  onClick={() => openTaskModal(undefined, currentCol?.id)}
                  className="min-h-[36px] text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir aquí</span>
                </button>
              </div>

              <AnimatePresence>
                {colTasks.map((task) => renderTaskCard(task, colIdx))}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-2">No hay tareas en esta etapa</p>
                  <button
                    onClick={() => openTaskModal(undefined, currentCol?.id)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                  >
                    + Crear tarea
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* DESKTOP ONLY: Multi-Column Horizontal Drag & Drop Grid */}
      <div className="hidden lg:block flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max items-start">
          {activeRubro.columns.map((column, colIdx) => {
            const colTasks = rubroTasks.filter((t) => t.columnId === column.id);
            const isDropTarget = activeDropColId === column.id;

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-80 flex flex-col h-full rounded-2xl border transition-all duration-200 ${
                  isDropTarget
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/90 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60'
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {column.title}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">
                      {colTasks.length}
                    </span>
                    {column.isFinal && (
                      <span title="Etapa de cierre con celebración">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openTaskModal(undefined, column.id)}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors"
                    title={`Nueva tarea en ${column.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5">
                  <AnimatePresence>
                    {colTasks.map((task) => renderTaskCard(task, colIdx))}
                  </AnimatePresence>

                  {colTasks.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-300/80 dark:border-slate-800 rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                        Sin tareas en esta etapa
                      </p>
                      <button
                        onClick={() => openTaskModal(undefined, column.id)}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        + Agregar tarea
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
