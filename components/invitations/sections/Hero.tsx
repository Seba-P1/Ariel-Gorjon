'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Calendar, MapPin, Sparkles, Heart } from 'lucide-react';
import { InvitationTheme, Event, Guest } from '@/types/domain';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeroProps {
  theme: InvitationTheme;
  event: Event;
  guest?: Guest | null;
  data?: {
    customTitle?: string;
    customSubtitle?: string;
    videoUrl?: string;
  };
}

export function Hero({ theme, event, guest, data }: HeroProps) {
  const formattedDate = event.event_date
    ? format(new Date(event.event_date), "EEEE d 'de' MMMM, yyyy", { locale: es })
    : null;

  const scrollToContent = () => {
    const nextSection = document.getElementById('invitation-content');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full flex flex-col items-center justify-between p-6 text-center overflow-hidden">
      {/* Background Image / Overlay */}
      {event.cover_image_url ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${event.cover_image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${theme.palette.primary} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Top Ornament / Guest Personalized Badge */}
      <div className="relative z-10 pt-8">
        {guest ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg border border-white/20 bg-white/10"
          >
            <Sparkles className="w-4 h-4 text-[var(--theme-primary)]" />
            <span className="text-xs uppercase tracking-widest font-medium text-white">
              Invitación exclusiva para <strong className="underline underline-offset-4">{guest.full_name}</strong>
            </span>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center gap-2 opacity-60">
            <span className="h-[1px] w-8 bg-[var(--theme-primary)]" />
            <Heart className="w-4 h-4 text-[var(--theme-primary)]" />
            <span className="h-[1px] w-8 bg-[var(--theme-primary)]" />
          </div>
        )}
      </div>

      {/* Main Title & Couple / Honoree Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="relative z-10 max-w-3xl space-y-6 my-auto"
      >
        <p
          className="text-sm md:text-base uppercase tracking-[0.3em] font-medium"
          style={{ color: theme.palette.primary }}
        >
          {data?.customSubtitle || '¡Nos Casamos! / Nuestra Fiesta'}
        </p>

        <h1
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-tight drop-shadow-md"
          style={{
            fontFamily: theme.fonts.heading,
            color: event.cover_image_url ? '#FFFFFF' : theme.palette.text,
          }}
        >
          {data?.customTitle || event.title}
        </h1>

        {formattedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-lg font-light tracking-wide text-white/90 pt-2"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--theme-primary)]" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            {event.location_name && (
              <>
                <span className="hidden sm:inline opacity-40">•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--theme-primary)]" />
                  <span>{event.location_name}</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Down Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 pb-8"
      >
        <button
          onClick={scrollToContent}
          className="group flex flex-col items-center gap-2 text-xs uppercase tracking-widest transition-transform hover:scale-105 cursor-pointer text-white/80 hover:text-white"
        >
          <span>Ver Invitación</span>
          <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all animate-bounce">
            <ChevronDown className="w-4 h-4 text-[var(--theme-primary)]" />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
