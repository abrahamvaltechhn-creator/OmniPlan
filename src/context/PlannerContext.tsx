import React, { createContext, useContext, useEffect, useState } from 'react';
import { CURRENT_USER, INITIAL_TASKS } from '../data/initialData';
import { Priority, Task, User, ViewMode } from '../types/planner';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface TaskModalState {
  isOpen: boolean;
  task?: Task;
  defaultColumnId?: string;
}

interface PlannerContextType {
  user: User;
  tasks: Task[];
  viewMode: ViewMode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: Priority | 'all';
  setFilterPriority: (priority: Priority | 'all') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  taskModal: TaskModalState;
  openTaskModal: (task?: Task, defaultColumnId?: string) => void;
  closeTaskModal: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'omniplan_tasks_v3',
  VIEW_MODE: 'omniplan_view_mode_v3',
  DARK_MODE: 'omniplan_dark_mode_v3',
  SOUND_ENABLED: 'omniplan_sound_v3',
  SIDEBAR: 'omniplan_sidebar_open_v3',
};

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'inprogress', title: 'En Progreso' },
  { id: 'done', title: 'Completado', isFinal: true },
];

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR);
    return saved !== null ? saved === 'true' : true;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? saved === 'true' : true;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_TASKS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [viewMode] = useState<ViewMode>('kanban');

  const [taskModal, setTaskModal] = useState<TaskModalState>({ isOpen: false });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, String(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (taskModal.isOpen) closeTaskModal();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (
        e.key.toLowerCase() === 'n' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        openTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [taskModal.isOpen]);

  const toggleDarkMode = () => {
    soundManager.playPop();
    setIsDarkMode((prev) => !prev);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
  };

  const toggleSidebar = () => {
    soundManager.playPop();
    setIsSidebarOpen((prev) => !prev);
  };

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
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
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

    const targetCol = COLUMNS.find((c) => c.id === targetColumnId);
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

  const openTaskModal = (task?: Task, defaultColumnId?: string) => {
    soundManager.playPop();
    setTaskModal({ isOpen: true, task, defaultColumnId });
  };

  const closeTaskModal = () => {
    setTaskModal({ isOpen: false });
  };

  return (
    <PlannerContext.Provider
      value={{
        user: CURRENT_USER,
        tasks,
        viewMode,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        isDarkMode,
        toggleDarkMode,
        soundEnabled,
        setSoundEnabled,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleSubtask,
        taskModal,
        openTaskModal,
        closeTaskModal,
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