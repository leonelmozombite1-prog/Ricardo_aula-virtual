import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Headphones,
  Globe,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { EducationalResource } from '../types';
import { RESOURCES_DATA } from '../data/mockData';

interface ResourcesSectionProps {
  onPreviewResource: (resource: EducationalResource) => void;
  onDownloadResource: (resource: EducationalResource) => void;
  searchFilter: string;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  onPreviewResource,
  onDownloadResource,
  searchFilter,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('todos');
  const [selectedArea, setSelectedArea] = useState<string>('todas');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const levels = [
    { id: 'todos', label: 'Todos los Niveles' },
    { id: 'Inicial', label: 'Educación Inicial' },
    { id: 'Primaria', label: 'Educación Primaria' },
    { id: 'Secundaria', label: 'Educación Secundaria' },
    { id: 'EBE', label: 'Básica Especial (EBE)' },
  ];

  const areas = [
    { id: 'todas', label: 'Todas las Áreas' },
    { id: 'Matemática', label: 'Matemática' },
    { id: 'Comunicación', label: 'Comunicación' },
    { id: 'Ciencia y Tecnología', label: 'Ciencia y Tecnología' },
    { id: 'Ciencias Sociales', label: 'Ciencias Sociales' },
    { id: 'EIB', label: 'Lenguas Originarias (EIB)' },
  ];

  const filteredResources = RESOURCES_DATA.filter((item) => {
    const matchesLevel = selectedLevel === 'todos' || item.level === selectedLevel;
    const matchesArea = selectedArea === 'todas' || item.area === selectedArea;
    const matchesSearch =
      !searchFilter ||
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.language.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesLevel && matchesArea && matchesSearch;
  });

  const handleDownload = (res: EducationalResource) => {
    onDownloadResource(res);
    setDownloadSuccessId(res.id);
    setTimeout(() => {
      setDownloadSuccessId(null);
    }, 2500);
  };

  return (
    <section id="materiales" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Repositorio Digital de Materiales Pedagógicos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recursos Educativos para el Aula y la Comunidad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Descarga libre de textos escolares, cuadernos de autoaprendizaje, fichas de trabajo y guías docentes elaboradas por especialistas del Minedu.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg font-medium">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              Materiales en Castellano, Quechua y Aymara
            </span>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {levels.map((lvl) => {
            const isActive = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        {/* Sub-area filter tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px] shrink-0">
            Área Curricular:
          </span>
          {areas.map((ar) => {
            const isActive = selectedArea === ar.id;
            return (
              <button
                key={ar.id}
                onClick={() => setSelectedArea(ar.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {ar.label}
              </button>
            );
          })}
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 mb-1">
              No hay recursos disponibles con estos criterios de búsqueda.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Intenta seleccionar otra área curricular o nivel educativo.
            </p>
            <button
              onClick={() => {
                setSelectedLevel('todos');
                setSelectedArea('todas');
              }}
              className="px-4 py-2 text-xs font-medium bg-[#B91C1C] text-white rounded-lg hover:bg-red-800"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const isDownloaded = downloadSuccessId === res.id;

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Header bar with format and language tag */}
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        {res.format === 'Audio/Podcast' ? (
                          <Headphones className="w-3.5 h-3.5 text-purple-600" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span>{res.format}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 text-[11px]">{res.pagesOrDuration}</span>
                      </div>

                      <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                        {res.language}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                        <span className="font-semibold text-[#0284C7]">{res.level}</span>
                        <span>·</span>
                        <span>{res.grade}</span>
                        <span>·</span>
                        <span className="text-slate-600">{res.area}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug mb-2 line-clamp-2">
                        {res.title}
                      </h3>

                      <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4 line-clamp-3">
                        {res.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {res.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Download stats */}
                      <div className="text-[11px] text-slate-400 mt-2">
                        {res.downloadsCount.toLocaleString()} descargas institucionales
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onPreviewResource(res)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Previsualizar</span>
                    </button>

                    <button
                      onClick={() => handleDownload(res)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        isDownloaded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#10B981] hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Descargado!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
