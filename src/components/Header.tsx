import React, { useState } from 'react';
import {
  Search,
  LogIn,
  UserPlus,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
  Headphones,
  Bell,
  CheckCircle2,
  Menu,
  X,
  User,
  LogOut,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  fontSizeLevel: number;
  setFontSizeLevel: (fn: (prev: number) => number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onSearch,
  searchQuery,
  activeSection,
  setActiveSection,
  highContrast,
  setHighContrast,
  fontSizeLevel,
  setFontSizeLevel,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Compass },
    { id: 'campus-virtual', label: 'Campus Virtual', icon: GraduationCap },
    { id: 'materiales', label: 'Materiales Educativos', icon: BookOpen },
    { id: 'cursos', label: 'Cursos y Convocatorias', icon: GraduationCap },
    { id: 'comunidades', label: 'Comunidades', icon: Users },
    { id: 'noticias', label: 'Actualidad y Noticias', icon: Bell },
    { id: 'soporte', label: 'Mesa de Ayuda', icon: Headphones },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      {/* 1. Official Government Strip (MINEDU / GOB.PE) */}
      <div className="bg-[#B91C1C] text-white text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            {/* Peruvian Flag Emblem */}
            <span className="inline-flex w-5 h-3.5 border border-white/40 overflow-hidden shrink-0 rounded-xs">
              <span className="w-1/3 bg-[#DC2626] h-full inline-block"></span>
              <span className="w-1/3 bg-white h-full inline-block"></span>
              <span className="w-1/3 bg-[#DC2626] h-full inline-block"></span>
            </span>
            <span className="text-[13px] tracking-wider font-extrabold uppercase">PERÚ</span>
          </div>
          <span className="text-white/40">|</span>
          <span className="font-medium text-white/95 text-[11px] sm:text-xs">
            Ministerio de Educación
          </span>
          <span className="hidden md:inline-block text-white/40">·</span>
          <span className="hidden md:inline-block text-white/80 text-[11px]">
            Plataforma Digital de Aprendizaje
          </span>
        </div>

        {/* Accessibility Toolbar */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="hidden sm:flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-sm">
            <span className="text-white/70 mr-1">Accesibilidad:</span>
            <button
              onClick={() => setFontSizeLevel((p) => Math.max(1, p - 1))}
              title="Disminuir texto"
              className="px-1.5 py-0.5 hover:bg-white/20 rounded font-bold transition-colors"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeLevel(() => 2)}
              title="Tamaño normal"
              className="px-1.5 py-0.5 hover:bg-white/20 rounded font-medium transition-colors"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel((p) => Math.min(3, p + 1))}
              title="Aumentar texto"
              className="px-1.5 py-0.5 hover:bg-white/20 rounded font-bold transition-colors"
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setHighContrast((prev) => !prev)}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 font-medium ${
              highContrast ? 'bg-amber-300 text-slate-900 font-bold' : 'bg-black/20 text-white/90 hover:bg-white/20'
            }`}
          >
            <span>{highContrast ? '● Alto Contraste' : 'Contraste'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('inicio');
          }}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="flex flex-col">
            <div className="flex items-center tracking-tight leading-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D92525] group-hover:text-red-700 transition-colors">
                perú
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0284C7] group-hover:text-sky-700 transition-colors">
                educa
              </span>
              {/* Characteristic colorful educational spark */}
              <span className="ml-1 flex gap-0.5 self-start mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Sistema Digital para el Aprendizaje
            </span>
          </div>
        </a>

        {/* Global Search Input */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-4 relative">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Buscar en PerúEduca (cursos, guías, textos, normativas, IA...)"
              className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Suggestions Popup */}
          {searchFocused && !searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Búsquedas Frecuentes
              </span>
              <div className="flex flex-wrap gap-2">
                {['Inteligencia Artificial', 'CNEB 2026', 'Fichas de Primaria', 'Quechua Chanka', 'DUA Inclusión', 'Moodle'].map(
                  (term) => (
                    <button
                      key={term}
                      onMouseDown={() => onSearch(term)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded text-xs transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons / User Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Direct link to Campus Virtual */}
          <a
            href="#campus-virtual"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('campus-virtual');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0284C7] bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Campus Virtual</span>
          </a>

          {user ? (
            /* User profile dropdown */
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#B91C1C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[140px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-none">
                    {user.role} · {user.ugel}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Docente Verificado
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <a
                      href="#campus-virtual"
                      onClick={() => {
                        handleNavClick('campus-virtual');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      <GraduationCap className="w-4 h-4 text-sky-600" />
                      Mis Cursos Matriculados ({user.enrolledCourses?.length || 0})
                    </a>
                    <a
                      href="#cursos"
                      onClick={() => {
                        handleNavClick('cursos');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      Mis Constancias y Certificados
                    </a>
                    <a
                      href="#comunidades"
                      onClick={() => {
                        handleNavClick('comunidades');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      <Users className="w-4 h-4 text-amber-600" />
                      Mis Comunidades
                    </a>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login & Register buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Ingresar</span>
              </button>
              <button
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-red-800 rounded-md transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Regístrate</span>
              </button>
            </div>
          )}

          {/* Mobile menu burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar cursos, recursos, guías..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* 3. Main Navigation Menu (Desktop & Tablet) */}
      <nav className="hidden md:block bg-[#0F172A] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1 py-1 text-[13px] font-medium overflow-x-auto scrollbar-none">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <li key={link.id} className="shrink-0">
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#B91C1C] text-white font-semibold shadow-xs'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{link.label}</span>
                  </button>
                </li>
              );
            })}
            <li className="shrink-0 ml-auto hidden xl:block">
              <a
                href="https://sifods.minedu.gob.pe"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 px-2 py-1 rounded border border-amber-400/30 hover:border-amber-400/60 transition-colors"
              >
                <span>SIFODS Escalafón</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  isActive ? 'bg-[#B91C1C] text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
