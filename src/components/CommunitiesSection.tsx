import React, { useState } from 'react';
import { Users, MessageSquare, Sparkles, CheckCircle2, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface CommunitiesSectionProps {
  onJoinCommunity: (commName: string) => void;
}

export const CommunitiesSection: React.FC<CommunitiesSectionProps> = ({
  onJoinCommunity,
}) => {
  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({});

  const communities = [
    {
      id: 'comm-1',
      name: 'Comunidad Nacional de Docentes de Matemática',
      members: '48,200 docentes',
      discussions: '1,420 debates',
      description: 'Espacio de intercambio de estrategias de resolución de problemas según el enfoque de George Pólya y materiales manipulativos.',
      tag: 'Ciencias Exactas',
    },
    {
      id: 'comm-2',
      name: 'Red de Innovación en Competencias Digitales e IA',
      members: '64,900 docentes',
      discussions: '2,890 debates',
      description: 'Colegas compartiendo prompts, herramientas educativas gratuitas y proyectos de robótica con recursos reciclados.',
      tag: 'Tecnología Educativa',
    },
    {
      id: 'comm-3',
      name: 'Comunidad de Educación Intercultural Bilingüe (EIB)',
      members: '28,150 docentes',
      discussions: '980 debates',
      description: 'Materiales y reflexiones en lenguas quechua, aymara, awajún y shipibo para la preservación de saberes comunitarios.',
      tag: 'Interculturalidad',
    },
    {
      id: 'comm-4',
      name: 'Red de Directivos y Gestión Escolar Líder',
      members: '32,400 directores',
      discussions: '1,120 debates',
      description: 'Consultas sobre instrumentos de gestión (PEI, PAT), monitoreo pedagógico y clima institucional favorable.',
      tag: 'Gestión Institucional',
    },
  ];

  const handleJoin = (id: string, name: string) => {
    setJoinedMap((prev) => ({ ...prev, [id]: true }));
    onJoinCommunity(name);
  };

  return (
    <section id="comunidades" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#EAB308] uppercase tracking-wider mb-1">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Redes de Colaboración Docente</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Comunidades Virtuales de Aprendizaje
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Conéctate con colegas de todo el Perú para compartir proyectos didácticos, rúbricas de evaluación y experiencias exitosas.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Más de 20 redes temáticas activas a nivel nacional
          </div>
        </div>

        {/* Community Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((comm) => {
            const isJoined = joinedMap[comm.id];

            return (
              <div
                key={comm.id}
                className="bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                      {comm.tag}
                    </span>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {comm.members}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        {comm.discussions}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {comm.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {comm.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Moderado por especialistas DIFOID</span>

                  <button
                    onClick={() => handleJoin(comm.id, comm.name)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                      isJoined
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-[#B91C1C] hover:bg-red-800 text-white shadow-2xs'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>¡Unido!</span>
                      </>
                    ) : (
                      <>
                        <span>Unirme al grupo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
