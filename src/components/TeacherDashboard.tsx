import React, { useState } from 'react';
import {
  Upload,
  BookOpen,
  FileText,
  HelpCircle,
  Video,
  Image,
  Award,
  Users,
  CheckCircle2,
  Trash2,
  Eye,
  Plus,
  Calendar,
  GraduationCap,
  Sparkles,
  Lock,
  Layers,
  Filter,
  BarChart3,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';
import { BentinCourse, CourseMaterial, ExamAttempt, UserProfile } from '../types';
import { GRADE_SECTIONS } from '../data/bentinData';

interface TeacherDashboardProps {
  currentUser: UserProfile;
  courses: BentinCourse[];
  materials: CourseMaterial[];
  attempts: ExamAttempt[];
  onOpenUpload: (defaultCourseId?: string) => void;
  onViewMaterial: (material: CourseMaterial, courseTitle: string) => void;
  onDeleteMaterial: (materialId: string) => void;
}

// Student access data for the 18 sections of I.E. Ricardo Bentin
const SECTION_ATTENDANCE_STATS: Record<
  string,
  { total: number; accessed: number; percent: number; grade: string; color: string }
> = {
  'Primero A': { total: 36, accessed: 35, percent: 97, grade: '1°', color: 'bg-blue-600' },
  'Primero B': { total: 35, accessed: 32, percent: 91, grade: '1°', color: 'bg-blue-500' },
  'Primero C': { total: 34, accessed: 30, percent: 88, grade: '1°', color: 'bg-blue-400' },
  'Segundo A': { total: 37, accessed: 36, percent: 97, grade: '2°', color: 'bg-emerald-600' },
  'Segundo B': { total: 36, accessed: 33, percent: 92, grade: '2°', color: 'bg-emerald-500' },
  'Segundo C': { total: 35, accessed: 31, percent: 89, grade: '2°', color: 'bg-emerald-400' },
  'Segundo D': { total: 34, accessed: 29, percent: 85, grade: '2°', color: 'bg-emerald-300' },
  'Tercero A': { total: 38, accessed: 37, percent: 97, grade: '3°', color: 'bg-purple-600' },
  'Tercero B': { total: 36, accessed: 34, percent: 94, grade: '3°', color: 'bg-purple-500' },
  'Tercero C': { total: 35, accessed: 32, percent: 91, grade: '3°', color: 'bg-purple-400' },
  'Tercero D': { total: 34, accessed: 29, percent: 85, grade: '3°', color: 'bg-purple-300' },
  'Tercero E': { total: 32, accessed: 27, percent: 84, grade: '3°', color: 'bg-purple-200' },
  'Cuarto A': { total: 38, accessed: 38, percent: 100, grade: '4°', color: 'bg-amber-600' },
  'Cuarto B': { total: 37, accessed: 36, percent: 97, grade: '4°', color: 'bg-amber-500' },
  'Cuarto C': { total: 35, accessed: 33, percent: 94, grade: '4°', color: 'bg-amber-400' },
  'Quinto A': { total: 38, accessed: 38, percent: 100, grade: '5°', color: 'bg-rose-600' },
  'Quinto B': { total: 36, accessed: 35, percent: 97, grade: '5°', color: 'bg-rose-500' },
  'Quinto C': { total: 35, accessed: 32, percent: 91, grade: '5°', color: 'bg-rose-400' },
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  courses,
  materials,
  attempts,
  onOpenUpload,
  onViewMaterial,
  onDeleteMaterial,
}) => {
  // STRICT RULE: The teacher ONLY accesses and manages THEIR assigned course!
  const teacherCourse =
    courses.find((c) => c.id === currentUser.assignedCourseId) || courses[0];

  const [sectionFilter, setSectionFilter] = useState<string>('todas');
  const [gradeFilterTab, setGradeFilterTab] = useState<string>('todos');
  const [chartViewMode, setChartViewMode] = useState<'secciones' | 'grados'>('secciones');
  const [chartGradeFilter, setChartGradeFilter] = useState<string>('todos');

  // Deletion confirmation state
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  // Materials of ONLY this teacher's course, filtered by section
  const myCourseMaterials = materials.filter((m) => {
    if (m.courseId !== teacherCourse.id) return false;
    if (sectionFilter !== 'todas' && m.gradeSection !== sectionFilter) return false;
    return true;
  });

  // Filter sections by grade tab if selected
  const visibleSections = GRADE_SECTIONS.filter((sec) => {
    if (gradeFilterTab === '1') return sec.startsWith('Primero');
    if (gradeFilterTab === '2') return sec.startsWith('Segundo');
    if (gradeFilterTab === '3') return sec.startsWith('Tercero');
    if (gradeFilterTab === '4') return sec.startsWith('Cuarto');
    if (gradeFilterTab === '5') return sec.startsWith('Quinto');
    return true;
  });

  // Filter sections for the analytics chart
  const chartSections = GRADE_SECTIONS.filter((sec) => {
    if (chartGradeFilter === '1') return sec.startsWith('Primero');
    if (chartGradeFilter === '2') return sec.startsWith('Segundo');
    if (chartGradeFilter === '3') return sec.startsWith('Tercero');
    if (chartGradeFilter === '4') return sec.startsWith('Cuarto');
    if (chartGradeFilter === '5') return sec.startsWith('Quinto');
    return true;
  });

  // Grade consolidated statistics
  const GRADE_CONSOLIDATED = [
    { grade: '1° Secundaria', totalStudents: 105, accessedStudents: 97, percent: 92, sectionsCount: 3, color: 'bg-blue-600' },
    { grade: '2° Secundaria', totalStudents: 142, accessedStudents: 129, percent: 91, sectionsCount: 4, color: 'bg-emerald-600' },
    { grade: '3° Secundaria', totalStudents: 175, accessedStudents: 159, percent: 91, sectionsCount: 5, color: 'bg-purple-600' },
    { grade: '4° Secundaria', totalStudents: 110, accessedStudents: 107, percent: 97, sectionsCount: 3, color: 'bg-amber-600' },
    { grade: '5° Secundaria', totalStudents: 109, accessedStudents: 105, percent: 96, sectionsCount: 3, color: 'bg-rose-600' },
  ];

  const totalRegisteredStudents = GRADE_CONSOLIDATED.reduce((acc, curr) => acc + curr.totalStudents, 0);
  const totalAccessedStudents = GRADE_CONSOLIDATED.reduce((acc, curr) => acc + curr.accessedStudents, 0);
  const overallAccessRate = ((totalAccessedStudents / totalRegisteredStudents) * 100).toFixed(1);

  // Counts specific to this teacher's course
  const totalMyMaterials = materials.filter((m) => m.courseId === teacherCourse.id);
  const pdfCount = totalMyMaterials.filter((m) => m.type === 'pdf').length;
  const examCount = totalMyMaterials.filter((m) => m.type === 'exam').length;
  const videoCount = totalMyMaterials.filter((m) => m.type === 'video').length;
  const photoCount = totalMyMaterials.filter((m) => m.type === 'photo').length;

  // Student exam attempts ONLY for this teacher's course
  const myExamIds = new Set(totalMyMaterials.filter((m) => m.type === 'exam').map((m) => m.id));
  const myAttempts = attempts.filter((att) => att.courseId === teacherCourse.id || myExamIds.has(att.examId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Welcome & Actions Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E293B] to-[#831843] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-black/30 px-3 py-1 rounded-md border border-amber-300/30">
              <GraduationCap className="w-4 h-4" />
              <span>Docente Titular · I.E. Ricardo Bentín (Pucallpa - Ucayali)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bienvenido a tu aula virtual asignada de <strong>{teacherCourse.title}</strong>. Gestiona tus guías PDF, videos de clase, fotos y exámenes interactivos para las 18 secciones (Primero A a Quinto C).
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onOpenUpload(teacherCourse.id)}
              className="w-full sm:w-auto px-6 py-3 bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>+ Subir Material para mis Alumnos</span>
            </button>
          </div>
        </div>

        {/* Quick Teacher Metrics for THIS course */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-2xl font-black text-amber-400 block font-mono">{pdfCount}</span>
            <span className="text-xs text-slate-300">Guías / PDFs de mi curso</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-2xl font-black text-sky-400 block font-mono">{examCount}</span>
            <span className="text-xs text-slate-300">Exámenes activos</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-2xl font-black text-purple-400 block font-mono">{videoCount}</span>
            <span className="text-xs text-slate-300">Videos de clase</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-2xl font-black text-emerald-400 block font-mono">{myAttempts.length}</span>
            <span className="text-xs text-slate-300">Exámenes calificados</span>
          </div>
        </div>
      </div>

      {/* 2. Single Assigned Course Showcase (NO other teachers' courses) */}
      <div className="bg-white rounded-2xl border-2 border-[#1E3A8A]/30 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {teacherCourse.code}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Tu Asignatura Asignada Única</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Pucallpa - Ucayali
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {teacherCourse.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {teacherCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-slate-600">
              <span className="font-semibold text-slate-900">
                Docente Titular: <strong className="text-[#1E3A8A]">{currentUser.name}</strong>
              </span>
              <span>·</span>
              <span>Especialidad: {currentUser.specialty || teacherCourse.area}</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">18 Secciones Habilitadas (1° a 5° Sec)</span>
            </div>
          </div>

          <div className="shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 min-w-[220px]">
            <div className="text-xs text-slate-500 font-medium">Estado del Curso:</div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Aula Virtual Activa</span>
            </div>
            <div className="text-xs text-slate-600 pt-1 border-t border-slate-200">
              <strong>{totalMyMaterials.length}</strong> recursos educativos disponibles
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Student Attendance & Access Analytics Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] mb-1">
              <BarChart3 className="w-4 h-4 text-[#1E3A8A]" />
              <span>Estadísticas de Ingreso y Conectividad Escolar</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Alumnos por Grado y Sección que Ingresaron a "{teacherCourse.title}"
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoreo en tiempo real de asistencia digital de las 18 secciones de la I.E. Ricardo Bentín
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setChartViewMode('secciones')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartViewMode === 'secciones'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Secciones (18)
            </button>
            <button
              onClick={() => setChartViewMode('grados')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartViewMode === 'grados'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consolidado por Grados (1° a 5°)
            </button>
          </div>
        </div>

        {/* Analytics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-xs font-bold text-[#1E3A8A] block">Total Ingresos al Curso</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{totalAccessedStudents}</span>
              <span className="text-xs text-slate-500 font-medium">de {totalRegisteredStudents} alumnos</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              ✓ {overallAccessRate}% de participación
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-900 block">Grado Más Activo</span>
            <div className="text-lg font-black text-slate-900 mt-1">4° de Secundaria</div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              107 alumnos conectados (97.3%)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-xs font-bold text-amber-900 block">Sección con 100% Asistencia</span>
            <div className="text-lg font-black text-slate-900 mt-1">Cuarto A y Quinto A</div>
            <span className="text-[11px] text-amber-800 font-semibold block mt-1">
              38/38 alumnos ingresaron
            </span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
            <span className="text-xs font-bold text-purple-900 block">Aulas en Monitoreo</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">18 Secciones</div>
            <span className="text-[11px] text-purple-700 font-semibold block mt-1">
              Pucallpa - Ucayali
            </span>
          </div>
        </div>

        {/* View 1: Chart by All 18 Sections */}
        {chartViewMode === 'secciones' && (
          <div className="space-y-4 pt-2">
            {/* Filter buttons for the chart */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="font-bold text-slate-600 mr-1">Filtrar Grado:</span>
                {[
                  { id: 'todos', label: 'Todas las Secciones (18)' },
                  { id: '1', label: '1° Secundaria (A, B, C)' },
                  { id: '2', label: '2° Secundaria (A, B, C, D)' },
                  { id: '3', label: '3° Secundaria (A, B, C, D, E)' },
                  { id: '4', label: '4° Secundaria (A, B, C)' },
                  { id: '5', label: '5° Secundaria (A, B, C)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setChartGradeFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                      chartGradeFilter === f.id
                        ? 'bg-[#1E3A8A] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Mostrando {chartSections.length} secciones
              </span>
            </div>

            {/* Interactive Visual Bar Chart */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-3">
                {chartSections.map((secName) => {
                  const stat = SECTION_ATTENDANCE_STATS[secName] || {
                    total: 35,
                    accessed: 30,
                    percent: 86,
                    grade: 'Sec',
                    color: 'bg-blue-600',
                  };

                  return (
                    <div key={secName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 w-24 truncate">{secName}</span>
                          <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            Grado {stat.grade}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs">
                          <span className="font-bold text-slate-900">
                            {stat.accessed} / {stat.total} alumnos
                          </span>
                          <span
                            className={`font-black text-[11px] px-1.5 py-0.2 rounded ${
                              stat.percent >= 95
                                ? 'bg-emerald-100 text-emerald-800'
                                : stat.percent >= 90
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {stat.percent}%
                          </span>
                        </div>
                      </div>

                      {/* Bar Fill */}
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${stat.color}`}
                          style={{ width: `${stat.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View 2: Chart Consolidated by Grade (1° to 5°) */}
        {chartViewMode === 'grados' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {GRADE_CONSOLIDATED.map((gr) => (
                <div
                  key={gr.grade}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-[#1E3A8A] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                      {gr.sectionsCount} Secciones
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{gr.grade}</h4>

                    <div className="my-3 space-y-1">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-600">Ingresaron:</span>
                        <strong className="text-slate-900 font-mono">
                          {gr.accessedStudents} de {gr.totalStudents}
                        </strong>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${gr.color}`}
                          style={{ width: `${gr.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Conectividad:</span>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      {gr.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SVG Visual Histogram */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Comparativa de Asistencia Digital por Grados</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  I.E. Ricardo Bentín · {totalAccessedStudents} alumnos activos
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 items-end h-40 pt-4 px-2 border-b border-slate-700">
                {GRADE_CONSOLIDATED.map((gr) => {
                  const heightPercent = (gr.accessedStudents / 175) * 100;
                  return (
                    <div key={gr.grade} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono text-amber-300 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {gr.accessedStudents}
                      </span>
                      <div
                        className={`w-full max-w-[48px] rounded-t-lg transition-all duration-500 ${
                          gr.percent >= 95 ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-sky-500 hover:bg-sky-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                      <span className="text-[11px] font-bold text-slate-300 mt-2 text-center truncate w-full">
                        {gr.grade.replace(' Secundaria', '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Materials List for This Course Organized by Grade and Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <span>{teacherCourse.title}</span>
              <span>·</span>
              <span className="text-[#1E3A8A]">
                {sectionFilter === 'todas' ? 'Todas las Secciones' : `Sección: ${sectionFilter}`}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Materiales y Exámenes de mi Curso
            </h3>
          </div>

          <button
            onClick={() => onOpenUpload(teacherCourse.id)}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Material a esta Sección</span>
          </button>
        </div>

        {/* Section Filter System */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Grade filter level tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Filtrar Grado:</span>
            </span>

            {[
              { id: 'todos', label: 'Todos los Grados' },
              { id: '1', label: '1° Secundaria (A, B, C)' },
              { id: '2', label: '2° Secundaria (A, B, C, D)' },
              { id: '3', label: '3° Secundaria (A, B, C, D, E)' },
              { id: '4', label: '4° Secundaria (A, B, C)' },
              { id: '5', label: '5° Secundaria (A, B, C)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setGradeFilterTab(tab.id);
                  if (tab.id !== 'todos') setSectionFilter('todas');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  gradeFilterTab === tab.id
                    ? 'bg-[#1E3A8A] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Individual Section Buttons (18 sections) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-500 font-bold shrink-0 mr-1">Sección exacta:</span>
            <button
              onClick={() => setSectionFilter('todas')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                sectionFilter === 'todas'
                  ? 'bg-[#B91C1C] text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Todas las Secciones
            </button>
            {visibleSections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSectionFilter(sec)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                  sectionFilter === sec
                    ? 'bg-[#B91C1C] text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {myCourseMaterials.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">
              No hay materiales para {sectionFilter === 'todas' ? 'este curso' : `la sección ${sectionFilter}`}
            </h4>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              Sube guías en PDF (sin límite de MB ni páginas), cuestionarios o videos asignados a {sectionFilter === 'todas' ? 'tus alumnos' : `la sección ${sectionFilter}`}.
            </p>
            <button
              onClick={() => onOpenUpload(teacherCourse.id)}
              className="px-4 py-2 bg-[#B91C1C] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-red-800"
            >
              + Subir material para {sectionFilter === 'todas' ? 'mi curso' : sectionFilter}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourseMaterials.map((mat) => {
              return (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
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
                              ? 'PDF / Guía'
                              : mat.type === 'exam'
                              ? 'Examen Online'
                              : mat.type === 'video'
                              ? 'Video Educativo'
                              : 'Foto / Infografía'}
                          </span>
                        </span>

                        {mat.gradeSection && (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300/60">
                            {mat.gradeSection}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400">{mat.createdAt}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {mat.description}
                    </p>

                    {mat.type === 'exam' && mat.examQuestions && (
                      <div className="text-[11px] font-semibold text-[#1E3A8A] bg-blue-50 p-2 rounded-md mb-2 flex items-center justify-between">
                        <span>{mat.examQuestions.length} preguntas interactivas</span>
                        <span>{mat.totalPoints || 20} puntos máx.</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewMaterial(mat, teacherCourse.title)}
                      className="text-xs font-bold text-[#1E3A8A] hover:text-blue-900 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{mat.type === 'exam' ? 'Revisar Examen' : 'Visualizar'}</span>
                    </button>

                    {/* Prominent Deletion Action with Inline Confirmation */}
                    {materialToDelete === mat.id ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2 py-1 rounded-lg animate-in fade-in">
                        <span className="text-[10px] font-bold text-rose-800">¿Eliminar material?</span>
                        <button
                          onClick={() => {
                            onDeleteMaterial(mat.id);
                            setMaterialToDelete(null);
                          }}
                          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded shadow-2xs"
                        >
                          Sí, Borrar
                        </button>
                        <button
                          onClick={() => setMaterialToDelete(null)}
                          className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] rounded font-medium"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMaterialToDelete(mat.id)}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                        title="Eliminar este material educativo del curso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Student Submissions & Grades Table for THIS Course */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Registro de Evaluaciones Entregadas en {teacherCourse.title}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Calificaciones automáticas de los exámenes resueltos por tus alumnos en este curso
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            {myAttempts.length} entregas en este curso
          </span>
        </div>

        {myAttempts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            Aún ningún alumno ha rendido evaluaciones en tu curso. Los alumnos pueden resolver los exámenes desde su panel.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Alumno</th>
                  <th className="p-3">DNI</th>
                  <th className="p-3">Grado / Sección</th>
                  <th className="p-3">Examen</th>
                  <th className="p-3">Puntaje</th>
                  <th className="p-3">Calificación / Nivel</th>
                  <th className="p-3">Fecha y Hora</th>
                  <th className="p-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myAttempts.map((att) => {
                  const examMaterial = materials.find((m) => m.id === att.examId);
                  return (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{att.studentName}</td>
                      <td className="p-3 font-mono text-slate-500">{att.studentDni}</td>
                      <td className="p-3 font-semibold text-[#1E3A8A]">
                        {att.gradeSection || examMaterial?.gradeSection || 'Primero A'}
                      </td>
                      <td className="p-3 text-slate-700">
                        {examMaterial?.title || 'Evaluación'}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {att.score} / {att.maxScore}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-black px-2 py-0.5 rounded text-[11px] ${
                            att.gradeLetter === 'AD'
                              ? 'bg-emerald-100 text-emerald-800'
                              : att.gradeLetter === 'A'
                              ? 'bg-blue-100 text-blue-800'
                              : att.gradeLetter === 'B'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.gradeLetter} (
                          {att.gradeLetter === 'AD'
                            ? 'Logro Destacado'
                            : att.gradeLetter === 'A'
                            ? 'Logro Esperado'
                            : 'En Proceso'}
                          )
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{att.submittedAt}</td>
                      <td className="p-3 text-right">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Calificado
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
