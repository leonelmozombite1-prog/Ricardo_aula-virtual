import React, { useState } from 'react';
import { X, LogIn, Lock, Mail, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_USER } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Por favor, ingresa tu DNI o correo institucional.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor, ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        ...DEMO_USER,
        name: identifier.includes('@') ? 'Docente PerúEduca' : 'Prof. Carlos Mendoza Ríos',
        dni: identifier.includes('@') ? '45892174' : identifier,
        email: identifier.includes('@') ? identifier : 'carlos.mendoza@perueduca.pe',
      });
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(DEMO_USER);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#B91C1C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-extrabold tracking-tight">perú</span>
            <span className="text-xl font-extrabold text-sky-300">educa</span>
          </div>
          <h3 className="text-lg font-bold">Iniciar Sesión en el Portal</h3>
          <p className="text-xs text-white/80 mt-1 font-normal">
            Ingresa a tus cursos, recursos pedagógicos y comunidades docentes.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Quick Demo Login Pill for quick testing */}
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Acceso Rápido de Prueba</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Prueba la experiencia de docente registrado con un solo clic.
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs"
            >
              Probar Demo
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                DNI o Correo Institucional
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ej. 45892174 o docente@perueduca.pe"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white text-slate-800"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Contraseña</label>
                <a
                  href="#olvide-contrasena"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Se ha enviado un enlace de recuperación de contraseña a tu correo registrado en el Ministerio de Educación.'
                    );
                  }}
                  className="text-[11px] font-medium text-[#0284C7] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white text-slate-800"
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

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span>Recordar mis datos en este equipo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Validando credenciales MINEDU...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar a PerúEduca</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              ¿No tienes una cuenta de docente o directivo?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
                className="font-bold text-[#0284C7] hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
