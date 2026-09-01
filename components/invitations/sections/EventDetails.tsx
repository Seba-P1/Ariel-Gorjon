'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Church, GlassWater, PartyPopper } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventDetailsProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    ceremonyTitle?: string;
    ceremonyTime?: string;
    ceremonyAddress?: string;
    partyTitle?: string;
    partyTime?: string;
    partyAddress?: string;
  };
}

export function EventDetails({ theme, event, data }: EventDetailsProps) {
  const formattedDate = event.event_date
    ? format(new Date(event.event_date), "EEEE d 'de' MMMM, yyyy", { locale: es })
    : null;

  const timeString = event.event_date
    ? format(new Date(event.event_date), 'HH:mm') + ' hs'
    : '20:30 hs';

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto" id="invitation-details">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 sm:space-y-12"
      >
        <div className="space-y-2">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Información del Evento
          </p>
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            Dónde y Cuándo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
          {/* Ceremony / Civil Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-sm space-y-4 sm:space-y-6 flex flex-col justify-between"
            style={{
              backgroundColor: theme.palette.secondary,
              borderColor: `${theme.palette.primary}30`,
            }}
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                <Church className="w-6 h-6" />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
              >
                {data?.ceremonyTitle || 'Ceremonia'}
              </h3>
              <p className="text-sm opacity-80" style={{ color: theme.palette.text }}>
                Acompañanos en el momento más emotivo de la velada.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--theme-primary)]/20 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[var(--theme-primary)]" />
                <span className="capitalize font-medium" style={{ color: theme.palette.text }}>
                  {formattedDate || 'Fecha a confirmar'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[var(--theme-primary)]" />
                <span className="font-medium" style={{ color: theme.palette.text }}>
                  {data?.ceremonyTime || timeString}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <span className="opacity-90" style={{ color: theme.palette.text }}>
                  {data?.ceremonyAddress || event.location_address || event.location_name || 'Salón de Eventos'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Party / Reception Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-sm space-y-4 sm:space-y-6 flex flex-col justify-between"
            style={{
              backgroundColor: theme.palette.secondary,
              borderColor: `${theme.palette.primary}30`,
            }}
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
              >
                {data?.partyTitle || 'Fiesta y Brindis'}
              </h3>
              <p className="text-sm opacity-80" style={{ color: theme.palette.text }}>
                Cena, baile, barra de tragos y fiesta hasta que salga el sol.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--theme-primary)]/20 text-sm">
              <div className="flex items-center gap-3">
                <GlassWater className="w-4 h-4 text-[var(--theme-primary)]" />
                <span className="font-medium" style={{ color: theme.palette.text }}>
                  Recepción & Cena
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[var(--theme-primary)]" />
                <span className="font-medium" style={{ color: theme.palette.text }}>
                  {data?.partyTime || '22:00 hs en adelante'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                <span className="opacity-90" style={{ color: theme.palette.text }}>
                  {data?.partyAddress || event.location_name || event.location_address || 'Salón Principal'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
