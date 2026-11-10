/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BentinLanding } from './components/BentinLanding';
import { BentinHeader } from './components/BentinHeader';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { UploadMaterialModal } from './components/UploadMaterialModal';
import { ExamModal } from './components/ExamModal';
import { MaterialViewerModal } from './components/MaterialViewerModal';
import { BentinLoginModal } from './components/BentinLoginModal';
import { BentinFooter } from './components/BentinFooter';

import {
  BENTIN_COURSES,
  INITIAL_MATERIALS,
  INITIAL_ATTEMPTS,
  DEFAULT_TEACHER,
  DEFAULT_STUDENT,
  TEACHERS_LIST
} from './data/bentinData';
import { BentinCourse, CourseMaterial, ExamAttempt, UserProfile } from './types';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Global User State - starts as null so user sees the Presentation first!
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [courses, setCourses] = useState<BentinCourse[]>(BENTIN_COURSES);
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_MATERIALS);
  const [attempts, setAttempts] = useState<ExamAttempt[]>(INITIAL_ATTEMPTS);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [defaultUploadCourseId, setDefaultUploadCourseId] = useState<string | undefined>();
  const [examMaterial, setExamMaterial] = useState<{
    material: CourseMaterial;
    courseTitle: string;
  } | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<{
    material: CourseMaterial;
    courseTitle: string;
  } | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Login handler
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'docente') {
      const course = courses.find((c) => c.id === user.assignedCourseId);
      showToast(
        `¡Bienvenido, ${user.name}! Has ingresado en Modo Profesor para el curso de ${course?.title || user.specialty}.`
      );
    } else {
      showToast(`¡Bienvenido, ${user.name}! Has ingresado en Modo Alumno (${user.section || user.grade}).`);
    }
  };

  // Logout handler to return to presentation
  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Has cerrado sesión correctamente. Volviendo a la presentación del colegio.');
  };

  // Quick switch role
  const handleQuickSwitchUser = (role: 'docente' | 'alumno') => {
    if (role === 'docente') {
      setCurrentUser(DEFAULT_TEACHER);
      showToast('Cambiado a Modo Profesor (Docente de Matemática).');
    } else {
      setCurrentUser(DEFAULT_STUDENT);
      showToast('Cambiado a Modo Alumno (Estudiante de Primero A).');
    }
  };

  // Teacher uploads material
  const handleMaterialCreated = (newMaterial: CourseMaterial) => {
    setMaterials((prev) => [newMaterial, ...prev]);
    const course = courses.find((c) => c.id === newMaterial.courseId);
    showToast(
      `¡"${newMaterial.title}" publicado con éxito para la sección ${newMaterial.gradeSection || 'Primero A'} en ${course?.title || 'el curso'}!`
    );
  };

  // Teacher deletes material
  const handleDeleteMaterial = (materialId: string) => {
    const targetMat = materials.find((m) => m.id === materialId);
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    showToast(`El material "${targetMat?.title || 'recurso'}" ha sido eliminado del aula virtual.`);
  };

  // Student takes exam
  const handleTakeExam = (material: CourseMaterial, courseTitle: string) => {
    setExamMaterial({ material, courseTitle });
  };

  // Student submits exam
  const handleExamSubmitted = (attempt: ExamAttempt) => {
    setAttempts((prev) => [attempt, ...prev.filter((a) => a.examId !== attempt.examId)]);
    showToast(
      `¡Examen entregado! Calificación obtenida: ${attempt.score} / ${attempt.maxScore} (Nivel: ${attempt.gradeLetter})`
    );
  };

  // View PDF / Video / Photo
  const handleViewMaterial = (material: CourseMaterial, courseTitle: string) => {
    if (material.type === 'exam') {
      setExamMaterial({ material, courseTitle });
    } else {
      setViewingMaterial({ material, courseTitle });
    }
  };

  const handleDownloadMaterial = (material: CourseMaterial) => {
    showToast(`Descargando "${material.title}" (${material.fileSize || 'documento'})...`);
  };

  // 1. IF NO USER IS LOGGED IN: SHOW THE PRESENTATION FIRST!
  if (!currentUser) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed flex-1 font-medium">{toastMessage}</div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <BentinLanding onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  // 2. IF LOGGED IN: SHOW THE TEACHER OR STUDENT DASHBOARD!
  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-[#F8FAFC] text-slate-800 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed flex-1 font-medium">{toastMessage}</div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Logout & Switch Account */}
      <BentinHeader
        currentUser={currentUser}
        courses={courses}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenUpload={() => {
          setDefaultUploadCourseId(currentUser.assignedCourseId || undefined);
          setIsUploadOpen(true);
        }}
        onQuickSwitchUser={handleQuickSwitchUser}
        onLogout={handleLogout}
      />

      {/* Main View: Teacher or Student Dashboard */}
      <main className="flex-1">
        {currentUser.role === 'docente' ? (
          <TeacherDashboard
            currentUser={currentUser}
            courses={courses}
            materials={materials}
            attempts={attempts}
            onOpenUpload={(cId) => {
              setDefaultUploadCourseId(cId || currentUser.assignedCourseId || undefined);
              setIsUploadOpen(true);
            }}
            onViewMaterial={handleViewMaterial}
            onDeleteMaterial={handleDeleteMaterial}
          />
        ) : (
          <StudentDashboard
            currentUser={currentUser}
            courses={courses}
            materials={materials}
            attempts={attempts}
            onTakeExam={handleTakeExam}
            onViewMaterial={handleViewMaterial}
            onDownloadMaterial={handleDownloadMaterial}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <BentinFooter />

      {/* Authentication Modal with Directory of all Teachers and Students */}
      <BentinLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={currentUser.role === 'docente' ? 'docente' : 'alumno'}
      />

      {/* Upload Material Modal (Docente) */}
      <UploadMaterialModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        courses={courses}
        defaultCourseId={defaultUploadCourseId || currentUser.assignedCourseId}
        onMaterialCreated={handleMaterialCreated}
        authorName={currentUser.name}
      />

      {/* Exam Taker / Review Modal (Alumno & Docente) */}
      {examMaterial && (
        <ExamModal
          material={examMaterial.material}
          currentUser={currentUser}
          courseTitle={examMaterial.courseTitle}
          onClose={() => setExamMaterial(null)}
          onExamSubmitted={handleExamSubmitted}
          existingAttempt={attempts.find((a) => a.examId === examMaterial.material.id)}
        />
      )}

      {/* PDF, Video and Photo Viewer Modal */}
      {viewingMaterial && (
        <MaterialViewerModal
          material={viewingMaterial.material}
          courseTitle={viewingMaterial.courseTitle}
          onClose={() => setViewingMaterial(null)}
          onDownload={handleDownloadMaterial}
        />
      )}
    </div>
  );
}
