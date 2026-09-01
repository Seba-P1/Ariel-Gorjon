import * as React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Users,
  CheckCircle2,
  CalendarDays,
  Camera,
  Tv,
  ExternalLink,
  ClipboardList,
  UserPlus,
  Eye,
  Sliders,
} from 'lucide-react';
import { EventEditorStudio } from '@/components/admin/EventEditorStudio';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id: eventId } = await params;
  const admin = createAdminClient();

  // 1. Fetch Event
  const { data: event, error } = await admin
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error || !event) {
    notFound();
  }

  // 2. Fetch Templates
  const { data: templates } = await admin
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('family', { ascending: true });

  // 3. Fetch Clients
  const { data: clients } = await admin
    .from('clients')
    .select('*')
    .order('full_name', { ascending: true });

  // 4. Metrics Counts
  const { count: guestsCount } = await admin
    .from('guests')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId);

  const { count: rsvpCount } = await admin
    .from('rsvps')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId);

  const { count: confirmedCount } = await admin
    .from('rsvps')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .eq('status', 'confirmed');

  const { count: photosCount } = await admin
    .from('photos')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId);

  const { data: confirmedRsvps } = await admin
    .from('rsvps')
    .select('attendees_count')
    .eq('event_id', eventId)
    .eq('status', 'confirmed');

  const totalPeople = (confirmedRsvps || []).reduce((acc, r) => acc + (r.attendees_count || 1), 0);

  const eventDate = event.event_date
    ? format(new Date(event.event_date), "EEEE d 'de' MMMM, yyyy", { locale: es })
    : 'Sin fecha';

  return (
    <div className="space-y-8">
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href={`/eventos/${eventId}/invitados`}>
          <Card className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer group h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition-colors shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Lista de Invitados ({guestsCount || 0})
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Links personalizados y códigos QR
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/eventos/${eventId}/rsvp`}>
          <Card className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer group h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Confirmaciones de Asistencia ({totalPeople} pers.)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Respuestas de comensales y dietas
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/eventos/${eventId}/fotos`}>
          <Card className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer group h-full">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Fotos & Moderación ({photosCount || 0})
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Aprobar/ocultar fotos y descargar ZIP
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Full Event Customizer Studio */}
      <EventEditorStudio
        event={event}
        templates={templates || []}
        clients={clients || []}
      />
    </div>
  );
}
