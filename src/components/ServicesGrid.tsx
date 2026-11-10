import React from 'react';
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Users,
  Clock,
  Headphones,
  ArrowUpRight
} from 'lucide-react';
import { SERVICES_LIST } from '../data/mockData';

interface ServicesGridProps {
  onNavigate: (sectionId: string) => void;
  onOpenSupport: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onNavigate,
  onOpenSupport,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Clock':
        return <Clock className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      default:
        return <GraduationCap className="w-6 h-6" />;
    }
  };

  const handleServiceClick = (item: typeof SERVICES_LIST[0]) => {
    if (item.id === 'ayuda') {
      onOpenSupport();
    } else if (item.id === 'campus') {
      onNavigate('campus-virtual');
    } else if (item.id === 'recursos') {
      onNavigate('materiales');
    } else if (item.id === 'comunidades') {
      onNavigate('comunidades');
    } else if (item.id === 'autoformativo' || item.id === 'sifods') {
      onNavigate('cursos');
    }
  };

  return (
    <section className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#D92525] tracking-widest uppercase">
              Plataforma Digital de Aprendizaje
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Nuestros Servicios y Accesos Directos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-0 max-w-md">
            Espacios diseñados para potenciar la labor de docentes, directivos y estudiantes en todo el país.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES_LIST.map((service) => {
            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group relative bg-slate-50 hover:bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      {getIcon(service.iconName)}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors mb-2 flex items-center gap-1">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0284C7]" />
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                  <span>Acceder al servicio</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
