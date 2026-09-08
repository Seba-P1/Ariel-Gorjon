'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/database';
import { updateEvent } from '@/app/(admin)/eventos/actions';
import { toast } from 'sonner';
import {
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
  Video,
  Radio,
  Layout,
  HardDrive,
  Volume2,
  Info,
  AlertCircle,
} from 'lucide-react';
import { YouTubeIcon } from '@/components/ui/icons/YouTubeIcon';
import { parseAudioSource, suggestSongTitle } from '@/lib/music';
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
  const parsedMusic = React.useMemo(() => parseAudioSource(musicUrl), [musicUrl]);
  const [musicSourceMode, setMusicSourceMode] = React.useState<'upload' | 'youtube' | 'drive' | 'direct'>(() => {
    const initialParsed = parseAudioSource(event.music_url || '');
    if (initialParsed.type === 'youtube') return 'youtube';
    if (initialParsed.type === 'drive') return 'drive';
    if (initialParsed.type === 'direct' && !event.music_url?.includes('event-music')) return 'direct';
    return 'upload';
  });

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

  // Hero Section Customization
  const [heroTitle, setHeroTitle] = React.useState(themeConfig.hero_title || '');
  const [heroSubtitle, setHeroSubtitle] = React.useState(themeConfig.hero_subtitle || '');
  const [heroVideoUrl, setHeroVideoUrl] = React.useState(themeConfig.hero_video_url || '');

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

  // Godparents / Padrinos
  const [godparentsTitle, setGodparentsTitle] = React.useState(themeConfig.godparents_title || 'Padrinos & Cortejo');
  const [godparentsMembers, setGodparentsMembers] = React.useState<any[]>(
    themeConfig.godparents_members || [
      { name: 'Carlos Gomez', role: 'Padrino de Boda' },
      { name: 'Mariana Lopez', role: 'Madrina de Boda' },
    ]
  );

  // Accommodation / Hospedaje
  const [accommodationTitle, setAccommodationTitle] = React.useState(themeConfig.accommodation_title || 'Hospedaje Recomendado');
  const [accommodationHotels, setAccommodationHotels] = React.useState<any[]>(
    themeConfig.accommodation_hotels || [
      { name: 'Hotel Boutique Colonial', address: 'Av. Libertador 1200', notes: 'Mencionar código BODA para 15% off' },
    ]
  );

  // Trivia
  const [triviaTitle, setTriviaTitle] = React.useState(themeConfig.trivia_title || '¿Cuánto nos conocés? Trivia');
  const [triviaQuestions, setTriviaQuestions] = React.useState<any[]>(
    themeConfig.trivia_questions || [
      {
        question: '¿Dónde fue nuestra primera cita?',
        options: ['Café del Sol', 'Parque Centenario', 'Un concierto', 'Playa'],
        correctIndex: 0,
      },
    ]
  );

  // Sections config
  const standardSections = [
    { id: 'hero', name: 'Portada Principal (Hero & Título)', icon: Layout },
    { id: 'countdown', name: 'Cuenta Regresiva en Tiempo Real', icon: Clock },
    { id: 'event-details', name: 'Dónde y Cuándo (Ceremonia & Fiesta)', icon: MapPin },
    { id: 'location', name: 'Mapa GPS & Cómo Llegar', icon: MapPin },
    { id: 'dress-code', name: 'Código de Vestimenta (Dress Code)', icon: Shirt },
    { id: 'story', name: 'Historia & Timeline Emotivo', icon: Heart },
    { id: 'photo-album', name: 'Galería de Fotos del Agasajado', icon: ImageIcon },
    { id: 'rsvp', name: 'Formulario de Confirmación de Asistencia', icon: CheckCircle2 },
    { id: 'gifts', name: 'Datos Bancarios & Regalos CBU/Alias', icon: Gift },
    { id: 'live-album-qr', name: 'QR de Álbum en Vivo para Invitados', icon: Camera },
    { id: 'music', name: 'Reproductor de Música Flotante', icon: Music },
    { id: 'song-requests', name: 'Sugerencias de Canciones por Invitados', icon: Radio },
    { id: 'instagram-wall', name: 'Muro Social & Hashtag Oficial', icon: Users },
    { id: 'godparents', name: 'Padrinos / Madrinas / Cortejo', icon: Users },
    { id: 'accommodation', name: 'Hospedaje & Hoteles Cercanos', icon: Hotel },
    { id: 'trivia', name: 'Juego de Trivia para Invitados', icon: HelpCircle },
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
      const suggested = suggestSongTitle(file.name);
      if (!musicTitle || musicTitle.includes('A Thousand Years')) {
        setMusicTitle(suggested);
      }
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
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_video_url: heroVideoUrl,
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
        godparents_title: godparentsTitle,
        godparents_members: godparentsMembers,
        accommodation_title: accommodationTitle,
        accommodation_hotels: accommodationHotels,
        trivia_title: triviaTitle,
        trivia_questions: triviaQuestions,
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
    <div className="space-y-8 pb-16">
      {/* Studio Header Sticky Bar */}
      <div className="sticky top-4 z-30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800/90 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-100 tracking-tight">
                {title || 'Personalizador de Evento'}
              </h1>
              <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10 uppercase">
                {status}
              </Badge>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Ajustá paleta, ceremonias, música, fotos, módulos y textos en tiempo real.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <Link href={`/invitacion/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs rounded-xl h-10 px-3.5">
              <Eye className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              Invitación
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-40" />
            </Button>
          </Link>

          <Link href={`/album/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs rounded-xl h-10 px-3.5">
              <Camera className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Álbum QR
            </Button>
          </Link>

          <Link href={`/pantalla/${slug}`} target="_blank">
            <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs rounded-xl h-10 px-3.5">
              <Tv className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
              Pantalla TV
            </Button>
          </Link>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/25 rounded-xl h-10 px-6 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="flex !h-auto gap-1.5 p-2 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl w-max min-w-full">
            <TabsTrigger value="general" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="design" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Palette className="w-3.5 h-3.5 mr-2" />
              Plantilla & Colores
            </TabsTrigger>
            <TabsTrigger value="hero" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Layout className="w-3.5 h-3.5 mr-2" />
              Portada & Textos
            </TabsTrigger>
            <TabsTrigger value="media" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <ImageIcon className="w-3.5 h-3.5 mr-2" />
              Galería de Fotos
            </TabsTrigger>
            <TabsTrigger value="music" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Music className="w-3.5 h-3.5 mr-2" />
              Música
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <MapPin className="w-3.5 h-3.5 mr-2" />
              Salones & Horarios
            </TabsTrigger>
            <TabsTrigger value="dresscode" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Shirt className="w-3.5 h-3.5 mr-2" />
              Dress Code
            </TabsTrigger>
            <TabsTrigger value="story" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Heart className="w-3.5 h-3.5 mr-2" />
              Historia
            </TabsTrigger>
            <TabsTrigger value="gifts" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Gift className="w-3.5 h-3.5 mr-2" />
              Regalos & CBU
            </TabsTrigger>
            <TabsTrigger value="extras" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Users className="w-3.5 h-3.5 mr-2" />
              Padrinos, Hoteles & Trivia
            </TabsTrigger>
            <TabsTrigger value="album" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Tv className="w-3.5 h-3.5 mr-2" />
              Álbum & Pantalla
            </TabsTrigger>
            <TabsTrigger value="modules" className="text-xs font-semibold py-2.5 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all">
              <Layers className="w-3.5 h-3.5 mr-2" />
              Módulos (16)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. GENERAL TAB */}
        <TabsContent value="general">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-amber-400" />
                Datos Principales del Evento
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Configurá el nombre principal, el enlace web personalizado (slug) y el estado de publicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Título del Evento *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Boda Sofía & Mateo"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                  <p className="text-[11px] text-neutral-500">Aparecerá en el título de la página y encabezados.</p>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Enlace Web Único (Slug) *</Label>
                  <div className="flex items-center">
                    <span className="text-xs text-neutral-400 bg-neutral-900 border border-r-0 border-neutral-800 px-3.5 h-11 flex items-center rounded-l-xl font-mono">
                      /invitacion/
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="sofia-y-mateo"
                      className="bg-neutral-950/80 border-neutral-800 rounded-l-none text-sm font-mono h-11 rounded-r-xl"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500">Solo minúsculas, números y guiones.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Tipo de Celebración</Label>
                  <Select value={eventType} onValueChange={(val: any) => setEventType(val)}>
                    <SelectTrigger className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl">
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

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Fecha y Hora de Inicio</Label>
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Estado del Evento</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl">
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
                <div className="space-y-2.5 pt-4 border-t border-neutral-800/60">
                  <Label className="text-sm font-semibold text-neutral-200">Cliente Asociado (Opcional)</Label>
                  <Select value={clientId} onValueChange={(val) => setClientId(val || '')}>
                    <SelectTrigger className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl max-w-md">
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
          {/* Live Palette Visual Preview */}
          <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                Vista Previa de la Paleta Activa
              </h3>
              <span className="text-[11px] text-neutral-400">Los colores se reflejan en tiempo real</span>
            </div>

            <div
              className="p-6 rounded-2xl border transition-all duration-300 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ backgroundColor: bgColor, borderColor: `${primaryColor}40` }}
            >
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest font-bold font-mono" style={{ color: primaryColor }}>
                  {title || 'Título del Evento'}
                </span>
                <h4 className="text-2xl font-black" style={{ color: textColor }}>
                  Muestra de Tipografía & Contraste
                </h4>
                <p className="text-xs opacity-80" style={{ color: textColor }}>
                  Fondo: <span className="font-mono">{bgColor}</span> • Primario: <span className="font-mono">{primaryColor}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div
                  className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: primaryColor, color: bgColor }}
                >
                  Botón de Acción
                </div>
                <div
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                  style={{ backgroundColor: secondaryColor, borderColor: `${primaryColor}40`, color: textColor }}
                >
                  Tarjeta Secundaria
                </div>
              </div>
            </div>
          </div>

          {/* Template Selection Grid */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-400" />
                Plantilla Base (18 Diseños Exclusivos)
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Hacé clic en una plantilla para aplicar su estilo de fuente, ornamentos y paleta armoniosa.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {templates.map((tpl) => {
                  const isSelected = templateId === tpl.id;
                  const defTheme = (tpl.default_theme as any) || {};
                  const pColor = defTheme.palette?.primary || '#F59E0B';
                  const bColor = defTheme.palette?.bg || '#0B0B0B';
                  const tColor = defTheme.palette?.text || '#FFFFFF';

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-40 relative overflow-hidden group bg-neutral-950/90 ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/20 scale-102 bg-amber-500/5'
                          : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80 hover:scale-102'
                      }`}
                    >
                      {/* Mini Theme Canvas Swatch */}
                      <div
                        className="h-16 rounded-xl p-2.5 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-inner"
                        style={{ backgroundColor: bColor }}
                      >
                        <div className="flex items-center justify-between z-10">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: pColor }}
                          />
                          <span
                            className="text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded backdrop-blur-sm"
                            style={{ backgroundColor: `${bColor}cc`, color: pColor }}
                          >
                            {tpl.variant?.toUpperCase() || 'V1'}
                          </span>
                        </div>
                        <span
                          className="text-[11px] font-bold truncate z-10"
                          style={{ color: tColor }}
                        >
                          {tpl.name.split('—')[0]}
                        </span>
                      </div>

                      {/* Card Info Footer */}
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold truncate">
                            {tpl.family.replace(/[-_]/g, ' ')}
                          </span>
                          {isSelected && (
                            <Badge className="bg-amber-500 text-neutral-950 text-[9px] font-black h-4 px-1.5 shadow-md">
                              ACTIVA
                            </Badge>
                          )}
                        </div>
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

          {/* Color Palettes Fine-Tuning */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100">Personalización Manual de Colores</CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Ajustá con precisión los valores hexadecimales para combinar con el vestido, salón o branding del cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2.5 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <Label className="text-xs font-semibold text-neutral-300">Color Primario (Acentos)</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer bg-transparent border border-neutral-700 p-0.5"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <Label className="text-xs font-semibold text-neutral-300">Color Secundario (Tarjetas)</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer bg-transparent border border-neutral-700 p-0.5"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <Label className="text-xs font-semibold text-neutral-300">Color de Fondo General</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer bg-transparent border border-neutral-700 p-0.5"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <Label className="text-xs font-semibold text-neutral-300">Color de Texto Principal</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer bg-transparent border border-neutral-700 p-0.5"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-mono h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-4 border-t border-neutral-800/60">
                <span className="text-xs font-bold text-neutral-400 block mb-3 uppercase tracking-wider">
                  Combinaciones Rápidas Recomendadas:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { name: 'Oro & Marfil', p: '#D4AF37', s: '#1A1A1A', bg: '#0B0B0B', t: '#FFFFFF' },
                    { name: 'Rose Gold & Frambuesa', p: '#E0A899', s: '#24141E', bg: '#140A10', t: '#FFFFFF' },
                    { name: 'Verde Botánico & Salvia', p: '#4E7D56', s: '#122015', bg: '#09120B', t: '#FFFFFF' },
                    { name: 'Terracota & Tierra', p: '#C86D51', s: '#26140F', bg: '#120805', t: '#FFFFFF' },
                    { name: 'Neón Cyber Cyan', p: '#06B6D4', s: '#0F172A', bg: '#020617', t: '#FFFFFF' },
                    { name: 'Total White Minimal', p: '#111827', s: '#F3F4F6', bg: '#FFFFFF', t: '#111827' },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPrimaryColor(preset.p);
                        setSecondaryColor(preset.s);
                        setBgColor(preset.bg);
                        setTextColor(preset.t);
                      }}
                      className="text-xs border-neutral-800 hover:bg-neutral-800 text-neutral-300 h-9 rounded-xl px-3.5"
                    >
                      <span className="w-3 h-3 rounded-full mr-2 shadow-sm" style={{ backgroundColor: preset.p }} />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. HERO & TEXTOS */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Layout className="w-5 h-5 text-amber-400" />
                Portada Principal (Hero Section)
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Personalizá los textos de impacto que verán los invitados ni bien abren la tarjeta.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Subtítulo Superior del Hero</Label>
                  <Input
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Ej: ¡NOS CASAMOS! / NUESTRA FIESTA"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl font-bold uppercase tracking-wider"
                  />
                  <p className="text-[11px] text-neutral-500">Texto pequeño sobre los nombres de los homenajeados.</p>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Título Principal Personalizado (Opcional)</Label>
                  <Input
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder={`Por defecto: ${title || 'Boda Sofía & Mateo'}`}
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                  <p className="text-[11px] text-neutral-500">Si lo dejás vacío, usará el título general del evento.</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Label className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                  <Video className="w-4 h-4 text-sky-400" />
                  URL de Video de Fondo (Opcional)
                </Label>
                <Input
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="https://.../video-hero.mp4"
                  className="bg-neutral-950/80 border-neutral-800 text-xs font-mono h-11 rounded-xl"
                />
                <p className="text-[11px] text-neutral-500">
                  Enlace directo a video MP4 que se reproducirá en bucle detrás del título en pantallas compatibles.
                </p>
              </div>

              {/* Cover Image Uploader */}
              <div className="pt-4 border-t border-neutral-800/60 space-y-4">
                <Label className="text-sm font-semibold text-neutral-200 block">Imagen de Portada / Fondo</Label>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {coverImageUrl ? (
                    <div className="w-full sm:w-56 h-36 rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-950 shrink-0 shadow-lg">
                      <img src={coverImageUrl} alt="Portada" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setCoverImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Eliminar portada"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full sm:w-56 h-36 rounded-2xl border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-neutral-500 shrink-0 bg-neutral-950/40">
                      <ImageIcon className="w-8 h-8 mb-1.5 opacity-40" />
                      <span className="text-xs font-medium">Sin imagen</span>
                    </div>
                  )}

                  <div className="space-y-3.5 flex-1 w-full">
                    <div>
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>{isUploadingCover ? 'Subiendo y optimizando...' : 'Subir Foto de Portada (JPG, PNG, WebP)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onCoverFileChange}
                          disabled={isUploadingCover}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-neutral-400">O pegar URL directa de imagen:</Label>
                      <Input
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="bg-neutral-950 border-neutral-800 text-xs font-mono h-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. MEDIA TAB (GALERIA) */}
        <TabsContent value="media" className="space-y-6">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  Galería de Fotos del Agasajado ({galleryPhotos.length} fotos)
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Fotos oficiales que los invitados podrán navegar en formato carrusel o cuadrícula.
                </CardDescription>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 text-xs font-bold cursor-pointer transition-colors shadow-md shadow-amber-500/10 shrink-0">
                <Plus className="w-4 h-4" />
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
            <CardContent className="p-6 md:p-8">
              {galleryPhotos.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-neutral-800/60 bg-neutral-950/40 text-neutral-400 text-xs space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-amber-400" />
                  <p className="font-semibold text-neutral-300">No hay fotos en la galería oficial.</p>
                  <p className="text-neutral-500">Podés subir múltiples imágenes juntas desde tu dispositivo.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {galleryPhotos.map((photo, idx) => (
                    <div key={idx} className="group relative h-36 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-md">
                      <img src={photo.url} alt={photo.caption || ''} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-3">
                        <span className="text-[10px] text-neutral-300 font-medium line-clamp-1">{photo.caption || `Foto #${idx + 1}`}</span>
                        <button
                          onClick={() => setGalleryPhotos(galleryPhotos.filter((_, i) => i !== idx))}
                          className="p-2 rounded-xl bg-rose-500/80 text-white hover:bg-rose-600 transition-colors shadow-lg"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. MUSIC TAB */}
        <TabsContent value="music" className="space-y-6">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                    <Music className="w-5 h-5 text-amber-400" />
                    Música de Fondo de la Invitación
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-400 mt-1">
                    Sonará automáticamente cuando los invitados abran o interactúen con la tarjeta.
                  </CardDescription>
                </div>
                {parsedMusic.isValid && (
                  <Badge variant="outline" className="self-start sm:self-auto border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[11px] py-1 px-3">
                    Música activa
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Song Title / Artist Name */}
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">
                  Nombre de la Canción / Artista
                </Label>
                <Input
                  value={musicTitle}
                  onChange={(e) => setMusicTitle(e.target.value)}
                  placeholder="Ej: A Thousand Years — Christina Perri"
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
                <p className="text-[11px] text-neutral-500">
                  Es el título que se mostrará en el botón flotante de la invitación.
                </p>
              </div>

              {/* Source Mode Selector Tabs */}
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-semibold text-neutral-200">
                  Elegí cómo cargar la música:
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMusicSourceMode('upload')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      musicSourceMode === 'upload'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-md'
                        : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Subir de mi PC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMusicSourceMode('youtube')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      musicSourceMode === 'youtube'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-md'
                        : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <YouTubeIcon className="w-4 h-4" />
                    <span>YouTube</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMusicSourceMode('drive')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      musicSourceMode === 'drive'
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-md'
                        : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>Google Drive</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMusicSourceMode('direct')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      musicSourceMode === 'direct'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-md'
                        : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Enlace MP3</span>
                  </button>
                </div>
              </div>

              {/* Source Option 1: Upload from PC */}
              {musicSourceMode === 'upload' && (
                <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200">Subir archivo de audio desde tu computadora</h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        Formatos soportados: MP3, WAV, M4A o AAC (hasta 50 MB).
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer transition-colors border border-neutral-700 shadow-sm">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{isUploadingMusic ? 'Subiendo y procesando pista...' : 'Elegir archivo de música (.mp3 / .wav / .m4a)'}</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                      onChange={onMusicFileChange}
                      disabled={isUploadingMusic}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Source Option 2: YouTube Audio */}
              {musicSourceMode === 'youtube' && (
                <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                        <YouTubeIcon className="w-4 h-4 text-rose-400" />
                        Canción desde YouTube (Solo Audio)
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        Pegá cualquier enlace de video o canción de YouTube. En la tarjeta sonará únicamente el audio en bucle sin mostrar el video.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      value={musicUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMusicUrl(val);
                        const p = parseAudioSource(val);
                        if (p.type === 'youtube' && (!musicTitle || musicTitle.includes('A Thousand Years'))) {
                          setMusicTitle('Tema musical de YouTube');
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                      className="bg-neutral-900 border-neutral-700 text-xs font-mono h-11 rounded-xl text-neutral-100"
                    />
                  </div>

                  {parsedMusic.type === 'youtube' ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Enlace de YouTube válido detectado (ID: <strong className="font-mono">{parsedMusic.youtubeId}</strong>). La música sonará en segundo plano.
                      </span>
                    </div>
                  ) : musicUrl ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Pegá un enlace válido de YouTube (ej: https://www.youtube.com/watch?v=...)</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Source Option 3: Google Drive */}
              {musicSourceMode === 'drive' && (
                <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-sky-400" />
                        Canción desde Google Drive
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        Pegá el enlace para compartir de un archivo de audio guardado en tu Google Drive.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      value={musicUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMusicUrl(val);
                        const p = parseAudioSource(val);
                        if (p.type === 'drive' && (!musicTitle || musicTitle.includes('A Thousand Years'))) {
                          setMusicTitle('Canción desde Google Drive');
                        }
                      }}
                      placeholder="https://drive.google.com/file/d/1X-example-id/view?usp=sharing"
                      className="bg-neutral-900 border-neutral-700 text-xs font-mono h-11 rounded-xl text-neutral-100"
                    />
                  </div>

                  {parsedMusic.type === 'drive' ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Archivo de Google Drive detectado (ID: <strong className="font-mono">{parsedMusic.driveId}</strong>). Se transmitirá automáticamente.
                      </span>
                    </div>
                  ) : null}

                  <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Importante:</strong> En Google Drive, hacé clic derecho en el archivo de audio &gt; <em>Compartir</em> &gt; cambiar el acceso general a <strong>"Cualquiera con el enlace"</strong> (Lector) para que los invitados puedan escucharlo.
                    </span>
                  </div>
                </div>
              )}

              {/* Source Option 4: Direct URL */}
              {musicSourceMode === 'direct' && (
                <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-4">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-neutral-200">URL Directa del Archivo de Audio</Label>
                    <Input
                      value={musicUrl}
                      onChange={(e) => setMusicUrl(e.target.value)}
                      placeholder="https://.../cancion.mp3"
                      className="bg-neutral-900 border-neutral-700 text-xs font-mono h-11 rounded-xl text-neutral-100"
                    />
                    <p className="text-[11px] text-neutral-500">
                      Enlace directo HTTPS que apunte a un archivo .mp3, .wav o .m4a en cualquier servidor.
                    </p>
                  </div>
                </div>
              )}

              {/* Live Preview Player in Admin Studio */}
              {musicUrl && (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Volume2 className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-100">{musicTitle || 'Música de fondo'}</span>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono px-2 py-0 border-neutral-700 text-neutral-300">
                            {parsedMusic.type === 'youtube' ? 'YouTube' : parsedMusic.type === 'drive' ? 'Google Drive' : 'Audio MP3'}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-neutral-500 font-mono truncate max-w-sm block mt-0.5">
                          {musicUrl}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMusicUrl('')}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-8 px-3 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Quitar música
                    </Button>
                  </div>

                  {/* Player Element */}
                  <div className="pt-1">
                    {parsedMusic.type === 'youtube' ? (
                      <div className="space-y-3">
                        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-black aspect-video max-w-sm">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${parsedMusic.youtubeId}?rel=0`}
                            title="Previsualización de YouTube"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Aquí podés escucharla para verificarla. En la invitación de los invitados <strong>solo sonará la música de fondo</strong>, sin ventana de video.</span>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <audio
                          controls
                          src={parsedMusic.resolvedUrl}
                          className="w-full max-w-md h-10 rounded-lg"
                        />
                        <p className="text-[11px] text-neutral-500">
                          Previsualizador de audio: presioná Play para escuchar la pista antes de guardar.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. LOCATIONS & TIMES TAB */}
        <TabsContent value="locations" className="space-y-6">
          {/* Ceremony Card */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-sky-400" />
                Salón / Lugar 1: Ceremonia Religiosa o Civil
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Datos de la iglesia, parroquia o registro civil (opcional).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Título de la Ceremonia</Label>
                  <Input
                    value={ceremonyTitle}
                    onChange={(e) => setCeremonyTitle(e.target.value)}
                    placeholder="Ej: Ceremonia Religiosa"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Horario de la Ceremonia</Label>
                  <Input
                    value={ceremonyTime}
                    onChange={(e) => setCeremonyTime(e.target.value)}
                    placeholder="Ej: 18:30 hs"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">Lugar & Dirección de la Ceremonia</Label>
                <Input
                  value={ceremonyAddress}
                  onChange={(e) => setCeremonyAddress(e.target.value)}
                  placeholder="Ej: Parroquia San Benito de Palermo, Villanueva 905, CABA"
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Party Card */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-amber-400" />
                Salón / Lugar 2: Fiesta & Recepción
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Salón principal de eventos donde se realiza la fiesta.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Nombre del Salón / Quinta</Label>
                  <Input
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Ej: Palacio Sans Souci"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Horario de la Fiesta</Label>
                  <Input
                    value={partyTime}
                    onChange={(e) => setPartyTime(e.target.value)}
                    placeholder="Ej: 20:30 hs"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">Dirección Completa de la Fiesta</Label>
                <Input
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="Ej: Paz 461, Victoria, San Fernando, Provincia de Buenos Aires"
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-2.5">
                  <Label className="text-xs text-neutral-400">Latitud GPS (Para Waze/Google Maps exacto)</Label>
                  <Input
                    value={locationLat}
                    onChange={(e) => setLocationLat(e.target.value)}
                    placeholder="-34.4533"
                    className="bg-neutral-950/80 border-neutral-800 text-xs font-mono h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs text-neutral-400">Longitud GPS</Label>
                  <Input
                    value={locationLng}
                    onChange={(e) => setLocationLng(e.target.value)}
                    placeholder="-58.5472"
                    className="bg-neutral-950/80 border-neutral-800 text-xs font-mono h-10 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. DRESS CODE TAB */}
        <TabsContent value="dresscode">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Shirt className="w-5 h-5 text-amber-400" />
                Código de Vestimenta (Dress Code)
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Indicaciones claras para que los invitados asistan con la etiqueta adecuada.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">Tipo de Etiqueta</Label>
                <Select value={dressCodeType} onValueChange={setDressCodeType}>
                  <SelectTrigger className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl">
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

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">Descripción o Recomendación</Label>
                <Textarea
                  value={dressCodeDesc}
                  onChange={(e) => setDressCodeDesc(e.target.value)}
                  placeholder="Ej: Queremos que te vistas para brillar y disfrutar una noche inolvidable."
                  className="bg-neutral-950/80 border-neutral-800 text-sm min-h-[90px] rounded-xl"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">Notas Especiales o Qué Evitar</Label>
                <Input
                  value={dressCodeNotes}
                  onChange={(e) => setDressCodeNotes(e.target.value)}
                  placeholder="Ej: Por favor no asistir vestidos de blanco ni beige."
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. STORY TAB */}
        <TabsContent value="story">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-400" />
                Nuestra Historia / Timeline
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Sección emotiva donde se relatan los hitos de la pareja o el homenajeado.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Título de la Sección</Label>
                  <Input
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="El Camino Hacia el Gran Día"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Subtítulo</Label>
                  <Input
                    value={storySubtitle}
                    onChange={(e) => setStorySubtitle(e.target.value)}
                    placeholder="Nuestra Historia"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold text-neutral-200">Hitos de la Historia (Timeline)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setStoryMilestones([
                        ...storyMilestones,
                        { year: '2026', title: 'Nuevo Momento', description: 'Descripción del momento...' },
                      ])
                    }
                    className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar Hito
                  </Button>
                </div>

                {storyMilestones.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        value={m.year}
                        onChange={(e) => {
                          const copy = [...storyMilestones];
                          copy[idx].year = e.target.value;
                          setStoryMilestones(copy);
                        }}
                        placeholder="Año / Fecha"
                        className="w-32 bg-neutral-900 border-neutral-800 text-xs font-bold h-10 rounded-xl"
                      />
                      <Input
                        value={m.title}
                        onChange={(e) => {
                          const copy = [...storyMilestones];
                          copy[idx].title = e.target.value;
                          setStoryMilestones(copy);
                        }}
                        placeholder="Título del hito"
                        className="flex-1 bg-neutral-900 border-neutral-800 text-xs font-semibold h-10 rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setStoryMilestones(storyMilestones.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:bg-rose-500/10 h-10 w-10 p-0 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
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
                      className="bg-neutral-900 border-neutral-800 text-xs min-h-[70px] rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. GIFTS & BANKING TAB */}
        <TabsContent value="gifts">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-amber-400" />
                Datos Bancarios & Mesa de Regalos
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Los invitados podrán copiar el CBU o Alias con un solo clic desde la invitación.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-neutral-200">Mensaje a los Invitados</Label>
                <Textarea
                  value={giftDesc}
                  onChange={(e) => setGiftDesc(e.target.value)}
                  placeholder="Tu presencia es nuestro mejor regalo..."
                  className="bg-neutral-950/80 border-neutral-800 text-sm min-h-[80px] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Alias de Cuenta (Mercado Pago / Banco)</Label>
                  <Input
                    value={alias}
                    onChange={(e) => setAlias(e.target.value.toUpperCase())}
                    placeholder="SOFIA.Y.MATEO.BODA"
                    className="bg-neutral-950/80 border-neutral-800 text-sm font-mono font-bold text-amber-400 h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">CBU / CVU (22 dígitos)</Label>
                  <Input
                    value={cbu}
                    onChange={(e) => setCbu(e.target.value)}
                    placeholder="0000003100012345678901"
                    className="bg-neutral-950/80 border-neutral-800 text-sm font-mono h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Nombre del Banco / Billetera</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Mercado Pago / Banco Galicia"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Titular de la Cuenta</Label>
                  <Input
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Sofía Rodriguez y Mateo Gómez"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Label className="text-sm font-semibold text-neutral-200">Link a Lista de Regalos Externa (opcional)</Label>
                <Input
                  value={giftRegistryUrl}
                  onChange={(e) => setGiftRegistryUrl(e.target.value)}
                  placeholder="https://novios.falabella.com.ar/..."
                  className="bg-neutral-950/80 border-neutral-800 text-xs font-mono h-11 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 10. EXTRAS (PADRINOS, HOSPEDAJE, TRIVIA) */}
        <TabsContent value="extras" className="space-y-6">
          {/* Godparents / Cortejo */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-amber-400" />
                  Padrinos / Madrinas / Cortejo
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Presentá a las personas especiales que acompañan a los agasajados.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGodparentsMembers([...godparentsMembers, { name: '', role: 'Padrino' }])}
                className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar Integrante
              </Button>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="space-y-2.5 max-w-md">
                <Label className="text-sm font-semibold text-neutral-200">Título de la Sección</Label>
                <Input
                  value={godparentsTitle}
                  onChange={(e) => setGodparentsTitle(e.target.value)}
                  placeholder="Padrinos & Cortejo de Honor"
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
              </div>

              <div className="space-y-3 pt-3">
                {godparentsMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                    <Input
                      value={member.name}
                      onChange={(e) => {
                        const copy = [...godparentsMembers];
                        copy[idx].name = e.target.value;
                        setGodparentsMembers(copy);
                      }}
                      placeholder="Nombre y Apellido"
                      className="flex-1 bg-neutral-900 border-neutral-800 text-sm h-10 rounded-xl"
                    />
                    <Input
                      value={member.role}
                      onChange={(e) => {
                        const copy = [...godparentsMembers];
                        copy[idx].role = e.target.value;
                        setGodparentsMembers(copy);
                      }}
                      placeholder="Rol (ej: Madrina, Padrino)"
                      className="w-48 bg-neutral-900 border-neutral-800 text-sm h-10 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setGodparentsMembers(godparentsMembers.filter((_, i) => i !== idx))}
                      className="text-rose-400 hover:bg-rose-500/10 h-10 w-10 p-0 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Accommodation / Hoteles */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                  <Hotel className="w-5 h-5 text-sky-400" />
                  Hospedaje & Hoteles Recomendados
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Opciones para invitados que viajan desde otras ciudades.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAccommodationHotels([...accommodationHotels, { name: '', address: '', notes: '' }])}
                className="text-xs border-sky-500/30 text-sky-400 hover:bg-sky-500/10 h-8 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar Hotel
              </Button>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="space-y-2.5 max-w-md">
                <Label className="text-sm font-semibold text-neutral-200">Título de la Sección</Label>
                <Input
                  value={accommodationTitle}
                  onChange={(e) => setAccommodationTitle(e.target.value)}
                  placeholder="Hospedaje Recomendado"
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
              </div>

              <div className="space-y-3 pt-3">
                {accommodationHotels.map((hotel, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        value={hotel.name}
                        onChange={(e) => {
                          const copy = [...accommodationHotels];
                          copy[idx].name = e.target.value;
                          setAccommodationHotels(copy);
                        }}
                        placeholder="Nombre del Hotel"
                        className="flex-1 bg-neutral-900 border-neutral-800 text-sm font-bold h-10 rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAccommodationHotels(accommodationHotels.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:bg-rose-500/10 h-10 w-10 p-0 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={hotel.address}
                        onChange={(e) => {
                          const copy = [...accommodationHotels];
                          copy[idx].address = e.target.value;
                          setAccommodationHotels(copy);
                        }}
                        placeholder="Dirección o Teléfono"
                        className="bg-neutral-900 border-neutral-800 text-xs h-10 rounded-xl"
                      />
                      <Input
                        value={hotel.notes}
                        onChange={(e) => {
                          const copy = [...accommodationHotels];
                          copy[idx].notes = e.target.value;
                          setAccommodationHotels(copy);
                        }}
                        placeholder="Código de descuento o link"
                        className="bg-neutral-900 border-neutral-800 text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trivia */}
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Juego de Trivia para Invitados
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  Preguntas interactivas con puntuación para que los invitados jueguen desde la tarjeta.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setTriviaQuestions([
                    ...triviaQuestions,
                    { question: 'Nueva Pregunta', options: ['Opción A', 'Opción B', 'Opción C'], correctIndex: 0 },
                  ])
                }
                className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar Pregunta
              </Button>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="space-y-2.5 max-w-md">
                <Label className="text-sm font-semibold text-neutral-200">Título de la Trivia</Label>
                <Input
                  value={triviaTitle}
                  onChange={(e) => setTriviaTitle(e.target.value)}
                  placeholder="¿Cuánto nos conocés? Trivia"
                  className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                />
              </div>

              <div className="space-y-4 pt-3">
                {triviaQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        value={q.question}
                        onChange={(e) => {
                          const copy = [...triviaQuestions];
                          copy[idx].question = e.target.value;
                          setTriviaQuestions(copy);
                        }}
                        placeholder="Escribí la pregunta..."
                        className="flex-1 bg-neutral-900 border-neutral-800 text-sm font-bold h-10 rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTriviaQuestions(triviaQuestions.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:bg-rose-500/10 h-10 w-10 p-0 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options?.map((opt: string, optIdx: number) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span
                            onClick={() => {
                              const copy = [...triviaQuestions];
                              copy[idx].correctIndex = optIdx;
                              setTriviaQuestions(copy);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${
                              q.correctIndex === optIdx
                                ? 'bg-emerald-500 text-neutral-950 font-black ring-2 ring-emerald-400/50'
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                            }`}
                            title="Hacé clic para marcar como respuesta correcta"
                          >
                            {optIdx + 1}
                          </span>
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const copy = [...triviaQuestions];
                              copy[idx].options[optIdx] = e.target.value;
                              setTriviaQuestions(copy);
                            }}
                            placeholder={`Opción ${optIdx + 1}`}
                            className="bg-neutral-900 border-neutral-800 text-xs h-9 rounded-xl"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 11. LIVE ALBUM & SCREEN TAB */}
        <TabsContent value="album">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Tv className="w-5 h-5 text-amber-400" />
                Configuración de Álbum PWA & Pantalla en Vivo
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Ajustes para la proyección en pantalla gigante y subida de fotos por invitados mediante código QR.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-neutral-100">Habilitar Álbum en Vivo por QR</h4>
                  <p className="text-xs text-neutral-400">Permitir a los invitados subir fotos desde sus celulares escaneando el código QR.</p>
                </div>
                <Switch checked={albumEnabled} onCheckedChange={setAlbumEnabled} />
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 shadow-sm">
                <div>
                  <h4 className="text-sm font-bold text-neutral-100">Moderación Manual Previa</h4>
                  <p className="text-xs text-neutral-400">
                    Si está activo, las fotos requieren aprobación en el panel antes de salir proyectadas en la pantalla.
                  </p>
                </div>
                <Switch checked={albumManualApproval} onCheckedChange={setAlbumManualApproval} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Duración por Foto en Pantalla</Label>
                  <Select value={albumSlideDuration} onValueChange={(val) => setAlbumSlideDuration(val || '4000')}>
                    <SelectTrigger className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl">
                      <SelectValue placeholder="Duración" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                      <SelectItem value="2500">2.5 segundos (Dinámico)</SelectItem>
                      <SelectItem value="4000">4 segundos (Recomendado)</SelectItem>
                      <SelectItem value="6000">6 segundos (Tranquilo)</SelectItem>
                      <SelectItem value="8000">8 segundos (Lento)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Efecto Visual en Pantalla</Label>
                  <Select value={albumTransition} onValueChange={(val) => setAlbumTransition(val || 'kenburns')}>
                    <SelectTrigger className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Hashtag Oficial del Evento</Label>
                  <Input
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    placeholder="#BodaSofiYMateo"
                    className="bg-neutral-950/80 border-neutral-800 text-sm font-bold text-amber-400 h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-neutral-200">Usuario de Instagram para Muro Social</Label>
                  <Input
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@arielproducciones"
                    className="bg-neutral-950/80 border-neutral-800 text-sm h-11 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 12. MODULES TAB (16 SECTIONS) */}
        <TabsContent value="modules">
          <Card className="bg-neutral-900/70 border-neutral-800/80 shadow-xl rounded-3xl">
            <CardHeader className="p-6 md:p-8 border-b border-neutral-800/60">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-400" />
                Módulos Activos de la Tarjeta ({activeSections.length}/16 Activos)
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Activá o desactivá los bloques de contenido que querés mostrar en la invitación digital interactiva.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {standardSections.map((sec) => {
                  const isEnabled = activeSections.includes(sec.id);
                  const Icon = sec.icon;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                        isEnabled
                          ? 'bg-neutral-950/90 border-amber-500/40 shadow-sm shadow-amber-500/5'
                          : 'bg-neutral-950/30 border-neutral-800/60 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isEnabled
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-neutral-200">{sec.name}</span>
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
