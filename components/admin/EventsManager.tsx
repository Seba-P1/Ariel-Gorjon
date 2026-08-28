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
  Sliders,
} from 'lucide-react';
import { EVENT_TYPES } from '@/lib/constants';

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
  const [eventType, setEventType] = React.useState<string>('boda');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [eventDate, setEventDate] = React.useState('');
  const [locationName, setLocationName] = React.useState('');
  const [locationAddress, setLocationAddress] = React.useState('');
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
        location_address: locationAddress.trim() || undefined,
      });

      if (!res.ok) {
        toast.error('Error al crear evento: ' + res.error);
        return;
      }

      toast.success(`Evento "${title}" creado exitosamente`);
      setShowCreateDialog(false);
      if (res.event) {
        router.push(`/eventos/${res.event.id}`);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error('Error inesperado: ' + err.message);
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
        toast.error('Error al eliminar evento: ' + res.error);
        return;
      }

      setEvents((prev) => prev.filter((e) => e.id !== deletingId));
      toast.success('Evento eliminado correctamente');
      setDeletingId(null);
    } catch (err: any) {
      toast.error('Error al eliminar: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Buscar por título, slug o salón..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-800 text-sm"
          />
        </div>

        <Button
          onClick={() => {
            setTitle('');
            setSlug('');
            setEventType('boda');
            setSelectedTemplateId(templates[0]?.id || '');
            setEventDate('');
            setLocationName('');
            setLocationAddress('');
            setShowCreateDialog(true);
          }}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Nuevo Evento
        </Button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-300">No se encontraron eventos</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No hay eventos que coincidan con los criterios de búsqueda.'
              : 'Todavía no creaste ningún evento. Creá el primero para empezar a diseñar invitaciones.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const formattedDate = evt.event_date
              ? format(new Date(evt.event_date), "d 'de' MMMM, yyyy", { locale: es })
              : 'Sin fecha asignada';

            return (
              <Card
                key={evt.id}
                className="bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            evt.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]'
                              : evt.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]'
                              : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30 text-[10px]'
                          }
                        >
                          {evt.status === 'active' ? 'Activo' : evt.status === 'draft' ? 'Borrador' : 'Archivado'}
                        </Badge>
                        <span className="text-[11px] font-mono text-neutral-400">/{evt.slug}</span>
                      </div>
                      <h3 className="font-bold text-lg text-neutral-100 line-clamp-1">{evt.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>

                    {evt.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="truncate">{evt.location_name}</span>
                      </div>
                    )}

                    {evt.templates && (
                      <div className="flex items-center gap-2 text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">Plantilla: {evt.templates.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/60 border-t border-neutral-800/80 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/eventos/${evt.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl"
                      >
                        <Sliders className="w-3.5 h-3.5 mr-1" />
                        Personalizar
                      </Button>
                    </Link>

                    <Link href={`/invitacion/${evt.slug}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold border-neutral-700 hover:bg-neutral-800 text-neutral-200 rounded-xl"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Ver Tarjeta
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-800/40">
                    <Link href={`/eventos/${evt.id}/invitados`} className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-[11px] text-neutral-400 hover:text-sky-400 h-7 px-1"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Invitados
                      </Button>
                    </Link>

                    <Link href={`/album/${evt.slug}`} target="_blank" className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-[11px] text-neutral-400 hover:text-amber-400 h-7 px-1"
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        Álbum
                      </Button>
                    </Link>

                    <button
                      onClick={() => setDeletingId(evt.id)}
                      className="inline-flex items-center justify-center text-[11px] text-neutral-500 hover:text-red-400 h-7 px-1 rounded-md transition-colors"
                      title="Eliminar evento"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Borrar
                    </button>
                  </div>
                </div>
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
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 focus:outline-none"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-medium">Plantilla de Diseño (18)</label>
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

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Dirección Completa (Opcional)</label>
              <Input
                placeholder="Ej: Paz 461, Victoria, San Fernando"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-xs"
              />
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
              Crear Evento & Personalizar
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
