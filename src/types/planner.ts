export type Priority = 'baja' | 'media' | 'alta' | 'critica';

export type EisenhowerQuadrant = 1 | 2 | 3 | 4; // 1: Urgente & Importante, 2: No Urgente & Importante, 3: Urgente & No Importante, 4: Ni Urgente Ni Importante

export interface Column {
  id: string;
  title: string;
  color?: string;
  isFinal?: boolean;
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
}

export interface Rubro {
  id: string;
  name: string;
  iconName: string;
  description: string;
  themeColor: string;
  columns: Column[];
  defaultTags: string[];
  customFields?: CustomFieldDefinition[];
  isCustom?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  rubroId: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  estimatedHours?: number;
  assigneeId?: string;
  tags: string[];
  subtasks: Subtask[];
  quadrant?: EisenhowerQuadrant;
  customData?: Record<string, string | number>;
  createdAt: string;
  completedAt?: string;

  // Legal & Hearing specific fields
  hearingDate?: string; // YYYY-MM-DD
  hearingTime?: string; // HH:mm
  hearingType?: string; // e.g., "Desahogo de Pruebas", "Audiencia Inicial", "Juicio Oral", "Conciliación"
  courtBranch?: string; // e.g., "3° Juzgado Civil", "Juzgado de Garantía"
  caseNumber?: string; // e.g., "Expediente C-4890/2026"
  writtenBriefStatus?: 'pendiente' | 'en_redaccion' | 'listo_para_firma' | 'presentado';
  legalArea?: LegalArea; // Familia, Civil, Laboral, Penal
}

export type LegalArea = 'familia' | 'civil' | 'laboral' | 'penal';

export interface Habit {
  id: string;
  rubroId?: string;
  name: string;
  category: string;
  streak: number;
  completedDays: string[]; // YYYY-MM-DD strings
  targetPerWeek: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  email?: string;
}

export type ViewMode = 'kanban' | 'calendar' | 'gantt' | 'matrix' | 'habits' | 'analytics';
