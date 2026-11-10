import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
}) => {
  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Docente' | 'Directivo' | 'Especialista DRE/UGEL' | 'Estudiante'>('Docente');
  const [region, setRegion] = useState('Lima Metropolitana');
  const [ugel, setUgel] = useState('UGEL 03');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || dni.length < 8) {
      setError('Por favor, ingresa un número de DNI válido de 8 dígitos.');
      return;
    }
    if (!fullName.trim()) {
      setError('Por favor, ingresa tus nombres y apellidos completos.');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones del portal del Minedu.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const newUser: UserProfile = {
        name: fullName,
        email,
        dni,
        role,
        region,
        ugel,
        institution: institution || 'I.E. Pública Nacional',
        enrolledCourses: ['curso-ia-pedagogica'],
      };
      onRegisterSuccess(newUser);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#B91C1C] text-white p-6 relative shrink-0">
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
          <h3 className="text-lg font-bold">Registro de Usuario en PerúEduca</h3>
          <p className="text-xs text-white/80 mt-1 font-normal">
            Crea tu cuenta institucional vinculada a tu DNI y escalafón educativo.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de DNI (8 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej. 45892174"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rol en la Comunidad Educativa
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                >
                  <option value="Docente">Docente Nombrado o Contratado</option>
                  <option value="Directivo">Director o Subdirector</option>
                  <option value="Especialista DRE/UGEL">Especialista DRE / UGEL</option>
                  <option value="Estudiante">Estudiante / Comunidad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombres y Apellidos Completos
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. María Elena Paredes Quispe"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico (Personal o Institucional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="docente@gmail.com o @perueduca.pe"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Región / DRE
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                >
                  <option value="Lima Metropolitana">Lima Metropolitana</option>
                  <option value="Cusco">Cusco</option>
                  <option value="Arequipa">Arequipa</option>
                  <option value="La Libertad">La Libertad</option>
                  <option value="Piura">Piura</option>
                  <option value="Puno">Puno</option>
                  <option value="Junín">Junín</option>
                  <option value="Loreto">Loreto</option>
                  <option value="San Martín">San Martín</option>
                  <option value="Ancash">Ancash</option>
                  <option value="Ayacucho">Ayacucho</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  UGEL de Adscripción
                </label>
                <input
                  type="text"
                  value={ugel}
                  onChange={(e) => setUgel(e.target.value)}
                  placeholder="Ej. UGEL 03, UGEL Cusco"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institución Educativa (Opcional)
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Ej. I.E. Emblemática Alfonso Ugarte"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña para PerúEduca
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                  required
                />
                <span>
                  Declaro bajo juramento que los datos ingresados son verídicos y acepto los Términos de Servicio y la Política de Privacidad de la Plataforma Digital PerúEduca del Ministerio de Educación.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Creando cuenta institucional...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Completar Registro Oficial</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to login */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              ¿Ya estás registrado en PerúEduca?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                className="font-bold text-[#0284C7] hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
