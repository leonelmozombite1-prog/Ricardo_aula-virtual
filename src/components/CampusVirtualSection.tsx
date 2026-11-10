import React, { useState } from 'react';
import {
  GraduationCap,
  ExternalLink,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';
import { UserProfile, Course } from '../types';
import { COURSES_DATA } from '../data/mockData';

interface CampusVirtualSectionProps {
  user: UserProfile | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onSelectCourse: (course: Course) => void;
}

export const CampusVirtualSection: React.FC<CampusVirtualSectionProps> = ({
  user,
  onOpenLogin,
  onOpenRegister,
  onSelectCourse,
}) => {
  const [activeTab, setActiveTab] = useState<'aulas' | 'constancias' | 'guia'>('aulas');
  const [copiedLink, setCopiedLink] = useState(false);

  const enrolledCourseObjects = COURSES_DATA.filter(
    (c) => user?.enrolledCourses?.includes(c.id) || c.id === 'curso-ia-pedagogica'
  );

  return (
    <section id="campus-virtual" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Entorno Virtual de Aprendizaje (Moodle)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Virtual PerúEduca
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Accede a tus aulas virtuales, evaluaciones modulares, foros de discusión y certificaciones oficiales emitidas por el Ministerio de Educación.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://campus.perueduca.pe"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
            >
              <span>Acceder al Campus Externo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* User Status Bar inside Campus */}
        {user ? (
          <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white mb-8 shadow-md border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#B91C1C] flex items-center justify-center font-bold text-xl text-white shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Sesión Activa
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    DNI: {user.dni} · {user.role} · {user.ugel} ({user.region})
                  </p>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">
                    {user.institution}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-xs rounded-xl px-4 py-2 text-center border border-white/10">
                  <span className="text-lg font-extrabold text-amber-300 block leading-tight font-mono">
                    {enrolledCourseObjects.length}
                  </span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wide">
                    Cursos en curso
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl px-4 py-2 text-center border border-white/10">
                  <span className="text-lg font-extrabold text-emerald-300 block leading-tight font-mono">
                    100%
                  </span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wide">
                    Validado SIFODS
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase mb-2">
                <Lock className="w-4 h-4" />
                <span>Ingreso Restringido con DNI</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                ¿Aún no has iniciado sesión en el Campus Virtual?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Para ingresar a tus aulas virtuales Moodle, revisar tus tareas y descargar tus constancias oficiales con firma digital, inicia sesión con tu usuario de PerúEduca o regístrate si eres docente nuevo.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={onOpenLogin}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#B91C1C] hover:bg-red-800 rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Iniciar Sesión en el Campus</span>
              </button>
              <button
                onClick={onOpenRegister}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Crear Cuenta Nueva
              </button>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('aulas')}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'aulas'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mis Aulas Virtuales
          </button>
          <button
            onClick={() => setActiveTab('constancias')}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'constancias'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Descarga de Constancias
          </button>
          <button
            onClick={() => setActiveTab('guia')}
            className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'guia'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Guía de Navegación Moodle
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'aulas' && (
          <div className="space-y-4">
            {enrolledCourseObjects.map((course, idx) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {course.code}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">Aula Habilitada</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 hover:text-[#0284C7] transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0284C7] h-full rounded-full transition-all duration-500"
                          style={{ width: `${idx === 0 ? 68 : 35}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 font-mono">
                        {idx === 0 ? '68%' : '35%'} completado
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Ver Sílabo
                  </button>
                  <button
                    onClick={() => {
                      alert(
                        `Ingresando al Aula Virtual Moodle de "${course.title}". En una sesión real del MINEDU se redirige a campus.perueduca.pe con autenticación Single Sign-On (SSO).`
                      );
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <span>Entrar al Aula</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'constancias' && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Validación y Descarga de Constancias con Código QR Oficial
            </h4>
            <p className="text-xs text-slate-600 mb-6 max-w-2xl leading-relaxed">
              Las constancias emitidas por PerúEduca cuentan con código de verificación QR y firma digital del Ministerio de Educación. Para consultar una constancia histórica o descargar tus certificados aprobados, ingresa tu número de DNI o código de verificación del documento.
            </p>

            <div className="max-w-md flex gap-2">
              <input
                type="text"
                defaultValue={user?.dni || ''}
                placeholder="Ingresa tu DNI o Código de Constancia..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
              <button
                onClick={() => {
                  alert(
                    'Búsqueda de constancia completada: Se encontraron 2 constancias oficiales asociadas a tu legajo MINEDU (Programa de Competencias Digitales 2025 y Taller de Alfabetización Mediática).'
                  );
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#B91C1C] hover:bg-red-800 rounded-lg transition-colors"
              >
                Consultar
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guia' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284C7] font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h5 className="text-sm font-bold text-slate-900 mb-1">Preinscripción al Curso</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Selecciona el programa de tu interés desde la sección de Cursos y completa tu preinscripción con tu DNI.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h5 className="text-sm font-bold text-slate-900 mb-1">Desarrollo de Módulos</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Revisa los videos interactivos, participa en los foros y aprueba las evaluaciones modulares con nota mínima de 14.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h5 className="text-sm font-bold text-slate-900 mb-1">Certificación Automática</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Al concluir el curso, tu constancia digital se emitirá inmediatamente y se sincronizará con tu escalafón SIFODS.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
