'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { InvitationTheme } from '@/types/domain';

interface GodparentsProps {
  theme: InvitationTheme;
  data?: {
    title?: string;
    subtitle?: string;
    people?: { name: string; role: string; photoUrl?: string }[];
  };
}

export function Godparents({ theme, data }: GodparentsProps) {
  const people = data?.people || [
    { name: 'María Elena Rossi', role: 'Madrina de Boda', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
    { name: 'Carlos Alberto Gorjón', role: 'Padrino de Boda', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
    { name: 'Lucía Fernández', role: 'Testigo de Honor', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop' },
    { name: 'Esteban Méndez', role: 'Testigo de Honor', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center" id="invitation-godparents">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-6 sm:space-y-10"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Personas Especiales</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || 'Padrinos y Cortejo'}
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.subtitle || 'Quienes nos acompañan de manera muy especial en este día tan importante.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {people.map((person, idx) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-sm flex flex-col items-center space-y-3 sm:space-y-4 text-center"
              style={{
                backgroundColor: theme.palette.secondary,
                borderColor: `${theme.palette.primary}30`,
              }}
            >
              <div
                className="relative w-24 h-24 rounded-full overflow-hidden border-2 shadow-md"
                style={{ borderColor: theme.palette.primary }}
              >
                {person.photoUrl ? (
                  <Image
                    src={person.photoUrl}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--theme-primary)]/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-[var(--theme-primary)]" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3
                  className="font-bold text-lg leading-snug"
                  style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
                >
                  {person.name}
                </h3>
                <span
                  className="text-xs uppercase tracking-wider font-semibold block text-[var(--theme-primary)]"
                >
                  {person.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
