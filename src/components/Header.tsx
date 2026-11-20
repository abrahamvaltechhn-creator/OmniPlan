import React from 'react';
import {
  Calendar,
  Columns3,
  GanttChart,
  Grid2X2,
  CheckCircle2,
  BarChart3,
  Search,
  Plus,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  PanelLeft,
  PanelLeftClose,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { RubroIcon } from './RubroIcon';
import { ViewMode } from '../types/planner';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    openTaskModal,
    soundEnabled,
    setSoundEnabled,
    isDarkMode,
    toggleDarkMode,
    setCommandPaletteOpen,
    activeRubro,
    isSidebarOpen,
    toggleSidebar,
    setIsMobileMenuOpen,
  } = usePlanner();

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'kanban', label: 'Tablero', icon: <Columns3 className="w-4 h-4" /> },
    { mode: 'calendar', label: 'Calendario', icon: <Calendar className="w-4 h-4" /> },
    { mode: 'gantt', label: 'Cronograma', icon: <GanttChart className="w-4 h-4" /> },
    { mode: 'matrix', label: 'Matriz', icon: <Grid2X2 className="w-4 h-4" /> },
    { mode: 'habits', label: 'Hábitos', icon: <CheckCircle2 className="w-4 h-4" /> },
    { mode: 'analytics', label: 'Analíticas', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 z-30 shrink-0 select-none">
      {/* Zone 1: Sidebar Toggle + Brand Wordmark + Mobile Rubro Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        {/* Toggle Sidebar Button (works on desktop & mobile) */}
        <button
          onClick={toggleSidebar}
          className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarOpen ? 'Ocultar barra lateral (⌘B)' : 'Mostrar barra lateral (⌘B)'}
          aria-label={isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 hidden lg:block" />
          ) : (
            <PanelLeft className="w-4 h-4 hidden lg:block text-indigo-600 dark:text-indigo-400" />
          )}
          <Menu className="w-5 h-5 lg:hidden" />
        </button>

        <a
          href="#"
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap"
        >
          <span className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-xs shadow-indigo-500/20">
            OP
          </span>
          <span className="hidden sm:inline">OmniPlan</span>
        </a>

        {/* Mobile active rubro chip with dropdown arrow */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 text-xs font-medium truncate max-w-[150px]"
        >
          <span className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0">
            <RubroIcon name={activeRubro.iconName} className="w-3.5 h-3.5" />
          </span>
          <span className="truncate">{activeRubro.name}</span>
          <ChevronDown className="w-3 h-3 text-indigo-500 shrink-0" />
        </button>
      </div>

      {/* Zone 2: Desktop clean single-line nav links */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = viewMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Utilities & Primary Action */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center sm:px-2.5 sm:py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          title="Buscar o comandos rápidos (⌘K)"
          aria-label="Abrir buscador"
        >
          <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline ml-1.5">Buscar</span>
          <kbd className="hidden md:inline ml-1 px-1 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
          aria-label={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        <button
          onClick={toggleDarkMode}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          aria-label="Alternar modo oscuro"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <button
          onClick={() => openTaskModal()}
          className="min-h-[40px] flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 active:scale-95"
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
