import React, { useState } from 'react';
import { Play, Tv, Eye, Calendar, Clock, CheckCircle2, User, Volume2, Share2 } from 'lucide-react';
import { WEBINAR_DATA } from '../data/mockData';
import { WebinarItem } from '../types';

export const WebinarPlayer: React.FC = () => {
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarItem>(WEBINAR_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#EAB308] uppercase tracking-wider mb-1">
              <Tv className="w-4 h-4 text-amber-500" />
              <span>PerúEduca TV · Streaming y Conferencias</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Talleres y Webinars Pedagógicos en Vivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Sesiones formativas con especialistas del Minedu y expertos internacionales en didáctica, IA y competencias curriculares.
            </p>
          </div>

          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Transmisiones y grabaciones oficiales
          </span>
        </div>

        {/* Video Stage and Playlist split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-white">
          {/* Main Video Viewport (8 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              {isPlaying ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mb-4 animate-pulse">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
                    Reproduciendo Grabación Oficial MINEDU
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white max-w-lg mb-2">
                    {selectedWebinar.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 max-w-md">
                    Expositor: {selectedWebinar.presenter} ({selectedWebinar.role})
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Pausar video
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          'https://www.youtube.com/results?search_query=perueduca+minedu+' +
                            encodeURIComponent(selectedWebinar.title),
                          '_blank'
                        );
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>Abrir en YouTube</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src="/src/assets/images/hero_docente_tecnologia_1794336763892.jpg"
                    alt={selectedWebinar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B91C1C] hover:bg-red-600 text-white shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                    aria-label="Reproducir webinar"
                  >
                    <Play className="w-8 h-8 fill-white ml-1" />
                    <span className="absolute -bottom-8 whitespace-nowrap text-xs font-bold text-white/90">
                      Ver Conferencia
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Current Video Info */}
            <div className="mt-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                  {selectedWebinar.category}
                </span>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedWebinar.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {selectedWebinar.views.toLocaleString()} vistas
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-white transition-colors text-slate-300"
                    title="Compartir enlace"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isCopied ? '¡Copiado!' : 'Compartir'}</span>
                  </button>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                {selectedWebinar.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-white">{selectedWebinar.presenter}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{selectedWebinar.role}</span>
              </div>
            </div>
          </div>

          {/* Playlist Panel (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-950/80 p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
            <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 flex items-center justify-between">
              <span>Lista de Sesiones</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                3 disponibles
              </span>
            </h4>

            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {WEBINAR_DATA.map((item) => {
                const isSelected = selectedWebinar.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedWebinar(item);
                      setIsPlaying(true);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'bg-slate-800/90 border-[#0284C7] shadow-xs'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0 flex items-center justify-center text-slate-300 mt-0.5">
                      <Play className="w-4 h-4 fill-slate-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white leading-snug line-clamp-2 mb-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{item.presenter}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                        <span>·</span>
                        <span>{item.views.toLocaleString()} vistas</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
              <a
                href="https://www.youtube.com/@perueduca"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
              >
                <span>Visitar canal oficial de YouTube PerúEduca</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
