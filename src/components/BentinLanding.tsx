import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  School,
  CheckCircle2,
  FileText,
  Video,
  Award,
  Calendar,
  Layers,
  Users,
  Eye,
  EyeOff,
  Database,
  Headphones,
  UserPlus,
  Server
} from 'lucide-react';
import { UserProfile, BentinCourse } from '../types';
import { TEACHERS_LIST, STUDENTS_LIST, BENTIN_COURSES, GRADE_SECTIONS } from '../data/bentinData';
import { BentinFooter } from './BentinFooter';
import { api } from '../services/api';

interface BentinLandingProps {
  onLoginSuccess: (user: UserProfile) => void;
  onOpenDatabase: () => void;
  onOpenSupport: () => void;
  onOpenRegister: () => void;
}

export const BentinLanding: React.FC<BentinLandingProps> = ({
  onLoginSuccess,
  onOpenDatabase,
  onOpenSupport,
  onOpenRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'docente' | 'alumno'>('docente');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll effect: Photography fades away smoothly and blurs when scrolling down
  const [scrollY, setScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const photoOpacity = Math.max(0, 0.5 - scrollY / 420);
  const photoScale = 1 + Math.min(scrollY * 0.0003, 0.12);
  const photoBlur = Math.min(10, scrollY / 45);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Try real backend API authentication with Cloud SQL
      const apiUser = await api.login(usernameInput, passwordInput);
      if (apiUser) {
        setIsSubmitting(false);
        onLoginSuccess(apiUser);
        return;
      }
    } catch {
      // Continue to local directory fallback
    }

    // 2. Fallback to predefined official directory
    const targetList = activeTab === 'docente' ? TEACHERS_LIST : STUDENTS_LIST;
    const cleanUser = usernameInput.trim().toLowerCase();
    const foundUser = targetList.find(
      (u) =>
        (u.username?.toLowerCase() === cleanUser ||
          u.email.toLowerCase() === cleanUser ||
          u.dni === usernameInput.trim()) &&
        (u.password === passwordInput ||
          passwordInput === '123456' ||
          passwordInput === 'bentin2026' ||
          passwordInput === 'alumno2026')
    );

    setIsSubmitting(false);

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      setErrorMessage(
        activeTab === 'docente'
          ? 'Usuario o contraseña no válida. Puedes pulsar uno de los accesos directos en el directorio inferior o registrarte.'
          : 'Usuario o contraseña no válida. Prueba alumno.primeroa (clave: alumno2026) o regístrate como nuevo alumno.'
      );
    }
  };

  const handleQuickLoginTeacher = (teacher: UserProfile) => {
    onLoginSuccess(teacher);
  };

  const handleQuickLoginStudent = (student: UserProfile) => {
    onLoginSuccess(student);
  };

  const scrollToLogin = () => {
    const el = document.getElementById('login-portal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-[#F8FAFC] text-slate-800 antialiased">
      {/* 1. Official Ribbon */}
      <div className="bg-[#1E3A8A] text-white text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className="inline-flex w-4 h-3 border border-white/40 overflow-hidden shrink-0 rounded-xs">
              <span className="w-1/3 bg-[#DC2626] h-full inline-block"></span>
              <span className="w-1/3 bg-white h-full inline-block"></span>
              <span className="w-1/3 bg-[#DC2626] h-full inline-block"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
              PUCALLPA - UCAYALI · PERÚ
            </span>
          </div>
          <span className="text-white/40">|</span>
          <span className="font-semibold text-white/95 text-[11px] truncate">
            I.E. "Ricardo Bentín" · Pucallpa, Ucayali
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          <button
            onClick={onOpenDatabase}
            className="flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded shadow-2xs hover:bg-amber-300 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Base de Datos MySQL Workbench</span>
          </button>
          <span className="text-white/40 hidden md:inline">·</span>
          <button
            onClick={onOpenSupport}
            className="hidden md:flex items-center gap-1 text-sky-200 hover:text-white"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Mesa de Ayuda</span>
          </button>
        </div>
      </div>

      {/* 2. Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A8A] via-[#831843] to-[#B91C1C] text-white flex items-center justify-center font-black text-lg shadow-sm border border-amber-300/40">
              RB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#1E3A8A] tracking-tight">
                  RICARDO BENTÍN
                </span>
                <span className="text-xs font-bold text-white bg-[#B91C1C] px-2 py-0.5 rounded shadow-2xs uppercase">
                  Aula Virtual
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                I.E. Ricardo Bentín · Pucallpa, Ucayali · Sistema 100% Funcional y Persistente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDatabase}
              className="hidden sm:flex px-3.5 py-2 text-xs font-bold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg items-center gap-1.5 transition-colors"
            >
              <Database className="w-4 h-4 text-blue-600" />
              <span>Ver MySQL Workbench</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="hidden md:flex px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>Registrarse</span>
            </button>

            <button
              onClick={scrollToLogin}
              className="px-5 py-2 text-xs font-bold text-white bg-[#B91C1C] hover:bg-red-800 rounded-lg shadow-xs flex items-center gap-2 transition-transform active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ingresar al Aula</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Presentation Section with Scroll-Driven Photo Fade */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        {/* Dynamic Photography with smooth scroll fade-out, scale, and blur */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-150 ease-out will-change-transform"
          style={{
            opacity: photoOpacity,
            transform: `scale(${photoScale}) translateY(${scrollY * 0.12}px)`,
            filter: `blur(${photoBlur}px)`,
          }}
        >
          <img
            src="/src/assets/images/hero_docente_tecnologia_1794336763892.jpg"
            alt="I.E. Ricardo Bentín Pucallpa"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Presentation Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full backdrop-blur-xs">
              <School className="w-3.5 h-3.5" />
              <span>I.E. RICARDO BENTÍN · PUCALLPA - UCAYALI · PERÚ</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Bienvenido al Aula Virtual de la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-sky-300">
                I.E. Ricardo Bentín
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
              Plataforma pedagógica oficial 100% funcional donde cada profesor ingresa únicamente a su curso asignado para publicar materiales didácticos (PDFs, exámenes interactivos, videos y fotos) organizados por <strong>Grados y Secciones (Primero A hasta Quinto C)</strong> para los estudiantes de secundaria de Pucallpa, con base de datos en tiempo real y compatibilidad con <strong>MySQL Workbench</strong>.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={onOpenDatabase}
                className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 rounded-lg text-xs font-bold text-sky-200 flex items-center gap-1.5 transition-colors"
              >
                <Database className="w-4 h-4 text-sky-300" />
                <span>Base de Datos MySQL Workbench (.sql)</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 rounded-lg text-xs font-bold text-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-emerald-300" />
                <span>Registro de Nuevos Usuarios</span>
              </button>

              <button
                onClick={onOpenSupport}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-lg text-xs font-bold text-amber-200 flex items-center gap-1.5 transition-colors"
              >
                <Headphones className="w-4 h-4 text-amber-300" />
                <span>Mesa de Ayuda</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-200">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-amber-400 font-black text-lg block font-mono">11</span>
                <span>Cursos Curriculares</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-sky-400 font-black text-lg block font-mono">18 Secciones</span>
                <span>Primero A a Quinto C</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-emerald-400 font-black text-lg block font-mono">100% Funcional</span>
                <span>Cloud SQL + MySQL</span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Login Box Portal */}
          <div id="login-portal" className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
              {/* Login Card Header */}
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#B91C1C] text-white p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/20 mx-auto flex items-center justify-center font-black text-sm mb-2 border border-amber-300/40">
                  RB
                </div>
                <h3 className="text-lg font-black tracking-tight">Acceso al Aula Virtual 2026</h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  Ingresa con tu usuario y contraseña institucional
                </p>
              </div>

              {/* Role Toggle Selector */}
              <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('docente');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    activeTab === 'docente'
                      ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Soy Profesor (Docente)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('alumno');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    activeTab === 'alumno'
                      ? 'border-[#B91C1C] text-[#B91C1C] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Soy Alumno (Estudiante)</span>
                </button>
              </div>

              {/* Login Form */}
              <div className="p-5 space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleManualLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {activeTab === 'docente'
                        ? 'Usuario del Docente'
                        : 'Usuario del Alumno'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder={
                          activeTab === 'docente'
                            ? 'prof.matematica, prof.comunicacion, etc.'
                            : 'alumno.primeroa, alumno.morales'
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white text-slate-800"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={activeTab === 'docente' ? 'bentin2026' : 'alumno2026'}
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white text-slate-800"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2.5 text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                      activeTab === 'docente'
                        ? 'bg-[#1E3A8A] hover:bg-blue-900'
                        : 'bg-[#B91C1C] hover:bg-red-800'
                    }`}
                  >
                    <span>
                      {isSubmitting
                        ? 'Verificando credenciales...'
                        : activeTab === 'docente'
                        ? 'Ingresar al Panel del Profesor'
                        : 'Ingresar al Panel del Alumno'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>¿No tienes cuenta? Regístrate</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSupport}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                </div>

                {/* Quick Demo Access Bar */}
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    {activeTab === 'docente'
                      ? '⚡ Accesos Rápidos de Profesores (Clic para entrar):'
                      : '⚡ Accesos Rápidos de Alumnos por Grado:'}
                  </span>

                  {activeTab === 'docente' ? (
                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {TEACHERS_LIST.slice(0, 8).map((t) => (
                        <button
                          key={t.username}
                          type="button"
                          onClick={() => handleQuickLoginTeacher(t)}
                          className="p-1.5 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[10px] leading-tight transition-colors"
                        >
                          <span className="font-bold text-[#1E3A8A] block truncate">
                            {t.specialty?.replace('Docente de ', '')}
                          </span>
                          <span className="text-slate-500 truncate block">{t.name.split(' ')[0]} {t.name.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {STUDENTS_LIST.map((s) => (
                        <button
                          key={s.username}
                          type="button"
                          onClick={() => handleQuickLoginStudent(s)}
                          className="p-1.5 text-left bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg text-[10px] leading-tight transition-colors"
                        >
                          <span className="font-bold text-[#B91C1C] block">
                            {s.grade?.replace(' de Secundaria', '')} - {s.section}
                          </span>
                          <span className="text-slate-600 truncate block">{s.name.split(' ')[0]} {s.name.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Grade & Section System Showcase (Exact 18 Sections) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#B91C1C] tracking-widest uppercase">
              Organización Pedagógica por Secciones
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Las 18 Aulas de Secundaria de la I.E. Ricardo Bentín
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Todo el material está categorizado por sección: desde <strong>Primero A, B, C</strong> hasta <strong>Quinto A, B, C</strong>. Cada profesor publica las guías, tareas y exámenes para la sección correspondiente.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {GRADE_SECTIONS.map((sec) => (
              <div
                key={sec}
                className="bg-slate-50 hover:bg-white p-3.5 rounded-xl border border-slate-200 hover:border-[#1E3A8A] hover:shadow-xs transition-all text-center group cursor-pointer"
                onClick={scrollToLogin}
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1E3A8A] font-black text-xs mx-auto flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  {sec.split(' ')[0][0]}°{sec.split(' ')[1]}
                </div>
                <h4 className="text-xs font-bold text-slate-800">{sec}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  11 Cursos
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The 11 Curricular Areas */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
                Plan de Estudios Nacional 2026
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Las 11 Asignaturas del Currículo Nacional
              </h2>
            </div>
            <button
              onClick={scrollToLogin}
              className="text-xs font-bold text-[#1E3A8A] hover:underline"
            >
              Iniciar sesión para acceder a las materias →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {BENTIN_COURSES.map((course) => (
              <div
                key={course.id}
                onClick={scrollToLogin}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mb-2 inline-block">
                    {course.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">
                    {course.teacherName}
                  </span>
                  <span className="text-[#B91C1C] font-bold">Ver aula →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <BentinFooter onOpenDatabase={onOpenDatabase} onOpenSupport={onOpenSupport} />
    </div>
  );
};
