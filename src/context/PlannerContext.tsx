import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_HABITS, INITIAL_MEMBERS, INITIAL_RUBROS, INITIAL_TASKS, STANDBY_PRESET_RUBROS } from '../data/initialData';
import { EisenhowerQuadrant, Habit, Priority, Rubro, Task, TeamMember, ViewMode } from '../types/planner';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface TaskModalState {
  isOpen: boolean;
  task?: Task;
  defaultColumnId?: string;
  defaultDate?: string;
}

interface PlannerContextType {
  rubros: Rubro[];
  activeRubroId: string;
  activeRubro: Rubro;
  setActiveRubroId: (id: string) => void;
  tasks: Task[];
  habits: Habit[];
  members: TeamMember[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: Priority | 'all';
  setFilterPriority: (priority: Priority | 'all') => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isDemoMode: boolean;
  restoreAllRubros: () => void;

  // Task actions
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: string) => void;
  moveTaskQuadrant: (taskId: string, targetQuadrant: EisenhowerQuadrant) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Rubro actions
  addRubro: (rubro: Omit<Rubro, 'id'>) => Rubro;
  deleteRubro: (id: string) => void;

  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDays'>) => void;
  toggleHabitDay: (habitId: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;

  // Persistence & Data
  resetToDemoData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;

  // Modals & Palette
  taskModal: TaskModalState;
  openTaskModal: (task?: Task, defaultColumnId?: string, defaultDate?: string) => void;
  closeTaskModal: () => void;
  isRubroModalOpen: boolean;
  openRubroModal: () => void;
  closeRubroModal: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RUBROS: 'omniplan_rubros_v2',
  TASKS: 'omniplan_tasks_v2',
  HABITS: 'omniplan_habits_v2',
  MEMBERS: 'omniplan_members_v2',
  ACTIVE_RUBRO: 'omniplan_active_rubro_v2',
  VIEW_MODE: 'omniplan_view_mode_v2',
  DARK_MODE: 'omniplan_dark_mode_v2',
  SOUND_ENABLED: 'omniplan_sound_v2',
  SIDEBAR: 'omniplan_sidebar_open_v2',
};

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR);
    return saved !== null ? saved === 'true' : true;
  });

  // Sound state
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? saved === 'true' : true;
  });

  // Rubros state: For the client demo, only the legal practice workspace is active
  const [rubros, setRubros] = useState<Rubro[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RUBROS);
    if (saved) {
      try {
        const parsed: Rubro[] = JSON.parse(saved);
        const standbyIds = new Set(STANDBY_PRESET_RUBROS.map((r) => r.id));
        const demoRubros = parsed.filter((r) => !standbyIds.has(r.id));
        if (demoRubros.length > 0) {
          const legalIdx = demoRubros.findIndex((r) => r.id === 'legal');
          const updatedLegal = INITIAL_RUBROS.find((r) => r.id === 'legal')!;
          if (legalIdx !== -1) {
            demoRubros[legalIdx] = updatedLegal;
          } else {
            demoRubros.unshift(updatedLegal);
          }
          return demoRubros;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_RUBROS;
  });

  const [activeRubroId, setActiveRubroId] = useState<string>(() => {
    return 'legal';
  });

  // Tasks state: prioritize comprehensive legal matters (Laboral, Civil, Familia, Penal)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        const parsed: Task[] = JSON.parse(saved);
        const legalTasks = INITIAL_TASKS.filter((t) => t.rubroId === 'legal');
        const customTasks = parsed.filter(
          (t) => t.rubroId !== 'legal' && !STANDBY_PRESET_RUBROS.some((sr) => sr.id === t.rubroId)
        );
        return [...legalTasks, ...customTasks];
      } catch {
        // fallback
      }
    }
    return INITIAL_TASKS.filter((t) => t.rubroId === 'legal');
  });

  // Habits state: specialized legal tracking
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      try {
        const parsed: Habit[] = JSON.parse(saved);
        const legalHabits = parsed.filter((h) => h.rubroId === 'legal');
        if (legalHabits.length > 0) return legalHabits;
      } catch {
        // fallback
      }
    }
    return INITIAL_HABITS.filter((h) => h.rubroId === 'legal');
  });

  const [members] = useState<TeamMember[]>(INITIAL_MEMBERS);

  // View & Filter states
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as ViewMode) || 'kanban';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');

  // Modals state
  const [taskModal, setTaskModal] = useState<TaskModalState>({ isOpen: false });
  const [isRubroModalOpen, setIsRubroModalOpen] = useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme to DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);

  // Sync sound settings
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(soundEnabled));
  }, [soundEnabled]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RUBROS, JSON.stringify(rubros));
  }, [rubros]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_RUBRO, activeRubroId);
  }, [activeRubroId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(isSidebarOpen));
  }, [isSidebarOpen]);

  // Keyboard shortcut listener for ⌘K, ⌘B, and N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        soundManager.playPop();
      }
      // ⌘B or Ctrl+B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      // N key (when not typing in an input/textarea) to create task
      if (
        e.key.toLowerCase() === 'n' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        openTaskModal();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        if (taskModal.isOpen) closeTaskModal();
        if (isRubroModalOpen) closeRubroModal();
        if (isCommandPaletteOpen) setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [taskModal.isOpen, isRubroModalOpen, isCommandPaletteOpen, isSidebarOpen, isMobileMenuOpen]);

  const activeRubro = rubros.find((r) => r.id === activeRubroId) || rubros[0];

  const setViewMode = (mode: ViewMode) => {
    soundManager.playPop();
    setViewModeState(mode);
  };

  const toggleDarkMode = () => {
    soundManager.playPop();
    setIsDarkMode((prev) => !prev);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
  };

  const toggleSidebar = () => {
    soundManager.playPop();
    // If mobile, toggle mobile drawer, otherwise toggle desktop sidebar
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  // Task Handlers
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    soundManager.playPop();
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates };
        return updated;
      })
    );
    soundManager.playPop();
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    soundManager.playSwoosh();
  };

  const moveTask = (taskId: string, targetColumnId: string) => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.columnId === targetColumnId) return;

    const targetRubro = rubros.find((r) => r.id === currentTask.rubroId);
    const targetCol = targetRubro?.columns.find((c) => c.id === targetColumnId);

    const isFinalColumn = targetCol?.isFinal;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            columnId: targetColumnId,
            completedAt: isFinalColumn ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );

    if (isFinalColumn) {
      soundManager.playChime();
      triggerConfetti();
    } else {
      soundManager.playSwoosh();
    }
  };

  const moveTaskQuadrant = (taskId: string, targetQuadrant: EisenhowerQuadrant) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, quadrant: targetQuadrant };
        }
        return t;
      })
    );
    soundManager.playSwoosh();
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        let allDone = true;
        const newSubtasks = t.subtasks.map((st) => {
          if (st.id === subtaskId) {
            const nextVal = !st.completed;
            if (!nextVal) allDone = false;
            return { ...st, completed: nextVal };
          }
          if (!st.completed) allDone = false;
          return st;
        });

        if (allDone && newSubtasks.length > 0) {
          soundManager.playChime();
          triggerConfetti();
        } else {
          soundManager.playPluck();
        }

        return { ...t, subtasks: newSubtasks };
      })
    );
  };

  // Rubro Handlers
  const addRubro = (rubroData: Omit<Rubro, 'id'>): Rubro => {
    const newRubro: Rubro = {
      ...rubroData,
      id: `rubro_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true,
    };
    setRubros((prev) => [...prev, newRubro]);
    setActiveRubroId(newRubro.id);
    soundManager.playChime();
    return newRubro;
  };

  const deleteRubro = (id: string) => {
    if (rubros.length <= 1) return;
    setRubros((prev) => prev.filter((r) => r.id !== id));
    setTasks((prev) => prev.filter((t) => t.rubroId !== id));
    if (activeRubroId === id) {
      const remaining = rubros.filter((r) => r.id !== id);
      setActiveRubroId(remaining[0].id);
    }
    soundManager.playSwoosh();
  };

  // Habit Handlers
  const addHabit = (data: Omit<Habit, 'id' | 'streak' | 'completedDays'>) => {
    const newHabit: Habit = {
      ...data,
      id: `hab_${Date.now()}`,
      streak: 1,
      completedDays: [new Date().toISOString().split('T')[0]],
    };
    setHabits((prev) => [newHabit, ...prev]);
    soundManager.playChime();
    triggerConfetti();
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDays.includes(dateStr);
        const newDays = exists
          ? h.completedDays.filter((d) => d !== dateStr)
          : [...h.completedDays, dateStr];

        const nextStreak = exists ? Math.max(0, h.streak - 1) : h.streak + 1;

        if (!exists) {
          soundManager.playChime();
          triggerConfetti();
        } else {
          soundManager.playPluck();
        }

        return {
          ...h,
          completedDays: newDays,
          streak: nextStreak,
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    soundManager.playSwoosh();
  };

  // Reset & Export/Import & Demo Management
  const isDemoMode = rubros.length === 1 && rubros[0].id === 'legal';

  const resetToDemoData = () => {
    setRubros(INITIAL_RUBROS);
    setTasks(INITIAL_TASKS.filter((t) => t.rubroId === 'legal'));
    setHabits(INITIAL_HABITS.filter((h) => h.rubroId === 'legal'));
    setActiveRubroId('legal');
    localStorage.removeItem(STORAGE_KEYS.RUBROS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_RUBRO, 'legal');
    soundManager.playChime();
  };

  const restoreAllRubros = () => {
    const allRubros = [INITIAL_RUBROS[0], ...STANDBY_PRESET_RUBROS];
    setRubros(allRubros);
    setTasks(INITIAL_TASKS);
    setHabits(INITIAL_HABITS);
    localStorage.setItem(STORAGE_KEYS.RUBROS, JSON.stringify(allRubros));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
    soundManager.playChime();
    triggerConfetti();
  };

  const exportDataJSON = () => {
    const exportBundle = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      rubros,
      tasks,
      habits,
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omniplan_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundManager.playPop();
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.rubros && Array.isArray(parsed.rubros)) {
        setRubros(parsed.rubros);
      }
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
      }
      if (parsed.habits && Array.isArray(parsed.habits)) {
        setHabits(parsed.habits);
      }
      soundManager.playChime();
      return true;
    } catch {
      return false;
    }
  };

  // Modal helpers
  const openTaskModal = (task?: Task, defaultColumnId?: string, defaultDate?: string) => {
    soundManager.playPop();
    setTaskModal({ isOpen: true, task, defaultColumnId, defaultDate });
  };

  const closeTaskModal = () => {
    setTaskModal({ isOpen: false });
  };

  const openRubroModal = () => {
    soundManager.playPop();
    setIsRubroModalOpen(true);
  };

  const closeRubroModal = () => {
    setIsRubroModalOpen(false);
  };

  return (
    <PlannerContext.Provider
      value={{
        rubros,
        activeRubroId,
        activeRubro,
        setActiveRubroId: (id) => {
          soundManager.playPop();
          setActiveRubroId(id);
        },
        tasks,
        habits,
        members,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        soundEnabled,
        setSoundEnabled,
        isDarkMode,
        toggleDarkMode,
        isDemoMode,
        restoreAllRubros,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        moveTaskQuadrant,
        toggleSubtask,
        addRubro,
        deleteRubro,
        addHabit,
        toggleHabitDay,
        deleteHabit,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,
        taskModal,
        openTaskModal,
        closeTaskModal,
        isRubroModalOpen,
        openRubroModal,
        closeRubroModal,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
