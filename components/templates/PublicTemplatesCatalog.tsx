'use client';

import * as React from 'react';
import Link from 'next/link';
import { Tables } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Eye,
  Search,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Heart,
  Music,
  MapPin,
  Camera,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { themeFontsVariables } from '@/lib/fonts';

interface PublicTemplatesCatalogProps {
  initialTemplates: Tables<'templates'>[];
}

export function PublicTemplatesCatalog({ initialTemplates }: PublicTemplatesCatalogProps) {
  const [selectedFamily, setSelectedFamily] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const families = [
    { id: 'all', name: 'Todas', count: 18 },
    { id: 'elegante-clasica', name: 'Elegante Clásica', count: 3 },
    { id: 'moderna-minimal', name: 'Moderna Minimal', count: 3 },
    { id: 'floral-romantica', name: 'Floral Romántica', count: 3 },
    { id: 'glamour-dorada', name: 'Glamour Dorada', count: 3 },
    { id: 'neon-fiesta', name: 'Neón Fiesta', count: 3 },
    { id: 'rustica-boho', name: 'Rústica Boho', count: 3 },
  ];

  const filteredTemplates = React.useMemo(() => {
    return initialTemplates.filter((tpl) => {
      const matchesFamily =
        selectedFamily === 'all' ||
        tpl.family === selectedFamily ||
        tpl.family.replace('_', '-') === selectedFamily;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        tpl.name.toLowerCase().includes(term) ||
        tpl.slug.toLowerCase().includes(term) ||
        (tpl.description && tpl.description.toLowerCase().includes(term));

      return matchesFamily && matchesSearch;
    });
  }, [initialTemplates, selectedFamily, searchTerm]);

  // Family-specific curated highlights
  const getFamilyBadges = (family: string) => {
    const fam = family.replace('_', '-');
    switch (fam) {
      case 'elegante-clasica':
        return ['Caligrafía Real', 'Confirmación y Banco', 'Estilo Bodas'];
      case 'moderna-minimal':
        return ['Vanguardia', 'Minimalista', 'Cero Recargado'];
      case 'floral-romantica':
        return ['Botánica Romántica', 'Acuarelas Suaves', 'Música'];
      case 'glamour-dorada':
        return ['Oro & Destellos', 'Cumpleaños de 15', 'Gala Nocturna'];
      case 'neon-fiesta':
        return ['Cyber & Glow', 'Fiestas 15 & DJ', 'Pantalla en Vivo'];
      case 'rustica-boho':
        return ['Terracota & Lino', 'Eventos de Campo', 'Línea de Tiempo'];
      default:
        return ['100% Personalizable', 'Mapa & Confirmación', 'Álbum QR'];
    }
  };

  const getSampleHeading = (family: string, variant: string) => {
    const fam = family.replace('_', '-');
    if (fam === 'neon-fiesta') return 'VALENTINA XV';
    if (fam === 'glamour-dorada') return 'Nuestra Noche Soñada';
    if (fam === 'floral-romantica') return 'Camila & Lucas';
    if (fam === 'rustica-boho') return 'Felicidad al Aire Libre';
    if (fam === 'moderna-minimal') return 'SOFÍA & MATEO';
    return 'Sofía & Mateo';
  };

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 antialiased ${themeFontsVariables}`}>
      {/* Responsive Top Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-2xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-neutral-100 rounded-xl h-9 sm:h-10 px-2.5 sm:px-3.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 text-amber-400" />
                <span>Inicio</span>
              </Button>
            </Link>
            <div className="h-4 w-px bg-neutral-800 hidden sm:block" />
            <span className="font-bold text-xs sm:text-sm text-neutral-200 hidden sm:block">
              Catálogo de 18 Modelos de Tarjetas Digitales
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/5491100000000?text=Hola%20Ariel,%20quiero%20consultar%20por%20las%20tarjetas%20digitales%20para%20mi%20evento"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-black text-[11px] sm:text-xs rounded-xl shadow-lg shadow-[#25D366]/20 h-9 sm:h-10 px-3 sm:px-4 flex items-center gap-1.5"
              >
                <WhatsAppIcon className="w-4 h-4 text-neutral-950" />
                <span className="hidden sm:inline">Pedir Asesoramiento</span>
                <span className="sm:hidden">Consultar</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="pt-12 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-4 sm:space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-md">
          <span>Diseños Exclusivos de Ariel Producciones</span>
        </div>
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
          Elegí el estilo perfecto para tu{' '}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            gran celebración
          </span>
        </h1>
        <p className="text-xs sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed px-2">
          Probá cada modelo en vivo con animaciones reales. Todas incluyen cuenta regresiva, confirmación de asistencia con cupos, mapas interactivos y fotos en pantalla gigante.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 space-y-6">
        <div className="space-y-4">
          {/* Search Box on mobile / desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Buscar por estilo o nombre (ej: Floral, Gala, Neón)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-900 border-neutral-800 text-xs rounded-xl h-10 w-full"
              />
            </div>

            <span className="text-[11px] text-neutral-400 font-medium px-1">
              Mostrando <strong className="text-amber-400">{filteredTemplates.length}</strong> de 18 plantillas
            </span>
          </div>

          {/* Family Horizontal Scrollable Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {families.map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  selectedFamily === fam.id
                    ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/25 scale-102 font-black'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{fam.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedFamily === fam.id ? 'bg-neutral-950/20 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {fam.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {filteredTemplates.map((tpl) => {
            const theme = (tpl.default_theme as any) || {};
            const primaryColor = theme.palette?.primary || '#F59E0B';
            const bgColor = theme.palette?.bg || '#0B0B0B';
            const secondaryColor = theme.palette?.secondary || '#171717';
            const textColor = theme.palette?.text || '#FFFFFF';
            const headingFont = theme.fonts?.heading || 'serif';
            const badges = getFamilyBadges(tpl.family);
            const sampleText = getSampleHeading(tpl.family, tpl.variant || 'v1');

            const whatsappMessage = encodeURIComponent(
              `¡Hola Ariel! Me encantó la plantilla "${tpl.name}" (${tpl.slug}) para mi evento. ¿Me contás cómo la personalizamos?`
            );

            return (
              <div
                key={tpl.id}
                className="group rounded-3xl bg-neutral-900/60 border border-neutral-800/90 hover:border-amber-500/60 transition-all duration-400 overflow-hidden flex flex-col justify-between shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
              >
                {/* Visual Header Mockup */}
                <div
                  className="h-52 sm:h-56 p-5 sm:p-6 relative flex flex-col justify-between overflow-hidden border-b border-neutral-800/80 transition-colors"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Radial ambient glow */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none transition-opacity group-hover:opacity-50"
                    style={{
                      background: `radial-gradient(circle at 50% 20%, ${primaryColor} 0%, transparent 75%)`,
                    }}
                  />

                  {/* Top Bar inside mockup */}
                  <div className="flex items-start justify-between z-10">
                    <Badge
                      variant="outline"
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md border-white/15 text-neutral-200 px-2.5 py-1"
                    >
                      {tpl.family.replace(/[-_]/g, ' ')}
                    </Badge>

                    {/* Color Swatch Pill */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-md"
                        style={{ backgroundColor: primaryColor }}
                        title={`Color primario: ${primaryColor}`}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-md"
                        style={{ backgroundColor: secondaryColor }}
                        title={`Color secundario: ${secondaryColor}`}
                      />
                    </div>
                  </div>

                  {/* Typography Showcase Center */}
                  <div className="z-10 text-center my-auto space-y-1">
                    <p
                      className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-mono font-bold"
                      style={{ color: primaryColor }}
                    >
                      {tpl.variant ? `Colección ${tpl.variant.toUpperCase()}` : 'Colección Exclusiva'}
                    </p>
                    <h2
                      className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                      style={{
                        fontFamily: headingFont,
                        color: textColor,
                      }}
                    >
                      {sampleText}
                    </h2>
                  </div>

                  {/* Bottom ornament line */}
                  <div className="z-10 flex items-center justify-center gap-2 opacity-60">
                    <span className="h-[1px] w-12" style={{ backgroundColor: primaryColor }} />
                    <Heart className="w-3 h-3" style={{ color: primaryColor }} />
                    <span className="h-[1px] w-12" style={{ backgroundColor: primaryColor }} />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-7 space-y-5 sm:space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight">
                        {tpl.name}
                      </h3>
                      <span className="text-[10px] font-mono text-amber-400/90 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {tpl.variant?.toUpperCase() || 'V1'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {tpl.description ||
                        'Diseño interactivo con animaciones, reproductor musical y confirmación de invitados.'}
                    </p>

                    {/* Feature Highlights */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {badges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300"
                        >
                          ✓ {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-2.5 sm:gap-3">
                    <Link href={`/demo/${tpl.slug}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold border-neutral-700/80 hover:bg-neutral-800 text-neutral-200 rounded-xl h-10 sm:h-11 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                        Ver Demo
                      </Button>
                    </Link>

                    <a
                      href={`https://wa.me/5491100000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="w-full text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 rounded-xl shadow-lg shadow-[#25D366]/20 h-10 sm:h-11 flex items-center justify-center gap-1.5"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        Elegir Estilo
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-neutral-900 text-center text-xs text-neutral-500 space-y-3">
        <div className="text-amber-400 font-bold text-sm tracking-wide">
          Ariel Producciones
        </div>
        <p>© {new Date().getFullYear()} Ariel Producciones • Experiencias Digitales para Eventos.</p>
        <p className="text-[11px] text-neutral-600">
          Todas las plantillas son 100% editables y adaptables para bodas, 15 años, cumpleaños y eventos corporativos.
        </p>
      </footer>
    </div>
  );
}
