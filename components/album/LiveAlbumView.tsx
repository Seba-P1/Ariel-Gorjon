'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database';
import { compressImage } from '@/lib/utils/image-compression';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Camera,
  Heart,
  Upload,
  Image as ImageIcon,
  Loader2,
  Download,
} from 'lucide-react';

interface LiveAlbumViewProps {
  event: Tables<'events'>;
  initialPhotos: Tables<'photos'>[];
}

export function LiveAlbumView({ event, initialPhotos }: LiveAlbumViewProps) {
  const [photos, setPhotos] = React.useState<Tables<'photos'>[]>(initialPhotos);
  const [activeTab, setActiveTab] = React.useState<'gallery' | 'upload'>('gallery');

  // Uploader State
  const [uploaderName, setUploaderName] = React.useState('');
  const [caption, setCaption] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // Lightbox State
  const [lightboxPhoto, setLightboxPhoto] = React.useState<Tables<'photos'> | null>(null);

  // Liked Photos State (stored in localStorage)
  const [likedPhotoIds, setLikedPhotoIds] = React.useState<Set<string>>(new Set());

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load saved name and likes from localStorage
  React.useEffect(() => {
    const savedName = localStorage.getItem(`uploader_name_${event.id}`);
    if (savedName) setUploaderName(savedName);

    const savedLikes = localStorage.getItem(`liked_photos_${event.id}`);
    if (savedLikes) {
      try {
        setLikedPhotoIds(new Set(JSON.parse(savedLikes)));
      } catch {}
    }
  }, [event.id]);

  // Real-time subscription for live photos
  React.useEffect(() => {
    const channel = supabase
      .channel(`live-photos-${event.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPhoto = payload.new as Tables<'photos'>;
            if (newPhoto.status === 'approved') {
              setPhotos((prev) => [newPhoto, ...prev.filter((p) => p.id !== newPhoto.id)]);
              toast.info(`📸 ${newPhoto.uploader_name || 'Alguien'} subió una nueva foto!`);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Tables<'photos'>;
            setPhotos((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setPhotos((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id, supabase]);

  // File selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 5); // Max 5 files
    setSelectedFiles(files);
    setActiveTab('upload');
  };

  // Upload handler
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Save uploader name
      if (uploaderName.trim()) {
        localStorage.setItem(`uploader_name_${event.id}`, uploaderName.trim());
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // 1. Client-side compression
        const compressedBlob = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
        });

        // 2. Prepare FormData
        const formData = new FormData();
        formData.append('file', compressedBlob, file.name);
        formData.append('event_id', event.id);
        formData.append('uploader_name', uploaderName.trim() || 'Invitado');
        if (caption.trim()) formData.append('caption', caption.trim());

        // 3. Post to API
        const res = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json();
          toast.error(`Error al subir imagen ${i + 1}: ` + (errJson.error || 'Error'));
        }

        const stepProgress = Math.round(((i + 1) / selectedFiles.length) * 100);
        setUploadProgress(stepProgress);
      }

      toast.success('¡Fotos subidas con éxito! Ya se ven en la galería y en la pantalla.');
      setSelectedFiles([]);
      setCaption('');
      setActiveTab('gallery');
    } catch (err: any) {
      toast.error('Error al subir fotos: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Like handler
  const handleLike = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (likedPhotoIds.has(photoId)) return;

    const nextLikes = new Set(likedPhotoIds);
    nextLikes.add(photoId);
    setLikedPhotoIds(nextLikes);
    localStorage.setItem(`liked_photos_${event.id}`, JSON.stringify(Array.from(nextLikes)));

    try {
      await fetch('/api/photos/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_id: photoId }),
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between pb-24">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">
                {event.title}
              </h1>
              <p className="text-[11px] text-neutral-400">Álbum en Vivo • {photos.length} fotos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20"
            >
              <Camera className="w-4 h-4 mr-1.5" />
              Tomar Foto
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto p-4 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex rounded-xl bg-neutral-900 p-1 border border-neutral-800">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'gallery'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Galería ({photos.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Subir Fotos {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </button>
          </div>
        </div>

        {/* TAB 1: Gallery */}
        {activeTab === 'gallery' && (
          <div>
            {photos.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-neutral-200">El álbum está listo</h3>
                  <p className="text-xs text-neutral-400">
                    Sé el primero en sacar una foto o subir recuerdos de la fiesta para proyectarlos en pantalla.
                  </p>
                </div>
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Abrir Cámara y Sacar Foto
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo, idx) => {
                  const isLiked = likedPhotoIds.has(photo.id);
                  return (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      onClick={() => setLightboxPhoto(photo)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer"
                    >
                      <Image
                        src={photo.thumbnail_path || photo.storage_path}
                        alt={photo.caption || 'Foto del evento'}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                        {photo.caption && (
                          <p className="text-[11px] text-white font-medium line-clamp-1 mb-1">
                            {photo.caption}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-neutral-300">
                          <span className="font-medium truncate">{photo.uploader_name || 'Invitado'}</span>
                          <button
                            onClick={(e) => handleLike(photo.id, e)}
                            className="flex items-center gap-1 p-1 rounded-full hover:scale-110 transition-transform"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Upload */}
        {activeTab === 'upload' && (
          <div className="max-w-md mx-auto space-y-6 py-4">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold">Subí tus fotos</h2>
              <p className="text-xs text-neutral-400">
                Tus fotos aparecerán en la pantalla gigante de la fiesta en vivo.
              </p>
            </div>

            {/* Select Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="h-20 border-dashed border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 flex flex-col gap-2 rounded-2xl"
              >
                <Camera className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-semibold">Cámara</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-20 border-dashed border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 flex flex-col gap-2 rounded-2xl"
              >
                <ImageIcon className="w-6 h-6 text-sky-400" />
                <span className="text-xs font-semibold">Galería</span>
              </Button>
            </div>

            {/* Selected Previews */}
            {selectedFiles.length > 0 && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{selectedFiles.length} foto(s) seleccionada(s)</span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-rose-400 hover:underline"
                  >
                    Quitar todas
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-800">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 font-medium">¿Quién saca las fotos? *</label>
                    <Input
                      placeholder="Tu nombre o Familia"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300 font-medium">Dedicatoria o mensaje (opcional)</label>
                    <Input
                      placeholder="Ej: ¡Felicidades! Los queremos mucho"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-sm"
                    />
                  </div>
                </div>

                {uploadProgress !== null && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs text-amber-400">
                      <span>Optimizando y subiendo...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2 bg-neutral-800" />
                  </div>
                )}

                <Button
                  disabled={isUploading}
                  onClick={handleUpload}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-6 text-sm rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Publicar en el Álbum
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Action Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-800/80 p-3 z-30">
        <div className="max-w-md mx-auto flex items-center justify-around gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 flex flex-col items-center gap-1 h-auto py-1.5 ${
              activeTab === 'gallery' ? 'text-amber-400' : 'text-neutral-400'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[10px] font-medium">Ver Álbum</span>
          </Button>

          <Button
            onClick={() => cameraInputRef.current?.click()}
            className="bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-bold px-6 py-5 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">Sacar Foto</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center gap-1 h-auto py-1.5 text-neutral-400 hover:text-neutral-200"
          >
            <Upload className="w-4 h-4" />
            <span className="text-[10px] font-medium">Subir</span>
          </Button>
        </div>
      </nav>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxPhoto} onOpenChange={(open) => !open && setLightboxPhoto(null)}>
        <DialogContent className="max-w-2xl bg-neutral-950/95 border-neutral-800 p-2 sm:p-4 text-neutral-100 overflow-hidden">
          {lightboxPhoto && (
            <div className="space-y-3">
              <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900">
                <Image
                  src={lightboxPhoto.storage_path}
                  alt={lightboxPhoto.caption || 'Foto'}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <div>
                  <h4 className="font-semibold text-sm">{lightboxPhoto.uploader_name || 'Invitado'}</h4>
                  {lightboxPhoto.caption && (
                    <p className="text-xs text-neutral-400 italic">{lightboxPhoto.caption}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(lightboxPhoto.id)}
                    className="border-neutral-800 text-xs"
                  >
                    <Heart
                      className={`w-4 h-4 mr-1.5 ${
                        likedPhotoIds.has(lightboxPhoto.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-neutral-400'
                      }`}
                    />
                  </Button>

                  <a href={lightboxPhoto.storage_path} download target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-neutral-800 text-xs">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
