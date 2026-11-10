import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  HelpCircle,
  Video,
  Image,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Clock,
  Award
} from 'lucide-react';
import { BentinCourse, CourseMaterial, ExamQuestion, MaterialType } from '../types';
import { GRADE_SECTIONS } from '../data/bentinData';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: BentinCourse[];
  defaultCourseId?: string;
  onMaterialCreated: (material: CourseMaterial) => void;
  authorName: string;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  courses,
  defaultCourseId,
  onMaterialCreated,
  authorName,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourseId || courses[0]?.id || '');
  const [selectedGradeSection, setSelectedGradeSection] = useState('Primero A');
  const [materialType, setMaterialType] = useState<MaterialType>('pdf');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // PDF specific
  const [pagesCount, setPagesCount] = useState<number | string>(12);
  const [fileSize, setFileSize] = useState('15.4 MB');
  const [uploadedFileName, setUploadedFileName] = useState<string>('Guia_Oficial_Ucayali.pdf');

  // Video specific
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=gnAdna_tLK0');
  const [videoDuration, setVideoDuration] = useState('Cualquier duración (Sin límite)');

  // Form error state (replaces window.alert)
  const [formError, setFormError] = useState<string>('');

  // Photo specific
  const [imageUrl, setImageUrl] = useState('/src/assets/images/banner_ia_educacion_1794336764506.jpg');

  // Exam specific
  const [timeLimit, setTimeLimit] = useState(20);
  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 'q_' + Date.now() + '_1',
      question: '¿Cuál es el concepto principal tratado en la sesión?',
      options: [
        'Definición teórica y aplicación práctica en el aula',
        'Alternativa secundaria incorrecta',
        'Distractor de evaluación',
        'Ninguna de las anteriores',
      ],
      correctOptionIndex: 0,
      points: 10,
    },
    {
      id: 'q_' + Date.now() + '_2',
      question: '¿Qué paso se debe seguir para resolver el problema propuesto?',
      options: [
        'Analizar los datos y aplicar la fórmula general correspondiente',
        'Omitir la comprobación del resultado',
        'Multiplicar sin revisar las unidades',
        'Elegir al azar',
      ],
      correctOptionIndex: 0,
      points: 10,
    },
  ]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: 'q_' + Date.now() + '_' + (prev.length + 1),
        question: `Pregunta ${prev.length + 1}: `,
        options: ['Opción A (Correcta)', 'Opción B', 'Opción C', 'Opción D'],
        correctOptionIndex: 0,
        points: 5,
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], question: text };
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOpts = [...copy[qIdx].options];
      newOpts[optIdx] = val;
      copy[qIdx] = { ...copy[qIdx], options: newOpts };
      return copy;
    });
  };

  const handleCorrectOptionChange = (qIdx: number, optIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], correctOptionIndex: optIdx };
      return copy;
    });
  };

  const handleLoadSampleExam = () => {
    setQuestions([
      {
        id: 'q_sample_1',
        question: '¿Cuál es la función cuadrática cuya gráfica tiene vértice en el punto (0, 0)?',
        options: ['f(x) = x²', 'f(x) = 2x + 1', 'f(x) = x³ - 2', 'f(x) = 1/x'],
        correctOptionIndex: 0,
        points: 5,
      },
      {
        id: 'q_sample_2',
        question: '¿Qué ocurre con la concavidad de la parábola si el coeficiente principal "a" es positivo (a > 0)?',
        options: [
          'Se abre hacia arriba (cóncava hacia arriba)',
          'Se abre hacia abajo',
          'Es una línea horizontal',
          'No se puede determinar',
        ],
        correctOptionIndex: 0,
        points: 5,
      },
      {
        id: 'q_sample_3',
        question: '¿Cuál es el valor del discriminante si la ecuación tiene dos raíces reales e iguales?',
        options: ['Δ = 0', 'Δ > 0', 'Δ < 0', 'Δ = 100'],
        correctOptionIndex: 0,
        points: 5,
      },
      {
        id: 'q_sample_4',
        question: 'Al resolver (x - 4)(x + 2) = 0, ¿cuáles son los valores de x?',
        options: ['x = 4 y x = -2', 'x = -4 y x = 2', 'x = 0 y x = 2', 'x = 4 y x = 2'],
        correctOptionIndex: 0,
        points: 5,
      },
    ]);
    setTitle('Examen Rápido de Comprobación de Aprendizajes');
    setDescription('Evaluación corta de 4 preguntas para afianzar los conceptos vistos en clase.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) {
      setFormError('Por favor ingresa un título para el material educativo.');
      return;
    }

    const totalPts = materialType === 'exam' ? questions.reduce((sum, q) => sum + q.points, 0) : undefined;

    const newMaterial: CourseMaterial = {
      id: 'mat_' + Date.now(),
      courseId: selectedCourseId,
      title,
      description: description || 'Material pedagógico publicado por el docente en el aula virtual.',
      type: materialType,
      createdAt: 'Publicado hoy',
      authorName,
      gradeSection: selectedGradeSection,
      pdfUrl: materialType === 'pdf' ? '/docs/material_educativo.pdf' : undefined,
      pagesCount: materialType === 'pdf' ? Number(pagesCount) : undefined,
      fileSize: materialType === 'pdf' ? fileSize : undefined,
      videoUrl: materialType === 'video' ? videoUrl : undefined,
      videoDuration: materialType === 'video' ? videoDuration : undefined,
      imageUrl: materialType === 'photo' ? imageUrl : undefined,
      examQuestions: materialType === 'exam' ? questions : undefined,
      examTimeLimitMinutes: materialType === 'exam' ? Number(timeLimit) : undefined,
      totalPoints: totalPts,
    };

    onMaterialCreated(newMaterial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#831843] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-300">
              I.E. Ricardo Bentín · Pucallpa, Ucayali · Panel del Docente
            </span>
            <h3 className="text-lg font-extrabold flex items-center gap-2 mt-0.5">
              <Upload className="w-5 h-5" />
              <span>Publicar Material o Examen para Alumnos</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 font-bold text-xs flex items-center justify-between">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError('')}
                className="text-rose-500 hover:text-rose-800 text-sm ml-2"
              >
                ✕
              </button>
            </div>
          )}
          {/* Target Course & Section Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Asignatura / Curso
              </label>
              {defaultCourseId ? (
                <div className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-bold flex items-center justify-between">
                  <span className="truncate">{courses.find((c) => c.id === selectedCourseId)?.title || 'Mi Curso'}</span>
                  <span className="text-[10px] bg-blue-100 text-[#1E3A8A] px-2 py-0.5 rounded font-black shrink-0">
                    Tu Asignatura
                  </span>
                </div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} [{c.code}]
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Grado y Sección Destino
              </label>
              <select
                value={selectedGradeSection}
                onChange={(e) => setSelectedGradeSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] font-bold text-[#1E3A8A]"
              >
                {GRADE_SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    Sección {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Material Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Tipo de Material Educativo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMaterialType('pdf')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  materialType === 'pdf'
                    ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C] shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>PDF / Ficha</span>
              </button>

              <button
                type="button"
                onClick={() => setMaterialType('exam')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  materialType === 'exam'
                    ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A] shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>Examen Online</span>
              </button>

              <button
                type="button"
                onClick={() => setMaterialType('video')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  materialType === 'video'
                    ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Video / Link</span>
              </button>

              <button
                type="button"
                onClick={() => setMaterialType('photo')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  materialType === 'photo'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                <Image className="w-5 h-5" />
                <span>Foto / Infografía</span>
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Título del Material / Examen
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Ficha de Trabajo N° 05: Álgebra o Examen Mensual"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Descripción e Indicaciones para los Alumnos
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Indica qué deben hacer los alumnos (ej. 'Resolver los ejercicios antes del viernes')..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          {/* Conditional Fields based on materialType */}
          {materialType === 'pdf' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 block">
                  Documento PDF Escolar
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  ✓ Sin restricciones de tamaño (MB) ni de páginas
                </span>
              </div>

              {/* Real File Input Card */}
              <div className="border-2 border-dashed border-rose-300 rounded-xl p-4 text-center bg-rose-50/40 hover:bg-rose-50/80 transition-colors">
                <input
                  type="file"
                  id="pdf-upload-file-input"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFileName(file.name);
                      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
                      setFileSize(`${sizeInMb} MB`);
                      if (!title) {
                        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
                      }
                    }
                  }}
                />
                <label htmlFor="pdf-upload-file-input" className="cursor-pointer block">
                  <FileText className="w-9 h-9 text-rose-600 mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-slate-800 block">
                    {uploadedFileName ? `Archivo seleccionado: ${uploadedFileName}` : 'Seleccionar archivo PDF de tu dispositivo'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Puedes cargar archivos de cualquier peso (50 MB, 100 MB, 500 MB+) y sin límite en la cantidad de páginas.
                  </p>
                  <span className="mt-2 inline-block px-3 py-1 bg-white border border-rose-300 text-rose-700 font-bold text-[11px] rounded-lg shadow-2xs hover:bg-rose-50">
                    Examinar archivo PDF...
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    Número de páginas (Sin restricciones)
                  </label>
                  <input
                    type="text"
                    value={pagesCount}
                    onChange={(e) => setPagesCount(e.target.value)}
                    placeholder="Ej. 12 páginas, 45 páginas, etc."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    Tamaño del archivo (Ilimitado)
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="Ej. 25 MB, 120 MB (Cualquier tamaño)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {materialType === 'video' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 block">
                  Video Educativo (YouTube o Enlace Web)
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-full">
                  ✓ Sin límite de duración
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">URL del Video (YouTube, Vimeo o Enlace)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">
                  Duración de la clase (Sin límite: 10 min, 45 min o conferencias de 2 a 3 horas)
                </label>
                <input
                  type="text"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  placeholder="Ej. 45:00 min, 1h 30 min, 3 horas (Libre)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {materialType === 'photo' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Foto o Infografía Didáctica
              </span>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Ruta o URL de la Imagen</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {materialType === 'exam' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-xl">
                <div>
                  <span className="font-bold text-xs text-[#1E3A8A] block">
                    Configuración de la Evaluación Online
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {questions.length} preguntas · Total:{' '}
                    {questions.reduce((sum, q) => sum + q.points, 0)} puntos (Escala vigesimal 0-20)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSampleExam}
                  className="px-2.5 py-1 text-xs bg-white text-[#1E3A8A] font-bold border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  Cargar Preguntas Ejemplo
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <label className="text-xs text-slate-700 font-bold">
                    Tiempo Límite:
                  </label>
                </div>
                <input
                  type="number"
                  min={5}
                  max={90}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-center text-xs font-bold"
                />
                <span className="text-xs text-slate-500">minutos para resolver</span>
              </div>

              {/* Questions list */}
              <div className="space-y-4">
                {questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Pregunta N° {qIdx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Puntaje:</span>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={q.points}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setQuestions((prev) => {
                              const copy = [...prev];
                              copy[qIdx].points = val;
                              return copy;
                            });
                          }}
                          className="w-14 px-1.5 py-0.5 text-xs text-center border border-slate-300 rounded bg-white font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          disabled={questions.length <= 1}
                          className="text-slate-400 hover:text-red-600 disabled:opacity-30 p-1"
                          title="Eliminar pregunta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                      placeholder="Escribe el enunciado de la pregunta..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      required
                    />

                    {/* Options list */}
                    <div className="space-y-1.5 pl-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Opciones de respuesta (Marca el círculo de la opción correcta):
                      </span>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${q.id}`}
                            checked={q.correctOptionIndex === optIdx}
                            onChange={() => handleCorrectOptionChange(qIdx, optIdx)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            title="Marcar como respuesta correcta"
                          />
                          <span className="text-xs font-bold text-slate-600 w-4">
                            {String.fromCharCode(65 + optIdx)}:
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            placeholder={`Opción ${String.fromCharCode(65 + optIdx)}`}
                            className={`flex-1 px-2.5 py-1 text-xs border rounded-md bg-white ${
                              q.correctOptionIndex === optIdx
                                ? 'border-emerald-500 bg-emerald-50/50 font-semibold text-emerald-950'
                                : 'border-slate-300'
                            }`}
                            required
                          />
                          {q.correctOptionIndex === optIdx && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                              ✓ Correcta
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2 bg-white border-2 border-dashed border-[#1E3A8A]/40 hover:border-[#1E3A8A] text-[#1E3A8A] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Otra Pregunta al Examen</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs flex items-center gap-2 transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Publicar para los Alumnos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
