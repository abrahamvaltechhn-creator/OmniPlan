import React, { useState } from 'react';
import {
  Flame,
  CalendarClock,
  UserCheck,
  Ban,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { EisenhowerQuadrant, Task } from '../types/planner';

export const EisenhowerMatrixView: React.FC = () => {
  const { activeRubro, tasks, openTaskModal, moveTaskQuadrant, toggleSubtask } = usePlanner();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropQuadrant, setActiveDropQuadrant] = useState<EisenhowerQuadrant | null>(null);

  const rubroTasks = tasks.filter((t) => t.rubroId === activeRubro.id);

  const quadrantsConfig: {
    id: EisenhowerQuadrant;
    title: string;
    subtitle: string;
    actionLabel: string;
    icon: React.ReactNode;
    colorClasses: string;
    badgeClass: string;
  }[] = [
    {
      id: 1,
      title: 'Urgente & Importante',
      subtitle: 'Crisis y plazos inminentes',
      actionLabel: 'Hacer Ya',
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      colorClasses: 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10',
      badgeClass: 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60',
    },
    {
      id: 2,
      title: 'No Urgente & Importante',
      subtitle: 'Estrategia, diseño y prevención',
      actionLabel: 'Planificar',
      icon: <CalendarClock className="w-4 h-4 text-indigo-500" />,
      colorClasses: 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/10',
      badgeClass: 'text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60',
    },
    {
      id: 3,
      title: 'Urgente & No Importante',
      subtitle: 'Interrupciones o tareas operativas',
      actionLabel: 'Delegar',
      icon: <UserCheck className="w-4 h-4 text-amber-500" />,
      colorClasses: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10',
      badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60',
    },
    {
      id: 4,
      title: 'Ni Urgente Ni Importante',
      subtitle: 'Distracciones y tareas residuales',
      actionLabel: 'Eliminar / Postergar',
      icon: <Ban className="w-4 h-4 text-slate-500" />,
      colorClasses: 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30',
      badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
    },
  ];

  // Drag and drop between quadrants
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, qId: EisenhowerQuadrant) => {
    e.preventDefault();
    if (activeDropQuadrant !== qId) {
      setActiveDropQuadrant(qId);
    }
  };

  const handleDrop = (e: React.DragEvent, qId: EisenhowerQuadrant) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskQuadrant(taskId, qId);
    }
    setDraggedTaskId(null);
    setActiveDropQuadrant(null);
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-hidden pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{activeRubro.name}</span>
            <span aria-hidden="true">·</span>
            <span>Priorización Estratégica</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Matriz de Eisenhower
          </h1>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 overflow-y-auto">
        {quadrantsConfig.map((q) => {
          // Fallback quadrant logic: if not assigned, map based on priority
          const quadrantTasks = rubroTasks.filter((t) => {
            if (t.quadrant) return t.quadrant === q.id;
            // Default mapping
            if (q.id === 1 && t.priority === 'critica') return true;
            if (q.id === 2 && (t.priority === 'alta' || t.priority === 'media')) return true;
            if (q.id === 3 && t.priority === 'baja') return true;
            return false;
          });

          const isDropTarget = activeDropQuadrant === q.id;

          return (
            <div
              key={q.id}
              onDragOver={(e) => handleDragOver(e, q.id)}
              onDragLeave={() => setActiveDropQuadrant(null)}
              onDrop={(e) => handleDrop(e, q.id)}
              className={`flex flex-col rounded-2xl border p-4 transition-all duration-200 overflow-hidden ${
                q.colorClasses
              } ${isDropTarget ? 'ring-2 ring-indigo-500 scale-[1.008]' : ''}`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-xs">
                    {q.icon}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{q.title}</span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        ({quadrantTasks.length})
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {q.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider ${q.badgeClass}`}>
                  {q.actionLabel}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {quadrantTasks.map((task) => {
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => openTaskModal(task)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-shadow cursor-grab active:cursor-grabbing group select-none"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1">
                            {task.legalArea && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                                {task.legalArea}
                              </span>
                            )}
                            {task.caseNumber && (
                              <span className="font-mono text-[10px] text-slate-400 truncate">
                                {task.caseNumber}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1 mb-1">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span>Vence: {task.dueDate}</span>
                            {task.hearingDate && (
                              <>
                                <span>·</span>
                                <span className="text-amber-600 dark:text-amber-400 font-medium">Aud: {task.hearingDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {quadrantTasks.length === 0 && (
                  <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-300/80 dark:border-slate-800 rounded-xl text-center p-3">
                    <span className="text-[11px] text-slate-400">
                      Sin tareas en este cuadrante
                    </span>
                    <button
                      onClick={() => openTaskModal(undefined, undefined, undefined)}
                      className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                      + Añadir tarea
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
