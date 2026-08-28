'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';

interface MusicPlayerProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    musicUrl?: string;
    songTitle?: string;
  };
}

export function MusicPlayer({ theme, event, data }: MusicPlayerProps) {
  const audioUrl = data?.musicUrl || event.music_url;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="group flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl backdrop-blur-xl border transition-all cursor-pointer"
        style={{
          backgroundColor: `${theme.palette.bg}E6`,
          borderColor: `${theme.palette.primary}60`,
          color: theme.palette.text,
        }}
        title={isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
      >
        <div
          className="p-2 rounded-full text-white shadow-md flex items-center justify-center"
          style={{ backgroundColor: theme.palette.primary }}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-80" />
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left pr-2">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--theme-primary)]">
            Música de fondo
          </span>
          <span className="text-xs font-medium truncate max-w-[120px]" style={{ color: theme.palette.text }}>
            {data?.songTitle || 'Tema especial'}
          </span>
        </div>

        {/* Animated Equalizer Wave Bars */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-end gap-0.5 h-3.5 pr-1"
            >
              {[0.4, 0.8, 0.5, 0.9, 0.3].map((delay, idx) => (
                <motion.span
                  key={idx}
                  animate={{ height: ['20%', '100%', '30%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8 + delay * 0.5,
                    ease: 'easeInOut',
                  }}
                  className="w-0.5 rounded-full bg-[var(--theme-primary)]"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
