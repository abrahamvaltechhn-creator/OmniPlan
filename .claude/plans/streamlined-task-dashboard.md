# Plan: Convert OmniPlan to Streamlined Task Dashboard — "CVS WorkSpace by OmniPlan"

## Contexto
Quitar todo lo innecesario y convertir OmniPlan en una dashboard simple para **Cinthia Sánchez (abogada)** que permita crear tareas con:
- Nombre/título
- Fecha de inicio
- Fecha de finalización
- Anotaciones
- Email visible en UI (Gmail, solo visual)

**Branding:** "CVS WorkSpace by OmniPlan"  
**Estilo:** Glassmorphism  
**Usuario único:** Cinthia Sánchez (no multi-usuario)

## Objetivo
Transformar de un planificador multi-vista a un dashboard minimalista glassmorphism para gestión de tareas legales personales.

## Ámbito de Cambios

### Archivos a MODIFICAR (simplificar + glassmorphism)
1. **src/types/planner.ts** - Simplificar Task, remover tipos legales complejos, Habit, EisenhowerQuadrant, Rubro, Column
2. **src/data/initialData.ts** - Una sola usuaria: Cinthia Sánchez (email Gmail). Tareas legales de ejemplo simplificadas
3. **src/context/PlannerContext.tsx** - Remover: habits, mult-view, rubros complejos, legal-specific logic. Mantener: tasks, add/update/delete/move task
4. **src/components/App.tsx** - Un solo view (Dashboard/Kanban), título "CVS WorkSpace by OmniPlan"
5. **src/components/KanbanView.tsx** - Vista principal simplificada, 3 columnas: Por Hacer → En Progreso → Completado
6. **src/components/TaskModal.tsx** - Solo 4 campos: Título, Anotaciones, Fecha Inicio, Fecha Fin
7. **src/components/Header.tsx** - Título nuevo, botón nueva tarea, theme toggle, search
8. **src/components/Sidebar.tsx** - Stats simples, email de Cinthia visible, sin lista de miembros
9. **src/index.css** - **Glassmorphism styles** (backdrop-filter, transparencias, blur)
10. **src/main.tsx** - Sin cambios

### Archivos a ELIMINAR
- src/components/CalendarView.tsx
- src/components/GanttTimelineView.tsx
- src/components/EisenhowerMatrixView.tsx
- src/components/HabitsTrackerView.tsx
- src/components/AnalyticsView.tsx
- src/components/CustomRubroModal.tsx
- src/components/MobileBottomNav.tsx
- src/components/CommandPalette.tsx (opcional - se puede mantener para búsqueda rápida)
- src/utils/audio.ts (simplificar o remover)

### Componentes a CONSERVAR (con glassmorphism)
- App.tsx, KanbanView.tsx, TaskModal.tsx, Header.tsx, Sidebar.tsx
- ConfettiCanvas.tsx, RubroIcon.tsx
- PlannerContext.tsx (simplificado), utils/confetti.ts

## Glassmorphism UI Spec

```css
/* Base glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.dark .glass {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}
```

Aplicar a: Header, Sidebar, TaskModal, Kanban columns, Task cards

## Pasos de Implementación

### Fase 1: Tipos y Datos (src/types/planner.ts, src/data/initialData.ts)
- Task: id, title, description, startDate, dueDate, priority, tags, completedAt, columnId
- Remover: hearingDate, hearingTime, hearingType, courtBranch, caseNumber, writtenBriefStatus, legalArea, quadrant, assigneeId, customData, subtasks
- User: id, name, role, email, avatarUrl (solo Cinthia)
- Un solo "rubro" implícito: columnas fijas (todo, in-progress, done)

### Fase 2: Contexto (PlannerContext.tsx)
- Estado: tasks[], user, viewMode (fijo 'kanban'), searchQuery, filterPriority, isDarkMode
- Acciones: addTask, updateTask, deleteTask, moveTask, toggleSubtask (simplificado)
- Remover: habits, rubros, restoreAllRubros, export/import, command palette, mobile menu
- Persistencia: localStorage simplificado

### Fase 3: Componentes Core
- App.tsx: Layout glassmorphism (Header + Sidebar + Main Kanban)
- KanbanView.tsx: 3 columnas glass, drag & drop (o click para mover)
- TaskModal.tsx: Form glass con 4 campos
- Header.tsx: "CVS WorkSpace by OmniPlan" + botones
- Sidebar.tsx: Stats + Email Cinthia (click to copy)

### Fase 4: Estilos Glassmorphism (index.css)
- Variables CSS para colores glass light/dark
- Clases utilitarias .glass, .glass-strong, .glass-subtle
- Animaciones suaves (motion ya instalado)

### Fase 5: Datos Iniciales
- 3-5 tareas legales de ejemplo con fechas reales

## Verificación
- `npm run dev` - Compila sin errores
- UI glassmorphism visible en light/dark mode
- Crear/editar/borrar/mover tareas funciona
- Modal muestra solo 4 campos
- Email Cinthia visible y copiable en Sidebar
- Título "CVS WorkSpace by OmniPlan" en header

## Riesgos / Notas
- Drag & drop: si no hay librería, usar click-to-move (más simple, menos deps)
- Glassmorphism requiere backdrop-filter (soporte amplio en navegadores modernos)
- motion (framer-motion) ya instalado para animaciones