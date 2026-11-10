import React, { useState } from 'react';
import {
  X,
  Headphones,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [ticketDni, setTicketDni] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('recuperacion');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: '¿Cómo recupero el acceso a mi cuenta si olvidé mi contraseña o correo?',
      a: 'Puedes hacer clic en "¿Olvidaste tu contraseña?" en el formulario de inicio de sesión o comunicarte a la línea gratuita 0800-40210 indicando tu número de DNI para validar tu identidad con RENIEC.',
    },
    {
      q: '¿Cuándo se emite mi constancia luego de culminar un curso virtual?',
      a: 'Las constancias digitales se generan en un plazo máximo de 7 días hábiles posteriores al cierre del curso, previa aprobación de todas las evaluaciones con nota mínima de 14. Se sincronizan automáticamente con tu escalafón SIFODS.',
    },
    {
      q: '¿Quiénes pueden acceder al Campus Virtual de PerúEduca?',
      a: 'Todos los docentes nombrados, contratados, directivos, especialistas de DRE y UGEL, así como estudiantes y miembros de la comunidad escolar debidamente registrados con su DNI.',
    },
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitSupport({
        name: 'Usuario I.E. Ricardo Bentin',
        email: ticketEmail,
        dni: ticketDni,
        role: 'Estudiante / Docente',
        subject: ticketSubject,
        message: ticketMessage,
      });
    } catch (err) {
      console.error('Error submitting ticket:', err);
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0284C7] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Headphones className="w-5 h-5 text-sky-200" />
            <span className="text-xs font-bold tracking-widest uppercase text-sky-200">
              Canales de Atención Oficial
            </span>
          </div>
          <h3 className="text-xl font-bold">Mesa de Ayuda PerúEduca</h3>
          <p className="text-xs text-white/90 mt-1">
            Asistencia técnica para acceso al campus, inscripción en cursos y emisión de constancias.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Official Hotlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                <Phone className="w-4 h-4" />
                <span>Línea Gratuita Nacional</span>
              </div>
              <p className="text-lg font-extrabold text-slate-900 font-mono">0800-40210</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Llamada gratuita desde fijos a nivel nacional
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs mb-1">
                <Mail className="w-4 h-4" />
                <span>Correo Institucional</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 font-mono">
                soporte@perueduca.pe
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Central: (01) 615-5800 anexos 21001 / 21002
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Horario de Atención:</strong> Lunes a Viernes de 8:00 a.m. a 8:00 p.m. · Sábados de 9:00 a.m. a 2:00 p.m.
            </span>
          </div>

          {/* Ticket Submission Form */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#0284C7]" />
              <span>Enviar Consulta o Reportar Incidencia</span>
            </h4>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="text-sm font-bold text-emerald-900">
                  ¡Ticket Registrado con Éxito!
                </h5>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Tu número de atención es <strong className="font-mono">#TK-2026-8492</strong>. Un especialista de la mesa de ayuda del Minedu te responderá al correo ingresado en menos de 24 horas.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Número de DNI
                    </label>
                    <input
                      type="text"
                      value={ticketDni}
                      onChange={(e) => setTicketDni(e.target.value)}
                      placeholder="8 dígitos"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Correo Electrónico de Contacto
                    </label>
                    <input
                      type="email"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="docente@ejemplo.com"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Motivo de la Consulta
                  </label>
                  <select
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
                  >
                    <option value="recuperacion">Recuperación de contraseña o usuario</option>
                    <option value="aula">Problemas de acceso al aula virtual Moodle</option>
                    <option value="constancia">Consulta sobre constancia o certificado</option>
                    <option value="inscripcion">Dudas sobre preinscripción a cursos</option>
                    <option value="otro">Otras consultas pedagógicas o técnicas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Detalle de tu Consulta o Inconveniente
                  </label>
                  <textarea
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe claramente el problema, indicando el nombre del curso o código de error si corresponde..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
                >
                  Generar Ticket de Soporte
                </button>
              </form>
            )}
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Preguntas Frecuentes Rápidas</span>
            </h4>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 flex items-center justify-between gap-2 hover:bg-slate-100"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        expandedFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-3.5 pb-3 pt-1 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-200 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
