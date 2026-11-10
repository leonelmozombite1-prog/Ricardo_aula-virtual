import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Clock,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  FileCheck,
  Check
} from 'lucide-react';
import { Course, UserProfile } from '../types';

interface CourseDetailModalProps {
  course: Course | null;
  user: UserProfile | null;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  user,
  onClose,
  onEnroll,
}) => {
  const [enrolled, setEnrolled] = useState(false);

  if (!course) return null;

  const isAlreadyEnrolled = user?.enrolledCourses?.includes(course.id) || enrolled;

  const handleEnrollClick = () => {
    onEnroll(course.id);
    setEnrolled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 bg-slate-900 shrink-0">
          <img
            src={course.image}
            alt={course.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full backdrop-blur-xs transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs mb-1">
              <span className="font-mono bg-[#B91C1C] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[11px]">
                {course.code}
              </span>
              <span>·</span>
              <span className="text-amber-300 font-semibold">{course.modality}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Duración:</span>
              <span className="font-bold text-slate-800">{course.durationHours} horas pedagógicas</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Inicio:</span>
              <span className="font-bold text-slate-800">{course.startDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estado:</span>
              <span className="font-bold text-emerald-700">{course.status}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Costo:</span>
              <span className="font-bold text-[#0284C7]">Gratuito (MINEDU)</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Sumilla del Programa Formativo
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {course.description}
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Público Objetivo
            </h4>
            <div className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-900">
              <Users className="w-4 h-4 text-[#0284C7] shrink-0" />
              <span>{course.targetAudience}</span>
            </div>
          </div>

          {/* Syllabus Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Módulos y Temario Detallado
            </h4>
            <div className="space-y-3">
              {course.modules.map((mod, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                      {mod.title}
                    </h5>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {mod.hours} horas
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                    {mod.topics.map((t, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Certification info */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Certificación Oficial con Validez Escalafonaria</span>
              <p className="leading-relaxed">
                {course.certification}. Al aprobar con nota igual o mayor a 14, la constancia se emitirá digitalmente y se registrará automáticamente en el sistema SIFODS.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cerrar
          </button>

          {isAlreadyEnrolled ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Preinscripción Registrada en PerúEduca</span>
              </span>
              <button
                onClick={() => {
                  alert(
                    `Redirigiendo a tu aula virtual en campus.perueduca.pe para el curso "${course.title}".`
                  );
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
              >
                Ir al Aula Moodle
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnrollClick}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#B91C1C] hover:bg-red-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Preinscribirme a este Curso</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
