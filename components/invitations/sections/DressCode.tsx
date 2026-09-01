'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';

interface DressCodeProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    type?: string;
    description?: string;
    colors?: { name: string; hex: string }[];
    notes?: string;
  };
}

export function DressCode({ theme, data }: DressCodeProps) {
  const codeType = data?.type || 'Elegante / Formal';
  const description =
    data?.description ||
    'Queremos que te vistas para brillar y disfrutar una noche inolvidable.';
  const swatches = data?.colors || [
    { name: 'Negro', hex: '#111111' },
    { name: 'Azul Noche', hex: '#1E293B' },
    { name: 'Dorado', hex: '#D4AF37' },
    { name: 'Nude / Beige', hex: '#E2D9CC' },
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center" id="invitation-dresscode">
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
          <Shirt className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Código de Vestimenta
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {codeType}
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.text }}>
            {description}
          </p>
        </div>

        {swatches.length > 0 && (
          <div className="pt-4 space-y-3">
            <p className="text-xs uppercase tracking-widest font-medium opacity-70" style={{ color: theme.palette.text }}>
              Colores sugeridos
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {swatches.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/40 shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <span className="text-[10px] font-medium opacity-75" style={{ color: theme.palette.text }}>
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.notes && (
          <div className="pt-4 border-t border-[var(--theme-primary)]/20 text-xs italic opacity-75 flex items-center justify-center gap-1.5" style={{ color: theme.palette.text }}>
            <Shirt className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>{data.notes}</span>
          </div>
        )}
      </motion.div>
    </section>
  );
}
