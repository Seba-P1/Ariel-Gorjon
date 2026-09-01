'use client';

import * as React from 'react';
import { Tables } from '@/types/database';
import { exportToExcel, exportToCsv, formatRsvpDate } from '@/lib/utils/export';
import { createClient } from '@/lib/supabase/client';
import { updateRsvp, deleteRsvp } from '@/app/(admin)/eventos/[id]/actions';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  FileSpreadsheet,
  FileText,
  Printer,
  MoreHorizontal,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';

interface RsvpTableProps {
  eventId: string;
  eventTitle: string;
  initialRsvps: Tables<'rsvps'>[];
}

export function RsvpTable({ eventId, eventTitle, initialRsvps }: RsvpTableProps) {
  const [rsvps, setRsvps] = React.useState<Tables<'rsvps'>[]>(initialRsvps);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'confirmed' | 'declined' | 'pending'>('all');

  // Edit State
  const [editingRsvp, setEditingRsvp] = React.useState<Tables<'rsvps'> | null>(null);
  const [editAttendees, setEditAttendees] = React.useState(1);
  const [editStatus, setEditStatus] = React.useState<'confirmed' | 'declined' | 'pending'>('confirmed');
  const [editNotes, setEditNotes] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Delete State
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const supabase = createClient();

  // Real-time subscription for live RSVP updates
  React.useEffect(() => {
    const channel = supabase
      .channel(`rsvps-realtime-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rsvps',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRsvps((prev) => [payload.new as Tables<'rsvps'>, ...prev]);
            toast.info(`Nueva confirmación recibida: ${(payload.new as any).full_name}`);
          } else if (payload.eventType === 'UPDATE') {
            setRsvps((prev) =>
              prev.map((r) => (r.id === payload.new.id ? (payload.new as Tables<'rsvps'>) : r))
            );
          } else if (payload.eventType === 'DELETE') {
            setRsvps((prev) => prev.filter((r) => r.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, supabase]);

  // Calculations
  const totalConfirmations = rsvps.filter((r) => r.status === 'confirmed').length;
  const totalDeclined = rsvps.filter((r) => r.status === 'declined').length;
  const totalPeople = rsvps
    .filter((r) => r.status === 'confirmed')
    .reduce((acc, r) => acc + (r.attendees_count || 1), 0);

  // Filtered List
  const filteredRsvps = React.useMemo(() => {
    return rsvps.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        r.full_name.toLowerCase().includes(term) ||
        (r.email && r.email.toLowerCase().includes(term)) ||
        (r.phone && r.phone.toLowerCase().includes(term)) ||
        (r.song_request && r.song_request.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
  }, [rsvps, statusFilter, searchTerm]);

  // Edit Action Handlers
  const handleOpenEdit = (rsvp: Tables<'rsvps'>) => {
    setEditingRsvp(rsvp);
    setEditAttendees(rsvp.attendees_count || 1);
    setEditStatus(rsvp.status);
    setEditNotes(rsvp.dietary_notes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingRsvp) return;
    try {
      setIsUpdating(true);
      const res = await updateRsvp(editingRsvp.id, eventId, {
        attendees_count: editAttendees,
        status: editStatus,
        dietary_notes: editNotes,
      });

      if (!res.ok) {
        toast.error('Error al actualizar: ' + res.error);
        return;
      }

      setRsvps((prev) =>
        prev.map((r) =>
          r.id === editingRsvp.id
            ? { ...r, attendees_count: editAttendees, status: editStatus, dietary_notes: editNotes }
            : r
        )
      );

      toast.success('Confirmación actualizada');
      setEditingRsvp(null);
    } catch {
      toast.error('Error al procesar la actualización');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Action Handlers
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await deleteRsvp(deletingId, eventId);

      if (!res.ok) {
        toast.error('Error al eliminar: ' + res.error);
        return;
      }

      setRsvps((prev) => prev.filter((r) => r.id !== deletingId));
      toast.success('Confirmación eliminada');
      setDeletingId(null);
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Confirmados
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{totalConfirmations}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Grupos / Respuestas 'Sí'</p>
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
            <p className="text-[11px] text-neutral-500 mt-1">Suma total de comensales</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Rechazados
            </CardTitle>
            <XCircle className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{totalDeclined}</div>
            <p className="text-[11px] text-neutral-500 mt-1">No pueden asistir</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Respuestas
            </CardTitle>
            <Clock className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{rsvps.length}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Registros recibidos en tiempo real</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-neutral-900 border-neutral-800 text-sm"
            />
          </div>

          <div className="flex items-center rounded-lg bg-neutral-900 p-1 border border-neutral-800">
            {(['all', 'confirmed', 'declined'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === st
                    ? 'bg-neutral-800 text-amber-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {st === 'all' ? 'Todos' : st === 'confirmed' ? 'Confirmados' : 'Rechazados'}
              </button>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(filteredRsvps, eventTitle)}
            className="border-neutral-800 hover:bg-neutral-800 text-neutral-200 text-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Excel (.xlsx)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCsv(filteredRsvps, eventTitle)}
            className="border-neutral-800 hover:bg-neutral-800 text-neutral-200 text-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="border-neutral-800 hover:bg-neutral-800 text-neutral-200 text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            Imprimir / PDF
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900/80">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="w-12 text-neutral-400">#</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Invitado</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Estado</TableHead>
              <TableHead className="text-neutral-300 font-semibold text-center">Lugares</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Contacto</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Notas / Dieta</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Canción Sugerida</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Fecha</TableHead>
              <TableHead className="w-12 text-right text-neutral-400 print:hidden"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRsvps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-neutral-500">
                  No se encontraron confirmaciones registradas con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : (
              filteredRsvps.map((rsvp, idx) => (
                <TableRow key={rsvp.id} className="border-neutral-800/60 hover:bg-neutral-800/30 transition-colors">
                  <TableCell className="font-mono text-xs text-neutral-500">{idx + 1}</TableCell>
                  <TableCell className="font-semibold text-neutral-100">
                    {rsvp.full_name}
                    {rsvp.message && (
                      <p className="text-xs text-neutral-400 italic font-normal mt-0.5 max-w-xs truncate">
                        "{rsvp.message}"
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {rsvp.status === 'confirmed' ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                        Confirmado
                      </Badge>
                    ) : rsvp.status === 'declined' ? (
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-xs">
                        Rechazado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-amber-400">
                    {rsvp.status === 'confirmed' ? rsvp.attendees_count : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-300 space-y-0.5">
                    {rsvp.phone && <div>{rsvp.phone}</div>}
                    {rsvp.email && <div className="text-neutral-400">{rsvp.email}</div>}
                    {!rsvp.phone && !rsvp.email && <span className="text-neutral-600">—</span>}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-300 max-w-xs">
                    {rsvp.dietary_notes ? (
                      <span className="p-1 rounded bg-amber-500/10 text-amber-300 font-medium">
                        {rsvp.dietary_notes}
                      </span>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-300 max-w-xs truncate">
                    {rsvp.song_request || <span className="text-neutral-600">—</span>}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-400 font-mono whitespace-nowrap">
                    {formatRsvpDate(rsvp.created_at)}
                  </TableCell>
                  <TableCell className="text-right print:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-200">
                        <DropdownMenuItem onClick={() => handleOpenEdit(rsvp)} className="cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5 mr-2 text-amber-400" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(rsvp.id)}
                          className="cursor-pointer text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRsvp} onOpenChange={(open) => !open && setEditingRsvp(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>Editar Confirmación de {editingRsvp?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Estado de Asistencia</label>
              <div className="grid grid-cols-3 gap-2">
                {(['confirmed', 'declined', 'pending'] as const).map((st) => (
                  <Button
                    key={st}
                    type="button"
                    variant={editStatus === st ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditStatus(st)}
                    className={`text-xs ${
                      editStatus === st
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {st === 'confirmed' ? 'Confirmado' : st === 'declined' ? 'Rechazado' : 'Pendiente'}
                  </Button>
                ))}
              </div>
            </div>

            {editStatus === 'confirmed' && (
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Total Personas / Acompañantes</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={editAttendees}
                  onChange={(e) => setEditAttendees(parseInt(e.target.value, 10) || 1)}
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Restricciones Alimentarias</label>
              <Input
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Ej: Menú vegetariano"
                className="bg-neutral-950 border-neutral-800 text-neutral-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingRsvp(null)}
              className="border-neutral-800"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={handleSaveEdit}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold"
            >
              {isUpdating && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>¿Eliminar confirmación?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Esta acción eliminará el registro de confirmación de la base de datos de manera definitiva.
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
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
