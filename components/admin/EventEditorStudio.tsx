'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database';
import { updateEvent } from '@/app/(admin)/eventos/actions';
import { toast } from 'sonner';
import {
  Sparkles,
  Save,
  Eye,
  Camera,
  Tv,
  ExternalLink,
  Layers,
  Palette,
  Image as ImageIcon,
  Music,
  MapPin,
  Shirt,
  Heart,
  Gift,
  Share2,
  Users,
  Hotel,
  HelpCircle,
  Sliders,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EVENT_TYPES } from '@/lib/constants';
import { INVITATION_THEMES } from '@/components/invitations/themes';

interface EventEditorStudioProps {
  event: Tables<'events'>;
  templates: Tables<'templates'>[];
  clients?: Tables<'clients'>[];
}

export function EventEditorStudio({ event, templates, clients = [] }: EventEditorStudioProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('general');

  // Form State
  const [title, setTitle] = React.useState(event.title);
  const [slug, setSlug] = React.useState(event.slug);
  const [eventType, setEventType] = React.useState(event.event_type);
  const [status, setStatus] = React.useState(event.status);
  const [templateId, setTemplateId] = React.useState(event.template_id || '');
  const [clientId, setClientId] = React.useState(event.client_id || '');
  const [eventDate, setEventDate] = React.useState(
    event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : ''
  );

  // Cover & Music
  const [coverImageUrl, setCoverImageUrl] = React.useState(event.cover_image_url || '');
  const [musicUrl, setMusicUrl] = React.useState(event.music_url || '');

  // Locations & Lat/Lng
  const [locationName, setLocationName] = React.useState(event.location_name || '');
  const [locationAddress, setLocationAddress] = React.useState(event.location_address || '');
  const [locationLat, setLocationLat] = React.useState(event.location_lat ? String(event.location_lat) : '');
  const [locationLng, setLocationLng] = React.useState(event.location_lng ? String(event.location_lng) : '');

  // Social & Album
  const [hashtag, setHashtag] = React.useState(event.hashtag || '');
  const [instagramHandle, setInstagramHandle] = React.useState(event.instagram_handle || '');
  const [albumEnabled, setAlbumEnabled] = React.useState(event.album_enabled ?? true);
  const [albumManualApproval, setAlbumManualApproval] = React.useState(event.album_manual_approval ?? false);
  const [albumSlideDuration, setAlbumSlideDuration] = React.useState(String(event.album_slide_duration_ms || 4000));
  const [albumTransition, setAlbumTransition] = React.useState(event.album_transition || 'kenburns');

  // Theme Config (Deep Object)
  const initialThemeConfig = (event.theme_config as Record<string, any>) || {};
  const [themeConfig, setThemeConfig] = React.useState<Record<string, any>>(initialThemeConfig);

  // Custom Colors
  const [primaryColor, setPrimaryColor] = React.useState(
    themeConfig.palette?.primary || '#D4AF37'
  );
  const [secondaryColor, setSecondaryColor] = React.useState(
    themeConfig.palette?.secondary || '#171717'
  );
  const [bgColor, setBgColor] = React.useState(
    themeConfig.palette?.bg || '#0B0B0B'
  );
  const [textColor, setTextColor] = React.useState(
    themeConfig.palette?.text || '#FFFFFF'
  );

  // Ceremony Details
  const [ceremonyTitle, setCeremonyTitle] = React.useState(themeConfig.ceremony_title || 'Ceremonia Religiosa / Civil');
  const [ceremonyTime, setCeremonyTime] = React.useState(themeConfig.ceremony_time || '18:30 hs');
  const [ceremonyAddress, setCeremonyAddress] = React.useState(themeConfig.ceremony_address || '');

  // Party Details
  const [partyTitle, setPartyTitle] = React.useState(themeConfig.party_title || 'Fiesta & Recepción');
  const [partyTime, setPartyTime] = React.useState(themeConfig.party_time || '20:30 hs');
  const [partyAddress, setPartyAddress] = React.useState(themeConfig.party_address || '');

  // Dress Code
  const [dressCodeType, setDressCodeType] = React.useState(themeConfig.dress_code_type || 'Elegante');
  const [dressCodeDesc, setDressCodeDesc] = React.useState(
    themeConfig.dress_code_description || 'Queremos que te vistas para brillar y disfrutar una noche inolvidable.'
  );
  const [dressCodeNotes, setDressCodeNotes] = React.useState(
    themeConfig.dress_code_notes || 'Por favor evitar vestir de blanco.'
  );

  // Gifts & Banking
  const [giftTitle, setGiftTitle] = React.useState(themeConfig.gift_title || 'Mesa de Regalos');
  const [giftDesc, setGiftDesc] = React.useState(
    themeConfig.gift_description || 'Tu presencia es nuestro mejor regalo. Si deseás hacernos un presente, podés hacerlo a través de:'
  );
  const [cbu, setCbu] = React.useState(themeConfig.cbu_cvu || '');
  const [alias, setAlias] = React.useState(themeConfig.alias || '');
  const [bankName, setBankName] = React.useState(themeConfig.bank_name || '');
  const [accountHolder, setAccountHolder] = React.useState(themeConfig.account_holder || '');
  const [giftRegistryUrl, setGiftRegistryUrl] = React.useState(themeConfig.gift_registry_url || '');

  // Music details
  const [musicTitle, setMusicTitle] = React.useState(themeConfig.music_title || 'A Thousand Years — Instrumental');

  // Story / Timeline
  const [storyTitle, setStoryTitle] = React.useState(themeConfig.story_title || 'Nuestra Historia');
  const [storySubtitle, setStorySubtitle] = React.useState(themeConfig.story_subtitle || 'Cómo empezó todo');
  const [storyMilestones, setStoryMilestones] = React.useState<any[]>(
    themeConfig.story_milestones || [
      { year: '2020', title: 'Nos conocimos', description: 'Una tarde de café que lo cambió todo.' },
      { year: '2023', title: 'El compromiso', description: 'Un atardecer inolvidable frente al mar.' },
      { year: '2026', title: 'El Gran Día', description: 'Celebramos nuestro amor junto a ustedes.' },
    ]
  );

  // Gallery Photos
  const [galleryPhotos, setGalleryPhotos] = React.useState<any[]>(
    themeConfig.gallery_photos || [
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', caption: 'Nuestros momentos' },
      { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', caption: 'Risas compartidas' },
      { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800', caption: 'Atardeceres' },
      { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800', caption: 'Inolvidable' },
    ]
  );

  // Sections config
  const standardSections = [
    { id: 'hero', name: 'Portada Principal (Hero & Título)' },
    { id: 'countdown', name: 'Cuenta Regresiva en Tiempo Real' },
    { id: 'event-details', name: 'Dónde y Cuándo (Ceremonia & Fiesta)' },
    { id: 'location', name: 'Mapa GPS & Cómo Llegar' },
    { id: 'dress-code', name: 'Código de Vestimenta (Dress Code)' },
    { id: 'story', name: 'Historia & Timeline' },
    { id: 'photo-album', name: 'Galería de Fotos del Agasajado' },
    { id: 'rsvp', name: 'Formulario de Confirmación RSVP' },
    { id: 'gifts', name: 'Datos Bancarios & Regalos' },
    { id: 'live-album-qr', name: 'QR de Álbum en Vivo para Invitados' },
    { id: 'music', name: 'Reproductor de Música Flotante' },
    { id: 'song-requests', name: 'Sugerencias de Canciones' },
    { id: 'instagram-wall', name: 'Muro Social & Hashtag' },
    { id: 'godparents', name: 'Padrinos / Madrinas / Cortejo' },
    { id: 'accommodation', name: 'Hospedaje & Traslados' },
    { id: 'trivia', name: 'Trivia & Preguntas' },
  ];

  const currentSections = (event.sections_config as any[]) || [
    'hero',
    'countdown',
    'event-details',
    'location',
    'dress-code',
    'photo-album',
    'rsvp',
    'gifts',
    'live-album-qr',
    'music',
  ];

  const [activeSections, setActiveSections] = React.useState<string[]>(
    currentSections.map((s) => (typeof s === 'string' ? s : s.type))
  );

  // Upload Handlers
  const [isUploadingCover, setIsUploadingCover] = React.useState(false);
  const [isUploadingMusic, setIsUploadingMusic] = React.useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = React.useState(false);

  async function handleFileUpload(file: File, bucketType: 'covers' | 'music' | 'gallery') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucketType);
    formData.append('event_id', event.id);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Error al subir archivo');
    }
    return data.url;
  }

  async function onCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const url = await handleFileUpload(file, 'covers');
      setCoverImageUrl(url);
      toast.success('Imagen de portada subida y optimizada exitosamente');
    } catch (err: any) {
      toast.error('Error al subir portada: ' + err.message);
    } finally {
      setIsUploadingCover(false);
    }
  }

  async function onMusicFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMusic(true);
      const url = await handleFileUpload(file, 'music');
      setMusicUrl(url);
      toast.success('Pista de música subida con éxito');
    } catch (err: any) {
      toast.error('Error al subir música: ' + err.message);
    } finally {
      setIsUploadingMusic(false);
    }
  }

  async function onGalleryFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingGallery(true);
      const newPhotos: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await handleFileUpload(files[i], 'gallery');
        newPhotos.push({ url, caption: files[i].name.replace(/\.[^/.]+$/, '') });
      }
      setGalleryPhotos([...galleryPhotos, ...newPhotos]);
      toast.success(`Se subieron ${newPhotos.length} fotos a la galería`);
    } catch (err: any) {
      toast.error('Error al subir fotos de galería: ' + err.message);
    } finally {
      setIsUploadingGallery(false);
    }
  }

  // Handle Template Selection
  function handleSelectTemplate(tplId: string) {
    setTemplateId(tplId);
    const selected = templates.find((t) => t.id === tplId);
    if (selected) {
      const defTheme = (selected.default_theme as any) || {};
      if (defTheme.palette) {
        setPrimaryColor(defTheme.palette.primary || '#D4AF37');
        setSecondaryColor(defTheme.palette.secondary || '#171717');
        setBgColor(defTheme.palette.bg || '#0B0B0B');
        setTextColor(defTheme.palette.text || '#FFFFFF');
      }
      toast.info(`Plantilla "${selected.name}" seleccionada. Paleta actualizada.`);
    }
  }

  // Toggle Section
  function toggleSection(secId: string) {
    if (activeSections.includes(secId)) {
      setActiveSections(activeSections.filter((s) => s !== secId));
    } else {
      setActiveSections([...activeSections, secId]);
    }
  }

  // Save All Changes
  async function handleSave() {
    try {
      setIsSaving(true);

      const mergedThemeConfig = {
        ...themeConfig,
        palette: {
          primary: primaryColor,
          secondary: secondaryColor,
          bg: bgColor,
          text: textColor,
          accent: primaryColor,
        },
        ceremony_title: ceremonyTitle,
        ceremony_time: ceremonyTime,
        ceremony_address: ceremonyAddress,
        party_title: partyTitle,
        party_time: partyTime,
        party_address: partyAddress,
        dress_code_type: dressCodeType,
        dress_code_description: dressCodeDesc,
        dress_code_notes: dressCodeNotes,
        gift_title: giftTitle,
        gift_description: giftDesc,
        cbu_cvu: cbu,
        alias: alias,
        bank_name: bankName,
        account_holder: accountHolder,
        gift_registry_url: giftRegistryUrl,
        music_title: musicTitle,
        story_title: storyTitle,
        story_subtitle: storySubtitle,
        story_milestones: storyMilestones,
        gallery_photos: galleryPhotos,
      };

      const res = await updateEvent(event.id, {
        title,
        slug,
        event_type: eventType,
        status,
        template_id: templateId || null,
        client_id: clientId || null,
        event_date: eventDate || null,
        location_name: locationName || null,
        location_address: locationAddress || null,
        location_lat: locationLat || null,
        location_lng: locationLng || null,
        cover_image_url: coverImageUrl || null,
        music_url: musicUrl || null,
        hashtag: hashtag || null,
        instagram_handle: instagramHandle || null,
        album_enabled: albumEnabled,
        album_manual_approval: albumManualApproval,
        album_slide_duration_ms: Number(albumSlideDuration) || 4000,
        album_transition: albumTransition,
        theme_config: mergedThemeConfig,
        sections_config: activeSections,
      });

      if (!res.ok) {
        toast.error('Error al guardar: ' + res.error);
        return;
      }

      toast.success('¡Evento y diseño actualizados exitosamente!');
      router.refresh();
    } catch (err: any) {
      toast.error('Error inesperado: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                Personalizador de Evento & Tarjeta
              </h2>
              <p className="text-xs text-neutral-400">
                Ajustá colores, imágenes, textos, ceremonias, música y módulos en tiempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Link href={`/invitacion/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-200 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Ver Invitación
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
            </Button>
          </Link>

          <Link href={`/album/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-200 text-xs">
              <Camera className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Álbum en Vivo
            </Button>
          </Link>

          <Link href={`/pantalla/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-200 text-xs">
              <Tv className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
              Proyección
            </Button>
          </Link>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 px-5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1.5 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <TabsTrigger value="general" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="design" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Palette className="w-3.5 h-3.5 mr-1.5" />
            Plantilla & Colores
          </TabsTrigger>
          <TabsTrigger value="media" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
            Portada & Fotos
          </TabsTrigger>
          <TabsTrigger value="music" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Music className="w-3.5 h-3.5 mr-1.5" />
            Música
          </TabsTrigger>
          <TabsTrigger value="locations" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            Salones & Horarios
          </TabsTrigger>
          <TabsTrigger value="dresscode" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Shirt className="w-3.5 h-3.5 mr-1.5" />
            Dress Code
          </TabsTrigger>
          <TabsTrigger value="story" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            Historia
          </TabsTrigger>
          <TabsTrigger value="gifts" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Gift className="w-3.5 h-3.5 mr-1.5" />
            Regalos & Banco
          </TabsTrigger>
          <TabsTrigger value="album" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Tv className="w-3.5 h-3.5 mr-1.5" />
            Álbum & Pantalla
          </TabsTrigger>
          <TabsTrigger value="modules" className="text-xs font-semibold data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400 rounded-xl">
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            Módulos (16)
          </TabsTrigger>
        </TabsList>

        {/* 1. GENERAL TAB */}
        <TabsContent value="general">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Datos Principales del Evento</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Información básica, enlace personalizado y estado general.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Título del Evento *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Boda Sofía & Mateo"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Enlace Único (Slug) *</Label>
                  <div className="flex items-center">
                    <span className="text-xs text-neutral-500 bg-neutral-950 border border-r-0 border-neutral-800 px-3 py-2 rounded-l-md">
                      /invitacion/
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="sofia-y-mateo"
                      className="bg-neutral-950 border-neutral-800 rounded-l-none text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Tipo de Celebración</Label>
                  <Select value={eventType} onValueChange={(val: any) => setEventType(val)}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-sm">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Fecha y Hora de Inicio</Label>
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Estado del Evento</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-sm">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                      <SelectItem value="active">Activo (Publicado)</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {clients.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs text-neutral-300">Cliente Asociado (Opcional)</Label>
                  <Select value={clientId} onValueChange={(val) => setClientId(val || '')}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-sm">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                      <SelectItem value="">Sin cliente asignado</SelectItem>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.full_name} ({c.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. DESIGN & COLORS TAB */}
        <TabsContent value="design" className="space-y-6">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Elección de Plantilla Base (18 Diseños)</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Seleccioná el estilo visual maestro para la tarjeta virtual.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {templates.map((tpl) => {
                  const isSelected = templateId === tpl.id;
                  const defTheme = (tpl.default_theme as any) || {};
                  const pColor = defTheme.palette?.primary || '#F59E0B';
                  const bColor = defTheme.palette?.bg || '#0B0B0B';

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-32 relative overflow-hidden ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
                          : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950/60'
                      }`}
                      style={{ backgroundColor: bColor }}
                    >
                      <div className="flex items-center justify-between z-10">
                        <div
                          className="w-3 h-3 rounded-full border border-white/30"
                          style={{ backgroundColor: pColor }}
                        />
                        {isSelected && (
                          <Badge className="bg-amber-500 text-neutral-950 text-[9px] font-bold h-4 px-1">
                            Activo
                          </Badge>
                        )}
                      </div>

                      <div className="z-10">
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {tpl.variant || 'v1'}
                        </span>
                        <h4 className="text-xs font-bold text-neutral-100 line-clamp-1">
                          {tpl.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Personalización de Paleta de Colores</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Modificá los tonos exactos que utilizarán los botones, fondos y detalles de la tarjeta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-neutral-300">Color Primario (Acentos/Botones)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-neutral-300">Color Secundario (Tarjetas)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-neutral-300">Color de Fondo General</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-neutral-300">Color de Texto Principal</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-4 border-t border-neutral-800 mt-4">
                <span className="text-xs text-neutral-400 block mb-2 font-medium">Paletas rápidas predefinidas:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Oro Clásico', p: '#D4AF37', s: '#171717', bg: '#0B0B0B', t: '#FFFFFF' },
                    { name: 'Rose Gold', p: '#E0A899', s: '#24141E', bg: '#140A10', t: '#FFFFFF' },
                    { name: 'Verde Botánico', p: '#4E7D56', s: '#122015', bg: '#09120B', t: '#FFFFFF' },
                    { name: 'Terracota Boho', p: '#C86D51', s: '#26140F', bg: '#120805', t: '#FFFFFF' },
                    { name: 'Neón Cyan', p: '#06B6D4', s: '#0F172A', bg: '#020617', t: '#FFFFFF' },
                    { name: 'Minimal White', p: '#111827', s: '#F3F4F6', bg: '#FFFFFF', t: '#111827' },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrimaryColor(preset.p);
                        setSecondaryColor(preset.s);
                        setBgColor(preset.bg);
                        setTextColor(preset.t);
                      }}
                      className="text-xs border-neutral-800 hover:bg-neutral-800 text-neutral-300 h-7"
                    >
                      <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: preset.p }} />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. MEDIA TAB (PORTADA & GALERIA) */}
        <TabsContent value="media" className="space-y-6">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Imagen de Portada (Hero Background)</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Foto principal que se mostrará en la cabecera de la invitación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {coverImageUrl ? (
                  <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-950 shrink-0">
                    <img src={coverImageUrl} alt="Portada" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setCoverImageUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Eliminar portada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full sm:w-48 h-32 rounded-2xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-neutral-500 shrink-0">
                    <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                    <span className="text-[10px]">Sin imagen</span>
                  </div>
                )}

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <Label className="text-xs text-neutral-300 block mb-1">Subir Archivo desde tu dispositivo</Label>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingCover ? 'Subiendo y procesando...' : 'Seleccionar Imagen (JPG, PNG, WebP)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onCoverFileChange}
                        disabled={isUploadingCover}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-neutral-400">O pegar URL de imagen externa:</Label>
                    <Input
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-neutral-100">Galería de Fotos del Evento (Photo Album)</CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Fotos de la pareja o quinceañera que aparecerán en la sección interactiva de la tarjeta.
                </CardDescription>
              </div>

              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>{isUploadingGallery ? 'Subiendo...' : 'Agregar Fotos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onGalleryFileChange}
                  disabled={isUploadingGallery}
                  className="hidden"
                />
              </label>
            </CardHeader>
            <CardContent>
              {galleryPhotos.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-6">
                  No hay fotos en la galería. Podés subir varias imágenes juntas.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {galleryPhotos.map((photo, idx) => (
                    <div key={idx} className="group relative h-28 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                      <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <button
                          onClick={() => setGalleryPhotos(galleryPhotos.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. MUSIC TAB */}
        <TabsContent value="music">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Música de Fondo de la Invitación</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Pista musical que sonará cuando los invitados abran la tarjeta virtual.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Nombre de la Canción / Artista</Label>
                  <Input
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    placeholder="Ej: A Thousand Years — Christina Perri"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Subir Audio MP3 directo</Label>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingMusic ? 'Subiendo audio...' : 'Seleccionar MP3 / WAV'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={onMusicFileChange}
                      disabled={isUploadingMusic}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">URL del Archivo de Audio (MP3)</Label>
                <Input
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  placeholder="https://.../cancion.mp3"
                  className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                />
              </div>

              {musicUrl && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                      <span className="text-xs font-semibold text-neutral-200 block">{musicTitle}</span>
                      <span className="text-[11px] text-neutral-500 font-mono truncate max-w-xs block">{musicUrl}</span>
                    </div>
                  </div>
                  <audio controls src={musicUrl} className="h-8 max-w-[200px]" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. LOCATIONS & TIMES TAB (DOBLE SALON) */}
        <TabsContent value="locations" className="space-y-6">
          {/* Ceremony Card */}
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                Salón / Lugar 1: Ceremonia Religiosa o Civil
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Datos de la iglesia, parroquia o registro civil (opcional).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Título de la Ceremonia</Label>
                  <Input
                    value={ceremonyTitle}
                    onChange={(e) => setCeremonyTitle(e.target.value)}
                    placeholder="Ej: Ceremonia Religiosa"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Horario de la Ceremonia</Label>
                  <Input
                    value={ceremonyTime}
                    onChange={(e) => setCeremonyTime(e.target.value)}
                    placeholder="Ej: 18:30 hs"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">Lugar & Dirección de la Ceremonia</Label>
                <Input
                  value={ceremonyAddress}
                  onChange={(e) => setCeremonyAddress(e.target.value)}
                  placeholder="Ej: Parroquia San Benito de Palermo, Villanueva 905, CABA"
                  className="bg-neutral-950 border-neutral-800 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Party Card */}
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Salón / Lugar 2: Fiesta & Recepción
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Salón principal de eventos donde se realiza la fiesta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Nombre del Salón / Quinta</Label>
                  <Input
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Ej: Palacio Sans Souci"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Horario de la Fiesta</Label>
                  <Input
                    value={partyTime}
                    onChange={(e) => setPartyTime(e.target.value)}
                    placeholder="Ej: 20:30 hs"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">Dirección Completa</Label>
                <Input
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Ej: Paz 461, Victoria, San Fernando, Provincia de Buenos Aires"
                  className="bg-neutral-950 border-neutral-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-400">Latitud GPS (opcional)</Label>
                  <Input
                    value={locationLat}
                    onChange={(e) => setLocationLat(e.target.value)}
                    placeholder="-34.4533"
                    className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-400">Longitud GPS (opcional)</Label>
                  <Input
                    value={locationLng}
                    onChange={(e) => setLocationLng(e.target.value)}
                    placeholder="-58.5472"
                    className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. DRESS CODE TAB */}
        <TabsContent value="dresscode">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Código de Vestimenta (Dress Code)</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Indicaciones para que los invitados sepan cómo asistir vestidos al evento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">Tipo de Vestimenta</Label>
                <Select value={dressCodeType} onValueChange={setDressCodeType}>
                  <SelectTrigger className="bg-neutral-950 border-neutral-800 text-sm">
                    <SelectValue placeholder="Seleccionar estilo" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                    <SelectItem value="Elegante">Elegante / Gala</SelectItem>
                    <SelectItem value="Elegante Sport">Elegante Sport</SelectItem>
                    <SelectItem value="Black Tie">Black Tie (Smoking / Vestido Largo)</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Casual / Informal">Casual / Informal</SelectItem>
                    <SelectItem value="White Party">White Party (Total White)</SelectItem>
                    <SelectItem value="Temático / Disfraz">Temático / Disfraz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">Descripción o Recomendación</Label>
                <Textarea
                  value={dressCodeDesc}
                  onChange={(e) => setDressCodeDesc(e.target.value)}
                  placeholder="Ej: Queremos que te vistas para brillar..."
                  className="bg-neutral-950 border-neutral-800 text-sm min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">Notas Especiales o Qué Evitar</Label>
                <Input
                  value={dressCodeNotes}
                  onChange={(e) => setDressCodeNotes(e.target.value)}
                  placeholder="Ej: Por favor no asistir vestidos de blanco ni beige."
                  className="bg-neutral-950 border-neutral-800 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. STORY TAB */}
        <TabsContent value="story">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Nuestra Historia / Timeline</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Sección emotiva donde se relatan los momentos clave del agasajado o la pareja.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Título</Label>
                  <Input
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="El Camino Hacia el Gran Día"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Subtítulo</Label>
                  <Input
                    value={storySubtitle}
                    onChange={(e) => setStorySubtitle(e.target.value)}
                    placeholder="Nuestra Historia"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-neutral-200">Hitos de la Historia (Timeline)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setStoryMilestones([
                        ...storyMilestones,
                        { year: '2026', title: 'Nuevo Momento', description: 'Descripción del momento...' },
                      ])
                    }
                    className="text-xs border-neutral-800 h-7"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar Hito
                  </Button>
                </div>

                {storyMilestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        value={m.year}
                        onChange={(e) => {
                          const copy = [...storyMilestones];
                          copy[idx].year = e.target.value;
                          setStoryMilestones(copy);
                        }}
                        placeholder="Año / Fecha"
                        className="w-28 bg-neutral-900 border-neutral-800 text-xs font-bold"
                      />
                      <Input
                        value={m.title}
                        onChange={(e) => {
                          const copy = [...storyMilestones];
                          copy[idx].title = e.target.value;
                          setStoryMilestones(copy);
                        }}
                        placeholder="Título del hito"
                        className="flex-1 bg-neutral-900 border-neutral-800 text-xs font-semibold"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStoryMilestones(storyMilestones.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Textarea
                      value={m.description}
                      onChange={(e) => {
                        const copy = [...storyMilestones];
                        copy[idx].description = e.target.value;
                        setStoryMilestones(copy);
                      }}
                      placeholder="Descripción emotiva..."
                      className="bg-neutral-900 border-neutral-800 text-xs min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. GIFTS & BANKING TAB */}
        <TabsContent value="gifts">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Datos Bancarios & Mesa de Regalos</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Los invitados podrán copiar el CBU o Alias con un solo clic desde la invitación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-300">Mensaje a los Invitados</Label>
                <Textarea
                  value={giftDesc}
                  onChange={(e) => setGiftDesc(e.target.value)}
                  placeholder="Tu presencia es nuestro mejor regalo..."
                  className="bg-neutral-950 border-neutral-800 text-sm min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Alias de Cuenta (Mercado Pago / Banco)</Label>
                  <Input
                    value={alias}
                    onChange={(e) => setAlias(e.target.value.toUpperCase())}
                    placeholder="SOFIA.Y.MATEO.BODA"
                    className="bg-neutral-950 border-neutral-800 text-sm font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">CBU / CVU (22 dígitos)</Label>
                  <Input
                    value={cbu}
                    onChange={(e) => setCbu(e.target.value)}
                    placeholder="0000003100012345678901"
                    className="bg-neutral-950 border-neutral-800 text-sm font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Nombre del Banco / Billetera</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Mercado Pago / Banco Galicia"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Titular de la Cuenta</Label>
                  <Input
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Sofía Rodriguez y Mateo Gómez"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-xs text-neutral-300">Link a Lista de Regalos Externa (opcional)</Label>
                <Input
                  value={giftRegistryUrl}
                  onChange={(e) => setGiftRegistryUrl(e.target.value)}
                  placeholder="https://novios.falabella.com.ar/..."
                  className="bg-neutral-950 border-neutral-800 text-xs font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. LIVE ALBUM & SCREEN TAB */}
        <TabsContent value="album">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Configuración de Álbum PWA & Pantalla en Vivo</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Ajustes para la proyección en pantalla gigante y subida de fotos por invitados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100">Habilitar Álbum en Vivo</h4>
                  <p className="text-xs text-neutral-400">Permitir a los invitados subir fotos desde sus celulares.</p>
                </div>
                <Switch checked={albumEnabled} onCheckedChange={setAlbumEnabled} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100">Moderación Manual Previa</h4>
                  <p className="text-xs text-neutral-400">
                    Si está activo, las fotos requieren aprobación en el panel antes de salir en la pantalla.
                  </p>
                </div>
                <Switch checked={albumManualApproval} onCheckedChange={setAlbumManualApproval} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Duración por Foto en Pantalla (ms)</Label>
                  <Select value={albumSlideDuration} onValueChange={(val) => setAlbumSlideDuration(val || '4000')}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-sm">
                      <SelectValue placeholder="Duración" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                      <SelectItem value="2500">2.5 segundos (Rápido)</SelectItem>
                      <SelectItem value="4000">4 segundos (Recomendado)</SelectItem>
                      <SelectItem value="6000">6 segundos (Tranquilo)</SelectItem>
                      <SelectItem value="8000">8 segundos (Lento)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Efecto de Transición en Pantalla</Label>
                  <Select value={albumTransition} onValueChange={(val) => setAlbumTransition(val || 'kenburns')}>
                    <SelectTrigger className="bg-neutral-950 border-neutral-800 text-sm">
                      <SelectValue placeholder="Transición" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                      <SelectItem value="kenburns">Ken Burns (Zoom Cinematográfico)</SelectItem>
                      <SelectItem value="fade">Disolvencia Cruzada (Fade)</SelectItem>
                      <SelectItem value="slide">Deslizamiento Suave (Slide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Hashtag Oficial</Label>
                  <Input
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    placeholder="#BodaSofiYMateo"
                    className="bg-neutral-950 border-neutral-800 text-sm font-bold text-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-neutral-300">Usuario de Instagram</Label>
                  <Input
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@arielproducciones"
                    className="bg-neutral-950 border-neutral-800 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 10. MODULES TAB (16 SECTIONS) */}
        <TabsContent value="modules">
          <Card className="bg-neutral-900/60 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-base text-neutral-100">Módulos Activos de la Tarjeta (16 Secciones)</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Activá o desactivá los bloques de contenido que querés mostrar en la invitación digital.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {standardSections.map((sec) => {
                  const isEnabled = activeSections.includes(sec.id);
                  return (
                    <div
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isEnabled
                          ? 'bg-neutral-950 border-amber-500/40 shadow-sm'
                          : 'bg-neutral-950/40 border-neutral-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isEnabled ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-neutral-600'
                          }`}
                        />
                        <span className="text-xs font-semibold text-neutral-200">{sec.name}</span>
                      </div>

                      <Switch checked={isEnabled} onCheckedChange={() => toggleSection(sec.id)} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
