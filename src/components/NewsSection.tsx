import React from 'react';
import { Bell, Calendar, ArrowRight, Clock, User } from 'lucide-react';
import { NewsArticle } from '../types';
import { NEWS_DATA } from '../data/mockData';

interface NewsSectionProps {
  onSelectArticle: (article: NewsArticle) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSelectArticle }) => {
  return (
    <section id="noticias" className="py-12 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D92525] uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              <span>Actualidad y Comunicados Oficiales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Noticias del Sector Educativo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Información oficial, cronogramas de inscripción, disposiciones pedagógicas y eventos para la comunidad escolar.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Actualizado permanentemente por la Oficina de Prensa MINEDU
          </span>
        </div>

        {/* News Grid: 1 featured large + 2 side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {NEWS_DATA.map((article, index) => {
            const isMarquee = index === 0;

            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isMarquee ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <div>
                  {article.imageUrl && (
                    <div className={`relative overflow-hidden bg-slate-900 ${isMarquee ? 'h-64 sm:h-72' : 'h-48'}`}>
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] font-bold text-white bg-[#B91C1C] px-2.5 py-1 rounded shadow-xs uppercase">
                          {article.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center gap-3 text-xs text-slate-200 mb-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {article.date}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTimeMinutes} min de lectura
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <h3
                      className={`font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug mb-3 ${
                        isMarquee ? 'text-lg sm:text-xl' : 'text-base'
                      }`}
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mb-4 line-clamp-3">
                      {article.summary}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <User className="w-3.5 h-3.5" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0284C7] mt-2">
                  <span>Leer comunicado completo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
