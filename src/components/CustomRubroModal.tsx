import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Check } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { RubroIcon } from './RubroIcon';

export const CustomRubroModal: React.FC = () => {
  const { isRubroModalOpen, closeRubroModal, addRubro } = usePlanner();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Briefcase');
  const [themeColor, setThemeColor] = useState('indigo');
  const [columns, setColumns] = useState<string[]>([
    'Recepción / Solicitudes',
    'En Evaluación',
    'En Proceso Activo',
    'Finalizado / Entregado',
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [defaultTagsStr, setDefaultTagsStr] = useState('Prioritario, Cliente, Revisión');

  if (!isRubroModalOpen) return null;

  const availableIcons = [
    'Scale',
    'FileText',
    'Briefcase',
    'Laptop',
    'HeartPulse',
    'GraduationCap',
    'Palette',
    'TrendingUp',
    'Truck',
    'Coffee',
    'Rocket',
    'Target',
    'Building2',
    'Sparkles',
  ];

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    setColumns([...columns, newColumnName.trim()]);
    setNewColumnName('');
  };

  const handleRemoveColumn = (index: number) => {
    if (columns.length <= 2) {
      alert('Un flujo debe tener al menos 2 etapas.');
      return;
    }
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedColumns = columns.map((colTitle, idx) => ({
      id: `col_${Date.now()}_${idx}`,
      title: colTitle,
      isFinal: idx === columns.length - 1, // last column is final stage
    }));

    const tags = defaultTagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addRubro({
      name: name.trim(),
      description: description.trim() || 'Flujo de trabajo personalizado.',
      iconName,
      themeColor,
      columns: formattedColumns,
      defaultTags: tags.length > 0 ? tags : ['General'],
    });

    closeRubroModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 shrink-0" />

        <div className="px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Diseñar Nuevo Rubro & Flujo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personaliza etapas para cualquier industria, profesión o actividad
            </p>
          </div>
          <button
            onClick={closeRubroModal}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Rubro Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre de la Industria o Rubro *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="ej. Gastronomía & Cocina, Estudio Jurídico, Taller Mecánico..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción del Objetivo Operativo
            </label>
            <textarea
              rows={2}
              placeholder="¿Qué proceso o flujo de valor se gestiona aquí?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Ícono Distintivo
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map((ico) => {
                const isSelected = iconName === ico;
                return (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setIconName(ico)}
                    className={`h-10 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs scale-105 ring-2 ring-indigo-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <RubroIcon name={ico} className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columns / Stages configuration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Etapas del Flujo (Columnas del Tablero)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              La última etapa actúa automáticamente como estado de finalización y celebración.
            </p>

            <div className="space-y-1.5 mb-2.5">
              {columns.map((col, idx) => {
                const isLast = idx === columns.length - 1;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">
                        0{idx + 1}.
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {col}
                      </span>
                      {isLast && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Meta
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Añadir nueva etapa..."
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColumn(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddColumn}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
              >
                + Etapa
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Etiquetas Sugeridas (separadas por coma)
            </label>
            <input
              type="text"
              value={defaultTagsStr}
              onChange={(e) => setDefaultTagsStr(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={closeRubroModal}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
            >
              Crear Rubro & Iniciar Flujo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
