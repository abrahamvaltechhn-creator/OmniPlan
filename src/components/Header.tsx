import React from 'react';
import {
  Plus,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  PanelLeft,
  PanelLeftClose,
  Menu,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

export const Header: React.FC = () => {
  const {
    openTaskModal,
    soundEnabled,
    setSoundEnabled,
    isDarkMode,
    toggleDarkMode,
    isSidebarOpen,
    toggleSidebar,
  } = usePlanner();

  return (
    <header className="h-14 glass border-b border-white/20 dark:border-slate-800/30 px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 z-30 shrink-0 select-none">
      {/* Zone 1: Sidebar Toggle + Brand */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <button
          onClick={toggleSidebar}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/50 transition-colors glass"
          title={isSidebarOpen ? 'Ocultar barra lateral (⌘B)' : 'Mostrar barra lateral (⌘B)'}
          aria-label={isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          )}
          <Menu className="w-5 h-5 lg:hidden" />
        </button>

        <a
          href="#"
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
            CVS
          </span>
          <span className="hidden sm:inline">CVS WorkSpace by OmniPlan</span>
        </a>
      </div>

      {/* Zone 2: Utilities & Primary Action */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-800/50 rounded-lg transition-colors glass"
          title={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
          aria-label={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        <button
          onClick={toggleDarkMode}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-800/50 rounded-lg transition-colors glass"
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          aria-label="Alternar modo oscuro"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <button
          onClick={() => openTaskModal()}
          className="min-h-[40px] flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:from-indigo-800 active:to-violet-800 rounded-xl transition-all shadow-lg shadow-indigo-500/25 whitespace-nowrap shrink-0 active:scale-95"
          aria-label="Crear nueva tarea"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva Tarea</span>
          <span className="sm:hidden font-bold">Tarea</span>
        </button>
      </div>
    </header>
  );
};