import { NextRequest, NextResponse } from 'next/server';
import { extractYouTubeId, extractGoogleDriveId, suggestSongTitle } from '@/lib/music';

export const dynamic = 'force-dynamic';

function cleanYouTubeTitle(rawTitle: string): string {
  if (!rawTitle) return '';

  return rawTitle
    .replace(/\s*[\(\[]\s*(official\s*(music\s*)?video|video\s*oficial|audio\s*oficial|official\s*audio|video\s*clip|videoclip|letra|lyrics|lyric\s*video|remastered|hd|4k)\s*[\)\]]/gi, '')
    .replace(/\s*[\(\[]\s*visualizer\s*[\)\]]/gi, '')
    .replace(/\s*[\(\[]\s*(ft\.|feat\.|featuring)[^\)\]]*[\)\]]/gi, '')
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    const trimmed = url.trim();

    // 1. YouTube
    const ytId = extractYouTubeId(trimmed);
    if (ytId) {
      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(ytId)}&format=json`,
          { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' }
        );

        if (oembedRes.ok) {
          const data = await oembedRes.json();
          const cleanTitle = cleanYouTubeTitle(data.title || '');
          return NextResponse.json({
            ok: true,
            type: 'youtube',
            title: cleanTitle || data.title || 'Tema de YouTube',
            author: data.author_name || '',
          });
        }
      } catch (ytErr) {
        console.warn('Error fetching YouTube oEmbed:', ytErr);
      }

      return NextResponse.json({
        ok: true,
        type: 'youtube',
        title: 'Tema musical de YouTube',
      });
    }

    // 2. Google Drive
    const driveId = extractGoogleDriveId(trimmed);
    if (driveId) {
      try {
        // Fetch drive metadata page
        const driveRes = await fetch(`https://drive.google.com/file/d/${driveId}/view`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          cache: 'no-store',
        });
        if (driveRes.ok) {
          const html = await driveRes.text();
          const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/i) || html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            let extracted = titleMatch[1].replace(/\s*-\s*Google Drive\s*$/i, '').trim();
            extracted = extracted.replace(/\.(mp3|wav|m4a|aac|ogg)$/i, '');
            if (extracted && extracted.length > 2) {
              return NextResponse.json({
                ok: true,
                type: 'drive',
                title: extracted,
              });
            }
          }
        }
      } catch (driveErr) {
        console.warn('Error fetching Drive title:', driveErr);
      }

      return NextResponse.json({
        ok: true,
        type: 'drive',
        title: 'Canción desde Google Drive',
      });
    }

    // 3. Direct audio file
    const suggested = suggestSongTitle(trimmed);
    return NextResponse.json({
      ok: true,
      type: 'direct',
      title: suggested,
    });
  } catch (err: any) {
    console.error('Error in /api/audio/info:', err);
    return NextResponse.json({ error: err.message || 'Error al obtener información' }, { status: 500 });
  }
}
