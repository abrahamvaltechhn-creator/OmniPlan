import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Scale,
  FileText,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Task } from '../types/planner';

export const CalendarView: React.FC = () => {
  const { tasks, activeRubro, openTaskModal } = usePlanner();

  // Current calendar viewing month/year (defaults to current date, e.g. Nov 2026)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 2)); // Nov 2 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-02');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 10, 2);
    setCurrentDate(today);
    setSelectedDateStr('2026-11-02');
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // JavaScript getDay(): 0 is Sunday, 1 is Monday...
  // Convert so Monday is 0 and Sunday is 6
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const totalDays = lastDayOfMonth.getDate();

  // Fill calendar days
  const calendarDays: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const d = new Date(year, month - 1, day);
    const dateStr = d.toISOString().split('T')[0];
    calendarDays.push({ dateStr, dayNum: day, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    calendarDays.push({ dateStr, dayNum: day, isCurrentMonth: true });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const mStr = String(month + 2 > 12 ? 1 : month + 2).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const yVal = month + 2 > 12 ? year + 1 : year;
    const dateStr = `${yVal}-${mStr}-${dStr}`;
    calendarDays.push({ dateStr, dayNum: day, isCurrentMonth: false });
  }

  // Active Rubro tasks
  const rubroTasks = tasks.filter((t) => t.rubroId === activeRubro.id);

  // Selected date tasks (matching dueDate, startDate, or hearingDate)
  const selectedDayTasks = rubroTasks.filter(
    (t) =>
      t.dueDate === selectedDateStr ||
      t.startDate === selectedDateStr ||
      t.hearingDate === selectedDateStr
  );

  return (
    <div className="h-full flex flex-col p-3 sm:p-6 overflow-y-auto pb-20 lg:pb-6">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{activeRubro.name}</span>
            <span aria-hidden="true">·</span>
            <span>Vista Cronológica</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>
              {monthNames[month]} {year}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openTaskModal(undefined, undefined, selectedDateStr)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar en {selectedDateStr}</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Selected Day Split */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 overflow-hidden">
        {/* Monthly Calendar Grid */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2.5">
            {dayNames.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-6 divide-x divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto">
            {calendarDays.map((cell) => {
              const isToday = cell.dateStr === '2026-11-02';
              const isSelected = cell.dateStr === selectedDateStr;
              const dayTasks = rubroTasks.filter(
                (t) =>
                  t.dueDate === cell.dateStr ||
                  t.startDate === cell.dateStr ||
                  t.hearingDate === cell.dateStr
              );

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[75px] sm:min-h-[90px] p-1.5 sm:p-2 flex flex-col transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30 ring-1 ring-inset ring-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  } ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono tabular-nums w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-indigo-600 text-white font-bold'
                          : isSelected
                          ? 'font-bold text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks Preview inside cell */}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => {
                      const isHearing = Boolean(t.hearingDate === cell.dateStr || t.hearingType);
                      return (
                        <div
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTaskModal(t);
                          }}
                          className={`px-1.5 py-0.5 text-[11px] rounded truncate transition-colors flex items-center gap-1 border ${
                            isHearing
                              ? 'bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-300/70 dark:border-indigo-800 font-medium'
                              : 'bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/60'
                          }`}
                          title={t.title}
                        >
                          {isHearing ? (
                            <Scale className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                t.priority === 'critica'
                                  ? 'bg-rose-500'
                                  : t.priority === 'alta'
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-500'
                              }`}
                            />
                          )}
                          <span className="truncate">
                            {isHearing && t.hearingTime ? `${t.hearingTime} ` : ''}
                            {t.title}
                          </span>
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
                        +{dayTasks.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer / Sidebar */}
        <div className="w-full lg:w-84 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shrink-0 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                Agenda del Día
              </span>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                {selectedDateStr}
              </h3>
            </div>
            <button
              onClick={() => openTaskModal(undefined, undefined, selectedDateStr)}
              className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
              title="Crear tarea para este día"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((t) => {
                const isHearing = Boolean(t.hearingDate === selectedDateStr || t.hearingType);
                return (
                  <div
                    key={t.id}
                    onClick={() => openTaskModal(t)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isHearing
                        ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30 hover:border-indigo-400'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {isHearing && (
                      <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-indigo-100 dark:border-indigo-900/60">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                          <Scale className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span>Audiencia {t.hearingTime ? `• ${t.hearingTime}` : ''}</span>
                        </span>
                        {t.writtenBriefStatus && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                            {t.writtenBriefStatus === 'pendiente' && 'Escrito: Pendiente'}
                            {t.writtenBriefStatus === 'en_redaccion' && 'Escrito: En Redacción'}
                            {t.writtenBriefStatus === 'listo_para_firma' && 'Escrito: Para Firma'}
                            {t.writtenBriefStatus === 'presentado' && 'Escrito: Presentado'}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="capitalize font-medium">{t.priority}</span>
                        {t.legalArea && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {t.legalArea}
                          </span>
                        )}
                      </div>
                      {t.estimatedHours && (
                        <span className="font-mono tabular-nums">{t.estimatedHours}h estimadas</span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
                      {t.title}
                    </h4>

                    {t.courtBranch && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t.courtBranch}</span>
                        {t.caseNumber && <span className="font-mono text-[10px] text-slate-400">({t.caseNumber})</span>}
                      </div>
                    )}

                    {t.hearingType && (
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mb-1 line-clamp-1">
                        Objeto: {t.hearingType}
                      </div>
                    )}

                    {t.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {t.description}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center p-4">
                <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No hay entregas registradas para este día
                </p>
                <button
                  onClick={() => openTaskModal(undefined, undefined, selectedDateStr)}
                  className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  + Programar entrega
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
