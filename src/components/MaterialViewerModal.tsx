import React, { useState } from 'react';
import {
  X,
  FileText,
  Video,
  Image,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { CourseMaterial } from '../types';

interface MaterialViewerModalProps {
  material: CourseMaterial | null;
  courseTitle: string;
  onClose: () => void;
  onDownload: (material: CourseMaterial) => void;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({
  material,
  courseTitle,
  onClose,
  onDownload,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!material || material.type === 'exam') return null;

  const totalPages = material.pagesCount || 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between border-b border-blue-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
              {material.type === 'pdf' && <FileText className="w-5 h-5 text-red-400" />}
              {material.type === 'video' && <Video className="w-5 h-5 text-purple-400" />}
              {material.type === 'photo' && <Image className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-200">
                <span className="font-bold uppercase tracking-wider">{courseTitle}</span>
                <span>·</span>
                <span>Por: {material.authorName}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
                {material.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Controls toolbar */}
        {material.type === 'pdf' && (
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
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
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
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 rounded hover:bg-slate-200"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onDownload(material)}
                className="px-3 py-1 bg-[#B91C1C] hover:bg-red-800 text-white font-bold rounded flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900/10 flex justify-center items-center">
          {/* PDF Viewer Canvas */}
          {material.type === 'pdf' && (
            <div
              className="bg-white rounded-lg shadow-xl border border-slate-300 p-8 max-w-2xl w-full min-h-[500px] transition-transform duration-200 text-slate-800"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="border-b-2 border-[#1E3A8A] pb-3 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#1E3A8A] tracking-wider block">
                    I.E. Emblemática Ricardo Bentín · Aula Virtual
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {material.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Hoja {currentPage} / {totalPages}
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="font-bold text-[#1E3A8A] block text-xs mb-1">
                    Indicaciones del Docente:
                  </span>
                  <p className="text-xs text-slate-700">{material.description}</p>
                </div>

                <h5 className="font-bold text-slate-900 text-sm">
                  Parte {currentPage}: Fundamentos y Actividades Prácticas
                </h5>

                <p>
                  Estimados estudiantes de la I.E. Ricardo Bentín: para el desarrollo de esta sesión deben revisar detenidamente las fórmulas y ejemplos proporcionados a continuación, resolver las actividades en su cuaderno de trabajo y estar preparados para la evaluación continua.
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <p className="font-semibold text-slate-800">Ejercicios de Aplicación:</p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-2 text-xs">
                    <li>Analizar las condiciones iniciales del problema propuesto.</li>
                    <li>Plantear la ecuación o relación analítica pertinente.</li>
                    <li>Comprobar los resultados obtenidos y redactar una conclusión contextualizada.</li>
                  </ol>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Material oficial subido para el año escolar 2026. Recuerda llevar tu avance a clase presencial.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Video Player Canvas */}
          {material.type === 'video' && (
            <div className="w-full max-w-3xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white flex flex-col">
              <div className="aspect-video bg-black relative flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/gnAdna_tLK0?autoplay=0`}
                  title={material.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-5 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-amber-400 mb-2">
                  <span className="font-bold">Duración: {material.videoDuration || '15:00 min'}</span>
                  <a
                    href={material.videoUrl || 'https://youtube.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sky-400 hover:underline"
                  >
                    <span>Abrir en YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h4 className="text-base font-bold text-white mb-2">{material.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {material.description}
                </p>
              </div>
            </div>
          )}

          {/* Photo / Infographic Canvas */}
          {material.type === 'photo' && (
            <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 flex flex-col">
              <div className="bg-slate-900 max-h-[460px] overflow-hidden flex items-center justify-center">
                <img
                  src={material.imageUrl || '/src/assets/images/banner_ia_educacion_1794336764506.jpg'}
                  alt={material.title}
                  className="w-full h-auto object-contain max-h-[460px]"
                />
              </div>
              <div className="p-5 bg-white border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 mb-1">{material.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{material.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Subido por {material.authorName}</span>
                  <button
                    onClick={() => onDownload(material)}
                    className="px-3 py-1.5 bg-[#1E3A8A] text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Guardar Imagen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Aula Virtual Ricardo Bentín · Recursos Pedagógicos</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
