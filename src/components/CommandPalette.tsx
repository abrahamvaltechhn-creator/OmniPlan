import React, { useState } from 'react';
import {
  Search,
  X,
  Calendar,
  Columns3,
  GanttChart,
  Grid2X2,
  CheckCircle2,
  BarChart3,
  Plus,
  Sparkles,
  PanelLeft,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { RubroIcon } from './RubroIcon';
import { ViewMode } from '../types/planner';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    rubros,
    setActiveRubroId,
    setViewMode,
    openTaskModal,
    openRubroModal,
    toggleSidebar,
    isSidebarOpen,
  } = usePlanner();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const views: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'kanban', label: 'Tablero de Flujo (Kanban)', icon: <Columns3 className="w-4 h-4" /> },
    { mode: 'calendar', label: 'Calendario Mensual', icon: <Calendar className="w-4 h-4" /> },
    { mode: 'gantt', label: 'Cronograma Gantt / Plazos', icon: <GanttChart className="w-4 h-4" /> },
    { mode: 'matrix', label: 'Matriz de Prioridades (Eisenhower)', icon: <Grid2X2 className="w-4 h-4" /> },
    { mode: 'habits', label: 'Rastreador de Hábitos & KPIs', icon: <CheckCircle2 className="w-4 h-4" /> },
    { mode: 'analytics', label: 'Panel de Analíticas y Velocidad', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const filteredTasks = query.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredRubros = query.trim()
    ? rubros.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : rubros;

  const handleSelectTask = (task: (typeof tasks)[0]) => {
    setActiveRubroId(task.rubroId);
    openTaskModal(task);
    setCommandPaletteOpen(false);
  };

  const handleSelectView = (mode: ViewMode) => {
    setViewMode(mode);
    setCommandPaletteOpen(false);
  };

  const handleSelectRubro = (rubroId: string) => {
    setActiveRubroId(rubroId);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-16">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] mt-2 sm:mt-0">
        {/* Search input header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar tareas, cambiar de vista, saltar de rubro..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Quick Actions */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Acciones Inmediatas
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  openTaskModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left"
              >
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Crear nueva tarea en el flujo activo</span>
              </button>
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  openRubroModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Diseñar un nuevo rubro o flujo personalizado</span>
              </button>
              <button
                onClick={() => {
                  setCommandPaletteOpen(false);
                  toggleSidebar();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <PanelLeft className="w-4 h-4 text-slate-400" />
                  <span>{isSidebarOpen ? 'Ocultar barra lateral de rubros' : 'Mostrar barra lateral de rubros'}</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                  ⌘B
                </kbd>
              </button>
            </div>
          </div>

          {/* Matching Tasks */}
          {query.trim() && (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Tareas Encontradas ({filteredTasks.length})
              </span>
              {filteredTasks.length > 0 ? (
                <div className="space-y-1">
                  {filteredTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleSelectTask(task)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="truncate pr-2">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.tags.join(', ') || 'Sin etiquetas'} · {task.priority}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-slate-400 shrink-0">
                        {task.dueDate}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 px-3 py-1">
                  No se encontraron tareas con "{query}"
                </p>
              )}
            </div>
          )}

          {/* Navigation Views */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Vistas del Planificador
            </span>
            <div className="grid grid-cols-2 gap-1">
              {views.map((v) => (
                <button
                  key={v.mode}
                  onClick={() => handleSelectView(v.mode)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <span className="text-slate-400">{v.icon}</span>
                  <span className="truncate">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rubros Switcher */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Cambiar a Rubro
            </span>
            <div className="grid grid-cols-2 gap-1">
              {filteredRubros.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRubro(r.id)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <span className="text-slate-400">
                    <RubroIcon name={r.iconName} className="w-3.5 h-3.5" />
                  </span>
                  <span className="truncate">{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
