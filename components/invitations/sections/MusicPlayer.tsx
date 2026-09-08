'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { InvitationTheme, Event } from '@/types/domain';
import { parseAudioSource } from '@/lib/music';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface MusicPlayerProps {
  theme: InvitationTheme;
  event: Event;
  data?: {
    musicUrl?: string;
    songTitle?: string;
  };
}

export function MusicPlayer({ theme, event, data }: MusicPlayerProps) {
  const rawAudioUrl = data?.musicUrl || event.music_url || (event.theme_config as any)?.music_url;
  const songTitle = data?.songTitle || (event.theme_config as any)?.music_title || 'Música de fondo';

  const parsedSource = React.useMemo(() => {
    return parseAudioSource(rawAudioUrl);
  }, [rawAudioUrl]);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasStartedOnce, setHasStartedOnce] = React.useState(false);
  const [userMuted, setUserMuted] = React.useState(false);

  // References
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = React.useRef<any>(null);
  const ytContainerId = React.useId().replace(/:/g, '_') + '_yt_player';
  const userInteractedRef = React.useRef<boolean>(false);

  // Preconnect to YouTube for faster asset resolution
  React.useEffect(() => {
    if (parsedSource.type === 'youtube') {
      const domains = [
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://i.ytimg.com',
      ];
      domains.forEach((href) => {
        if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = href;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    }
  }, [parsedSource.type]);

  // Unified Playback Starter
  const startPlayback = React.useCallback(() => {
    userInteractedRef.current = true;
    if (userMuted) return;

    if (parsedSource.type === 'youtube') {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
        } catch (err) {
          console.warn('YouTube start playback attempt:', err);
        }
      }
    } else if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStartedOnce(true);
        })
        .catch((err) => {
          console.warn('HTML5 Audio play attempt:', err);
        });
    }
  }, [parsedSource.type, userMuted]);

  // 1. YouTube Player Engine
  React.useEffect(() => {
    if (parsedSource.type !== 'youtube' || !parsedSource.youtubeId) return;

    let isMounted = true;
    let pollTimer: NodeJS.Timeout | null = null;

    function createPlayer() {
      if (!isMounted || !window.YT || !window.YT.Player) return;

      try {
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch {}
        }

        ytPlayerRef.current = new window.YT.Player(ytContainerId, {
          videoId: parsedSource.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            loop: 1,
            playlist: parsedSource.youtubeId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
          events: {
            onReady: (e: any) => {
              if (!isMounted) return;
              try {
                e.target.unMute();
                e.target.setVolume(100);
                e.target.playVideo();
                // If user already interacted or browser allows it, ensure unmuted
                if (userInteractedRef.current) {
                  e.target.playVideo();
                }
              } catch (err) {
                console.warn('YouTube autoplay onReady attempt:', err);
              }
            },
            onStateChange: (e: any) => {
              if (!isMounted) return;
              // 1: playing, 2: paused, 0: ended
              if (e.data === 1) {
                setIsPlaying(true);
                setHasStartedOnce(true);
              } else if (e.data === 2 || e.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (e: any) => {
              console.warn('YouTube player error:', e.data);
            },
          },
        });
      } catch (err) {
        console.error('Error initializing YouTube Player:', err);
      }
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Ensure API script is injected
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        if (isMounted) createPlayer();
      };

      // Interval fallback check
      pollTimer = setInterval(() => {
        if (window.YT && window.YT.Player && isMounted) {
          if (pollTimer) clearInterval(pollTimer);
          createPlayer();
        }
      }, 150);
    }

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    };
  }, [parsedSource.type, parsedSource.youtubeId, ytContainerId]);

  // 2. HTML5 Audio Engine (Direct & Google Drive Stream)
  React.useEffect(() => {
    if (parsedSource.type !== 'direct' && parsedSource.type !== 'drive') return;
    if (!parsedSource.resolvedUrl) return;

    const audio = new Audio(parsedSource.resolvedUrl);
    audio.loop = true;
    audio.volume = 1.0;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPlay = () => {
      setIsPlaying(true);
      setHasStartedOnce(true);
    };
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Attempt immediate start
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Expected browser autoplay policy restriction before gesture
      });
    }

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [parsedSource.type, parsedSource.resolvedUrl]);

  // 3. Audio Unlock Listeners - Persists until audio is confirmed playing
  React.useEffect(() => {
    if (isPlaying || userMuted || !parsedSource.isValid) return;

    const handleInteraction = () => {
      startPlayback();
    };

    // Custom event dispatched from InvitationWelcomeCover or elsewhere
    window.addEventListener('invitation:play', handleInteraction);

    // Global tactile events to unlock audio on first touch anywhere on screen
    const interactionEvents = ['click', 'touchstart', 'pointerdown'];
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, handleInteraction, { passive: true });
    });

    return () => {
      window.removeEventListener('invitation:play', handleInteraction);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, handleInteraction);
      });
    };
  }, [isPlaying, userMuted, parsedSource.isValid, startPlayback]);

  if (!parsedSource.isValid) return null;

  // 4. Toggle Play / Mute
  const togglePlay = () => {
    if (isPlaying) {
      // User requested Mute / Pause
      setUserMuted(true);
      if (parsedSource.type === 'youtube' && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {}
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // User requested Play / Unmute
      setUserMuted(false);
      userInteractedRef.current = true;
      if (parsedSource.type === 'youtube' && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
        } catch {}
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Invisible YouTube IFrame Container - Sized and styled to prevent mobile iframe throttling */}
      {parsedSource.type === 'youtube' && (
        <div
          id={ytContainerId}
          className="fixed bottom-0 right-0 w-[200px] h-[200px] pointer-events-none opacity-[0.01] overflow-hidden z-[-50]"
          aria-hidden="true"
        />
      )}

      {/* Floating Music Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Helper prompt if audio hasn't started yet due to browser autoplay restriction */}
        <AnimatePresence>
          {!isPlaying && !hasStartedOnce && !userMuted && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={togglePlay}
              className="cursor-pointer px-3 py-1.5 rounded-full text-[11px] font-medium shadow-xl border backdrop-blur-md flex items-center gap-1.5 animate-bounce transition-transform hover:scale-105"
              style={{
                backgroundColor: `${theme.palette.bg}F0`,
                borderColor: `${theme.palette.primary}60`,
                color: theme.palette.text,
              }}
            >
              <Music className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>Tocá para escuchar música</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Controller Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={togglePlay}
          className="group flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl backdrop-blur-xl border transition-all cursor-pointer select-none"
          style={{
            backgroundColor: `${theme.palette.bg}E6`,
            borderColor: `${theme.palette.primary}60`,
            color: theme.palette.text,
          }}
          aria-label={isPlaying ? 'Silenciar música de fondo' : 'Reproducir música de fondo'}
          title={isPlaying ? 'Silenciar música (Mute)' : 'Reproducir música'}
        >
          {/* Circular Icon with Pulse on Play */}
          <div
            className="p-2 rounded-full text-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: theme.palette.primary }}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-80" />
            )}
          </div>

          {/* Song Info & Label */}
          <div className="hidden sm:flex flex-col text-left pr-2 max-w-[150px]">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[var(--theme-primary)]">
              {isPlaying ? 'Música activa' : 'Silenciado'}
            </span>
            <span className="text-xs font-medium truncate" style={{ color: theme.palette.text }}>
              {songTitle}
            </span>
          </div>

          {/* Equalizer Wave Bars */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-end gap-0.5 h-3.5 pr-1 overflow-hidden"
              >
                {[0.3, 0.7, 0.5, 0.9, 0.4].map((delay, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ height: ['25%', '100%', '30%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8 + delay * 0.4,
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
    </>
  );
}
