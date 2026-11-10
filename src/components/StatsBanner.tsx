import React from 'react';
import { STATS_ITEMS } from '../data/mockData';
import { MapPin } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  return (
    <section className="bg-[#0F172A] text-white py-12 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Impacto Educativo Nacional</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Conectando a la Comunidad Educativa de todo el Perú
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 rounded-xl p-5 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1 tracking-tight font-mono">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-100 mb-1">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-400">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
