import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import sharp from 'sharp';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const eventId = formData.get('event_id') as string | null;
    const uploaderName = (formData.get('uploader_name') as string | null) || 'Invitado';
    const caption = (formData.get('caption') as string | null) || null;

    if (!file || !eventId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (file, event_id)' },
        { status: 400 }
      );
    }

    // Verify MIME type and size
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'El archivo debe ser una imagen válida (JPG, PNG, WebP, HEIC).' },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La foto no debe superar los 20MB.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Verify Event exists and is active
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, status')
      .eq('id', eventId)
      .single();

    if (eventError || !event || event.status !== 'active') {
      return NextResponse.json(
        { error: 'El evento no se encuentra activo para recibir fotos.' },
        { status: 404 }
      );
    }

    // 2. Buffer conversion and Sharp processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const photoId = crypto.randomUUID();

    // Process Full Image (WebP, max 1920x1920, 82% quality)
    const fullBuffer = await sharp(buffer)
      .rotate() // Auto-orient based on EXIF
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // Process Thumbnail (WebP, max 450x450, 75% quality)
    const thumbBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 450, height: 450, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const fullPath = `${eventId}/${photoId}.webp`;
    const thumbPath = `${eventId}/thumbs/${photoId}.webp`;

    // 3. Upload to Supabase Storage `event-photos`
    const { error: fullUploadError } = await supabase.storage
      .from('event-photos')
      .upload(fullPath, fullBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: false,
      });

    if (fullUploadError) {
      return NextResponse.json(
        { error: 'Error al almacenar la imagen: ' + fullUploadError.message },
        { status: 500 }
      );
    }

    const { error: thumbUploadError } = await supabase.storage
      .from('event-photos')
      .upload(thumbPath, thumbBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: false,
      });

    if (thumbUploadError) {
      console.warn('Thumbnail upload warning:', thumbUploadError.message);
    }

    // 4. Get Public URLs
    const { data: fullUrlData } = supabase.storage
      .from('event-photos')
      .getPublicUrl(fullPath);

    const { data: thumbUrlData } = supabase.storage
      .from('event-photos')
      .getPublicUrl(thumbPath);

    // 5. Insert row in `photos` table
    const { data: photoRecord, error: insertError } = await supabase
      .from('photos')
      .insert({
        event_id: eventId,
        storage_path: fullUrlData.publicUrl,
        thumbnail_path: thumbUrlData.publicUrl,
        display_path: fullUrlData.publicUrl,
        uploader_name: uploaderName.slice(0, 100),
        caption: caption ? caption.slice(0, 300) : null,
        status: 'approved',
        mime_type: 'image/webp',
        size_bytes: fullBuffer.length,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Error al registrar la foto en la base de datos: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, photo: photoRecord }, { status: 201 });
  } catch (err: any) {
    console.error('Photo upload error:', err);
    return NextResponse.json(
      { error: 'Error interno en el procesamiento de la imagen' },
      { status: 500 }
    );
  }
}
