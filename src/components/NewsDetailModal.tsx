import React from 'react';
import { X, Calendar, Clock, User, Share2, ArrowLeft } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  article,
  onClose,
}) => {
  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Enlace de la noticia copiado al portapapeles.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white bg-[#B91C1C] px-2.5 py-0.5 rounded uppercase">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
              title="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {article.title}
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {article.author}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTimeMinutes} min de lectura
            </span>
          </div>

          {article.imageUrl && (
            <div className="rounded-xl overflow-hidden h-56 sm:h-64 bg-slate-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-sm font-semibold text-slate-700 leading-relaxed italic bg-slate-50 p-3.5 rounded-lg border-l-4 border-[#0284C7]">
            {article.summary}
          </p>

          <div className="prose prose-slate text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pt-2">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Noticias</span>
          </button>

          <button
            onClick={() => {
              window.open('https://www.gob.pe/minedu', '_blank');
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-sky-700 rounded-lg transition-colors"
          >
            Ver más en gob.pe/minedu
          </button>
        </div>
      </div>
    </div>
  );
};
