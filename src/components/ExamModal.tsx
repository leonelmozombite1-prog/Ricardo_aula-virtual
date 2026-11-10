import React, { useState, useEffect } from 'react';
import {
  X,
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CourseMaterial, ExamAttempt, UserProfile } from '../types';

interface ExamModalProps {
  material: CourseMaterial | null;
  currentUser: UserProfile;
  courseTitle: string;
  onClose: () => void;
  onExamSubmitted: (attempt: ExamAttempt) => void;
  existingAttempt?: ExamAttempt;
}

export const ExamModal: React.FC<ExamModalProps> = ({
  material,
  currentUser,
  courseTitle,
  onClose,
  onExamSubmitted,
  existingAttempt,
}) => {
  if (!material || material.type !== 'exam' || !material.examQuestions) return null;

  const questions = material.examQuestions;
  const initialTimeSeconds = (material.examTimeLimitMinutes || 20) * 60;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    existingAttempt ? existingAttempt.answers : {}
  );
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeSeconds);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!existingAttempt);
  const [currentScore, setCurrentScore] = useState<number>(existingAttempt?.score || 0);
  const [maxScore, setMaxScore] = useState<number>(existingAttempt?.maxScore || 20);
  const [gradeLetter, setGradeLetter] = useState<'AD' | 'A' | 'B' | 'C'>(
    existingAttempt?.gradeLetter || 'A'
  );

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, selectedAnswers]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    let totalScore = 0;
    let totalMax = 0;

    questions.forEach((q) => {
      totalMax += q.points;
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        totalScore += q.points;
      }
    });

    // Determine official achievement letter grade (AD, A, B, C)
    const percentage = totalMax > 0 ? (totalScore / totalMax) * 20 : 0;
    let letter: 'AD' | 'A' | 'B' | 'C' = 'C';
    if (percentage >= 18) letter = 'AD';
    else if (percentage >= 14) letter = 'A';
    else if (percentage >= 11) letter = 'B';
    else letter = 'C';

    setCurrentScore(totalScore);
    setMaxScore(totalMax);
    setGradeLetter(letter);
    setIsSubmitted(true);

    const attempt: ExamAttempt = {
      id: 'att_' + Date.now(),
      examId: material.id,
      courseId: material.courseId,
      studentName: currentUser.name,
      studentDni: currentUser.dni,
      submittedAt: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      score: totalScore,
      maxScore: totalMax,
      gradeLetter: letter,
      answers: selectedAnswers,
    };

    onExamSubmitted(attempt);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#B91C1C] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              <span>{courseTitle}</span>
              <span>·</span>
              <span>I.E. Emblemática Ricardo Bentín</span>
            </div>
            <h3 className="text-lg font-black mt-0.5">{material.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Cerrar examen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar with Timer and Progress */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Alumno:</span>
            <span className="text-slate-900 font-bold">{currentUser.name}</span>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted ? (
              <>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {answeredCount} de {questions.length} respondidas
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-2.5 py-1 rounded-md font-mono font-bold text-red-600 shadow-2xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1 text-xs">
                  <Award className="w-4 h-4" />
                  Calificación: {currentScore} / {maxScore} (Nota: {gradeLetter})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Exam Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-extrabold text-emerald-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>¡Evaluación Finalizada con Éxito!</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Tu puntaje ha sido registrado en el registro auxiliar del docente. Puedes revisar las respuestas correctas a continuación.
                </p>
              </div>

              <div className="text-center bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-xs shrink-0">
                <span className="text-2xl font-black text-[#1E3A8A] block font-mono">
                  {currentScore}
                  <span className="text-xs text-slate-400">/{maxScore}</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Nivel: {gradeLetter}
                </span>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : 'bg-rose-50/40 border-rose-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Pregunta {qIdx + 1} ({q.points} pts)
                    </span>
                    {isSubmitted && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? '✓ Correcto (+ ' + q.points + ')' : '✗ Incorrecto (0 pts)'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-snug">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isThisCorrectAnswer = q.correctOptionIndex === optIdx;

                      let optClasses = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                      if (isSubmitted) {
                        if (isThisCorrectAnswer) {
                          optClasses = 'border-emerald-500 bg-emerald-100/70 text-emerald-950 font-bold';
                        } else if (isOptionSelected && !isThisCorrectAnswer) {
                          optClasses = 'border-rose-400 bg-rose-100/70 text-rose-950 font-semibold line-through';
                        }
                      } else if (isOptionSelected) {
                        optClasses = 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A] font-bold shadow-2xs';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3 rounded-lg border flex items-center gap-3 text-xs sm:text-sm cursor-pointer transition-all ${optClasses}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isOptionSelected
                                ? 'bg-[#1E3A8A] text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {isSubmitted && isThisCorrectAnswer && (
                            <span className="text-xs text-emerald-700 font-bold shrink-0">
                              (Respuesta correcta)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            {isSubmitted ? 'Cerrar y Volver al Aula' : 'Guardar y Salir'}
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitExam}
              disabled={answeredCount === 0}
              className="px-6 py-2.5 bg-[#B91C1C] hover:bg-red-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-lg transition-transform active:scale-95 shadow-xs flex items-center gap-2"
            >
              <span>Entregar Examen al Profesor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-xs"
            >
              Finalizar Revisión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
