import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Video,
  Image,
  Award,
  Clock,
  CheckCircle2,
  Play,
  Download,
  Eye,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { BentinCourse, CourseMaterial, ExamAttempt, MaterialType, UserProfile } from '../types';
import { GRADE_SECTIONS } from '../data/bentinData';

interface StudentDashboardProps {
  currentUser: UserProfile;
  courses: BentinCourse[];
  materials: CourseMaterial[];
  attempts: ExamAttempt[];
  onTakeExam: (material: CourseMaterial, courseTitle: string) => void;
  onViewMaterial: (material: CourseMaterial, courseTitle: string) => void;
  onDownloadMaterial: (material: CourseMaterial) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  materials,
  attempts,
  onTakeExam,
  onViewMaterial,
  onDownloadMaterial,
}) => {
  // Extract initial section from user e.g. "Primero A", "Cuarto B"
  const userSec = currentUser.section || '';
  const initialSec = (GRADE_SECTIONS as readonly string[]).includes(userSec) ? userSec : 'Primero A';

  const [selectedCourseId, setSelectedCourseId] = useState<string>('todos');
  const [selectedSection, setSelectedSection] = useState<string>(initialSec);
  const [gradeFilterTab, setGradeFilterTab] = useState<string>('todos');
  const [filterType, setFilterType] = useState<string>('todos');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const getCourseTitle = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.title || 'Curso';
  };

  // Visible sections according to grade filter tab
  const visibleSections = GRADE_SECTIONS.filter((sec) => {
    if (gradeFilterTab === '1') return sec.startsWith('Primero');
    if (gradeFilterTab === '2') return sec.startsWith('Segundo');
    if (gradeFilterTab === '3') return sec.startsWith('Tercero');
    if (gradeFilterTab === '4') return sec.startsWith('Cuarto');
    if (gradeFilterTab === '5') return sec.startsWith('Quinto');
    return true;
  });

  // Filter materials by selected course (or all courses) AND selected section
  const filteredMaterials = materials.filter((m) => {
    const matchCourse = selectedCourseId === 'todos' || m.courseId === selectedCourseId;
    const matchSection = selectedSection === 'todas' || m.gradeSection === selectedSection;
    const matchType = filterType === 'todos' || m.type === filterType;
    return matchCourse && matchSection && matchType;
  });

  const getAttemptForExam = (examId: string) => {
    return attempts.find((a) => a.examId === examId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Student Hero Banner */}
      <div className="bg-gradient-to-r from-[#B91C1C] via-[#831843] to-[#1E3A8A] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-red-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-black/30 px-3 py-1 rounded-md border border-amber-300/30">
              <GraduationCap className="w-4 h-4" />
              <span>Estudiante Bentiniano · {currentUser.section || 'Primero A'} · Pucallpa, Ucayali</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Bienvenido, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              Accede a tus asignaturas, resuelve tus exámenes virtuales calificados automáticamente, descarga tus guías de trabajo y reproduce los videos de clase subidos por tus profesores en Pucallpa.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/20 text-center shrink-0">
            <span className="text-2xl font-black text-amber-300 font-mono block">
              {attempts.length}
            </span>
            <span className="text-xs text-white uppercase font-bold tracking-wide">
              Exámenes Resueltos
            </span>
            <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded font-medium">
              Promedio: 18.5 (AD)
            </div>
          </div>
        </div>
      </div>

      {/* Grade and Section Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#B91C1C] tracking-wider">
              Aulas por Grado y Sección:
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Selecciona tu sección para ver todos los trabajos, PDFs y exámenes
            </span>
          </div>

          <span className="text-xs font-bold text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 w-fit">
            Aula activa: {selectedSection === 'todas' ? 'Todas las Secciones' : `Sección ${selectedSection}`}
          </span>
        </div>

        {/* Grade tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-600 mr-1">Filtrar por Grado:</span>
          {[
            { id: 'todos', label: 'Todos los Grados' },
            { id: '1', label: '1° Sec (A, B, C)' },
            { id: '2', label: '2° Sec (A, B, C, D)' },
            { id: '3', label: '3° Sec (A, B, C, D, E)' },
            { id: '4', label: '4° Sec (A, B, C)' },
            { id: '5', label: '5° Sec (A, B, C)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setGradeFilterTab(tab.id);
                if (tab.id !== 'todos') setSelectedSection('todas');
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                gradeFilterTab === tab.id
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedSection('todas')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
              selectedSection === 'todas'
                ? 'bg-[#B91C1C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas las Secciones
          </button>
          {visibleSections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                selectedSection === sec
                  ? 'bg-[#B91C1C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Course Selection Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B91C1C]" />
            <span>Asignaturas del Currículo 2026</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Filtra por materia o ve todos los trabajos juntos
          </span>
        </div>

        {/* All courses toggle + course grid */}
        <div className="mb-4">
          <button
            onClick={() => setSelectedCourseId('todos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all mr-2 ${
              selectedCourseId === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Mostrar Trabajos de Todas las Materias
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => {
            const isSelected = selectedCourseId === course.id;
            const count = materials.filter(
              (m) =>
                m.courseId === course.id &&
                (selectedSection === 'todas' || m.gradeSection === selectedSection)
            ).length;

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-red-50/70 border-[#B91C1C] shadow-xs ring-2 ring-[#B91C1C]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#B91C1C] bg-white px-2 py-0.5 rounded border border-red-200">
                    {course.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {count} tareas
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {course.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
                  {course.teacherName}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-[#B91C1C] font-bold">Ver material</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#B91C1C]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Course Materials Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <span>{selectedCourse ? selectedCourse.grade : 'Todas las asignaturas'}</span>
              {selectedCourse && (
                <>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">{selectedCourse.teacherName}</span>
                </>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {selectedCourse ? `Contenido de la Asignatura: "${selectedCourse.title}"` : 'Material de Todas las Asignaturas'}
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'exam', label: '📝 Exámenes' },
              { id: 'pdf', label: '📄 PDFs y Guías' },
              { id: 'video', label: '🎥 Videos' },
              { id: 'photo', label: '🖼️ Fotos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Cards Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 mb-1">
              No hay actividades para esta categoría en este curso.
            </p>
            <p className="text-xs text-slate-500">
              Prueba seleccionando "Todos" para ver el material completo del docente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMaterials.map((mat) => {
              const attempt = mat.type === 'exam' ? getAttemptForExam(mat.id) : null;

              return (
                <div
                  key={mat.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded uppercase flex items-center gap-1.5 ${
                          mat.type === 'pdf'
                            ? 'bg-rose-100 text-rose-800'
                            : mat.type === 'exam'
                            ? 'bg-blue-100 text-blue-900'
                            : mat.type === 'video'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {mat.type === 'pdf' && <FileText className="w-3.5 h-3.5" />}
                        {mat.type === 'exam' && <HelpCircle className="w-3.5 h-3.5" />}
                        {mat.type === 'video' && <Video className="w-3.5 h-3.5" />}
                        {mat.type === 'photo' && <Image className="w-3.5 h-3.5" />}
                        <span>
                          {mat.type === 'pdf'
                            ? 'Guía / PDF'
                            : mat.type === 'exam'
                            ? 'Examen Online'
                            : mat.type === 'video'
                            ? 'Video de Clase'
                            : 'Foto Didáctica'}
                        </span>
                      </span>

                      <span className="text-[11px] text-slate-400">{mat.createdAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#1E3A8A] transition-colors">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-normal">
                      {mat.description}
                    </p>

                    {/* Type specific specs */}
                    {mat.type === 'exam' && mat.examQuestions && (
                      <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl mb-4 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#1E3A8A]">
                          <span>{mat.examQuestions.length} Preguntas con alternativa múltiple</span>
                          <span>{mat.totalPoints || 20} pts (Escala 0-20)</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Límite de tiempo: {mat.examTimeLimitMinutes || 20} minutos</span>
                        </div>
                      </div>
                    )}

                    {mat.type === 'video' && (
                      <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg mb-4 text-xs font-semibold text-purple-800 flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 fill-purple-700 text-purple-700" />
                        <span>Duración del video: {mat.videoDuration || '15 min'}</span>
                      </div>
                    )}

                    {mat.type === 'pdf' && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg mb-4 text-xs font-semibold text-rose-800 flex items-center justify-between">
                        <span>Documento: {mat.pagesCount || 6} páginas</span>
                        <span className="text-slate-500 font-mono text-[11px]">{mat.fileSize || '2.4 MB'}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {mat.type === 'exam' ? (
                      attempt ? (
                        <div className="w-full flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>
                              Examen Rendido: {attempt.score}/{attempt.maxScore} (Nota: {attempt.gradeLetter})
                            </span>
                          </span>

                          <button
                            onClick={() => onTakeExam(mat, getCourseTitle(mat.courseId))}
                            className="px-3 py-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
                          >
                            Ver Corrección
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onTakeExam(mat, getCourseTitle(mat.courseId))}
                          className="w-full py-2.5 bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Resolver Examen Ahora</span>
                        </button>
                      )
                    ) : mat.type === 'video' ? (
                      <button
                        onClick={() => onViewMaterial(mat, getCourseTitle(mat.courseId))}
                        className="w-full py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Ver Video de la Clase</span>
                      </button>
                    ) : mat.type === 'pdf' ? (
                      <div className="w-full flex items-center gap-2">
                        <button
                          onClick={() => onViewMaterial(mat, getCourseTitle(mat.courseId))}
                          className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Visualizar Guía</span>
                        </button>
                        <button
                          onClick={() => onDownloadMaterial(mat)}
                          className="flex-1 py-2 text-xs font-bold text-white bg-[#B91C1C] hover:bg-red-800 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar PDF</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onViewMaterial(mat, getCourseTitle(mat.courseId))}
                        className="w-full py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Foto / Infografía</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
