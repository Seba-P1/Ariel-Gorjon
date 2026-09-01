'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';

interface CountdownProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    title?: string;
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function Countdown({ theme, event, data }: CountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(null);

  React.useEffect(() => {
    if (!event.event_date) return;

    const target = new Date(event.event_date).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [event.event_date]);

  if (!event.event_date || !timeLeft) return null;

  return (
    <section className="py-10 sm:py-16 px-3.5 sm:px-6 max-w-4xl mx-auto text-center" id="invitation-countdown">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-[var(--theme-primary)] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{data?.title || 'Faltan muy pocos días'}</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {timeLeft.isPast ? '¡El gran día llegó!' : 'Cuenta Regresiva'}
          </h2>
        </div>

        {timeLeft.isPast ? (
          <div className="p-5 sm:p-6 rounded-2xl border border-[var(--theme-primary)]/30 bg-[var(--theme-secondary)]/30 backdrop-blur-sm max-w-md mx-auto">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[var(--theme-primary)] mb-2 fill-current" />
            <p className="font-semibold text-base sm:text-lg" style={{ color: theme.palette.text }}>
              ¡Estamos celebrando juntos este momento único!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl mx-auto">
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Hs', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Seg', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center p-2.5 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border shadow-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: theme.palette.secondary,
                  borderColor: `${theme.palette.primary}40`,
                }}
              >
                <span
                  className="text-xl sm:text-5xl font-bold tracking-tight font-mono"
                  style={{ color: theme.palette.primary }}
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span
                  className="text-[9px] sm:text-xs uppercase tracking-widest mt-0.5 sm:mt-1 font-medium opacity-80"
                  style={{ color: theme.palette.text }}
                >
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
