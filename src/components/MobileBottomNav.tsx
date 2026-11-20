import React from 'react';
import {
  Columns3,
  Calendar,
  Grid2X2,
  CheckCircle2,
  BarChart3,
  GanttChart,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { ViewMode } from '../types/planner';

export const MobileBottomNav: React.FC = () => {
  const { viewMode, setViewMode } = usePlanner();

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'kanban', label: 'Tablero', icon: <Columns3 className="w-5 h-5" /> },
    { mode: 'calendar', label: 'Calendario', icon: <Calendar className="w-5 h-5" /> },
    { mode: 'gantt', label: 'Gantt', icon: <GanttChart className="w-5 h-5" /> },
    { mode: 'matrix', label: 'Matriz', icon: <Grid2X2 className="w-5 h-5" /> },
    { mode: 'habits', label: 'Hábitos', icon: <CheckCircle2 className="w-5 h-5" /> },
    { mode: 'analytics', label: 'Métricas', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 select-none shadow-lg"
      aria-label="Navegación móvil inferior"
    >
      <div className="grid grid-cols-6 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = viewMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full px-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
