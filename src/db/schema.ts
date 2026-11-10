import { pgTable, text, serial, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (docentes, alumnos, administradores)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(), // Firebase Auth UID or internal ID
  dni: text('dni').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // 'docente' | 'alumno' | 'admin'
  grade: text('grade'),
  section: text('section'),
  specialty: text('specialty'),
  assignedCourseId: text('assigned_course_id'),
  institution: text('institution').default('I.E. Ricardo Bentín - Pucallpa'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Courses table (11 asignaturas oficiales)
export const courses = pgTable('courses', {
  id: text('id').primaryKey(), // e.g. 'curso-mat'
  code: text('code').notNull().unique(),
  title: text('title').notNull(),
  area: text('area').notNull(),
  grade: text('grade').notNull(),
  section: text('section').notNull(),
  teacherName: text('teacher_name').notNull(),
  teacherEmail: text('teacher_email').notNull(),
  coverImage: text('cover_image').notNull(),
  description: text('description').notNull(),
  studentsCount: integer('students_count').default(38).notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Course Materials (PDFs, Exámenes, Videos, Fotos)
export const courseMaterials = pgTable('course_materials', {
  id: text('id').primaryKey(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // 'pdf' | 'exam' | 'video' | 'photo'
  authorName: text('author_name').notNull(),
  gradeSection: text('grade_section').notNull(), // e.g. 'Primero A'
  fileSize: text('file_size'),
  pdfUrl: text('pdf_url'),
  pagesCount: integer('pages_count'),
  videoUrl: text('video_url'),
  videoDuration: text('video_duration'),
  imageUrl: text('image_url'),
  examTimeLimitMinutes: integer('exam_time_limit_minutes'),
  totalPoints: integer('total_points'),
  examQuestions: jsonb('exam_questions'), // Array of ExamQuestion
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Student Exam Attempts & Grades
export const examAttempts = pgTable('exam_attempts', {
  id: text('id').primaryKey(),
  examId: text('exam_id').references(() => courseMaterials.id, { onDelete: 'cascade' }).notNull(),
  courseId: text('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  studentName: text('student_name').notNull(),
  studentDni: text('student_dni').notNull(),
  gradeSection: text('grade_section'),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  gradeLetter: text('grade_letter').notNull(), // 'AD' | 'A' | 'B' | 'C'
  answers: jsonb('answers').notNull(), // Record<string, number>
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// Support tickets / Mesa de Ayuda
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  dni: text('dni').notNull(),
  role: text('role').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('Pendiente').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Educational Resources
export const educationalResources = pgTable('educational_resources', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  level: text('level').notNull(),
  grade: text('grade').notNull(),
  area: text('area').notNull(),
  format: text('format').notNull(),
  language: text('language').notNull(),
  pagesOrDuration: text('pages_or_duration').notNull(),
  downloadsCount: integer('downloads_count').default(0).notNull(),
  coverImage: text('cover_image').notNull(),
  tags: jsonb('tags').notNull(),
  publishedDate: text('published_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  materials: many(courseMaterials),
  attempts: many(examAttempts),
}));

export const materialsRelations = relations(courseMaterials, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseMaterials.courseId],
    references: [courses.id],
  }),
  attempts: many(examAttempts),
}));

export const attemptsRelations = relations(examAttempts, ({ one }) => ({
  material: one(courseMaterials, {
    fields: [examAttempts.examId],
    references: [courseMaterials.id],
  }),
  course: one(courses, {
    fields: [examAttempts.courseId],
    references: [courses.id],
  }),
}));
