import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifySuperadmin } from '@/lib/supabase/auth-guard';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    try {
      await verifySuperadmin();
    } catch {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const input = await request.json();

    const admin = createAdminClient();
    const updateData: Record<string, any> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug;
    if (input.event_type !== undefined) updateData.event_type = input.event_type;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.template_id !== undefined) updateData.template_id = input.template_id || null;
    if (input.client_id !== undefined) updateData.client_id = input.client_id || null;
    if (input.event_date !== undefined) updateData.event_date = input.event_date ? new Date(input.event_date).toISOString() : null;
    if (input.location_name !== undefined) updateData.location_name = input.location_name || null;
    if (input.location_address !== undefined) updateData.location_address = input.location_address || null;
    if (input.location_lat !== undefined) updateData.location_lat = input.location_lat ? parseFloat(input.location_lat) : null;
    if (input.location_lng !== undefined) updateData.location_lng = input.location_lng ? parseFloat(input.location_lng) : null;
    if (input.cover_image_url !== undefined) updateData.cover_image_url = input.cover_image_url || null;
    if (input.music_url !== undefined) updateData.music_url = input.music_url || null;
    if (input.hashtag !== undefined) updateData.hashtag = input.hashtag || null;
    if (input.instagram_handle !== undefined) updateData.instagram_handle = input.instagram_handle || null;
    if (input.theme_config !== undefined) updateData.theme_config = input.theme_config;
    if (input.sections_config !== undefined) updateData.sections_config = input.sections_config;
    if (input.album_enabled !== undefined) updateData.album_enabled = Boolean(input.album_enabled);
    if (input.album_manual_approval !== undefined) updateData.album_manual_approval = Boolean(input.album_manual_approval);
    if (input.album_slide_duration_ms !== undefined) updateData.album_slide_duration_ms = Number(input.album_slide_duration_ms);
    if (input.album_transition !== undefined) updateData.album_transition = input.album_transition;
    if (input.album_show_captions !== undefined) updateData.album_show_captions = Boolean(input.album_show_captions);
    if (input.album_watermark_url !== undefined) updateData.album_watermark_url = input.album_watermark_url || null;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await admin
      .from('events')
      .update(updateData as any)
      .eq('id', eventId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Error al actualizar evento' }, { status: 500 });
    }

    revalidatePath(`/eventos/${eventId}`);
    revalidatePath('/eventos');
    revalidatePath('/dashboard');
    if (data.slug) {
      revalidatePath(`/invitacion/${data.slug}`);
      revalidatePath(`/album/${data.slug}`);
      revalidatePath(`/pantalla/${data.slug}`);
    }

    return NextResponse.json({ ok: true, event: data });
  } catch (err: any) {
    console.error('Error in PUT /api/events/[id]:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
