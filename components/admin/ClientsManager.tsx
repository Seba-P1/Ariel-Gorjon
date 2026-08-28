'use client';

import * as React from 'react';
import { Tables } from '@/types/database';
import { createClientRecord, deleteClientRecord } from '@/app/(admin)/clientes/actions';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Search, Trash2, Mail, Phone, Loader2, Users } from 'lucide-react';

interface ClientsManagerProps {
  initialClients: Tables<'clients'>[];
}

export function ClientsManager({ initialClients }: ClientsManagerProps) {
  const [clients, setClients] = React.useState(initialClients);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Add Dialog
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

  // Delete Dialog
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filteredClients = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.full_name.toLowerCase().includes(term) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.phone && c.phone.toLowerCase().includes(term))
    );
  }, [clients, searchTerm]);

  const handleAdd = async () => {
    if (!fullName.trim() || !email.trim()) return;

    try {
      setIsAdding(true);
      const res = await createClientRecord({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (!res.ok) {
        toast.error(res.error || 'Error al crear cliente');
        return;
      }

      setClients((prev) => [res.client as Tables<'clients'>, ...prev]);
      toast.success('Cliente creado correctamente');
      setFullName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setShowAddDialog(false);
    } catch {
      toast.error('Error al crear cliente');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await deleteClientRecord(deletingId);

      if (!res.ok) {
        toast.error(res.error || 'Error al eliminar');
        return;
      }

      setClients((prev) => prev.filter((c) => c.id !== deletingId));
      toast.success('Cliente eliminado');
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
            placeholder="Buscar clientes por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-neutral-900 border-neutral-800 text-sm"
          />
        </div>

        <Button
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900/80">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="w-12 text-neutral-400">#</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Cliente</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Email</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Teléfono</TableHead>
              <TableHead className="text-neutral-300 font-semibold">Notas</TableHead>
              <TableHead className="w-12 text-right text-neutral-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                  No hay clientes registrados con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client, idx) => (
                <TableRow
                  key={client.id}
                  className="border-neutral-800/60 hover:bg-neutral-800/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-neutral-500">{idx + 1}</TableCell>
                  <TableCell className="font-semibold text-neutral-100">{client.full_name}</TableCell>
                  <TableCell className="text-xs text-neutral-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{client.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-300">
                    {client.phone ? (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{client.phone}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-600">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-400 max-w-xs truncate">
                    {client.notes || <span className="text-neutral-600">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(client.id)}
                      className="h-8 w-8 p-0 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3 text-left">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Nombre y Apellido *</label>
              <Input
                placeholder="Ej: Laura Santoro"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Email *</label>
              <Input
                type="email"
                placeholder="laura@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Teléfono / WhatsApp</label>
              <Input
                placeholder="+54 9 11 5555-1234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-medium">Notas internas</label>
              <Input
                placeholder="Notas de contacto, presupuesto, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-neutral-950 border-neutral-800 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAddDialog(false)} className="border-neutral-800">
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isAdding || !fullName.trim() || !email.trim()}
              onClick={handleAdd}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold"
            >
              {isAdding && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Guardar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>¿Eliminar cliente?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Esta acción eliminará el registro del cliente. Sus eventos existentes permanecerán intactos.
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
