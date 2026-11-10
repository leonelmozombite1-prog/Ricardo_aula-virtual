import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  X,
  Server,
  Layers,
  Table,
  Key,
  ExternalLink,
  Code2,
  FileCode2,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';

interface MySQLWorkbenchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MySQLWorkbenchModal: React.FC<MySQLWorkbenchModalProps> = ({ isOpen, onClose }) => {
  const [sqlContent, setSqlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'diagram' | 'tables' | 'guide'>('tables');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getMySQLScript().then((content) => {
        setSqlContent(content);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'database_bentin_mysql_workbench.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tablesInfo = [
    {
      name: 'users',
      description: 'Docentes, estudiantes, directivos y administradores con credenciales y roles.',
      columns: ['id (PK)', 'uid', 'dni (UNIQUE)', 'name', 'email (UNIQUE)', 'username', 'password', 'role', 'grade', 'section', 'specialty', 'assigned_course_id'],
      relations: '1 usuario profesor asignado a 1 curso curricular.',
    },
    {
      name: 'courses',
      description: 'Las 11 asignaturas oficiales del Currículo Nacional 2026 de la I.E. Ricardo Bentín.',
      columns: ['id (PK)', 'code (UNIQUE)', 'title', 'area', 'grade', 'section', 'teacher_name', 'teacher_email', 'cover_image', 'students_count', 'color'],
      relations: '1 curso tiene muchos materiales y muchos intentos de exámenes.',
    },
    {
      name: 'course_materials',
      description: 'Materiales didácticos (PDFs, exámenes, videos, fotos de pizarra) organizados por secciones.',
      columns: ['id (PK)', 'course_id (FK)', 'title', 'description', 'type', 'author_name', 'grade_section', 'pdf_url', 'video_url', 'exam_questions (JSON)'],
      relations: 'Pertenece a un curso (ON DELETE CASCADE) y puede tener intentos de exámenes.',
    },
    {
      name: 'exam_attempts',
      description: 'Evaluaciones rendidas por los alumnos, con puntaje vigesimal (0-20), nivel AD/A/B/C y respuestas.',
      columns: ['id (PK)', 'exam_id (FK)', 'course_id (FK)', 'student_name', 'student_dni', 'score', 'max_score', 'grade_letter', 'answers (JSON)'],
      relations: 'Enlaza el material del examen con el alumno y el curso.',
    },
    {
      name: 'support_tickets',
      description: 'Mesa de ayuda y requerimientos técnicos de la comunidad educativa.',
      columns: ['id (PK)', 'name', 'email', 'dni', 'role', 'subject', 'message', 'status', 'created_at'],
      relations: 'Registros independientes para la administración escolar.',
    },
    {
      name: 'educational_resources',
      description: 'Biblioteca digital descargable con fichas de trabajo, guías docentes y lecturas.',
      columns: ['id (PK)', 'title', 'description', 'level', 'grade', 'area', 'format', 'language', 'downloads_count', 'tags (JSON)'],
      relations: 'Catálogo de recursos educativos complementarios.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Base de Datos MySQL Workbench</h2>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                  100% Funcional
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Modelo relacional EER, script SQL completo y persistencia en Cloud SQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .sql</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-bold pt-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={`pb-2.5 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'tables'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Tablas y Entidades ({tablesInfo.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'sql'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Código SQL Completo</span>
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`pb-2.5 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'diagram'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modelo Relacional EER</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-[#1E3A8A] text-[#1E3A8A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Guía de Conexión en MySQL Workbench</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60">
          {/* TAB 1: TABLES */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Server className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <strong>Estructura Relacional Oficial:</strong> La base de datos está modelada con llaves foráneas (`FOREIGN KEY`) en cascada, índices de alto rendimiento para búsquedas por DNI, sección y curso, además de tipos nativos JSON para preguntas de exámenes dinámicas.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tablesInfo.map((table) => (
                  <div
                    key={table.name}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h4 className="text-sm font-black font-mono text-[#1E3A8A]">{table.name}</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        InnoDB
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{table.description}</p>
                    
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Columnas Principales:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {table.columns.map((col) => (
                          <span
                            key={col}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              col.includes('PK')
                                ? 'bg-amber-100 text-amber-900 font-bold'
                                : col.includes('FK')
                                ? 'bg-purple-100 text-purple-900 font-bold'
                                : 'bg-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      <Key className="w-3 h-3 inline mr-1 text-slate-400" />
                      {table.relations}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SQL CODE */}
          {activeTab === 'sql' && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">
                  Archivo: <strong>database_bentin_mysql_workbench.sql</strong> ({sqlContent.length} caracteres)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 text-slate-700 shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Código SQL'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 text-xs font-bold bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Archivo</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="h-96 flex items-center justify-center text-xs text-slate-500 bg-slate-900 rounded-xl text-white">
                  Cargando script SQL...
                </div>
              ) : (
                <pre className="bg-slate-950 text-slate-200 p-5 rounded-xl text-xs font-mono overflow-x-auto max-h-[550px] leading-relaxed border border-slate-800 selection:bg-blue-600">
                  {sqlContent}
                </pre>
              )}
            </div>
          )}

          {/* TAB 3: DIAGRAM EER */}
          {activeTab === 'diagram' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Diagrama Entidad-Relación (EER) en MySQL Workbench
                </h3>
                <div className="p-6 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs leading-relaxed space-y-4">
                  <div className="text-amber-400 font-bold border-b border-slate-800 pb-2">
                    [DIAGRAMA RELACIONAL - ESQUEMA BENTIN AULA VIRTUAL]
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                      <span className="text-sky-400 font-bold block mb-1">courses (Cursos)</span>
                      <div className="text-[11px] text-slate-300">
                        PK: id [VARCHAR]<br/>
                        UK: code [VARCHAR]<br/>
                        title, area, teacher_name<br/>
                        cover_image, color
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span>1:N (Un curso tiene muchos materiales)</span>
                      <span className="text-lg font-black text-amber-400">────────►</span>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                      <span className="text-emerald-400 font-bold block mb-1">course_materials (Materiales)</span>
                      <div className="text-[11px] text-slate-300">
                        PK: id [VARCHAR]<br/>
                        FK: course_id ──► courses.id<br/>
                        type: 'pdf'|'exam'|'video'|'photo'<br/>
                        grade_section, pdf_url, video_url
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                      <span className="text-purple-400 font-bold block mb-1">users (Usuarios)</span>
                      <div className="text-[11px] text-slate-300">
                        PK: id [INT AUTO_INC]<br/>
                        UK: dni, email, username<br/>
                        role: 'docente' | 'alumno'<br/>
                        grade, section, specialty
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span>Rinde evaluación (1:N)</span>
                      <span className="text-lg font-black text-amber-400">────────►</span>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                      <span className="text-rose-400 font-bold block mb-1">exam_attempts (Notas Alumnos)</span>
                      <div className="text-[11px] text-slate-300">
                        PK: id [VARCHAR]<br/>
                        FK: exam_id ──► course_materials.id<br/>
                        FK: course_id ──► courses.id<br/>
                        score, max_score, grade_letter
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STEP-BY-STEP WORKBENCH GUIDE */}
          {activeTab === 'guide' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs text-slate-700">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Cómo abrir y ejecutar en MySQL Workbench (Paso a Paso)
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Descarga el script SQL:</strong>
                    Haz clic en el botón superior verde <strong>"Descargar .sql"</strong> para guardar el archivo <code>database_bentin_mysql_workbench.sql</code> en tu computadora.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Abre MySQL Workbench:</strong>
                    Inicia MySQL Workbench en tu PC y conéctate a tu servidor local de MySQL (por ejemplo, <code>Local instance 3306</code>).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Carga y Ejecuta el Script:</strong>
                    Ve al menú superior: <code>File → Open SQL Script...</code>, selecciona <code>database_bentin_mysql_workbench.sql</code> y pulsa el botón del <strong>Rayo ⚡ (Execute)</strong> o la combinación <code>Ctrl + Shift + Enter</code>. Se creará automáticamente la base de datos <code>bentin_aula_virtual</code> con todas las tablas y datos.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">Generar Diagrama EER en Workbench:</strong>
                    En el menú de Workbench haz clic en <code>Database → Reverse Engineer...</code>, selecciona la base <code>bentin_aula_virtual</code> y pulsa "Next". ¡Verás el diagrama visual con todas las relaciones y llaves foráneas listas!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cloud SQL PostgreSQL activo en la nube + Compatible con MySQL Workbench</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
