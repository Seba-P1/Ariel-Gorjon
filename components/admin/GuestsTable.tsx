'use client';

import * as React from 'react';
import { Tables } from '@/types/database';
import { createGuest, bulkCreateGuests, deleteGuest } from '@/app/(admin)/eventos/[id]/actions';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { APP_CONFIG } from '@/lib/constants';

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
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  Upload,
  Trash2,
  MoreHorizontal,
  Link2,
  QrCode,
  Copy,
  Check,
  Users,
  UserPlus,
  Loader2,
} from 'lucide-react';

interface GuestsTableProps {
  eventId: string;
  eventSlug: string;
  initialGuests: Tables<'guests'>[];
}

export function GuestsTable({ eventId, eventSlug, initialGuests }: GuestsTableProps) {
  const [guests, setGuests] = React.useState<Tables<'guests'>[]>(initialGuests);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Add Guest State
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newSlots, setNewSlots] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);

  // Bulk Import State
  const [showBulkDialog, setShowBulkDialog] = React.useState(false);
  const [bulkText, setBulkText] = React.useState('');
  const [isBulkImporting, setIsBulkImporting] = React.useState(false);

  // QR Dialog State
  const [qrGuest, setQrGuest] = React.useState<Tables<'guests'> | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Copied Link State
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : APP_CONFIG.url;

  const getPersonalLink = (guest: Tables<'guests'>) =>
    `${baseUrl}/invitacion/${eventSlug}?g=${guest.personal_slug}`;

  const copyLink = (guest: Tables<'guests'>) => {
    navigator.clipboard.writeText(getPersonalLink(guest));
    setCopiedId(guest.id);
    toast.success(`Link de ${guest.full_name} copiado`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter
  const filteredGuests = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return guests;
    return guests.filter(
      (g) =>
        g.full_name.toLowerCase().includes(term) ||
        g.personal_slug.toLowerCase().includes(term)
    );
  }, [guests, searchTerm]);

  const totalSlots = guests.reduce((acc, g) => acc + g.slots, 0);

  // Add Guest Handler
  const handleAddGuest = async () => {
    if (!newName.trim()) return;
    try {
      setIsAdding(true);
      const res = await createGuest(eventId, {
        full_name: newName.trim(),
        slots: newSlots,
      });

      if (!res.ok) {
        toast.error(res.error || 'Error al crear invitado');
        return;
      }

      setGuests((prev) => [res.data as Tables<'guests'>, ...prev]);
      toast.success(`Invitado "${newName.trim()}" creado correctamente`);
      setNewName('');
      setNewSlots(1);
      setShowAddDialog(false);
    } catch {
      toast.error('Error al crear invitado');
    } finally {
      setIsAdding(false);
    }
  };

  // Bulk Import Handler
  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    try {
      setIsBulkImporting(true);
      const res = await bulkCreateGuests(eventId, bulkText);

      if (!res.ok) {
        toast.error(res.error || 'Error al importar');
        return;
      }

      toast.success(`${res.count} invitados importados correctamente`);
      setBulkText('');
      setShowBulkDialog(false);
      // Reload page to get fresh data
      window.location.reload();
    } catch {
      toast.error('Error al importar invitados');
    } finally {
      setIsBulkImporting(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await deleteGuest(deletingId, eventId);

      if (!res.ok) {
        toast.error(res.error || 'Error al eliminar');
        return;
      }

      setGuests((prev) => prev.filter((g) => g.id !== deletingId));
      toast.success('Invitado eliminado');
      setDeletingId(null);
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Invitados Registrados
            </CardTitle>
            <Users className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{guests.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total de Lugares
            </CardTitle>
            <UserPlus className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-400">{totalSlots}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Suma total de slots asignados</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800 col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Links Generados
            </CardTitle>
            <Link2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{guests.length}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Cada invitado tiene un link único</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Buscar invitado por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-800 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Agregar Invitado
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkDialog(true)}
            className="border-neutral-800 hover:bg-neutral-800 text-neutral-200 text-xs"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            Importar Lista
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900/80">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="w-12 text-neutral-400">#</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Nombre</TableHead>
              <TableHead className="text-neutral-300 font-semibold text-center">Lugares</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Link Personal</TableHead>
              <TableHead className="w-12 text-right text-neutral-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                  No hay invitados registrados todavía. Usá los botones de arriba para agregar.
                </TableCell>
              </TableRow>
            ) : (
              filteredGuests.map((guest, idx) => (
                <TableRow key={guest.id} className="border-neutral-800/60 hover:bg-neutral-800/30 transition-colors">
                  <TableCell className="font-mono text-xs text-neutral-500">{idx + 1}</TableCell>
                  <TableCell className="font-semibold text-neutral-100">{guest.full_name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/30 text-xs font-mono">
                      {guest.slots}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] text-neutral-400 font-mono bg-neutral-800 rounded px-2 py-0.5 max-w-xs truncate">
                        ...?g={guest.personal_slug}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-neutral-400 hover:text-amber-400"
                        onClick={() => copyLink(guest)}
                      >
                        {copiedId === guest.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-neutral-400 hover:text-amber-400"
                        onClick={() => setQrGuest(guest)}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-200">
                        <DropdownMenuItem onClick={() => copyLink(guest)} className="cursor-pointer">
                          <Link2 className="w-3.5 h-3.5 mr-2 text-amber-400" />
                          Copiar Link Personal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setQrGuest(guest)} className="cursor-pointer">
                          <QrCode className="w-3.5 h-3.5 mr-2 text-sky-400" />
                          Ver Código QR
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(guest.id)}
                          className="cursor-pointer text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Eliminar Invitado
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

      {/* Add Guest Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>Agregar Invitado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Nombre y Apellido *</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Familia Pérez"
                className="bg-neutral-950 border-neutral-800 text-neutral-100"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400">Cantidad de Lugares</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={newSlots}
                onChange={(e) => setNewSlots(parseInt(e.target.value, 10) || 1)}
                className="bg-neutral-950 border-neutral-800 text-neutral-100"
              />
              <p className="text-[11px] text-neutral-500">
                Si es una familia de 4, poné 4.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAddDialog(false)} className="border-neutral-800">
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isAdding || !newName.trim()}
              onClick={handleAddGuest}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold"
            >
              {isAdding && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Crear Invitado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Importar Lista de Invitados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <p className="text-xs text-neutral-400">
              Pegá la lista de invitados, uno por línea. Opcionalmente podés indicar la cantidad de lugares
              separado por coma o punto y coma.
            </p>
            <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3 text-[11px] font-mono text-neutral-400 space-y-0.5">
              <div>Familia Pérez, 4</div>
              <div>Juan Gómez; 2</div>
              <div>María López</div>
              <div>Familia Rodríguez, 5</div>
            </div>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Pegá acá tu lista de invitados..."
              rows={8}
              className="bg-neutral-950 border-neutral-800 text-neutral-100 font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowBulkDialog(false)} className="border-neutral-800">
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isBulkImporting || !bulkText.trim()}
              onClick={handleBulkImport}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold"
            >
              {isBulkImporting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!qrGuest} onOpenChange={(open) => !open && setQrGuest(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">{qrGuest?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            {qrGuest && (
              <>
                <div className="p-4 rounded-2xl bg-white">
                  <QRCodeSVG
                    value={getPersonalLink(qrGuest)}
                    size={200}
                    level="H"
                    includeMargin={false}
                    fgColor="#111827"
                  />
                </div>
                <code className="text-[10px] text-neutral-500 font-mono bg-neutral-800 rounded px-3 py-1.5 max-w-full break-all text-center">
                  {getPersonalLink(qrGuest)}
                </code>
                <Button
                  size="sm"
                  onClick={() => copyLink(qrGuest)}
                  className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copiar Link
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>¿Eliminar invitado?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Esta acción eliminará al invitado y su link personal de manera definitiva.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)} className="border-neutral-800">
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
