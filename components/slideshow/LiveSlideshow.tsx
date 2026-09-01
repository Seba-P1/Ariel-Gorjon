'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database';
import { APP_CONFIG } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Maximize,
  Minimize,
  Play,
  Pause,
  Settings,
  Camera,
  X,
  Smartphone,
} from 'lucide-react';

interface LiveSlideshowProps {
  event: Tables<'events'>;
  initialPhotos: Tables<'photos'>[];
}

export function LiveSlideshow({ event, initialPhotos }: LiveSlideshowProps) {
  const [photos, setPhotos] = React.useState<Tables<'photos'>[]>(initialPhotos);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [intervalSec, setIntervalSec] = React.useState(6);
  const [showQr, setShowQr] = React.useState(true);
  const [animationType, setAnimationType] = React.useState<'fade' | 'kenburns'>('kenburns');

  // Controls UI auto-hide
  const [showControls, setShowControls] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // New photo high-impact alert
  const [newPhotoAlert, setNewPhotoAlert] = React.useState<Tables<'photos'> | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const albumUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/album/${event.slug}`
    : `${APP_CONFIG.url}/album/${event.slug}`;

  // Hide cursor & controls on idle
  React.useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!showSettings) {
          setShowControls(false);
        }
      }, 4000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [showSettings]);

  // Real-time subscription for live photos
  React.useEffect(() => {
    const channel = supabase
      .channel(`slideshow-photos-${event.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPhoto = payload.new as Tables<'photos'>;
            if (newPhoto.status === 'approved') {
              setPhotos((prev) => [newPhoto, ...prev]);
              // Trigger 8-second alert
              setNewPhotoAlert(newPhoto);
              setTimeout(() => {
                setNewPhotoAlert((current) => (current?.id === newPhoto.id ? null : current));
              }, 8000);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Tables<'photos'>;
            if (updated.status === 'approved') {
              setPhotos((prev) => {
                const exists = prev.some((p) => p.id === updated.id);
                return exists
                  ? prev.map((p) => (p.id === updated.id ? updated : p))
                  : [updated, ...prev];
              });
            } else {
              setPhotos((prev) => prev.filter((p) => p.id !== updated.id));
            }
          } else if (payload.eventType === 'DELETE') {
            setPhotos((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id, supabase]);

  // Slideshow interval timer
  React.useEffect(() => {
    if (!isPlaying || photos.length <= 1 || newPhotoAlert !== null) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, intervalSec * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, photos.length, intervalSec, newPhotoAlert]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-black overflow-hidden select-none cursor-default font-sans"
    >
      {/* Empty State */}
      {photos.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="p-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Camera className="w-16 h-16 animate-pulse" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl sm:text-5xl font-bold text-neutral-100">{event.title}</h1>
            <p className="text-base text-neutral-400">
              Escaneá el código con tu celular para subir las primeras fotos y verlas acá en vivo.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white shadow-2xl flex flex-col items-center space-y-3">
            <QRCodeSVG value={albumUrl} size={220} level="H" fgColor="#0F172A" />
            <span className="text-xs font-bold text-neutral-800 tracking-wider uppercase">
              Escaneá para subir fotos
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Ambient Blurred Background */}
          {currentPhoto && (
            <div className="absolute inset-0 overflow-hidden opacity-40 blur-3xl scale-125 transition-all duration-1000 pointer-events-none">
              <img
                src={currentPhoto.storage_path}
                alt="Background glow"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Main Photo Slideshow Stage */}
          <AnimatePresence mode="wait">
            {currentPhoto && (
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0, scale: animationType === 'kenburns' ? 1.08 : 1 }}
                animate={{ opacity: 1, scale: animationType === 'kenburns' ? 1 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center p-4 sm:p-12 z-10"
              >
                <div className="relative max-w-full max-h-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center bg-black/40">
                  <img
                    src={currentPhoto.storage_path}
                    alt={currentPhoto.caption || 'Foto del evento'}
                    className="w-full h-full object-contain"
                    loading="eager"
                  />

                  {/* Caption & Uploader Badge */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 sm:p-8 flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm backdrop-blur-md">
                          📸 {currentPhoto.uploader_name || 'Invitado'}
                        </span>
                      </div>
                      {currentPhoto.caption && (
                        <p className="text-sm sm:text-lg text-neutral-100 font-medium max-w-2xl text-shadow">
                          "{currentPhoto.caption}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Photo High-Impact Popup Alert */}
          <AnimatePresence>
            {newPhotoAlert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: 'spring', damping: 20 }}
                className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
              >
                <div className="max-w-xl w-full bg-neutral-900 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-neutral-950 font-black text-xs sm:text-sm uppercase tracking-widest animate-bounce">
                    <Camera className="w-4 h-4" />
                    ¡Nueva Foto en Vivo!
                  </div>

                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-black/40">
                    <img
                      src={newPhotoAlert.storage_path}
                      alt="Nueva foto"
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-100">
                      Subida por {newPhotoAlert.uploader_name || 'un invitado'}
                    </h3>
                    {newPhotoAlert.caption && (
                      <p className="text-sm sm:text-base text-amber-300 italic">
                        "{newPhotoAlert.caption}"
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* QR Code Overlay */}
          {showQr && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 right-6 z-30 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3.5 max-w-xs"
            >
              <div className="p-2 rounded-xl bg-white shrink-0">
                <QRCodeSVG value={albumUrl} size={84} level="M" fgColor="#0F172A" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Subí tu foto</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-tight">
                  Escaneá con tu celular para verla en pantalla.
                </p>
              </div>
            </motion.div>
          )}

          {/* Event Watermark Top Left */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-neutral-200">
              <span className="font-bold text-sm sm:text-base">{event.title}</span>
              <span className="text-xs text-neutral-400 ml-2 font-mono">
                {currentIndex + 1}/{photos.length}
              </span>
            </div>
          </div>

          {/* Controls Bar (Auto-hiding on idle) */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-6 right-6 z-30 flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/60 backdrop-blur-md border-white/10 hover:bg-black/80 text-white rounded-xl h-10 w-10 p-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="bg-black/60 backdrop-blur-md border-white/10 hover:bg-black/80 text-white rounded-xl h-10 w-10 p-0"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-black/60 backdrop-blur-md border-white/10 hover:bg-black/80 text-white rounded-xl h-10 w-10 p-0"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Drawer */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute top-20 right-6 z-40 w-80 bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6 text-neutral-100 text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">Configuración de Pantalla</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                    className="h-7 w-7 p-0 text-neutral-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Interval Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Tiempo por foto</span>
                      <span className="font-bold text-amber-400">{intervalSec}s</span>
                    </div>
                    <Slider
                      value={[intervalSec]}
                      min={3}
                      max={15}
                      step={1}
                      onValueChange={(val: any) => {
                        const num = Array.isArray(val) ? val[0] : val;
                        if (typeof num === 'number') setIntervalSec(num);
                      }}
                    />
                  </div>

                  {/* QR Toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-neutral-400">Mostrar Código QR</span>
                    <Switch checked={showQr} onCheckedChange={setShowQr} />
                  </div>

                  {/* Animation Mode */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-neutral-400">Efecto Visual</span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={animationType === 'kenburns' ? 'default' : 'outline'}
                        onClick={() => setAnimationType('kenburns')}
                        className={`text-xs ${
                          animationType === 'kenburns'
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'border-neutral-800 text-neutral-400'
                        }`}
                      >
                        Ken Burns
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={animationType === 'fade' ? 'default' : 'outline'}
                        onClick={() => setAnimationType('fade')}
                        className={`text-xs ${
                          animationType === 'fade'
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'border-neutral-800 text-neutral-400'
                        }`}
                      >
                        Desvanecer
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
