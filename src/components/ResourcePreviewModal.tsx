import React, { useState } from 'react';
import {
  X,
  Download,
  BookOpen,
  FileText,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { EducationalResource } from '../types';

interface ResourcePreviewModalProps {
  resource: EducationalResource | null;
  onClose: () => void;
  onDownload: (resource: EducationalResource) => void;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  resource,
  onClose,
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isCopied, setIsCopied] = useState(false);

  if (!resource) return null;

  const totalPreviewPages = 5;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">{resource.level}</span>
                <span>·</span>
                <span>{resource.grade}</span>
                <span>·</span>
                <span className="text-amber-300">{resource.language}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {resource.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Compartir recurso"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isCopied ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Cerrar previsualización"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              Página {currentPage} de {totalPreviewPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPreviewPages, p + 1))}
              disabled={currentPage >= totalPreviewPages}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                className="p-1 rounded hover:bg-slate-200"
                title="Alejar"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 rounded hover:bg-slate-200"
                title="Acercar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onDownload(resource)}
              className="px-3 py-1 bg-[#10B981] hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar {resource.format}</span>
            </button>
          </div>
        </div>

        {/* Document Interactive Viewer Canvas */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-200/70 flex justify-center">
          <div
            className="bg-white rounded-lg shadow-xl border border-slate-300 p-8 max-w-2xl w-full transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Simulated Official MINEDU Pedagogical Document Page */}
            <div className="border-b-2 border-[#B91C1C] pb-4 mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#B91C1C]">
                  <span>PERÚ</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="text-slate-700 font-bold">Ministerio de Educación</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                  Dirección General de Educación Básica · PerúEduca
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Pág. 0{currentPage}
              </span>
            </div>

            {/* Document Content Simulation */}
            <div className="space-y-4 text-xs text-slate-800">
              <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
                <span className="text-[11px] font-bold text-sky-800 uppercase block mb-1">
                  Propósito de Aprendizaje · CNEB 2026
                </span>
                <p className="text-xs text-sky-900 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <h4 className="text-base font-bold text-slate-900 border-l-3 border-[#0284C7] pl-2.5">
                {resource.title} - Unidad de Aprendizaje {currentPage}
              </h4>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs leading-relaxed space-y-2">
                <p className="font-semibold text-slate-800">
                  1. Situación Significativa Contextualizada:
                </p>
                <p className="text-slate-600">
                  En la comunidad escolar, los estudiantes de {resource.grade} observan los cambios socioculturales y ambientales de su entorno local. A través de este material interactivo, desarrollarán la capacidad de formular preguntas investigativas y proponer alternativas de solución pertinentes.
                </p>
                <p className="font-semibold text-slate-800 pt-2">
                  2. Criterios de Evaluación Formativa:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                  <li>Identifica las ideas clave y argumentos principales de textos contextualizados.</li>
                  <li>Explica las relaciones de causa y efecto utilizando vocabulario específico en {resource.language}.</li>
                  <li>Produce evidencias orales o escritas con cohesión y coherencia reflexiva.</li>
                </ul>
              </div>

              {/* Sample illustrative diagram */}
              <div className="border border-slate-200 rounded-lg p-4 bg-amber-50/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">Orientación para el Docente:</span>
                  <span className="text-amber-800 text-[11px]">
                    Este material permite ajustes razonables según el DUA para estudiantes con necesidades educativas especiales.
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Disponible bajo Licencia de Uso Educativo Oficial del MINEDU</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
};
