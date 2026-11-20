import React from 'react';
import { Copy, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Task } from '../types/planner';

export const Sidebar: React.FC = () => {
  const { user, tasks, isDarkMode, isSidebarOpen, setIsSidebarOpen, toggleSidebar } = usePlanner();

  const todoCount = tasks.filter((t: Task) => t.columnId === 'todo').length;
  const inProgressCount = tasks.filter((t: Task) => t.columnId === 'inprogress').length;
  const doneCount = tasks.filter((t: Task) => t.columnId === 'done').length;

  const copyEmail = () => {
    navigator.clipboard.writeText(user.email);
  };

  if (!isSidebarOpen) return null;

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/20 dark:border-slate-800/30 glass shrink-0 select-none">
      {/* User Profile */}
      <div className="p-4 border-b border-white/20 dark:border-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.role}</p>
          </div>
        </div>
        <button
          onClick={copyEmail}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-[12px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-800/50 rounded-lg transition-colors glass group"
          title="Copiar email al portapapeles"
        >
          <Mail className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
          <span className="truncate font-mono">{user.email}</span>
          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3 border-b border-white/20 dark:border-slate-800/30">
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          Estado de Tareas
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl glass text-center">
            <span className="block text-lg font-bold font-mono tabular-nums text-amber-500 dark:text-amber-400">{todoCount}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Por Hacer</span>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <span className="block text-lg font-bold font-mono tabular-nums text-indigo-500 dark:text-indigo-400">{inProgressCount}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">En Progreso</span>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <span className="block text-lg font-bold font-mono tabular-nums text-emerald-500 dark:text-emerald-400">{doneCount}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Completado</span>
          </div>
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="p-4 space-y-2">
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          Por Prioridad
        </div>
        <div className="space-y-1.5">
          {(['critica', 'alta', 'media', 'baja'] as const).map((p) => {
            const count = tasks.filter((t: Task) => t.priority === p).length;
            if (count === 0) return null;
            const colors = {
              critica: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10',
              alta: 'text-orange-500 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/10',
              media: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/10',
              baja: 'text-slate-500 dark:text-slate-400 bg-slate-500/10 dark:bg-slate-500/10',
            };
            const icons = {
              critica: <AlertCircle className="w-3.5 h-3.5" />,
              alta: <AlertCircle className="w-3.5 h-3.5" />,
              media: <Clock className="w-3.5 h-3.5" />,
              baja: <CheckCircle2 className="w-3.5 h-3.5" />,
            };
            return (
              <div key={p} className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
                <span className={`${colors[p]} w-6 h-6 rounded flex items-center justify-center shrink-0`}>
                  {icons[p]}
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">{p}</span>
                <span className="ml-auto text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Close button for mobile */}
      <div className="mt-auto p-4 border-t border-white/20 dark:border-slate-800/30 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-800/50 rounded-lg transition-colors glass"
        >
          <span>Ocultar barra lateral</span>
        </button>
      </div>
    </aside>
  );
};