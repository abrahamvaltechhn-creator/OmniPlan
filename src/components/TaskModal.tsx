import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Subtask } from '../types/planner';

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'inprogress', title: 'En Progreso' },
  { id: 'done', title: 'Completado', isFinal: true },
];

export const TaskModal: React.FC = () => {
  const { taskModal, closeTaskModal, addTask, updateTask, deleteTask, toggleSubtask } = usePlanner();

  const isEditing = Boolean(taskModal.task);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (taskModal.task) {
      const t = taskModal.task;
      setTitle(t.title);
      setDescription(t.description || '');
      setColumnId(t.columnId);
      setStartDate(t.startDate || today);
      setDueDate(t.dueDate || today);
      setSubtasks(t.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setColumnId(taskModal.defaultColumnId || 'todo');
      const dateToUse = today;
      setStartDate(dateToUse);
      setDueDate(dateToUse);
      setSubtasks([]);
    }
  }, [taskModal]);

  if (!taskModal.isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtaskLocal = (subId: string) => {
    if (isEditing && taskModal.task) {
      toggleSubtask(taskModal.task.id, subId);
    }
    setSubtasks(
      subtasks.map((st) => (st.id === subId ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleRemoveSubtask = (subId: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== subId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      columnId: columnId || 'todo',
      priority: 'media' as const,
      startDate,
      dueDate,
      tags: [],
      subtasks,
    };

    if (isEditing && taskModal.task) {
      updateTask(taskModal.task.id, payload);
    } else {
      addTask(payload);
    }
    closeTaskModal();
  };

  const inputClassName =
    'w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto"
      onClick={closeTaskModal}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[92vh] flex flex-col glass-strong text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/60 dark:bg-slate-900/60">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            type="button"
            onClick={closeTaskModal}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Título *
            </label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              placeholder="¿Qué necesitas hacer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClassName}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Anotaciones
            </label>
            <textarea
              id="task-description"
              rows={3}
              placeholder="Detalles, enlaces, notas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClassName} text-xs resize-none`}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-start-date"
                className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Fecha de Inicio
              </label>
              <input
                id="task-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${inputClassName} text-xs font-mono tabular-nums`}
              />
            </div>

            <div>
              <label
                htmlFor="task-due-date"
                className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Fecha de Finalización
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${inputClassName} text-xs font-mono tabular-nums`}
              />
            </div>
          </div>

          {/* Column */}
          <div>
            <label
              htmlFor="task-column"
              className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              Columna
            </label>
            <select
              id="task-column"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className={`${inputClassName} text-xs`}
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Subtasks */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <label
              htmlFor="task-new-subtask"
              className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2"
            >
              Subtareas ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtaskLocal(st.id)}
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                    >
                      {st.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs truncate ${
                          st.completed
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {st.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="p-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                      aria-label="Eliminar subtarea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                id="task-new-subtask"
                type="text"
                placeholder="Añadir subtarea..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className={`flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors whitespace-nowrap"
              >
                + Subtarea
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {isEditing && taskModal.task ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar esta tarea definitivamente?')) {
                    deleteTask(taskModal.task!.id);
                    closeTaskModal();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg transition-colors shadow-md shadow-indigo-500/25"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};