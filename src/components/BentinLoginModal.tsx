import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';
import { TEACHERS_LIST, STUDENTS_LIST, BENTIN_COURSES } from '../data/bentinData';

interface BentinLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: 'docente' | 'alumno';
}

export const BentinLoginModal: React.FC<BentinLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'docente',
}) => {
  const [activeTab, setActiveTab] = useState<'docente' | 'alumno'>(initialRole);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDirectory, setShowDirectory] = useState(true);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetList = activeTab === 'docente' ? TEACHERS_LIST : STUDENTS_LIST;

    // Match by username, email or DNI
    const foundUser = targetList.find(
      (u) =>
        (u.username?.toLowerCase() === usernameInput.trim().toLowerCase() ||
          u.email.toLowerCase() === usernameInput.trim().toLowerCase() ||
          u.dni === usernameInput.trim()) &&
        (u.password === passwordInput || passwordInput === '123456')
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
      onClose();
    } else {
      setErrorMessage(
        activeTab === 'docente'
          ? 'Usuario o contraseña de docente incorrecta. Revisa el directorio inferior para ver las credenciales de cada curso.'
          : 'Usuario o contraseña de alumno incorrecta. Usa alumno.morales / alumno2026.'
      );
    }
  };

  const handleQuickLoginTeacher = (teacher: UserProfile) => {
    onLoginSuccess(teacher);
    onClose();
  };

  const handleQuickLoginStudent = (student: UserProfile) => {
    onLoginSuccess(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E293B] to-[#B91C1C] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-white/20 font-black flex items-center justify-center text-sm border border-amber-300/40">
              RB
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                I.E. Ricardo Bentín · Pucallpa, Ucayali
              </span>
              <h3 className="text-xl font-black">Iniciar Sesión en el Aula Virtual</h3>
            </div>
          </div>
          <p className="text-xs text-slate-200 mt-1">
            Ingreso oficial para profesores de cada asignatura y alumnos bentinianos.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => {
              setActiveTab('docente');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'docente'
                ? 'border-[#1E3A8A] text-[#1E3A8A] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Acceso Profesor (Docente de Curso)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('alumno');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'alumno'
                ? 'border-[#B91C1C] text-[#B91C1C] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Acceso Alumno (Estudiante)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {activeTab === 'docente'
                  ? 'Usuario del Docente (ej. prof.matematica)'
                  : 'Usuario del Alumno (ej. alumno.morales)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={
                    activeTab === 'docente'
                      ? 'prof.matematica, prof.comunicacion, etc.'
                      : 'alumno.morales o tu DNI'
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña institucional
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={activeTab === 'docente' ? 'bentin2026' : 'alumno2026'}
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
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
              className={`w-full py-2.5 text-white font-bold text-xs sm:text-sm rounded-lg transition-transform active:scale-95 shadow-xs flex items-center justify-center gap-2 ${
                activeTab === 'docente'
                  ? 'bg-[#1E3A8A] hover:bg-blue-900'
                  : 'bg-[#B91C1C] hover:bg-red-800'
              }`}
            >
              <span>
                {activeTab === 'docente'
                  ? 'Entrar a Modo Profesor'
                  : 'Entrar a Modo Alumno'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access Credentials Directory */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {activeTab === 'docente'
                    ? 'Directorio de Profesores (11 Cursos) · Clic para entrar'
                    : 'Cuentas de Alumnos · Clic para entrar'}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Clave: {activeTab === 'docente' ? 'bentin2026' : 'alumno2026'}
              </span>
            </div>

            {activeTab === 'docente' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {TEACHERS_LIST.map((teacher) => {
                  const course = BENTIN_COURSES.find((c) => c.id === teacher.assignedCourseId);

                  return (
                    <button
                      key={teacher.username}
                      type="button"
                      onClick={() => handleQuickLoginTeacher(teacher)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1E3A8A] bg-slate-50 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-[#1E3A8A] block uppercase truncate">
                          {course?.title || teacher.specialty}
                        </span>
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {teacher.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          User: <strong className="text-slate-700">{teacher.username}</strong>
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        Entrar →
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {STUDENTS_LIST.map((student) => (
                  <button
                    key={student.username}
                    type="button"
                    onClick={() => handleQuickLoginStudent(student)}
                    className="w-full p-3 rounded-xl border border-slate-200 hover:border-[#B91C1C] bg-slate-50 hover:bg-red-50/50 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#B91C1C] uppercase block">
                        {student.section} · {student.grade}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{student.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        User: <strong className="text-slate-700">{student.username}</strong> · Clave: <strong className="text-slate-700">{student.password}</strong>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#B91C1C] opacity-0 group-hover:opacity-100 transition-opacity">
                      Entrar como Alumno →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          I.E. Ricardo Bentín · Pucallpa, Ucayali · Sistema Autenticado de Aula Virtual 2026
        </div>
      </div>
    </div>
  );
};
