import React, { useState } from 'react';
import {
  Check,
  Flame,
  Plus,
  Trash2,
  Trophy,
  Target,
  Sparkles,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

export const HabitsTrackerView: React.FC = () => {
  const { habits, toggleHabitDay, addHabit, deleteHabit } = usePlanner();

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Productividad');
  const [newHabitTarget, setNewHabitTarget] = useState(5);

  // 7-day window: Monday to Sunday of the current week (2026-10-27 to 2026-11-02)
  const weekDays = [
    { label: 'Lun', dateStr: '2026-10-27', dayNum: '27' },
    { label: 'Mar', dateStr: '2026-10-28', dayNum: '28' },
    { label: 'Mié', dateStr: '2026-10-29', dayNum: '29' },
    { label: 'Jue', dateStr: '2026-10-30', dayNum: '30' },
    { label: 'Vie', dateStr: '2026-10-31', dayNum: '31' },
    { label: 'Sáb', dateStr: '2026-11-01', dayNum: '01' },
    { label: 'Dom', dateStr: '2026-11-02', dayNum: '02' }, // Today
  ];

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit({
      name: newHabitName.trim(),
      category: newHabitCategory,
      targetPerWeek: Number(newHabitTarget),
    });

    setNewHabitName('');
    setIsAddingHabit(false);
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-hidden pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Rendimiento Continuo</span>
            <span aria-hidden="true">·</span>
            <span>Hábitos & Indicadores Clave</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Rastreador de Consistencia
          </h1>
        </div>

        <button
          onClick={() => setIsAddingHabit(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Hábito</span>
        </button>
      </div>

      {/* Habits Table / Card Grid */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col shadow-xs">
        {/* Table Header */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-3 shrink-0">
          <div className="flex-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
            Hábito & Categoría
          </div>
          <div className="w-20 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
            Racha
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 px-2 sm:px-4">
            {weekDays.map((d) => {
              const isToday = d.dateStr === '2026-11-02';
              return (
                <div
                  key={d.dateStr}
                  className={`w-8 text-center text-[11px] font-mono tabular-nums ${
                    isToday ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="block text-[10px] text-slate-400">{d.label}</span>
                  <span>{d.dayNum}</span>
                </div>
              );
            })}
          </div>
          <div className="w-8 shrink-0" />
        </div>

        {/* Habit Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {habits.map((habit) => {
            const completedThisWeek = weekDays.filter((d) =>
              habit.completedDays.includes(d.dateStr)
            ).length;
            const targetMet = completedThisWeek >= habit.targetPerWeek;

            return (
              <div
                key={habit.id}
                className="flex items-center p-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Habit Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {habit.name}
                    </span>
                    {targetMet && (
                      <span title="Meta semanal alcanzada">
                        <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{habit.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {completedThisWeek}/{habit.targetPerWeek} días meta
                    </span>
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="w-20 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold font-mono tabular-nums bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>{habit.streak}d</span>
                  </span>
                </div>

                {/* 7-Day Checkboxes */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0 px-2 sm:px-4">
                  {weekDays.map((d) => {
                    const isDone = habit.completedDays.includes(d.dateStr);
                    const isToday = d.dateStr === '2026-11-02';

                    return (
                      <button
                        key={d.dateStr}
                        onClick={() => toggleHabitDay(habit.id, d.dateStr)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 active:scale-95'
                            : isToday
                            ? 'border-2 border-indigo-400 dark:border-indigo-500 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                            : 'border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                        title={`${habit.name} - ${d.dateStr}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Delete button */}
                <div className="w-8 shrink-0 flex justify-end">
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar el hábito "${habit.name}"?`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-opacity"
                    title="Eliminar hábito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {habits.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No tienes hábitos activos registrados todavía.
            </div>
          )}
        </div>
      </div>

      {/* New Habit Modal Form */}
      {isAddingHabit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Nuevo Hábito o Indicador Clave
            </h3>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Hábito
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Meditación matutina o Revisión de métricas"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Productividad">Productividad</option>
                    <option value="Salud & Bienestar">Salud & Bienestar</option>
                    <option value="Ventas & Clientes">Ventas & Clientes</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Aprendizaje">Aprendizaje</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meta Días / Semana
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingHabit(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
                >
                  Guardar Hábito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
