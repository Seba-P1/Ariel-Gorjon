'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Hotel, Phone, MapPin, ExternalLink } from 'lucide-react';
import { InvitationTheme } from '@/types/domain';
import { Button } from '@/components/ui/button';

interface AccommodationProps {
  theme: InvitationTheme;
  data?: {
    title?: string;
    subtitle?: string;
    places?: {
      name: string;
      address: string;
      phone?: string;
      priceNote?: string;
      bookingUrl?: string;
    }[];
  };
}

export function Accommodation({ theme, data }: AccommodationProps) {
  const places = data?.places || [
    {
      name: 'Hotel Boutique Grand Plaza',
      address: 'Av. Libertador 4520, Palermo',
      phone: '+54 11 4777-1234',
      priceNote: 'Tarifa preferencial mencionando la fiesta',
      bookingUrl: 'https://booking.com',
    },
    {
      name: 'Suites & Spa del Parque',
      address: 'Calle Las Heras 2100, Recoleta',
      phone: '+54 11 4800-5678',
      priceNote: 'A 10 minutos del salón de eventos',
      bookingUrl: 'https://booking.com',
    },
  ];

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center" id="invitation-accommodation">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-6 sm:space-y-10"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            <Hotel className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Hospedaje Recomendado</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || 'Dónde Alojarse'}
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.subtitle || 'Opciones sugeridas para quienes viajan desde otras ciudades.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
          {places.map((place, idx) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-sm space-y-4 sm:space-y-5 flex flex-col justify-between"
              style={{
                backgroundColor: theme.palette.secondary,
                borderColor: `${theme.palette.primary}30`,
              }}
            >
              <div className="space-y-3">
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
                >
                  {place.name}
                </h3>
                <div className="space-y-2 text-sm opacity-85" style={{ color: theme.palette.text }}>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                    <span>{place.address}</span>
                  </div>
                  {place.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                      <span>{place.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {place.priceNote && (
                <div className="p-3 rounded-xl bg-white/50 dark:bg-black/30 text-xs font-medium border border-[var(--theme-primary)]/20" style={{ color: theme.palette.text }}>
                  💡 {place.priceNote}
                </div>
              )}

              {place.bookingUrl && (
                <a href={place.bookingUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold border-[var(--theme-primary)]/40 hover:bg-[var(--theme-primary)]/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[var(--theme-primary)]" />
                    Ver Disponibilidad & Reservar
                  </Button>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
