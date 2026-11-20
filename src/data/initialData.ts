import { Task, User } from '../types/planner';

export const CURRENT_USER: User = {
  id: 'user_cinthia',
  name: 'Cinthia Sánchez',
  role: 'Abogada',
  email: 'cynthia.sanchez@estudiojuridico.com',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    columnId: 'todo',
    title: 'Señalamiento: Audiencia de primera de trámite en juicio laboral',
    description: 'Notificación de señalamiento de audiencia de primera de trámite. Preparar escrito de contestación y poder.',
    priority: 'critica',
    startDate: '2026-11-02',
    dueDate: '2026-11-06',
    tags: ['Laboral', 'Audiencia'],
    subtasks: [
      { id: 'sub_1', title: 'Revisar demanda de despido', completed: true },
      { id: 'sub_2', title: 'Redactar escrito de contestación', completed: false },
    ],
    createdAt: '2026-11-02T08:30:00Z',
  },
  {
    id: 'task_2',
    columnId: 'inprogress',
    title: 'Audiencia de pruebas y pliego testimonial en juicio civil ordinario',
    description: 'Señalamiento de audiencia de pruebas para el 09 de nov. Redactar pliego de posiciones testimonial.',
    priority: 'alta',
    startDate: '2026-11-02',
    dueDate: '2026-11-09',
    tags: ['Civil', 'Testigos'],
    subtasks: [
      { id: 'sub_3', title: 'Cotejar lista de testigos', completed: true },
      { id: 'sub_4', title: 'Redactar pliego de posiciones', completed: true },
    ],
    createdAt: '2026-11-02T09:00:00Z',
  },
  {
    id: 'task_3',
    columnId: 'inprogress',
    title: 'Audiencia primera en juicio de alimentos y cuidado personal',
    description: 'Escrito de contestación presentado. Pendiente concurrir a la audiencia primera fijada.',
    priority: 'media',
    startDate: '2026-11-01',
    dueDate: '2026-11-12',
    tags: ['Familia', 'Alimentos'],
    subtasks: [
      { id: 'sub_5', title: 'Recopilar comprobantes de ingresos', completed: true },
      { id: 'sub_6', title: 'Preparar minuta con el cliente', completed: false },
    ],
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'task_4',
    columnId: 'todo',
    title: 'Audiencia de testigos en proceso penal ante tribunal de juicio',
    description: 'Audiencia fijada para comparecencia y declaración de peritos y testigos clave.',
    priority: 'critica',
    startDate: '2026-11-02',
    dueDate: '2026-11-04',
    tags: ['Penal', 'Testigos'],
    subtasks: [
      { id: 'sub_7', title: 'Entrevista previa con testigos', completed: true },
      { id: 'sub_8', title: 'Asistencia en estrados', completed: false },
    ],
    createdAt: '2026-11-02T11:00:00Z',
  },
  {
    id: 'task_5',
    columnId: 'done',
    title: 'Audiencia de conclusiones y alegatos finales - Sentencia dictada',
    description: 'Concluyó audiencia de alegatos finales. Sentencia dictada favorablemente.',
    priority: 'media',
    startDate: '2026-10-15',
    dueDate: '2026-11-02',
    tags: ['Civil', 'Sentencia'],
    subtasks: [
      { id: 'sub_9', title: 'Redactar minuta de alegatos', completed: true },
      { id: 'sub_10', title: 'Notificar sentencia al cliente', completed: true },
    ],
    createdAt: '2026-10-15T08:00:00Z',
    completedAt: '2026-11-02T11:30:00Z',
  },
];