'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    customAddress?: string;
    mapQuery?: string;
    instructions?: string;
  };
}

export function LocationMap({ theme, event, data }: LocationMapProps) {
  const address = data?.customAddress || event.location_address || event.location_name || 'Buenos Aires, Argentina';
  const query = encodeURIComponent(data?.mapQuery || address);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const wazeUrl = `https://waze.com/ul?q=${query}`;

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto text-center" id="invitation-location">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Ubicación
          </p>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {event.location_name || 'Cómo Llegar'}
          </h2>
          <p className="text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.text }}>
            {address}
          </p>
        </div>

        {/* Map Container */}
        <div
          className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border relative"
          style={{ borderColor: `${theme.palette.primary}40` }}
        >
          <iframe
            title="Ubicación del evento"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </div>

        {data?.instructions && (
          <p className="text-xs sm:text-sm italic opacity-75 max-w-lg mx-auto" style={{ color: theme.palette.text }}>
            💡 {data.instructions}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button
              className="font-medium shadow-md transition-all hover:scale-105"
              style={{
                backgroundColor: theme.palette.primary,
                color: theme.palette.bg === '#FFFFFF' || theme.palette.bg === '#FFFDF8' ? '#FFFFFF' : '#000000',
              }}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Abrir en Google Maps
            </Button>
          </a>

          <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="font-medium border transition-all hover:scale-105"
              style={{
                borderColor: theme.palette.primary,
                color: theme.palette.text,
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2 text-[var(--theme-primary)]" />
              Abrir en Waze
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
