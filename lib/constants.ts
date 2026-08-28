export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Ariel Producciones",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description: "Plataforma de servicios para eventos, tarjetas virtuales y álbumes en vivo.",
  author: "Ariel Gorjón",
} as const;

export const STORAGE_BUCKETS = {
  EVENT_PHOTOS: "event-photos",
  EVENT_PHOTOS_DISPLAY: "event-photos-display",
  EVENT_COVERS: "event-covers",
  TEMPLATES_ASSETS: "templates-assets",
  EVENT_MUSIC: "event-music",
} as const;

export const LIMITS = {
  MAX_PHOTO_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_COVER_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_MUSIC_SIZE_BYTES: 15 * 1024 * 1024, // 15MB
  UPLOAD_RATE_LIMIT_PER_HOUR: Number(process.env.UPLOAD_RATE_LIMIT_PER_HOUR) || 20,
  RSVP_RATE_LIMIT_PER_HOUR: Number(process.env.RSVP_RATE_LIMIT_PER_HOUR) || 5,
  SLIDESHOW_MIN_DURATION_MS: 1500,
  SLIDESHOW_MAX_DURATION_MS: 15000,
  SLIDESHOW_DEFAULT_DURATION_MS: 3000,
} as const;

export const EVENT_TYPES = [
  { value: "boda", label: "Boda / Casamiento" },
  { value: "cumple15", label: "15 Años" },
  { value: "cumpleanos", label: "Cumpleaños" },
  { value: "bautismo", label: "Bautismo" },
  { value: "comunion", label: "Comunión" },
  { value: "corporativo", label: "Corporativo" },
  { value: "otro", label: "Otro" },
] as const;

export const TEMPLATE_FAMILIES = [
  { value: "elegante-clasica", label: "Elegante Clásica" },
  { value: "moderna-minimal", label: "Moderna Minimal" },
  { value: "floral-romantica", label: "Floral Romántica" },
  { value: "glamour-dorada", label: "Glamour Dorada" },
  { value: "neon-fiesta", label: "Neón Fiesta" },
  { value: "rustica-boho", label: "Rústica Boho" },
] as const;
