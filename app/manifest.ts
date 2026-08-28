import { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_CONFIG.name} — Álbum en Vivo`,
    short_name: 'Álbum en Vivo',
    description: 'Subí tus fotos de la fiesta en tiempo real.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0B0B',
    theme_color: '#F59E0B',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
