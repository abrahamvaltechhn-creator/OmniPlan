import React, { useEffect, useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Tag,
  Flame,
  Scale,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Briefcase,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { EisenhowerQuadrant, LegalArea, Priority, Subtask, Task } from '../types/planner';

export const TaskModal: React.FC = () => {
  const {
    taskModal,
    closeTaskModal,
    activeRubro,
    rubros,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
  } = usePlanner();

  const isEditing = Boolean(taskModal.task);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rubroId, setRubroId] = useState(activeRubro.id);
  const [columnId, setColumnId] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [startDate, setStartDate] = useState('2026-11-02');
  const [dueDate, setDueDate] = useState('2026-11-05');
  const [estimatedHours, setEstimatedHours] = useState<number | ''>(4);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>(2);

  // Legal / Hearing fields
  const [legalArea, setLegalArea] = useState<LegalArea | ''>('');
  const [hearingDate, setHearingDate] = useState('');
  const [hearingTime, setHearingTime] = useState('');
  const [hearingType, setHearingType] = useState('');
  const [courtBranch, setCourtBranch] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [writtenBriefStatus, setWrittenBriefStatus] = useState<
    'pendiente' | 'en_redaccion' | 'listo_para_firma' | 'presentado'
  >('pendiente');
  const [showLegalSection, setShowLegalSection] = useState(false);

  const currentRubro = rubros.find((r) => r.id === rubroId) || activeRubro;

  useEffect(() => {
    if (taskModal.task) {
      const t = taskModal.task;
      setTitle(t.title);
      setDescription(t.description || '');
      setRubroId(t.rubroId);
      setColumnId(t.columnId);
      setPriority(t.priority);
      setStartDate(t.startDate || '2026-11-02');
      setDueDate(t.dueDate || '2026-11-05');
      setEstimatedHours(t.estimatedHours ?? '');
      setTags(t.tags || []);
      setSubtasks(t.subtasks || []);
      setQuadrant(t.quadrant || 2);

      // Legal fields
      setLegalArea(t.legalArea || '');
      setHearingDate(t.hearingDate || '');
      setHearingTime(t.hearingTime || '');
      setHearingType(t.hearingType || '');
      setCourtBranch(t.courtBranch || '');
      setCaseNumber(t.caseNumber || '');
      setWrittenBriefStatus(t.writtenBriefStatus || 'pendiente');
      setShowLegalSection(
        Boolean(t.hearingDate || t.hearingType || t.courtBranch || t.rubroId === 'legal' || t.legalArea)
      );
    } else {
      // New task setup
      setTitle('');
      setDescription('');
      setRubroId(activeRubro.id);
      setColumnId(taskModal.defaultColumnId || activeRubro.columns[0]?.id || '');
      setPriority('media');
      const dateToUse = taskModal.defaultDate || '2026-11-02';
      setStartDate(dateToUse);
      setDueDate(dateToUse);
      setEstimatedHours(4);
      setTags([currentRubro.defaultTags[0] || 'General']);
      setSubtasks([]);
      setQuadrant(2);

      // Legal defaults
      setLegalArea(activeRubro.id === 'legal' ? 'laboral' : '');
      setHearingDate(activeRubro.id === 'legal' ? dateToUse : '');
      setHearingTime('10:00');
      setHearingType(
        activeRubro.id === 'legal' ? 'Audiencia de primera de trámite' : ''
      );
      setCourtBranch(activeRubro.id === 'legal' ? '1° Juzgado de Letras del Trabajo' : '');
      setCaseNumber('');
      setWrittenBriefStatus('pendiente');
      setShowLegalSection(activeRubro.id === 'legal');
    }
  }, [taskModal, activeRubro]);

  if (!taskModal.isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubtaskTitle('');
  };

  const handleAddLegalBriefChecklist = () => {
    const targetType = hearingType || 'Audiencia Señalada';
    const lowerType = targetType.toLowerCase();

    let steps: string[] = [];

    if (lowerType.includes('trámite') || lowerType.includes('tramite')) {
      steps = [
        'Analizar auto de señalamiento, demanda y cálculo de liquidación laboral',
        'Redactar escrito de contestación y excepciones preliminares',
        'Elaborar propuesta de bases para conciliación con el cliente',
        'Presentar escrito con patrocinio y personería al Juzgado de Letras',
      ];
    } else if (lowerType.includes('testigo')) {
      steps = [
        'Redactar pliego de posiciones y preguntas directas a testigos',
        'Citar y preparar formalmente a los testigos de la nómina',
        'Elaborar minuta de repreguntas y objeciones de contraparte',
        'Ingresar escrito de presentación de testigos y acreditación',
      ];
    } else if (lowerType.includes('prueba')) {
      steps = [
        'Analizar resolución que fija los puntos sustanciales controvertidos',
        'Redactar escrito de ofrecimiento de pruebas y objeción documental',
        'Foliar y anexar documentos, peritajes e informes técnicos',
        'Ingresar escrito al expediente electrónico con comprobante de acuse',
      ];
    } else if (lowerType.includes('conclusi') || lowerType.includes('alegato')) {
      steps = [
        'Estudiar actas de audiencia, declaraciones y pruebas rendidas',
        'Redactar alegato de conclusiones de fondo y valoración probatoria',
        'Incorporar jurisprudencia aplicable y doctrina favorable',
        'Presentar alegato final en estrado o ingresar escrito judicial',
      ];
    } else if (lowerType.includes('primera') || lowerType.includes('inicial')) {
      steps = [
        `Redactar escrito preparatorio y contestación para ${targetType}`,
        'Recopilar medios probatorios documentales preliminares',
        'Diseñar estrategia de fijación del objeto litigioso y acuerdos',
        'Radicar escrito y acreditar personería telemática ante el Juzgado',
      ];
    } else {
      steps = [
        `Redactar escrito preparatorio para ${targetType}`,
        'Anexar medios probatorios y pliego de preguntas / testimonios',
        'Revisión técnica de fondo y firma digital (Token e-Firma)',
        'Ingreso telemático al Juzgado y comprobación de acuse de recibo',
      ];
    }

    const briefSteps: Subtask[] = steps.map((title, idx) => ({
      id: `sub_${Date.now()}_${idx + 1}`,
      title,
      completed: false,
    }));

    setSubtasks((prev) => [...prev, ...briefSteps]);
    setWrittenBriefStatus('en_redaccion');
  };

  const handleToggleSubtaskLocal = (subId: string) => {
    if (isEditing && taskModal.task) {
      toggleSubtask(taskModal.task.id, subId);
    }
    setSubtasks(
      subtasks.map((st) => (st.id === subId ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleRemoveSubtask = (subId: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== subId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      rubroId,
      columnId: columnId || currentRubro.columns[0]?.id || '',
      priority,
      startDate,
      dueDate,
      estimatedHours: estimatedHours === '' ? undefined : Number(estimatedHours),
      tags,
      subtasks,
      quadrant,
      legalArea: legalArea || undefined,
      hearingDate: hearingDate || undefined,
      hearingTime: hearingTime || undefined,
      hearingType: hearingType || undefined,
      courtBranch: courtBranch || undefined,
      caseNumber: caseNumber || undefined,
      writtenBriefStatus: (hearingDate || hearingType || legalArea) ? writtenBriefStatus : undefined,
    };

    if (isEditing && taskModal.task) {
      updateTask(taskModal.task.id, payload);
    } else {
      addTask(payload);
    }
    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {currentRubro.name}
            </span>
          </div>

          <button
            onClick={closeTaskModal}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título de la Tarea / Hito *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="¿Qué necesitas planificar o entregar?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción o Criterios de Aceptación
            </label>
            <textarea
              rows={2}
              placeholder="Detalles, enlaces, instrucciones o notas relevantes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Stage & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rubro / Industria
              </label>
              <select
                value={rubroId}
                onChange={(e) => {
                  setRubroId(e.target.value);
                  const newR = rubros.find((r) => r.id === e.target.value);
                  if (newR) setColumnId(newR.columns[0]?.id || '');
                }}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {rubros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Etapa / Columna
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currentRubro.columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Dates & Hours & Priority Quadrant */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha Límite / Entrega
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Horas Estimadas
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="ej. 8"
                value={estimatedHours}
                onChange={(e) =>
                  setEstimatedHours(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cuadrante de Enfoque
              </label>
              <select
                value={quadrant}
                onChange={(e) => setQuadrant(Number(e.target.value) as EisenhowerQuadrant)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>Q1: Urgente e Importante</option>
                <option value={2}>Q2: Planificar con Tiempo</option>
                <option value={3}>Q3: Rápido / Tramitación</option>
                <option value={4}>Q4: Baja Prioridad</option>
              </select>
            </div>
          </div>

          {/* Señalamiento de Audiencia & Redacción de Escritos */}
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Señalamiento de Audiencia & Escritos</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                      Juzgados & Despacho
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Define fecha/hora, sala judicial, tipo de audiencia y estado del escrito preparatorio.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLegalSection(!showLegalSection)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              >
                {showLegalSection ? 'Ocultar campos' : 'Configurar señalamiento'}
              </button>
            </div>

            {showLegalSection && (
              <div className="pt-2 space-y-3.5 border-t border-indigo-100 dark:border-indigo-900/50">
                {/* Materia / Jurisdicción */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Materia Judicial *
                    </label>
                    <span className="text-[10px] text-slate-400">Familia, Civil, Laboral, Penal</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'laboral' as LegalArea, label: 'Laboral', icon: Briefcase, desc: '1° de trámite, despidos', pastelActive: 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700' },
                      { id: 'civil' as LegalArea, label: 'Civil', icon: Scale, desc: 'Ordinarios, pruebas, cobros', pastelActive: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700' },
                      { id: 'familia' as LegalArea, label: 'Familia', icon: Users, desc: 'Alimentos, cuidado, visitas', pastelActive: 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700' },
                      { id: 'penal' as LegalArea, label: 'Penal', icon: ShieldAlert, desc: 'Garantía, juicio oral', pastelActive: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700' },
                    ].map((area) => {
                      const IconComp = area.icon;
                      const isSelected = legalArea === area.id;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            setLegalArea(area.id);
                            if (!tags.includes(area.label)) {
                              setTags([area.label, ...tags.filter((t) => !['Laboral', 'Civil', 'Familia', 'Penal'].includes(t))]);
                            }
                            if (area.id === 'laboral' && (!hearingType || hearingType.includes('Inicial') || hearingType.includes('primera'))) {
                              setHearingType('Audiencia de primera de trámite');
                              setCourtBranch('1° Juzgado de Letras del Trabajo');
                            } else if (area.id === 'civil' && (!hearingType || hearingType.includes('trámite'))) {
                              setHearingType('Audiencia de pruebas');
                              setCourtBranch('3° Juzgado Civil');
                            } else if (area.id === 'familia' && (!hearingType || hearingType.includes('trámite'))) {
                              setHearingType('Audiencia primera');
                              setCourtBranch('Juzgado de Familia');
                            } else if (area.id === 'penal' && (!hearingType || hearingType.includes('trámite'))) {
                              setHearingType('Audiencia de testigos');
                              setCourtBranch('Juzgado de Garantía');
                            }
                          }}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            isSelected
                              ? `${area.pastelActive} shadow-xs font-semibold ring-1 ring-slate-400/30`
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs">
                            <IconComp className="w-3.5 h-3.5 shrink-0 opacity-90" />
                            <span>{area.label}</span>
                          </div>
                          <p className="text-[10px] mt-0.5 truncate text-slate-500 dark:text-slate-400">
                            {area.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hearing Type & Quick Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      ¿De qué es la Audiencia? (Objeto / Tipo) *
                    </label>
                    <span className="text-[10px] text-slate-400">Para enfocar el escrito judicial</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ej: Audiencia de primera de trámite, Audiencia de pruebas, de testigos..."
                    value={hearingType}
                    onChange={(e) => setHearingType(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Quick presets for hearings tailored to user's exact specification */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(legalArea === 'laboral'
                      ? [
                          'Audiencia de primera de trámite',
                          'Audiencia de juicio / desahogo',
                          'Audiencia de testigos',
                          'Audiencia de conciliación',
                        ]
                      : legalArea === 'familia'
                      ? [
                          'Audiencia primera',
                          'Audiencia de pruebas',
                          'Audiencia de conclusiones',
                          'Audiencia de testigos',
                        ]
                      : legalArea === 'civil'
                      ? [
                          'Audiencia primera',
                          'Audiencia de pruebas',
                          'Audiencia de conclusiones',
                          'Audiencia de testigos',
                        ]
                      : legalArea === 'penal'
                      ? [
                          'Audiencia de primera de control',
                          'Audiencia de pruebas',
                          'Audiencia de testigos',
                          'Audiencia de conclusiones',
                          'Juicio oral',
                        ]
                      : [
                          'Audiencia de primera de trámite',
                          'Audiencia primera',
                          'Audiencia de pruebas',
                          'Audiencia de conclusiones',
                          'Audiencia de testigos',
                        ]
                    ).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setHearingType(preset);
                          if (!title || title.startsWith('Preparar') || title.startsWith('Audiencia')) {
                            const areaLabel = legalArea ? ` (${legalArea.toUpperCase()})` : '';
                            setTitle(`${preset}${areaLabel}`);
                          }
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg transition-colors font-medium ${
                          hearingType === preset
                            ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hearing Date, Time & Court */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Fecha Audiencia Señalada
                    </label>
                    <input
                      type="date"
                      value={hearingDate}
                      onChange={(e) => setHearingDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hora de Concurrencia
                    </label>
                    <input
                      type="time"
                      value={hearingTime}
                      onChange={(e) => setHearingTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Juzgado / Sala / Tribunal
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 3° Juzgado Civil, Sala 4"
                      value={courtBranch}
                      onChange={(e) => setCourtBranch(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Case Number & Brief Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      N° Causa / Rol / Expediente
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Exp. C-4890/2026 o RIT O-321-2026"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estado de Redacción de Escrito
                    </label>
                    <select
                      value={writtenBriefStatus}
                      onChange={(e) =>
                        setWrittenBriefStatus(
                          e.target.value as 'pendiente' | 'en_redaccion' | 'listo_para_firma' | 'presentado'
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pendiente">Pendiente de redacción</option>
                      <option value="en_redaccion">En redacción y recopilación de pruebas</option>
                      <option value="listo_para_firma">Listo para revisión y firma digital</option>
                      <option value="presentado">Presentado al Tribunal / Con acuse</option>
                    </select>
                  </div>
                </div>

                {/* Work on Brief Action button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ¿Vas a preparar el escrito judicial para esta audiencia?
                  </p>
                  <button
                    type="button"
                    onClick={handleAddLegalBriefChecklist}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shadow-2xs self-start sm:self-auto"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>+ Cargar pasos del Escrito Judicial</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nueva etiqueta y presiona enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Añadir
              </button>
            </div>

            {/* Tags list (clean unboxed typographic tokens as per anti-slop) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Subtareas y Puntos de Control ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </label>

            <div className="space-y-1.5 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtaskLocal(st.id)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs truncate ${
                        st.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Añadir paso o subtarea..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
              >
                + Subtarea
              </button>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {isEditing && taskModal.task ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Eliminar esta tarea definitivamente?')) {
                    deleteTask(taskModal.task!.id);
                    closeTaskModal();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors shadow-xs"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
