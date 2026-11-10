import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Upload,
  UserCheck,
  School,
  Sparkles,
  CheckCircle2,
  FileText,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { UserProfile, BentinCourse } from '../types';

interface BentinHeaderProps {
  currentUser: UserProfile;
  courses: BentinCourse[];
  onOpenLogin: () => void;
  onOpenUpload: () => void;
  onQuickSwitchUser: (userRole: 'docente' | 'alumno') => void;
  onLogout: () => void;
}

export const BentinHeader: React.FC<BentinHeaderProps> = ({
  currentUser,
  courses,
  onOpenLogin,
  onOpenUpload,
  onQuickSwitchUser,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const assignedCourse = courses.find((c) => c.id === currentUser.assignedCourseId);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Institutional Top Strip */}
      <div className="bg-[#1E3A8A] text-white text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            {/* Peruvian Flag */}
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

        <div className="hidden md:flex items-center gap-3 text-[11px] text-amber-300 font-medium">
          <span>"Estudio, Disciplina y Trabajo"</span>
          <span className="text-white/40">·</span>
          <span className="text-white/80">11 Asignaturas Curriculares</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 group">
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
              I.E. Ricardo Bentín · Pucallpa - Ucayali
            </p>
          </div>
        </div>

        {/* User Identity & Role Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 px-3 rounded-xl border border-slate-200">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                currentUser.role === 'docente' ? 'bg-[#1E3A8A]' : 'bg-[#B91C1C]'
              }`}
            >
              {currentUser.role === 'docente' ? (
                <GraduationCap className="w-4 h-4" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 leading-tight">
                  {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1]}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    currentUser.role === 'docente'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  {currentUser.role === 'docente' ? 'Profesor' : 'Alumno'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[170px]">
                {currentUser.role === 'docente'
                  ? assignedCourse?.title || currentUser.specialty
                  : `${currentUser.grade || '4° Sec'} - ${currentUser.section || 'Sec B'}`}
              </p>
            </div>
          </div>

          {/* Teacher Upload Action */}
          {currentUser.role === 'docente' && (
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#B91C1C] to-red-600 hover:from-red-700 hover:to-red-800 rounded-lg shadow-xs flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Subir Material / Examen</span>
              <span className="sm:hidden">Subir</span>
            </button>
          )}

          {/* Change User & Logout Buttons */}
          <button
            onClick={onOpenLogin}
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            title="Cambiar de profesor o alumno"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Cambiar Cuenta</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 text-xs font-bold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Cerrar sesión y volver a la presentación"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
