import React from 'react';
import {
  ExternalLink,
  Shield,
  FileText,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onOpenSupport: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSupport,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-[#0B132B] text-slate-300 text-xs border-t border-slate-800">
      {/* Top Institutional Ribbon */}
      <div className="bg-[#B91C1C] text-white py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-wider text-sm">PERÚ</span>
            <span className="text-white/60">|</span>
            <span className="font-medium text-xs">Ministerio de Educación</span>
          </div>
          <span className="text-[11px] text-white/90">
            PerúEduca: Transformación digital e inclusión pedagógica para todo el país
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-[#D92525]">perú</span>
              <span className="text-2xl font-black text-[#0284C7]">educa</span>
              <span className="flex gap-0.5 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed font-normal text-xs pr-4">
              PerúEduca es el sistema digital para el aprendizaje del Ministerio de Educación del Perú. Brinda servicios de capacitación virtual, recursos educativos multimedia, comunidades profesionales y herramientas tecnológicas para la comunidad escolar.
            </p>

            <div className="space-y-2 text-slate-400 text-xs pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Sede Central: Calle Del Comercio 193, San Borja, Lima, Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Central Telefónica: (01) 615-5800 / Línea Gratuita: 0800-40210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mesa de Ayuda: soporte@perueduca.pe</span>
              </div>
            </div>
          </div>

          {/* Col 1: Servicios y Accesos */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-1.5">
              Servicios Digitales
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigateSection('campus-virtual')}
                  className="hover:text-white transition-colors text-left"
                >
                  Campus Virtual Moodle
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('cursos')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cursos de Formación Docente
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left"
                >
                  Biblioteca de Materiales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('comunidades')}
                  className="hover:text-white transition-colors text-left"
                >
                  Comunidades Virtuales
                </button>
              </li>
              <li>
                <a
                  href="https://sifods.minedu.gob.pe"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>SIFODS Escalafón</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Niveles y Modalidades */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-1.5">
              Niveles y Modalidades
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left"
                >
                  Educación Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left"
                >
                  Educación Primaria
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left"
                >
                  Educación Secundaria
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left"
                >
                  Básica Alternativa (EBA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left"
                >
                  Básica Especial (EBE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('materiales')}
                  className="hover:text-white transition-colors text-left text-amber-300"
                >
                  Lenguas Originarias (EIB)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Transparencia & Ayuda */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-1.5">
              Atención y Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onOpenSupport}
                  className="hover:text-white transition-colors text-sky-400 font-semibold"
                >
                  Mesa de Ayuda (Tickets)
                </button>
              </li>
              <li>
                <a
                  href="#terminos"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Términos y Condiciones de Uso: La plataforma PerúEduca es de acceso público y gratuito para la comunidad educativa peruana bajo la supervisión del MINEDU.'
                    );
                  }}
                  className="hover:text-white transition-colors"
                >
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a
                  href="#privacidad"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Política de Privacidad y Protección de Datos Personales conforme a la Ley N° 29733 de la República del Perú.'
                    );
                  }}
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#libro-reclamaciones"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      'Libro de Reclamaciones Virtual del Ministerio de Educación conforme al D.S. 042-2011-PCM.'
                    );
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-400"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Libro de Reclamaciones</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.gob.pe/minedu"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Portal Transparencia MINEDU</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Ministerio de Educación del Perú (MINEDU). Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Versión del Portal: 4.8.2</span>
            <span>·</span>
            <span>Dirección de Innovación Tecnológica en Educación (DITE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
