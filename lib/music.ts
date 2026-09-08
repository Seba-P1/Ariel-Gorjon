/**
 * Audio source detection, extraction, and URL resolver.
 * Supports:
 * 1. YouTube links (watch, share, embed, music.youtube, shorts) -> YouTube Video ID.
 * 2. Google Drive sharing links -> Direct streaming via proxy or Google CDN.
 * 3. Direct audio files (MP3, WAV, M4A, Supabase storage bucket URLs).
 */

export type AudioSourceType = 'youtube' | 'drive' | 'direct' | 'none';

export interface ParsedAudioSource {
  type: AudioSourceType;
  originalUrl: string;
  resolvedUrl: string;
  youtubeId?: string;
  driveId?: string;
  isValid: boolean;
}

/**
 * Extracts a YouTube video ID from various URL formats or raw IDs.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If it's already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex covering watch, youtu.be, embed, shorts, music.youtube
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(ytRegex);
  return match ? match[1] : null;
}

/**
 * Extracts a Google Drive file ID from sharing links or download URLs.
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern: drive.google.com/file/d/{ID}/view or id={ID}
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=download&)?id=))([a-zA-Z0-9_-]{20,})/i;
  const match = trimmed.match(driveRegex);
  if (match) return match[1];

  // Also match docs.google.com or raw drive id if preceded by id=
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{20,})/i);
  if (idParamMatch && trimmed.includes('google.com')) return idParamMatch[1];

  return null;
}

/**
 * Parses any raw audio URL and returns a normalized descriptor.
 */
export function parseAudioSource(rawUrl?: string | null): ParsedAudioSource {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return {
      type: 'none',
      originalUrl: '',
      resolvedUrl: '',
      isValid: false,
    };
  }

  const trimmed = rawUrl.trim();

  // 1. Check YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      type: 'youtube',
      originalUrl: trimmed,
      resolvedUrl: `https://www.youtube.com/watch?v=${ytId}`,
      youtubeId: ytId,
      isValid: true,
    };
  }

  // 2. Check Google Drive
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return {
      type: 'drive',
      originalUrl: trimmed,
      // We route through our dedicated internal streaming route for 100% CORS & Range header compatibility
      resolvedUrl: `/api/audio/stream?drive_id=${driveId}`,
      driveId: driveId,
      isValid: true,
    };
  }

  // 3. Direct Audio (Supabase, MP3, etc.)
  const isValidUrl = /^(https?:\/\/|\/)/i.test(trimmed);
  return {
    type: isValidUrl ? 'direct' : 'none',
    originalUrl: trimmed,
    resolvedUrl: trimmed,
    isValid: isValidUrl,
  };
}

/**
 * Cleans a filename or URL to suggest a friendly song title.
 */
export function suggestSongTitle(source: string): string {
  if (!source) return 'Música de fondo';

  // If YouTube URL
  if (source.includes('youtube.com') || source.includes('youtu.be')) {
    return 'Tema musical de YouTube';
  }

  // If Drive URL
  if (source.includes('drive.google.com')) {
    return 'Canción desde Google Drive';
  }

  // If filename or file path
  try {
    const filename = source.split('/').pop()?.split('?')[0] || '';
    if (filename) {
      const withoutExt = filename.replace(/\.(mp3|wav|m4a|aac|ogg|flac)$/i, '');
      const cleaned = decodeURIComponent(withoutExt)
        .replace(/[_-]+/g, ' ')
        .trim();
      if (cleaned.length > 2) {
        return cleaned;
      }
    }
  } catch {
    // Fallback
  }

  return 'Música de fondo';
}
