import React, { useEffect, useState } from 'react';
import { X, Plus, Calendar, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Task, Subtask } from '../types/planner';

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'inprogress', title: 'En Progreso' },
  { id: 'done', title: 'Completado', isFinal: true },
];

export const TaskModal: React.FC = () => {
  const { taskModal, closeTaskModal, addTask, updateTask, deleteTask, toggleSubtask, tasks } = usePlanner();

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-white/20 dark:border-slate-800/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col glass">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3 sm:py-4 border-b border-white/20 dark:border-slate-800/30 flex items-center justify-between shrink-0 glass">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={closeTaskModal}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors glass"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="¿Qué necesitas hacer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-white/30 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 glass"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Anotaciones
            </label>
            <textarea
              rows={3}
              placeholder="Detalles, enlaces, notas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-white/30 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none glass"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/30 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums glass"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Finalización
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/30 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums glass"
              />
            </div>
          </div>

          {/* Column */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Columna
            </label>
            <select
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/30 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 glass"
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Subtasks */}
          <div className="pt-2 border-t border-white/20 dark:border-slate-800/30">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Subtareas ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>

            <div className="space-y-1.5 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg glass"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtaskLocal(st.id)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs truncate ${
                        st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
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
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-white/30 dark:border-slate-800/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 glass"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
              >
                + Subtarea
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-slate-800/30">
            {isEditing && taskModal.task ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar esta tarea definitivamente?')) {
                    deleteTask(taskModal.task!.id);
                    closeTaskModal();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors glass"
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
                className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors glass"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
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