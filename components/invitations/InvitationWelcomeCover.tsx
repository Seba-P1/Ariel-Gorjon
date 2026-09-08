'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, Music, Sparkles, Heart } from 'lucide-react';
import { InvitationTheme, Event, Guest } from '@/types/domain';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface InvitationWelcomeCoverProps {
  theme: InvitationTheme;
  event: Event;
  guest?: Guest | null;
  songTitle?: string;
  isOpen: boolean;
  onOpen: () => void;
}

export function InvitationWelcomeCover({
  theme,
  event,
  guest,
  songTitle,
  isOpen,
  onOpen,
}: InvitationWelcomeCoverProps) {
  const [isOpening, setIsOpening] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    if (!event.event_date) return null;
    try {
      return format(new Date(event.event_date), "EEEE d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return null;
    }
  }, [event.event_date]);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Dispatch synchronous user gesture event to unlock audio immediately
    try {
      window.dispatchEvent(new CustomEvent('invitation:play'));
    } catch (e) {
      console.warn('Audio gesture dispatch warning:', e);
    }

    // 2. Trigger opening transition
    onOpen();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="welcome-envelope-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none"
          style={{
            backgroundColor: theme.palette.bg,
            color: theme.palette.text,
            fontFamily: theme.fonts.body,
          }}
        >
          {/* Background Ambient Cover / Blur */}
          {event.cover_image_url ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${event.cover_image_url})` }}
            >
              <div
                className="absolute inset-0 backdrop-blur-xl"
                style={{
                  backgroundColor: `${theme.palette.bg}E6`, // 90% opacity
                }}
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${theme.palette.primary}30 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Decorative Corner Borders */}
          <div
            className="absolute inset-4 sm:inset-8 border rounded-3xl pointer-events-none opacity-25"
            style={{ borderColor: theme.palette.primary }}
          />

          {/* Content Card / Envelope Aesthetic */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-2xl border"
            style={{
              backgroundColor: `${theme.palette.bg}B3`, // 70% opacity
              borderColor: `${theme.palette.primary}40`,
            }}
          >
            {/* Top Monogram / Icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-6 border"
              style={{
                backgroundColor: `${theme.palette.primary}15`,
                borderColor: `${theme.palette.primary}50`,
                color: theme.palette.primary,
              }}
            >
              <Heart className="w-6 h-6 animate-pulse fill-current" />
            </div>

            {/* Personalized Guest Badge */}
            {guest?.full_name && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 border"
                style={{
                  backgroundColor: `${theme.palette.primary}1A`,
                  borderColor: `${theme.palette.primary}40`,
                  color: theme.palette.primary,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>Invitación especial para {guest.full_name}</span>
              </motion.div>
            )}

            {/* Event Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide mb-3 leading-tight"
              style={{
                fontFamily: theme.fonts.heading,
                color: theme.palette.text,
              }}
            >
              {event.title}
            </h1>

            {/* Event Date */}
            {formattedDate && (
              <p
                className="text-xs sm:text-sm uppercase tracking-widest font-light mb-8 opacity-80"
                style={{ color: theme.palette.text }}
              >
                {formattedDate}
              </p>
            )}

            {/* Main Interactive Button: "Abrir Invitación" */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="group relative flex items-center justify-center gap-3 w-full py-4 px-8 rounded-2xl shadow-xl text-sm sm:text-base font-semibold transition-all cursor-pointer overflow-hidden border"
              style={{
                backgroundColor: theme.palette.primary,
                borderColor: `${theme.palette.primary}80`,
                color: '#ffffff',
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              <MailOpen className="w-5 h-5 transition-transform group-hover:-rotate-6" />
              <span>Abrir Invitación</span>
            </motion.button>

            {/* Subtle Music Indication */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] opacity-70">
              <Music className="w-3 h-3 text-[var(--theme-primary)]" />
              <span>
                {songTitle ? `Música: ${songTitle}` : 'Incluye música de fondo'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
