import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Flame,
  Scale,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

export const AnalyticsView: React.FC = () => {
  const { activeRubro, tasks } = usePlanner();

  const rubroTasks = tasks.filter((t) => t.rubroId === activeRubro.id);

  // Status breakdown
  const finalColumn = activeRubro.columns.find((c) => c.isFinal);
  const completedTasks = rubroTasks.filter((t) => t.columnId === finalColumn?.id);
  const activeTasks = rubroTasks.filter((t) => t.columnId !== finalColumn?.id);

  const completionRate =
    rubroTasks.length > 0
      ? Math.round((completedTasks.length / rubroTasks.length) * 100)
      : 0;

  // Hours
  const totalEstimatedHours = rubroTasks.reduce(
    (acc, t) => acc + (t.estimatedHours || 0),
    0
  );
  const completedHours = completedTasks.reduce(
    (acc, t) => acc + (t.estimatedHours || 0),
    0
  );

  // Priority counts
  const criticalCount = rubroTasks.filter((t) => t.priority === 'critica').length;
  const highCount = rubroTasks.filter((t) => t.priority === 'alta').length;
  const mediumCount = rubroTasks.filter((t) => t.priority === 'media').length;
  const lowCount = rubroTasks.filter((t) => t.priority === 'baja').length;

  // Subtask counts
  const totalSubtasks = rubroTasks.reduce((acc, t) => acc + t.subtasks.length, 0);
  const completedSubtasks = rubroTasks.reduce(
    (acc, t) => acc + t.subtasks.filter((st) => st.completed).length,
    0
  );

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-y-auto pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>{activeRubro.name}</span>
          <span aria-hidden="true">·</span>
          <span>Métricas de Rendimiento & Flujo</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Panel de Analíticas y Velocidad
        </h1>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Tasa de Finalización</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-400">del flujo</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Tareas Activas</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {activeTasks.length}
            </span>
            <span className="text-xs text-slate-400">de {rubroTasks.length} total</span>
          </div>
          <span className="block mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            {completedTasks.length} entregas cerradas
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Horas de Esfuerzo</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalEstimatedHours}h
            </span>
            <span className="text-xs text-slate-400">estimadas</span>
          </div>
          <span className="block mt-3 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {completedHours}h en etapas finales
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Subtareas Ejecutadas</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {completedSubtasks}/{totalSubtasks}
            </span>
            <span className="text-xs text-slate-400">ítems</span>
          </div>
          <span className="block mt-3 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {totalSubtasks > 0
              ? `${Math.round((completedSubtasks / totalSubtasks) * 100)}% de avance micro`
              : 'Sin subtareas'}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Stage Distribution Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Distribución por Etapa de Flujo
          </h3>

          <div className="space-y-3.5">
            {activeRubro.columns.map((col) => {
              const count = rubroTasks.filter((t) => t.columnId === col.id).length;
              const pct = rubroTasks.length > 0 ? Math.round((count / rubroTasks.length) * 100) : 0;

              return (
                <div key={col.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {col.title}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        col.isFinal ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Workload Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Carga por Nivel de Criticidad
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-center">
                <span className="block text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                  {criticalCount}
                </span>
                <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300">Crítica</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-center">
                <span className="block text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
                  {highCount}
                </span>
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">Alta</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40 text-center">
                <span className="block text-lg font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
                  {mediumCount}
                </span>
                <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300">Media</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700 text-center">
                <span className="block text-lg font-bold font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  {lowCount}
                </span>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">Baja</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              <span>Distribución por Materia</span>
            </h4>
            <div className="space-y-2">
              {[
                { area: 'laboral', label: 'Laboral', color: 'bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
                { area: 'civil', label: 'Civil', color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
                { area: 'familia', label: 'Familia', color: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
                { area: 'penal', label: 'Penal', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
              ].map((m) => {
                const count = rubroTasks.filter((t) => t.legalArea === m.area).length;
                return (
                  <div
                    key={m.area}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {m.label}
                    </span>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {count} causas
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
