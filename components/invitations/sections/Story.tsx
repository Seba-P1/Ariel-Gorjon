'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { InvitationTheme } from '@/types/domain';

interface StoryProps {
  theme: InvitationTheme;
  data?: {
    title?: string;
    subtitle?: string;
    milestones?: { year: string; title: string; description: string }[];
  };
}

export function Story({ theme, data }: StoryProps) {
  const milestones = data?.milestones || [
    {
      year: '2019',
      title: 'El primer café',
      description: 'Una charla de 20 minutos que se convirtió en una tarde entera de risas y miradas.',
    },
    {
      year: '2021',
      title: 'Nuestro primer viaje',
      description: 'Descubrimos que no solo éramos novios, sino los mejores compañeros de aventuras.',
    },
    {
      year: '2024',
      title: 'El gran "¡Sí, quiero!"',
      description: 'Bajo el atardecer y frente al mar, decidimos caminar juntos para siempre.',
    },
    {
      year: '2026',
      title: 'Nuestra Fiesta',
      description: 'El día en que celebramos nuestro amor rodeados de las personas que más queremos.',
    },
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto" id="invitation-story">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 sm:space-y-12"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{data?.subtitle || 'Nuestra Historia'}</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || 'El Camino Hacia el Gran Día'}
          </h2>
        </div>

        <div className="relative border-l-2 mx-auto max-w-xl text-left pl-5 sm:pl-6 space-y-8 sm:space-y-10 ml-4 sm:mx-auto" style={{ borderColor: `${theme.palette.primary}40` }}>
          {milestones.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative space-y-2"
            >
              {/* Dot Icon */}
              <div
                className="absolute -left-[33px] top-1 p-1.5 rounded-full border shadow-sm"
                style={{
                  backgroundColor: theme.palette.bg,
                  borderColor: theme.palette.primary,
                }}
              >
                <Heart className="w-3.5 h-3.5 text-[var(--theme-primary)] fill-current" />
              </div>

              <span
                className="text-xs uppercase tracking-widest font-bold px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${theme.palette.primary}20`,
                  color: theme.palette.primary,
                }}
              >
                {item.year}
              </span>
              <h3
                className="text-xl font-bold pt-1"
                style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
              >
                {item.title}
              </h3>
              <p className="text-sm opacity-80 leading-relaxed" style={{ color: theme.palette.text }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
