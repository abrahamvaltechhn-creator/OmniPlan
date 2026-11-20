import React from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Priority, Task } from '../types/planner';

export const GanttTimelineView: React.FC = () => {
  const { activeRubro, tasks, openTaskModal } = usePlanner();

  const rubroTasks = tasks.filter((t) => t.rubroId === activeRubro.id);

  // Define 14-day timeline window starting from 2026-11-01 to 2026-11-14
  const startWindow = new Date(2026, 10, 1);
  const totalTimelineDays = 14;

  const daysArray: { dayNum: number; dateStr: string; weekday: string }[] = [];
  const weekdaysShort = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

  for (let i = 0; i < totalTimelineDays; i++) {
    const d = new Date(startWindow);
    d.setDate(startWindow.getDate() + i);
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    daysArray.push({
      dayNum: d.getDate(),
      dateStr: `${d.getFullYear()}-${mStr}-${dStr}`,
      weekday: weekdaysShort[d.getDay()],
    });
  }

  // Calculate task span position on timeline
  const calculateBarSpan = (task: Task) => {
    const taskStart = new Date(task.startDate || '2026-11-01');
    const taskDue = new Date(task.dueDate || '2026-11-04');

    const diffStartDays = Math.max(
      0,
      Math.floor((taskStart.getTime() - startWindow.getTime()) / (1000 * 60 * 60 * 24))
    );
    const durationDays = Math.max(
      1,
      Math.floor((taskDue.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    // Percentage relative to the total timeline
    const leftPct = Math.min(100, (diffStartDays / totalTimelineDays) * 100);
    const widthPct = Math.min(100 - leftPct, (durationDays / totalTimelineDays) * 100);

    return {
      leftPct,
      widthPct: Math.max(6, widthPct),
      durationDays,
    };
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'critica':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800';
      case 'alta':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800';
      case 'media':
        return 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-800';
      case 'baja':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-hidden pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{activeRubro.name}</span>
            <span aria-hidden="true">·</span>
            <span>Diagrama de Gantt & Entregas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Cronograma Temporal
          </h1>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Tarea con Plazos</span>
        </button>
      </div>

      {/* Gantt Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col shadow-xs">
        {/* Timeline Axis Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
          <div className="w-64 sm:w-80 p-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 shrink-0">
            Hito / Actividad
          </div>
          <div className="flex-1 grid grid-cols-14 text-center divide-x divide-slate-200/70 dark:divide-slate-800">
            {daysArray.map((day) => {
              const isToday = day.dateStr === '2026-11-02';
              return (
                <div
                  key={day.dateStr}
                  className={`py-2 text-[11px] font-mono tabular-nums ${
                    isToday
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                    {day.weekday}
                  </span>
                  <span>{day.dayNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {rubroTasks.map((task) => {
            const span = calculateBarSpan(task);
            const col = activeRubro.columns.find((c) => c.id === task.columnId);

            return (
              <div
                key={task.id}
                onClick={() => openTaskModal(task)}
                className="flex items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                {/* Task Info Label */}
                <div className="w-64 sm:w-80 p-3 border-r border-slate-200/60 dark:border-slate-800 shrink-0 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">
                      <span className="truncate">{col?.title}</span>
                      {task.legalArea && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize font-medium text-slate-600 dark:text-slate-300">{task.legalArea}</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate block">
                      {task.title}
                    </span>
                  </div>

                  {task.caseNumber && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0 truncate max-w-[80px]">
                      {task.caseNumber}
                    </span>
                  )}
                </div>

                {/* Timeline Bar Track */}
                <div className="flex-1 relative h-12 flex items-center px-1">
                  {/* Grid background markers */}
                  <div className="absolute inset-0 grid grid-cols-14 pointer-events-none divide-x divide-slate-100 dark:divide-slate-800/50">
                    {daysArray.map((d) => (
                      <div
                        key={d.dateStr}
                        className={d.dateStr === '2026-11-02' ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}
                      />
                    ))}
                  </div>

                  {/* Active Task Duration Bar */}
                  <div
                    className={`absolute h-7 rounded-md flex items-center px-2 text-[11px] font-medium shadow-xs transition-all ${getPriorityColor(
                      task.priority
                    )} hover:brightness-105`}
                    style={{
                      left: `${span.leftPct}%`,
                      width: `${span.widthPct}%`,
                    }}
                    title={`${task.title}: ${task.startDate} al ${task.dueDate} (${span.durationDays} días)`}
                  >
                    <span className="truncate flex-1 font-semibold">{task.title}</span>
                    <span className="ml-1 text-[10px] font-mono tabular-nums opacity-90 hidden sm:inline">
                      {span.durationDays}d
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {rubroTasks.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No hay tareas registradas en este rubro para visualizar en el cronograma.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
