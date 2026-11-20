import React, { useState } from 'react';
import { Copy, Check, Mail, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Task } from '../types/planner';

export const Sidebar: React.FC = () => {
  const { user, tasks, isSidebarOpen, toggleSidebar } = usePlanner();
  const [copied, setCopied] = useState(false);

  const todoCount = tasks.filter((t: Task) => t.columnId === 'todo').length;
  const inProgressCount = tasks.filter((t: Task) => t.columnId === 'inprogress').length;
  const doneCount = tasks.filter((t: Task) => t.columnId === 'done').length;

  const copyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!isSidebarOpen) return null;

  const sidebarBody = (
    <div className="flex flex-col h-full">
      {/* User Profile */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
            aria-label="Cerrar barra lateral"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={copyEmail}
          className="mt-3 w-full flex items-center justify-between gap-2 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-200 bg-white/85 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors group"
          title="Copiar email al portapapeles"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
            <span className="truncate font-mono">{user.email}</span>
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3 border-b border-slate-200/80 dark:border-slate-800/60">
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
          Estado de Tareas
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/60 text-center">
            <span className="block text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {todoCount}
            </span>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
              Por Hacer
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/60 text-center">
            <span className="block text-lg font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {inProgressCount}
            </span>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
              En Progreso
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/60 text-center">
            <span className="block text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {doneCount}
            </span>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
              Completado
            </span>
          </div>
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="p-4 space-y-2">
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400">
          Por Prioridad
        </div>
        <div className="space-y-1.5">
          {(['critica', 'alta', 'media', 'baja'] as const).map((p) => {
            const count = tasks.filter((t: Task) => t.priority === p).length;
            if (count === 0) return null;
            const colors = {
              critica: 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/15',
              alta: 'text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/15',
              media: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15',
              baja: 'text-slate-700 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-500/15',
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
                <span className="text-xs font-medium text-slate-800 dark:text-slate-300 capitalize">
                  {p}
                </span>
                <span className="ml-auto text-xs font-mono tabular-nums font-semibold text-slate-600 dark:text-slate-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200/80 dark:border-slate-800/60 glass shrink-0 select-none">
        {sidebarBody}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div className="lg:hidden fixed inset-0 z-40 flex">
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          onClick={toggleSidebar}
        />
        <aside className="relative z-10 w-72 max-w-[85vw] h-full glass-strong border-r border-slate-200 dark:border-slate-800 select-none">
          {sidebarBody}
        </aside>
      </div>
    </>
  );
};