'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, ArrowRight, Smartphone } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/constants';

interface LiveAlbumQrProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    title?: string;
    description?: string;
  };
}

export function LiveAlbumQr({ theme, event, data }: LiveAlbumQrProps) {
  const uploadUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/album/${event.slug}`
    : `${APP_CONFIG.url}/album/${event.slug}`;

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center" id="invitation-live-album">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xl space-y-6 sm:space-y-8 relative overflow-hidden"
        style={{
          backgroundColor: theme.palette.secondary,
          borderColor: `${theme.palette.primary}50`,
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: theme.palette.primary }}
        />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] mb-1 sm:mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Novedad en la Fiesta</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || '📸 Álbum de Fotos en Vivo'}
          </h2>
          <p className="text-xs sm:text-sm opacity-85 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.description ||
              'Durante la fiesta, vas a poder escanear este código con tu celular para subir fotos y verlas proyectadas en pantalla gigante en tiempo real.'}
          </p>
        </div>

        {/* QR Code Card */}
        <div
          className="p-6 rounded-2xl bg-white shadow-xl max-w-[240px] mx-auto flex flex-col items-center justify-center space-y-3 border-2"
          style={{ borderColor: theme.palette.primary }}
        >
          <QRCodeSVG
            value={uploadUrl}
            size={180}
            level="H"
            includeMargin={false}
            fgColor="#111827"
          />
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-800 tracking-wider uppercase">
            <Smartphone className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
            <span>Escaneá con la cámara</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 relative z-10">
          <Link href={`/album/${event.slug}`}>
            <Button
              className="font-semibold shadow-lg transition-all hover:scale-105 py-6 px-8 text-sm"
              style={{
                backgroundColor: theme.palette.primary,
                color: theme.palette.bg === '#0B0B0B' || theme.palette.bg === '#0B0F1A' ? '#000000' : '#FFFFFF',
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Abrir Álbum para Subir Fotos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
