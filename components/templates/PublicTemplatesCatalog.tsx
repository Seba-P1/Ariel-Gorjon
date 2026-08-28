'use client';

import * as React from 'react';
import Link from 'next/link';
import { Tables, TemplateFamily } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Eye,
  MessageCircle,
  Search,
  ArrowLeft,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface PublicTemplatesCatalogProps {
  initialTemplates: Tables<'templates'>[];
}

export function PublicTemplatesCatalog({ initialTemplates }: PublicTemplatesCatalogProps) {
  const [selectedFamily, setSelectedFamily] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const families: { id: string; name: string }[] = [
    { id: 'all', name: 'Todas (18)' },
    { id: 'elegante-clasica', name: 'Elegante Clásica' },
    { id: 'moderna-minimal', name: 'Moderna Minimal' },
    { id: 'floral-romantica', name: 'Floral Romántica' },
    { id: 'glamour-dorada', name: 'Glamour Dorada' },
    { id: 'neon-fiesta', name: 'Neón Fiesta' },
    { id: 'rustica-boho', name: 'Rústica Boho' },
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-neutral-100 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Inicio
              </Button>
            </Link>
            <div className="h-4 w-px bg-neutral-800" />
            <span className="font-bold text-sm text-neutral-200">Catálogo de Diseños</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-800 hover:bg-neutral-900 text-xs font-semibold rounded-xl"
              >
                Acceso Panel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="pt-16 pb-12 px-6 max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>18 Diseños Exclusivos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight">
          Elegí la plantilla perfecta para tu fiesta
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
          Probá cada diseño en vivo con datos reales. Todas las plantillas incluyen música de fondo,
          confirmación RSVP instantánea, mapas GPS y álbum de fotos en tiempo real.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-12 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Family Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {families.map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedFamily === fam.id
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
                }`}
              >
                {fam.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Buscar por estilo o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-neutral-900 border-neutral-800 text-sm rounded-xl"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredTemplates.map((tpl) => {
            const theme = (tpl.default_theme as any) || {};
            const primaryColor = theme.palette?.primary || '#F59E0B';
            const bgColor = theme.palette?.bg || '#0B0B0B';
            const secondaryColor = theme.palette?.secondary || '#171717';
            const textColor = theme.palette?.text || '#FFFFFF';

            const whatsappMessage = encodeURIComponent(
              `Hola Ariel! Me gustó la plantilla "${tpl.name}" (${tpl.slug}) para mi evento. ¿Podemos coordinar para armar la mía?`
            );

            return (
              <div
                key={tpl.id}
                className="group rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
              >
                {/* Visual Header / Stylized Canvas */}
                <div
                  className="h-44 p-6 relative flex flex-col justify-between overflow-hidden border-b border-neutral-800/80"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Subtle Gradient Glow */}
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${primaryColor} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="flex items-start justify-between z-10">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md border-white/10 text-neutral-200"
                    >
                      {tpl.family.replace(/[-_]/g, ' ')}
                    </Badge>

                    <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                        title={`Color primario: ${primaryColor}`}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: secondaryColor }}
                        title={`Color secundario: ${secondaryColor}`}
                      />
                    </div>
                  </div>

                  <div className="z-10 space-y-1">
                    <span
                      className="text-[11px] font-mono font-bold tracking-widest uppercase block"
                      style={{ color: primaryColor }}
                    >
                      {tpl.variant || tpl.slug}
                    </span>
                    <h3
                      className="text-xl font-bold tracking-tight line-clamp-1"
                      style={{ color: textColor }}
                    >
                      {tpl.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {tpl.description ||
                      'Invitación interactiva completa con animaciones exclusivas, confirmación y música.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Cuenta regresiva y mapa interactivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Álbum PWA en vivo con proyección QR</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 grid grid-cols-2 gap-2.5">
                    <Link href={`/demo/${tpl.slug}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold border-neutral-700 hover:bg-neutral-800 text-neutral-200 rounded-xl"
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
                        className="w-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl shadow-md shadow-amber-500/15"
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Elegir
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
      <footer className="py-12 px-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Ariel Producciones • Experiencias Digitales para Eventos.</p>
      </footer>
    </div>
  );
}
