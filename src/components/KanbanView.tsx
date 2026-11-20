import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Priority, Task } from '../types/planner';

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'inprogress', title: 'En Progreso' },
  { id: 'done', title: 'Completado', isFinal: true },
];

export const KanbanView: React.FC = () => {
  const {
    tasks,
    openTaskModal,
    moveTask,
    searchQuery,
    filterPriority,
  } = usePlanner();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColId, setActiveDropColId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
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

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'critica': return 'text-rose-700 dark:text-rose-400 font-semibold';
      case 'alta': return 'text-amber-700 dark:text-amber-400 font-semibold';
      case 'media': return 'text-sky-700 dark:text-sky-400 font-medium';
      case 'baja': return 'text-slate-600 dark:text-slate-400 font-medium';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'critica': return 'Crítica';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
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
    if (activeDropColId !== colId) setActiveDropColId(colId);
  };

  const handleDragLeave = (_e: React.DragEvent, colId: string) => {
    if (activeDropColId === colId) setActiveDropColId(null);
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) moveTask(taskId, targetColId);
    setDraggedTaskId(null);
    setActiveDropColId(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  const renderTaskCard = (task: Task) => {
    const isDragging = draggedTaskId === task.id;
    const nextColumn = COLUMNS[COLUMNS.findIndex((c) => c.id === task.columnId) + 1];

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
        className={`group p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/75 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer select-none shadow-xs hover:shadow-md ${isDragging ? 'rotate-1' : ''}`}
      >
        {/* Top: Priority + Quick Move Arrow */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <span className={`text-[11px] ${getPriorityStyle(task.priority)}`}>
            {getPriorityLabel(task.priority)}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {nextColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveTask(task.id, nextColumn.id);
                }}
                className="min-h-[26px] min-w-[26px] p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center"
                title={`Avanzar a "${nextColumn.title}"`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 line-clamp-2 leading-snug mb-1.5">
          {task.title}
        </h3>

        {/* Description preview */}
        {task.description && (
          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Bottom: Dates + Subtasks */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            {task.startDate && (
              <span className="flex items-center gap-1 font-mono text-[10px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800/60">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Ini: {formatDate(task.startDate)}</span>
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1 font-mono text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                <Clock className="w-3 h-3 shrink-0" />
                <span>Fin: {formatDate(task.dueDate)}</span>
              </span>
            )}
          </div>

          {task.subtasks.length > 0 && (
            <span className="text-slate-600 dark:text-slate-400 font-mono font-medium">
              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-hidden pb-6">
      {/* View Header (without duplicate Nueva Tarea CTA; primary CTA lives in Header) */}
      <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-0.5">
            <span className="font-mono tabular-nums font-medium">{filteredTasks.length} tareas</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tablero de Tareas
          </h1>
        </div>
      </div>

      {/* DESKTOP: Multi-Column Grid */}
      <div className="hidden lg:block flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max items-start">
          {COLUMNS.map((column) => {
            const colTasks = filteredTasks.filter((t) => t.columnId === column.id);
            const isDropTarget = activeDropColId === column.id;

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-80 flex flex-col h-full rounded-2xl border transition-all duration-200 glass ${
                  isDropTarget
                    ? 'border-indigo-500/70 ring-2 ring-indigo-500/25'
                    : 'border-slate-200/80 dark:border-slate-800/60'
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {column.title}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {colTasks.length}
                    </span>
                    {column.isFinal && (
                      <span title="Etapa final">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => openTaskModal(undefined, column.id)}
                    className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors"
                    title={`Agregar en ${column.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5">
                  <AnimatePresence>
                    {colTasks.map((task) => renderTaskCard(task))}
                  </AnimatePresence>

                  {colTasks.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-white/50 dark:bg-slate-900/40">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        Sin tareas en esta etapa
                      </p>
                      <button
                        onClick={() => openTaskModal(undefined, column.id)}
                        className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:underline"
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

      {/* MOBILE: Column List View */}
      <div className="lg:hidden flex-1 overflow-y-auto space-y-4">
        {COLUMNS.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.columnId === column.id);

          return (
            <div key={column.id} className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {column.title} ({colTasks.length})
                </span>
                <button
                  onClick={() => openTaskModal(undefined, column.id)}
                  className="min-h-[32px] text-xs font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>

              <AnimatePresence>
                {colTasks.map((task) => renderTaskCard(task))}
              </AnimatePresence>

              {colTasks.length === 0 && (
                <div className="p-6 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">No hay tareas en esta etapa</p>
                  <button
                    onClick={() => openTaskModal(undefined, column.id)}
                    className="text-xs font-semibold text-indigo-700 dark:text-indigo-400"
                  >
                    + Crear tarea
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};