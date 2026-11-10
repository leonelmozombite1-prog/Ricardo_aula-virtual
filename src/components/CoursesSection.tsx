import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Course, UserProfile } from '../types';
import { COURSES_DATA } from '../data/mockData';

interface CoursesSectionProps {
  user: UserProfile | null;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (courseId: string) => void;
  searchFilter: string;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  user,
  onSelectCourse,
  onEnrollCourse,
  searchFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', label: 'Todos los Cursos' },
    { id: 'ia', label: 'Inteligencia Artificial' },
    { id: 'docentes', label: 'Formación Docente' },
    { id: 'directivos', label: 'Directivos y Gestión' },
    { id: 'inclusiva', label: 'Inclusiva y EIB' },
    { id: 'digital', label: 'Competencias Digitales' },
  ];

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory =
      selectedCategory === 'todos' || course.category === selectedCategory;
    const matchesSearch =
      !searchFilter ||
      course.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      course.targetAudience.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="cursos" className="py-12 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Campus Virtual & Programas SIFODS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Oferta Formativa y Cursos Vigentes 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Fortalece tus competencias pedagógicas y digitales con cursos certificados con validez oficial para el escalafón docente del Ministerio de Educación.
            </p>
          </div>

          {/* SIFODS Escalafón info notice */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 shadow-2xs max-w-xs shrink-0">
            <span className="font-semibold text-rose-700 block mb-0.5">
              Certificación Oficial MINEDU
            </span>
            <span>
              Tus constancias se vinculan automáticamente al Escalafón Docente mediante SIFODS.
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#B91C1C] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 mb-1">
              No se encontraron cursos para esta categoría o búsqueda.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Prueba cambiando los filtros o revisa nuestro catálogo general.
            </p>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="px-4 py-2 text-xs font-medium bg-[#0284C7] text-white rounded-lg hover:bg-sky-700"
            >
              Ver todos los cursos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = user?.enrolledCourses?.includes(course.id);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Banner Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={course.image}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                      {/* Course status badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] font-bold text-white bg-[#B91C1C] px-2.5 py-1 rounded shadow-xs uppercase tracking-wide">
                          {course.status}
                        </span>
                      </div>

                      {/* Modality tag */}
                      <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>{course.durationHours} horas pedagógicas</span>
                        <span className="text-white/60">·</span>
                        <span>{course.modality}</span>
                      </div>
                    </div>

                    {/* Course Details Content */}
                    <div className="p-5">
                      {/* Code & Audience */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                        <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-emerald-700 font-medium">
                          Inicio: {course.startDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4 line-clamp-3">
                        {course.description}
                      </p>

                      {/* Audience kicker */}
                      <div className="text-[11px] text-slate-500 flex items-start gap-1.5 mb-3">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{course.targetAudience}</span>
                      </div>

                      {/* Certification seal */}
                      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center gap-2 text-xs text-slate-700">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-[11px] font-medium leading-tight text-slate-700">
                          {course.certification}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                    >
                      Ver Sílabo
                    </button>

                    {isEnrolled ? (
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="flex-1 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Matriculado</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnrollCourse(course.id)}
                        className="flex-1 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span>Preinscribirme</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
