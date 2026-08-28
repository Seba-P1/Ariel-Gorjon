import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import sharp from 'sharp';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucketType = (formData.get('bucket') as string) || 'covers'; // 'covers' | 'music' | 'gallery'
    const eventId = (formData.get('event_id') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const fileId = crypto.randomUUID();

    if (bucketType === 'music') {
      // Audio upload
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
        return NextResponse.json({ error: 'El archivo debe ser de audio (.mp3, .wav, .m4a)' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split('.').pop() || 'mp3';
      const filePath = `${eventId}/${fileId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('event-music')
        .upload(filePath, buffer, {
          contentType: file.type || 'audio/mpeg',
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from('event-music')
        .getPublicUrl(filePath);

      return NextResponse.json({ ok: true, url: urlData.publicUrl });
    } else {
      // Image upload (covers / gallery / story)
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'El archivo debe ser una imagen válida' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Optimize image with Sharp (WebP, max 2400x2400)
      const optimizedBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      const bucketName = bucketType === 'gallery' ? 'event-photos-display' : 'event-covers';
      const filePath = `${eventId}/${fileId}.webp`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, optimizedBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return NextResponse.json({ ok: true, url: urlData.publicUrl });
    }
  } catch (err: any) {
    console.error('Upload route error:', err);
    return NextResponse.json({ error: 'Error al procesar la subida del archivo: ' + err.message }, { status: 500 });
  }
}
