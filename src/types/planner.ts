export type Priority = 'baja' | 'media' | 'alta' | 'critica';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
}

export type ViewMode = 'kanban';