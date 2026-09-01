'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { InvitationTheme } from '@/types/domain';
import { Button } from '@/components/ui/button';

interface TriviaProps {
  theme: InvitationTheme;
  data?: {
    title?: string;
    subtitle?: string;
    questions?: {
      question: string;
      options: string[];
      correctIndex: number;
    }[];
  };
}

export function Trivia({ theme, data }: TriviaProps) {
  const defaultQuestions = [
    {
      question: '¿Dónde fue la primera cita?',
      options: ['En un bar de Palermo', 'En una cafetería en San Telmo', 'En un concierto de rock', 'En la playa'],
      correctIndex: 1,
    },
    {
      question: '¿Quién dio el primer paso?',
      options: ['Ella', 'Él', 'Fue mutuo al mismo tiempo', 'Un amigo los presentó'],
      correctIndex: 0,
    },
    {
      question: '¿A qué destino sueñan viajar de Luna de Miel?',
      options: ['Japón', 'Italia y Grecia', 'Caribe', 'Nueva York'],
      correctIndex: 1,
    },
  ];

  const questions = data?.questions || defaultQuestions;
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const handleSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (index === questions[currentIdx].correctIndex) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-2xl mx-auto text-center" id="invitation-trivia">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-sm space-y-5 sm:space-y-6"
        style={{
          backgroundColor: theme.palette.secondary,
          borderColor: `${theme.palette.primary}40`,
        }}
      >
        <div className="inline-flex p-3 sm:p-4 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] mb-1 sm:mb-2">
          <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Juego Interactivo
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || '¿Cuánto Sabés de Nosotros?'}
          </h2>
          <p className="text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.subtitle || 'Respondé estas preguntas y descubrí si sos un experto en nuestra historia.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-2xl bg-white/70 dark:bg-black/50 border border-[var(--theme-primary)]/30 space-y-4"
            >
              <Award className="w-12 h-12 text-[var(--theme-primary)] mx-auto" />
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
              >
                Puntaje Final: {score} de {questions.length}
              </h3>
              <p className="text-sm opacity-85" style={{ color: theme.palette.text }}>
                {score === questions.length
                  ? '🏆 ¡Excelente! Nos conocés a la perfección.'
                  : score >= Math.ceil(questions.length / 2)
                  ? '👏 ¡Muy buen intento! Estás listo para festejar.'
                  : '😊 ¡Vas a tener que charlar más con nosotros en la fiesta!'}
              </p>
              <Button
                onClick={handleRestart}
                variant="outline"
                size="sm"
                className="border-[var(--theme-primary)]/40 hover:bg-[var(--theme-primary)]/10"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Jugar de nuevo
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-left"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--theme-primary)]">
                <span>Pregunta {currentIdx + 1} de {questions.length}</span>
                <span>Aciertos: {score}</span>
              </div>

              <h3
                className="text-lg sm:text-xl font-bold"
                style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
              >
                {questions[currentIdx].question}
              </h3>

              <div className="space-y-2.5">
                {questions[currentIdx].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === questions[currentIdx].correctIndex;
                  const showResult = selectedAnswer !== null;

                  let optionBg = 'bg-white/60 dark:bg-black/40 hover:bg-white/90';
                  let optionBorder = 'border-[var(--theme-primary)]/30';

                  if (showResult) {
                    if (isCorrect) {
                      optionBg = 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300';
                    } else if (isSelected) {
                      optionBg = 'bg-red-500/20 border-red-500 text-red-800 dark:text-red-300';
                    }
                  }

                  return (
                    <button
                      key={option}
                      disabled={showResult}
                      onClick={() => handleSelect(idx)}
                      className={`w-full p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${optionBg} ${optionBorder}`}
                      style={{ color: !showResult ? theme.palette.text : undefined }}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
