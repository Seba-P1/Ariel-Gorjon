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
} from 'lucide-react';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id: eventId } = await params;
  const admin = createAdminClient();

  // Event
  const { data: event, error } = await admin
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error || !event) {
    notFound();
  }

  // Counts
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
              {event.title}
            </h1>
            <Badge
              variant="outline"
              className={
                event.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : event.status === 'draft'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30'
              }
            >
              {event.status === 'active' ? 'Activo' : event.status === 'draft' ? 'Borrador' : 'Archivado'}
            </Badge>
          </div>
          <p className="text-sm text-neutral-400 flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5" />
            {eventDate}
            {event.location_name && <span className="text-neutral-600">• {event.location_name}</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/invitacion/${event.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-800 text-neutral-200 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Invitación
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
            </Button>
          </Link>

          <Link href={`/album/${event.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-800 text-neutral-200 text-xs">
              <Camera className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Álbum en Vivo
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
            </Button>
          </Link>

          <Link href={`/pantalla/${event.slug}`} target="_blank">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs">
              <Tv className="w-3.5 h-3.5 mr-1.5" />
              Lanzar Pantalla
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Invitados
            </CardTitle>
            <UserPlus className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{guestsCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Personas
            </CardTitle>
            <Users className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{totalPeople}</div>
            <p className="text-[11px] text-neutral-500 mt-1">{confirmedCount || 0} confirmados</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Respuestas
            </CardTitle>
            <ClipboardList className="w-4 h-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{rsvpCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Fotos en Vivo
            </CardTitle>
            <Camera className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">{photosCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href={`/eventos/${eventId}/invitados`}>
          <Card className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer group h-full">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition-colors shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Lista de Invitados
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Agregar invitados, generar links y códigos QR
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/eventos/${eventId}/rsvp`}>
          <Card className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer group h-full">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Confirmaciones (RSVP)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Respuestas en tiempo real, exportar Excel/CSV
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/eventos/${eventId}/fotos`}>
          <Card className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer group h-full">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Fotos & Moderación
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Aprobar/ocultar fotos y descargar ZIP
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
