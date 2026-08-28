'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database';
import { createEvent, deleteEvent } from '@/app/(admin)/eventos/actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Users,
  Eye,
  Trash2,
  Tv,
  Camera,
  Loader2,
} from 'lucide-react';

interface EventsManagerProps {
  initialEvents: (Tables<'events'> & {
    templates?: { name: string; slug: string } | null;
  })[];
  templates: Tables<'templates'>[];
}

export function EventsManager({ initialEvents, templates }: EventsManagerProps) {
  const router = useRouter();
  const [events, setEvents] = React.useState(initialEvents);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Create Event Dialog State
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [eventType, setEventType] = React.useState<'boda' | 'xv' | 'corporativo' | 'cumpleanos' | 'otro'>('boda');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [eventDate, setEventDate] = React.useState('');
  const [locationName, setLocationName] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  // Delete State
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const filteredEvents = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.slug.toLowerCase().includes(term) ||
        (e.location_name && e.location_name.toLowerCase().includes(term))
    );
  }, [events, searchTerm]);

  const handleCreate = async () => {
    if (!title.trim() || !slug.trim()) return;

    try {
      setIsCreating(true);
      const res = await createEvent({
        title: title.trim(),
        slug: slug.trim(),
        event_type: eventType,
        template_id: selectedTemplateId || null,
        event_date: eventDate || undefined,
        location_name: locationName.trim() || undefined,
      });

      if (!res.ok) {
        toast.error(res.error || 'Error al crear evento');
        return;
      }

      toast.success(`Evento "${title}" creado exitosamente`);
      setShowCreateDialog(false);
      if (res.event) {
        router.push(`/eventos/${res.event.id}`);
      } else {
        window.location.reload();
      }
    } catch {
      toast.error('Error al crear evento');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await deleteEvent(deletingId);

      if (!res.ok) {
        toast.error(res.error || 'Error al eliminar');
        return;
      }

      setEvents((prev) => prev.filter((e) => e.id !== deletingId));
      toast.success('Evento eliminado');
      setDeletingId(null);
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Buscar eventos por título o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-800 text-sm"
          />
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Crear Nuevo Evento
        </Button>
      </div>

      {/* Grid of Events */}
      {filteredEvents.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-neutral-800 bg-neutral-900/30 text-neutral-500 text-sm">
          No hay eventos creados todavía. Hacé click en "Crear Nuevo Evento".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const dateStr = event.event_date
              ? format(new Date(event.event_date), "d 'de' MMMM, yyyy", { locale: es })
              : 'Fecha a definir';

            return (
              <Card
                key={event.id}
                className="bg-neutral-900/60 border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-bold tracking-wider mb-2 bg-amber-500/10 text-amber-400 border-amber-500/30"
                      >
                        {event.event_type}
                      </Badge>
                      <h3 className="font-bold text-lg text-neutral-100 leading-snug">
                        {event.title}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        event.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {event.status === 'active' ? 'Activo' : 'Borrador'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{dateStr}</span>
                    </div>
                    {event.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span className="truncate">{event.location_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                    <Link href={`/eventos/${event.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold">
                        Administrar
                      </Button>
                    </Link>

                    <Link href={`/invitacion/${event.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-amber-400" title="Ver Invitación">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link href={`/pantalla/${event.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-sky-400" title="Ver Pantalla">
                        <Tv className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(event.id)}
                      className="h-8 w-8 p-0 text-neutral-500 hover:text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3 text-left">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Nombre o Título del Evento *</label>
              <Input
                placeholder="Ej: Boda Sofía & Mateo"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Link o Slug de la Invitación *</label>
              <div className="flex items-center rounded-lg bg-neutral-950 border border-neutral-800 px-3">
                <span className="text-xs text-neutral-500 font-mono">/invitacion/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent border-0 text-xs font-mono text-amber-400 py-2.5 focus:outline-none flex-1"
                  placeholder="boda-sofia-mateo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium">Tipo de Evento</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none"
                >
                  <option value="boda">Boda / Matrimonio</option>
                  <option value="xv">Mis 15 Años</option>
                  <option value="cumpleanos">Cumpleaños</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium">Plantilla de Diseño</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none"
                >
                  <option value="">Seleccionar plantilla...</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium">Fecha y Hora</label>
                <Input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium">Lugar / Salón</label>
                <Input
                  placeholder="Ej: Salón Bellinzona"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-xs"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateDialog(false)}
              className="border-neutral-800"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isCreating || !title.trim() || !slug.trim()}
              onClick={handleCreate}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold"
            >
              {isCreating && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Crear Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>¿Eliminar este evento?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Se eliminarán las invitaciones, fotos asociadas y confirmaciones RSVP de forma irreversible.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingId(null)}
              className="border-neutral-800"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isDeleting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Eliminar Definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
