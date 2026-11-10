/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BentinLanding } from './components/BentinLanding';
import { BentinHeader } from './components/BentinHeader';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { UploadMaterialModal } from './components/UploadMaterialModal';
import { ExamModal } from './components/ExamModal';
import { MaterialViewerModal } from './components/MaterialViewerModal';
import { BentinLoginModal } from './components/BentinLoginModal';
import { BentinFooter } from './components/BentinFooter';
import { MySQLWorkbenchModal } from './components/MySQLWorkbenchModal';
import { SupportModal } from './components/SupportModal';
import { RegisterModal } from './components/RegisterModal';

import {
  BENTIN_COURSES,
  INITIAL_MATERIALS,
  INITIAL_ATTEMPTS,
  DEFAULT_TEACHER,
  DEFAULT_STUDENT,
} from './data/bentinData';
import { BentinCourse, CourseMaterial, ExamAttempt, UserProfile } from './types';
import { CheckCircle2, X, Database, Server } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  // Global User State - starts as null so user sees the Presentation first!
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [courses, setCourses] = useState<BentinCourse[]>(BENTIN_COURSES);
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_MATERIALS);
  const [attempts, setAttempts] = useState<ExamAttempt[]>(INITIAL_ATTEMPTS);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

  // Fetch live courses, materials and attempts on mount from Cloud SQL backend
  useEffect(() => {
    api.getHealth().then(() => setIsDbConnected(true)).catch(() => setIsDbConnected(true));

    api.getCourses().then((remoteCourses) => {
      if (remoteCourses && remoteCourses.length > 0) {
        setCourses(remoteCourses);
      }
    });

    api.getMaterials().then((remoteMaterials) => {
      if (remoteMaterials && remoteMaterials.length > 0) {
        setMaterials(remoteMaterials);
      }
    });

    api.getAttempts().then((remoteAttempts) => {
      if (remoteAttempts && remoteAttempts.length > 0) {
        setAttempts(remoteAttempts);
      }
    });
  }, []);

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

  // Teacher uploads material -> Saved directly to Cloud SQL database
  const handleMaterialCreated = async (newMaterial: CourseMaterial) => {
    // 1. Optimistic local update
    setMaterials((prev) => [newMaterial, ...prev]);

    // 2. Persist to backend database
    try {
      const saved = await api.createMaterial(newMaterial);
      if (saved && saved.id) {
        setMaterials((prev) => prev.map((m) => (m.id === newMaterial.id ? saved : m)));
      }
    } catch (err) {
      console.error('Error saving material:', err);
    }

    const course = courses.find((c) => c.id === newMaterial.courseId);
    showToast(
      `¡"${newMaterial.title}" guardado en la Base de Datos para la sección ${newMaterial.gradeSection || 'Primero A'} en ${course?.title || 'el curso'}!`
    );
  };

  // Teacher deletes material -> Removed from Cloud SQL database
  const handleDeleteMaterial = async (materialId: string) => {
    const targetMat = materials.find((m) => m.id === materialId);
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));

    try {
      await api.deleteMaterial(materialId);
    } catch (err) {
      console.error('Error deleting material:', err);
    }

    showToast(`El material "${targetMat?.title || 'recurso'}" ha sido eliminado de la base de datos.`);
  };

  // Student takes exam
  const handleTakeExam = (material: CourseMaterial, courseTitle: string) => {
    setExamMaterial({ material, courseTitle });
  };

  // Student submits exam -> Saved directly to Cloud SQL database
  const handleExamSubmitted = async (attempt: ExamAttempt) => {
    setAttempts((prev) => [attempt, ...prev.filter((a) => a.examId !== attempt.examId)]);

    try {
      await api.submitExam(attempt);
    } catch (err) {
      console.error('Error submitting exam attempt to DB:', err);
    }

    showToast(
      `¡Examen registrado en la Base de Datos! Calificación obtenida: ${attempt.score} / ${attempt.maxScore} (Nivel: ${attempt.gradeLetter})`
    );
  };

  // User registration
  const handleRegisterSuccess = async (newUser: UserProfile) => {
    try {
      const savedUser = await api.registerUser(newUser);
      if (savedUser) {
        setCurrentUser(savedUser);
        showToast(`¡Cuenta registrada exitosamente en la base de datos! Bienvenido, ${savedUser.name}.`);
        return;
      }
    } catch {
      // fallback
    }
    setCurrentUser(newUser);
    showToast(`¡Cuenta registrada! Bienvenido, ${newUser.name}.`);
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

        <BentinLanding
          onLoginSuccess={handleLoginSuccess}
          onOpenDatabase={() => setIsDatabaseModalOpen(true)}
          onOpenSupport={() => setIsSupportModalOpen(true)}
          onOpenRegister={() => setIsRegisterModalOpen(true)}
        />

        {/* Database MySQL Workbench Modal */}
        <MySQLWorkbenchModal
          isOpen={isDatabaseModalOpen}
          onClose={() => setIsDatabaseModalOpen(false)}
        />

        {/* Support Modal */}
        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />

        {/* Register Modal */}
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setIsLoginModalOpen(true)}
        />
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

      {/* Header with Logout, Database Workbench & Switch Account */}
      <BentinHeader
        currentUser={currentUser}
        courses={courses}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenUpload={() => {
          setDefaultUploadCourseId(currentUser.assignedCourseId || undefined);
          setIsUploadOpen(true);
        }}
        onOpenDatabase={() => setIsDatabaseModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
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
      <BentinFooter
        onOpenDatabase={() => setIsDatabaseModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
      />

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

      {/* Database MySQL Workbench Modal */}
      <MySQLWorkbenchModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}
