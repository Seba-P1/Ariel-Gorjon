'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { InvitationTheme, Event } from '@/types/domain';
import { Button } from '@/components/ui/button';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface InstagramWallProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    hashtag?: string;
    handle?: string;
    title?: string;
    description?: string;
  };
}

export function InstagramWall({ theme, event, data }: InstagramWallProps) {
  const [copied, setCopied] = React.useState(false);
  const hashtag = data?.hashtag || event.hashtag || '#BodaArielYNovia';
  const handle = data?.handle || event.instagram_handle || '@ariel.eventos';

  const copyHashtag = () => {
    navigator.clipboard.writeText(hashtag);
    setCopied(true);
    toast.success('Hashtag copiado para Instagram');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center" id="invitation-instagram">
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
        <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md mb-2">
          <InstagramIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Redes Sociales
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || 'Compartí Tus Fotos en Instagram'}
          </h2>
          <p className="text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.description ||
              'Subí tus historias y fotos usando nuestro hashtag oficial para que no nos perdamos ningún recuerdo.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <div
            onClick={copyHashtag}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-black/50 border border-[var(--theme-primary)]/40 shadow-sm cursor-pointer transition-transform hover:scale-105"
          >
            <Hash className="w-5 h-5 text-[var(--theme-primary)]" />
            <span className="font-mono font-bold text-base sm:text-lg tracking-wide" style={{ color: theme.palette.text }}>
              {hashtag}
            </span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-2">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 opacity-70" />}
            </Button>
          </div>

          {handle && (
            <a
              href={`https://instagram.com/${handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm shadow-md transition-transform hover:scale-105"
            >
              <InstagramIcon className="w-4 h-4" />
              Etiquetanos {handle}
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
