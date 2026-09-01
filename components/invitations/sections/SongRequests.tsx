'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Music2, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { InvitationTheme, Event } from '@/types/domain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SongRequestsProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    title?: string;
    subtitle?: string;
  };
}

export function SongRequests({ theme, event, data }: SongRequestsProps) {
  const [songTitle, setSongTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [requester, setRequester] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!songTitle.trim()) {
      toast.error('Ingresá el título de la canción');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/song-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          song_title: songTitle.trim(),
          artist: artist.trim() || null,
          requester: requester.trim() || null,
        }),
      });

      if (!res.ok) {
        toast.error('No se pudo enviar la sugerencia');
        return;
      }

      setSent(true);
      toast.success('¡Canción enviada al DJ!');
      setSongTitle('');
      setArtist('');
    } catch {
      toast.error('Ocurrió un error al enviar');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-2xl mx-auto text-center" id="invitation-songs">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-sm space-y-5 sm:space-y-6"
        style={{
          backgroundColor: theme.palette.secondary,
          borderColor: `${theme.palette.primary}40`,
        }}
      >
        <div className="inline-flex p-3 sm:p-4 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] mb-1 sm:mb-2">
          <Music2 className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            DJ & Playlist
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || '¿Qué Tema No Puede Faltar?'}
          </h2>
          <p className="text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.subtitle || 'Ayudanos a armar la playlist perfecta para bailar toda la noche.'}
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ¡Gracias! La sumamos a la lista de temas para el DJ.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSent(false)}
              className="text-xs border-[var(--theme-primary)]/40"
            >
              Sugerir otra canción
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-80" style={{ color: theme.palette.text }}>
                  Nombre de la canción *
                </label>
                <Input
                  placeholder="Ej: Muchachos / Levitating"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium opacity-80" style={{ color: theme.palette.text }}>
                  Banda / Artista
                </label>
                <Input
                  placeholder="Ej: La Mosca / Dua Lipa"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium opacity-80" style={{ color: theme.palette.text }}>
                Tu nombre (opcional)
              </label>
              <Input
                placeholder="¿Quién la sugiere?"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold shadow-md transition-all py-5"
              style={{
                backgroundColor: theme.palette.primary,
                color: theme.palette.bg === '#0B0B0B' || theme.palette.bg === '#0B0F1A' ? '#000000' : '#FFFFFF',
              }}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Sugerir Tema
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
