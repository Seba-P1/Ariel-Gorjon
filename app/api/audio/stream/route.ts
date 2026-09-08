import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driveId = searchParams.get('drive_id');
    const directUrl = searchParams.get('url');

    let targetUrl = '';

    if (driveId) {
      targetUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}`;
    } else if (directUrl) {
      targetUrl = directUrl;
    } else {
      return NextResponse.json({ error: 'drive_id o url es requerido' }, { status: 400 });
    }

    // Forward Range header if present (crucial for iOS Safari & Android Chrome audio buffering)
    const rangeHeader = request.headers.get('range');
    const fetchHeaders: HeadersInit = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const driveRes = await fetch(targetUrl, {
      method: 'GET',
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!driveRes.ok && driveRes.status !== 206) {
      return NextResponse.json(
        {
          error:
            'No se pudo acceder al archivo de Google Drive. Asegurate de que el enlace tenga permiso público ("Cualquiera con el enlace puede ver").',
        },
        { status: driveRes.status || 502 }
      );
    }

    // Check if Google Drive returned an HTML page (like a virus scan warning or login page)
    const contentType = driveRes.headers.get('content-type') || 'audio/mpeg';
    if (contentType.includes('text/html')) {
      return NextResponse.json(
        {
          error:
            'El archivo de Google Drive no pudo ser transmitido directamente (requiere confirmación o acceso público). Verificá que el archivo esté compartido públicamente como lector.',
        },
        { status: 403 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType.startsWith('audio/') ? contentType : 'audio/mpeg');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=86400');

    const contentLength = driveRes.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    const contentRange = driveRes.headers.get('content-range');
    if (contentRange) {
      headers.set('Content-Range', contentRange);
    }

    return new NextResponse(driveRes.body as any, {
      status: driveRes.status === 206 ? 206 : 200,
      headers,
    });
  } catch (err: any) {
    console.error('Error in /api/audio/stream:', err);
    return NextResponse.json(
      { error: 'Error al transmitir la pista de audio: ' + (err.message || 'Error desconocido') },
      { status: 500 }
    );
  }
}
