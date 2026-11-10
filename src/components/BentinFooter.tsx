import React from 'react';
import { School, MapPin, Phone, Mail, Award, GraduationCap } from 'lucide-react';

export const BentinFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B132B] text-slate-300 text-xs border-t border-slate-800">
      {/* Top Strip */}
      <div className="bg-[#1E3A8A] text-white py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs uppercase tracking-wider text-amber-300">
              I.E. Ricardo Bentín
            </span>
            <span className="text-white/60">|</span>
            <span className="text-xs">Pucallpa · Coronel Portillo · Ucayali, Perú</span>
          </div>
          <span className="text-[11px] text-white/90">
            Lema Institucional: "Estudio, Disciplina y Trabajo"
          </span>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* School Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#B91C1C] text-white flex items-center justify-center font-black text-base border border-amber-300/40">
                RB
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  AULA VIRTUAL RICARDO BENTÍN
                </span>
                <p className="text-[11px] text-slate-400">
                  Institución Educativa Ricardo Bentín · Pucallpa, Ucayali
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Plataforma virtual pedagógica para el aprendizaje continuo de los estudiantes de secundaria en Pucallpa, facilitando la publicación de materiales por materias, la ejecución de exámenes interactivos y el acompañamiento formativo de nuestros docentes.
            </p>

            <div className="space-y-1.5 text-slate-400 text-xs pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>Jr. Tarapacá / Av. Centenario, Pucallpa - Ucayali, Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Central Telefónica I.E.: (061) 57-2384 / Dirección Escolar</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>aulavirtual@bentin.edu.pe</span>
              </div>
            </div>
          </div>

          {/* Docentes */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-700/60 pb-1">
              Para Docentes
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Acceso exclusivo a su curso asignado</li>
              <li>Subida de Guías y PDFs por sección</li>
              <li>Creación de Exámenes y Cuestionarios</li>
              <li>Publicación de Videos y Fotos de Clase</li>
              <li>Registro de Calificaciones en tiempo real</li>
            </ul>
          </div>

          {/* Alumnos */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-700/60 pb-1">
              Para Alumnos Bentinianos
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Aulas por Sección (Primero A hasta Quinto C)</li>
              <li>Resolución de Exámenes en Línea (0-20)</li>
              <li>Descarga de Fichas de Aprendizaje</li>
              <li>Videos Explicativos de Refuerzo</li>
              <li>Retroalimentación y Calificación Inmediata</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} I.E. Ricardo Bentín - Pucallpa, Ucayali. Todos los derechos reservados.</p>
          <p className="text-slate-400">Sistema Digital de Aprendizaje Escolar · Pucallpa, Ucayali</p>
        </div>
      </div>
    </footer>
  );
};
