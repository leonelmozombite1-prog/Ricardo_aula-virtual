export type MaterialType = 'pdf' | 'exam' | 'video' | 'photo';

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: MaterialType;
  createdAt: string;
  authorName: string;
  gradeSection?: string; // e.g. "1° A", "1° B", "2° A", "2° B", "3° A", "3° B", "4° A", "4° B", "5° A", "5° B"
  
  // Type specific properties
  pdfUrl?: string;
  pagesCount?: number;
  fileSize?: string;
  
  videoUrl?: string;
  videoDuration?: string;
  
  imageUrl?: string;
  
  examQuestions?: ExamQuestion[];
  examTimeLimitMinutes?: number;
  totalPoints?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  courseId: string;
  gradeSection?: string;
  studentName: string;
  studentDni: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  gradeLetter: 'AD' | 'A' | 'B' | 'C';
  answers: Record<string, number>;
}

export interface BentinCourse {
  id: string;
  code: string;
  title: string;
  area: string;
  grade: string;
  section: string;
  teacherName: string;
  teacherEmail: string;
  coverImage: string;
  description: string;
  studentsCount: number;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  dni: string;
  role: 'docente' | 'alumno' | 'Docente' | 'Directivo' | 'Especialista DRE/UGEL' | 'Estudiante';
  username?: string;
  password?: string;
  assignedCourseId?: string;
  grade?: string;
  section?: string;
  specialty?: string;
  institution: string;
  enrolledCourses?: string[];
  region?: string;
  ugel?: string;
}

// Backwards compatibility for mock data and auxiliary components
export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'ia' | 'docentes' | 'directivos' | 'inclusiva' | 'digital';
  modality: 'Virtual - Autoformativo' | 'Virtual con Tutor' | 'Híbrido';
  durationHours: number;
  targetAudience: string;
  startDate: string;
  status: 'Inscripciones Abiertas' | 'En Convocatoria' | 'Próximamente';
  certification: string;
  image: string;
  modules: { title: string; hours: number; topics: string[] }[];
  featured?: boolean;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  level: 'Inicial' | 'Primaria' | 'Secundaria' | 'EBA' | 'EBE';
  grade: string;
  area: 'Comunicación' | 'Matemática' | 'Ciencia y Tecnología' | 'Ciencias Sociales' | 'EIB' | 'Arte y Cultura';
  format: 'PDF' | 'Ficha Interactiva' | 'Guía Docente' | 'Audio/Podcast' | 'Video';
  language: 'Castellano' | 'Quechua Chanka' | 'Quechua Collao' | 'Aymara' | 'Shipibo-Konibo' | 'Awajún';
  pagesOrDuration: string;
  downloadsCount: number;
  publishedDate: string;
  coverImage: string;
  tags: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Comunicado' | 'Capacitación' | 'Institucional' | 'Innovación';
  date: string;
  author: string;
  readTimeMinutes: number;
  imageUrl?: string;
}

export interface WebinarItem {
  id: string;
  title: string;
  presenter: string;
  role: string;
  date: string;
  duration: string;
  youtubeId: string;
  category: string;
  views: number;
}
