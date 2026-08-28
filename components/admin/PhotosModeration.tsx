'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Tables } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Camera,
  Download,
  Tv,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface PhotosModerationProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  initialPhotos: Tables<'photos'>[];
}

export function PhotosModeration({
  eventId,
  eventSlug,
  eventTitle,
  initialPhotos,
}: PhotosModerationProps) {
  const [photos, setPhotos] = React.useState<Tables<'photos'>[]>(initialPhotos);
  const [filter, setFilter] = React.useState<'all' | 'approved' | 'rejected'>('all');

  // ZIP Download State
  const [isZipping, setIsZipping] = React.useState(false);
  const [zipProgress, setZipProgress] = React.useState<number | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const supabase = createClient();

  // Metrics
  const totalApproved = photos.filter((p) => p.status === 'approved').length;

  const filteredPhotos = React.useMemo(() => {
    if (filter === 'all') return photos;
    return photos.filter((p) => p.status === filter);
  }, [photos, filter]);

  // Status toggle handler
  const handleToggleStatus = async (photo: Tables<'photos'>) => {
    const nextStatus = photo.status === 'approved' ? 'rejected' : 'approved';

    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, status: nextStatus } : p))
    );

    const { error } = await supabase
      .from('photos')
      .update({ status: nextStatus })
      .eq('id', photo.id);

    if (error) {
      toast.error('Error al actualizar estado');
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, status: photo.status } : p))
      );
    } else {
      toast.success(
        nextStatus === 'approved' ? 'Foto aprobada para la pantalla' : 'Foto ocultada de la pantalla'
      );
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const { error } = await supabase.from('photos').delete().eq('id', deletingId);

      if (error) {
        toast.error('Error al eliminar foto: ' + error.message);
        return;
      }

      setPhotos((prev) => prev.filter((p) => p.id !== deletingId));
      toast.success('Foto eliminada');
      setDeletingId(null);
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  // ZIP Download Handler
  const handleDownloadAllZip = async () => {
    const photosToDownload = photos.filter((p) => p.status === 'approved');
    if (photosToDownload.length === 0) {
      toast.error('No hay fotos aprobadas para descargar');
      return;
    }

    try {
      setIsZipping(true);
      setZipProgress(5);
      const zip = new JSZip();
      const folder = zip.folder(`fotos-${eventSlug}`);

      for (let i = 0; i < photosToDownload.length; i++) {
        const photo = photosToDownload[i];
        try {
          const res = await fetch(photo.storage_path);
          const blob = await res.blob();
          const filename = `${String(i + 1).padStart(3, '0')}-${(photo.uploader_name || 'invitado')
            .replace(/[^a-zA-Z0-9]/g, '_')}.webp`;
          folder?.file(filename, blob);
        } catch (e) {
          console.warn('Error fetching photo for zip:', photo.storage_path);
        }

        const pct = Math.round(((i + 1) / photosToDownload.length) * 85) + 5;
        setZipProgress(pct);
      }

      setZipProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `fotos-${eventSlug}-${new Date().toISOString().split('T')[0]}.zip`);

      setZipProgress(100);
      toast.success('¡Archivo ZIP descargado con éxito!');
    } catch (err: any) {
      toast.error('Error al generar archivo ZIP: ' + err.message);
    } finally {
      setIsZipping(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Fotos
            </CardTitle>
            <Camera className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{photos.length}</div>
            <p className="text-[11px] text-neutral-500 mt-1">{totalApproved} aprobadas</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Fotos Aprobadas
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{totalApproved}</div>
            <p className="text-[11px] text-neutral-500 mt-1">Visibles en pantalla</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900/60 border-neutral-800 col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Acciones Rápidas
            </CardTitle>
            <Tv className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href={`/pantalla/${eventSlug}`} target="_blank" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-sky-500/40 text-sky-300 hover:bg-sky-500/10"
              >
                <Tv className="w-3.5 h-3.5 mr-1.5" />
                Lanzar Pantalla
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center rounded-lg bg-neutral-900 p-1 border border-neutral-800">
          {(['all', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === st
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st === 'all' ? 'Todas' : st === 'approved' ? 'Aprobadas' : 'Ocultas'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={isZipping || photos.length === 0}
            onClick={handleDownloadAllZip}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs"
          >
            {isZipping ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 mr-1.5" />
            )}
            Descargar Todas (ZIP)
          </Button>
        </div>
      </div>

      {/* Progress Bar when downloading ZIP */}
      {zipProgress !== null && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span>Comprimiendo álbum en archivo .ZIP...</span>
            <span>{zipProgress}%</span>
          </div>
          <Progress value={zipProgress} className="h-2 bg-neutral-800" />
        </div>
      )}

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-neutral-800 bg-neutral-900/30 text-neutral-500 text-sm">
          No hay fotos con el filtro seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border transition-all ${
                photo.status === 'approved'
                  ? 'border-neutral-800 hover:border-amber-500/50'
                  : 'border-rose-900/50 opacity-60'
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={photo.thumbnail_path || photo.storage_path}
                  alt={photo.caption || 'Foto'}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] backdrop-blur-md ${
                    photo.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {photo.status === 'approved' ? 'Visible' : 'Oculta'}
                </Badge>
              </div>

              {/* Card Footer / Details */}
              <div className="p-2.5 bg-neutral-900/90 border-t border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-neutral-200 truncate">
                    {photo.uploader_name || 'Invitado'}
                  </span>
                  <span className="text-neutral-500 text-[10px]">
                    {new Date(photo.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {photo.caption && (
                  <p className="text-[10px] text-neutral-400 italic line-clamp-1">
                    "{photo.caption}"
                  </p>
                )}

                {/* Moderation Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(photo)}
                    className={`h-7 px-2 text-[10px] font-medium ${
                      photo.status === 'approved'
                        ? 'text-neutral-400 hover:text-rose-400'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    {photo.status === 'approved' ? (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Aprobar
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(photo.id)}
                    className="h-7 w-7 p-0 text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>¿Eliminar foto permanentemente?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400">
            Esta acción eliminará la foto de la galería y de la base de datos de manera definitiva.
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
