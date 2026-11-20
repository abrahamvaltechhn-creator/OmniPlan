import React, { useRef } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Flame,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { RubroIcon } from './RubroIcon';

export const Sidebar: React.FC = () => {
  const {
    rubros,
    activeRubroId,
    setActiveRubroId,
    tasks,
    habits,
    openRubroModal,
    deleteRubro,
    exportDataJSON,
    importDataJSON,
    resetToDemoData,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    isDemoMode,
    restoreAllRubros,
  } = usePlanner();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (!success) {
          alert('El archivo JSON no tiene un formato válido.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSelectRubro = (id: string) => {
    setActiveRubroId(id);
    setIsMobileMenuOpen(false); // Close mobile drawer on selection
  };

  // Stats for the current rubro
  const currentRubroTasks = tasks.filter((t) => t.rubroId === activeRubroId);
  const activeRubroObj = rubros.find((r) => r.id === activeRubroId);
  const finalCol = activeRubroObj?.columns.find((c) => c.isFinal);
  const completedCount = currentRubroTasks.filter((t) => t.columnId === finalCol?.id).length;
  const pendingCount = currentRubroTasks.length - completedCount;

  // Habit stats
  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Rubro Selector Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              {isDemoMode ? 'Rubro Activo' : 'Rubros & Flujos'}
            </span>
            {isDemoMode && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openRubroModal();
              }}
              className="min-h-[32px] flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              title="Diseñar un nuevo flujo personalizado"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear</span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="hidden lg:flex min-h-[32px] min-w-[32px] items-center justify-center p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ocultar barra lateral (⌘B)"
              aria-label="Ocultar barra lateral"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          {rubros.map((rubro) => {
            const isActive = rubro.id === activeRubroId;
            const taskCount = tasks.filter((t) => t.rubroId === rubro.id).length;

            return (
              <div
                key={rubro.id}
                className={`group flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 font-semibold shadow-xs ring-1 ring-indigo-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200'
                }`}
              >
                <button
                  onClick={() => handleSelectRubro(rubro.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <RubroIcon name={rubro.iconName} className="w-4 h-4" />
                  </span>
                  <span className="truncate text-xs sm:text-[13px]">{rubro.name}</span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                    {taskCount}
                  </span>
                  {rubro.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Eliminar el rubro "${rubro.name}" y sus tareas?`)) {
                          deleteRubro(rubro.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      title="Eliminar este rubro personalizado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Mode Notice & Quick Restore Option */}
        {isDemoMode && (
          <div className="mt-3 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Demostración para Abogados</span>
            </div>
            <p className="text-[10px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              Demás rubros pausados temporalmente para una presentación focalizada en causas jurídicas y litigación.
            </p>
            <button
              onClick={restoreAllRubros}
              className="mt-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline text-left cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3 shrink-0" />
              <span>Restaurar todos los rubros</span>
            </button>
          </div>
        )}

        {/* Current Rubro Summary Card */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Estado del Flujo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
            {activeRubroObj?.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <span className="block text-base font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                {pendingCount}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">En curso</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              <span className="block text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Finalizadas</span>
            </div>
          </div>
        </div>

        {/* Habits summary preview */}
        <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <div>
              <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                Racha Acumulada
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {habits.length} hábitos activos
              </span>
            </div>
          </div>
          <span className="text-sm font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {totalStreaks}d
          </span>
        </div>
      </div>

      {/* Footer Actions: Import / Export / Reset */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 shrink-0 bg-white dark:bg-slate-900">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />

        <div className="flex items-center gap-1.5">
          <button
            onClick={exportDataJSON}
            className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-800"
            title="Exportar copia de seguridad en formato JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200/60 dark:border-slate-800"
            title="Restaurar datos desde un archivo JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm('¿Restablecer el planificador a los datos demostrativos originales?')) {
              resetToDemoData();
            }
          }}
          className="w-full min-h-[34px] flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer demo</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col shrink-0 select-none transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? 'w-64 opacity-100' : 'w-0 border-r-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-64 h-full flex flex-col justify-between overflow-hidden">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Flujos de Trabajo
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
