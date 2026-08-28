'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { InvitationTheme } from '@/types/domain';

interface PhotoAlbumProps {
  theme: InvitationTheme;
  data?: {
    title?: string;
    photos?: { url: string; caption?: string }[];
  };
}

export function PhotoAlbum({ theme, data }: PhotoAlbumProps) {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const photos = data?.photos || [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', caption: 'Nuestros momentos' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', caption: 'Risas compartidas' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop', caption: 'Atardeceres' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop', caption: 'Inolvidable' },
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx > 0 ? selectedIdx - 1 : photos.length - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx < photos.length - 1 ? selectedIdx + 1 : 0);
  };

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto text-center" id="invitation-album">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-10"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            <Camera className="w-4 h-4" />
            <span>Galería de Recuerdos</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || 'Momentos Inolvidables'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md border"
              style={{ borderColor: `${theme.palette.primary}30` }}
            >
              <Image
                src={item.url}
                alt={item.caption || `Foto ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-white font-medium">{item.caption}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative max-w-4xl max-h-[80vh] w-full h-[60vh] sm:h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={photos[selectedIdx].url}
                alt="Foto ampliada"
                fill
                className="object-contain"
              />
              {photos[selectedIdx].caption && (
                <div className="absolute bottom-4 inset-x-0 text-center text-white/90 text-sm font-medium bg-black/40 py-2 rounded-full max-w-sm mx-auto backdrop-blur-sm">
                  {photos[selectedIdx].caption}
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
