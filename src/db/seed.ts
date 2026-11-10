import { db } from './index.ts';
import { users, courses, courseMaterials, examAttempts, educationalResources } from './schema.ts';
import { BENTIN_COURSES, TEACHERS_LIST, STUDENTS_LIST, INITIAL_MATERIALS, INITIAL_ATTEMPTS } from '../data/bentinData.ts';
import { RESOURCES_DATA } from '../data/mockData.ts';

export async function seedDatabaseIfEmpty() {
  try {
    // Check if courses already exist
    const existingCourses = await db.select().from(courses);
    if (existingCourses.length === 0) {
      console.log('Seeding courses into Cloud SQL...');
      for (const c of BENTIN_COURSES) {
        await db.insert(courses).values({
          id: c.id,
          code: c.code,
          title: c.title,
          area: c.area,
          grade: c.grade,
          section: c.section,
          teacherName: c.teacherName,
          teacherEmail: c.teacherEmail,
          coverImage: c.coverImage,
          description: c.description,
          studentsCount: c.studentsCount,
          color: c.color,
        }).onConflictDoNothing();
      }
    }

    // Check users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      console.log('Seeding teachers and students into Cloud SQL...');
      for (const t of TEACHERS_LIST) {
        await db.insert(users).values({
          dni: t.dni,
          name: t.name,
          email: t.email,
          username: t.username || t.email,
          password: t.password || 'bentin2026',
          role: 'docente',
          specialty: t.specialty,
          assignedCourseId: t.assignedCourseId,
          institution: t.institution,
        }).onConflictDoNothing();
      }

      for (const s of STUDENTS_LIST) {
        await db.insert(users).values({
          dni: s.dni,
          name: s.name,
          email: s.email,
          username: s.username || s.email,
          password: s.password || 'alumno2026',
          role: 'alumno',
          grade: s.grade,
          section: s.section,
          institution: s.institution,
        }).onConflictDoNothing();
      }
    }

    // Check course materials
    const existingMaterials = await db.select().from(courseMaterials);
    if (existingMaterials.length === 0) {
      console.log('Seeding course materials into Cloud SQL...');
      for (const m of INITIAL_MATERIALS) {
        await db.insert(courseMaterials).values({
          id: m.id,
          courseId: m.courseId,
          title: m.title,
          description: m.description,
          type: m.type,
          authorName: m.authorName,
          gradeSection: m.gradeSection || 'Primero A',
          fileSize: m.fileSize,
          pdfUrl: m.pdfUrl,
          pagesCount: m.pagesCount,
          videoUrl: m.videoUrl,
          videoDuration: m.videoDuration,
          imageUrl: m.imageUrl,
          examTimeLimitMinutes: m.examTimeLimitMinutes,
          totalPoints: m.totalPoints,
          examQuestions: m.examQuestions as any,
        }).onConflictDoNothing();
      }
    }

    // Check exam attempts
    const existingAttempts = await db.select().from(examAttempts);
    if (existingAttempts.length === 0) {
      console.log('Seeding exam attempts into Cloud SQL...');
      for (const a of INITIAL_ATTEMPTS) {
        await db.insert(examAttempts).values({
          id: a.id,
          examId: a.examId,
          courseId: a.courseId,
          studentName: a.studentName,
          studentDni: a.studentDni,
          gradeSection: a.gradeSection || 'Primero A',
          score: a.score,
          maxScore: a.maxScore,
          gradeLetter: a.gradeLetter,
          answers: a.answers as any,
        }).onConflictDoNothing();
      }
    }

    // Check educational resources
    const existingResources = await db.select().from(educationalResources);
    if (existingResources.length === 0) {
      console.log('Seeding educational resources into Cloud SQL...');
      for (const r of RESOURCES_DATA.slice(0, 10)) {
        await db.insert(educationalResources).values({
          id: r.id,
          title: r.title,
          description: r.description,
          level: r.level,
          grade: r.grade,
          area: r.area,
          format: r.format,
          language: r.language,
          pagesOrDuration: r.pagesOrDuration,
          downloadsCount: r.downloadsCount,
          coverImage: r.coverImage,
          tags: r.tags as any,
          publishedDate: r.publishedDate,
        }).onConflictDoNothing();
      }
    }

    console.log('Database initialization / seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
