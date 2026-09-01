import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Tv,
  Users,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Smartphone,
  Music,
  Heart,
  Calendar,
  Layers,
  Shield,
  ExternalLink,
  Star,
  Clock,
  Download,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { themeFontsVariables } from '@/lib/fonts';
import { getSiteConfig } from '@/lib/site-config';

export default async function LandingPage() {
  const config = await getSiteConfig();

  const families = [
    {
      name: 'Elegante Clásica',
      desc: 'Tipografía serif sofisticada, fondos marfil, detalles en oro pulido y estilo editorial.',
      color: '#C5A059',
      bg: '#0D1117',
      tag: 'Bodas de Gala',
      font: 'var(--font-cormorant), serif',
    },
    {
      name: 'Moderna Minimal',
      desc: 'Líneas limpias, tipografía sans vanguardista, verde salvia y estética contemporánea.',
      color: '#E5E7EB',
      bg: '#000000',
      tag: 'Minimal & Chic',
      font: 'var(--font-montserrat), sans-serif',
    },
    {
      name: 'Floral Romántica',
      desc: 'Rosa empolvado, botánica suave y cursiva fluida para celebraciones de ensueño.',
      color: '#F472B6',
      bg: '#1A0B14',
      tag: 'Romántica',
      font: 'var(--font-parisienne), cursive',
    },
    {
      name: 'Glamour Dorada',
      desc: 'Impacto visual nocturno en negro carbón con brillos, perlas y dorados de fiesta.',
      color: '#F59E0B',
      bg: '#0B0B0B',
      tag: '15 Años & Galas',
      font: 'var(--font-great-vibes), cursive',
    },
    {
      name: 'Neón Fiesta',
      desc: 'Energía pura, degradados cyber cian y magenta para fiestas de 15 y eventos con DJ.',
      color: '#06B6D4',
      bg: '#0A0612',
      tag: 'Party & DJ',
      font: 'var(--font-orbitron), sans-serif',
    },
    {
      name: 'Rústica Boho',
      desc: 'Calidez terrosa en tonos terracota, lino y estética campestre al aire libre.',
      color: '#EA580C',
      bg: '#120B08',
      tag: 'Quintas & Aire Libre',
      font: 'var(--font-playfair), serif',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Elegís y Personalizás tu Tarjeta',
      desc: 'Seleccionás entre 18 plantillas exclusivas. Ajustamos paleta de color, fotos, música de fondo, itinerario y mapa exacto con GPS.',
      icon: Layers,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      number: '02',
      title: 'Enviás con Confirmación de Asistencia',
      desc: 'Tus invitados reciben un enlace personalizado donde confirman su asistencia, cantidad de acompañantes y menú especial (veggie, celíaco).',
      icon: Share2,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      number: '03',
      title: 'Tus Invitados Suben Fotos por QR en las Mesas',
      desc: 'Durante la fiesta, los invitados escanean los códigos QR con su celular. Sin descargar aplicaciones ni registrarse: suben fotos directamente.',
      icon: Camera,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      number: '04',
      title: 'Proyección en Vivo + Descarga en Alta Calidad',
      desc: 'Las fotos aparecen en tiempo real en la pantalla gigante del salón con efectos visuales. Al día siguiente descargás todo en un archivo ZIP.',
      icon: Tv,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 antialiased ${themeFontsVariables}`}>
      {/* Responsive Sticky Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-2xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div>
              <span className="text-sm sm:text-lg font-black tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent block">
                ARIEL PRODUCCIONES
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 hidden xs:block tracking-widest uppercase font-medium">
                Experiencias Digitales para Eventos
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-neutral-300">
            <a href="#experiencia" className="hover:text-amber-400 transition-colors">
              Cómo Funciona
            </a>
            <Link href="/plantillas" className="hover:text-amber-400 transition-colors font-bold text-amber-400">
              18 Modelos de Tarjetas
            </Link>
            <a href="#pantalla-en-vivo" className="hover:text-amber-400 transition-colors">
              Pantalla en Vivo
            </a>
            <a href="#planes" className="hover:text-amber-400 transition-colors">
              Planes & Precios
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/plantillas">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 h-8 sm:h-9 px-3.5 sm:px-4"
              >
                Ver Tarjetas
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — Perfectly proportioned for Notebooks, Laptops & BenQ Displays */}
      <section className="relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[250px] sm:h-[380px] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{config.hero.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-neutral-100">
            {config.hero.titleMain}{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              {config.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {config.hero.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
            <Link href="/plantillas" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs sm:text-sm px-6 sm:px-7 h-11 sm:h-12 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-102 cursor-pointer">
                Explorar 18 Modelos de Tarjetas
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <a href="#experiencia" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-neutral-800 hover:bg-neutral-900 text-neutral-200 font-semibold text-xs sm:text-sm px-5 sm:px-6 h-11 sm:h-12 rounded-xl"
              >
                <Tv className="w-4 h-4 mr-2 text-sky-400" />
                ¿Cómo Funciona?
              </Button>
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-[11px] sm:text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">✓</span> Sin descargar apps
            </span>
            <span className="hidden xs:inline text-neutral-700">•</span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">✓</span> Fotos en vivo por QR en pantalla
            </span>
            <span className="hidden xs:inline text-neutral-700">•</span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">✓</span> Confirmación de asistencia online
            </span>
          </div>
        </div>
      </section>

      {/* How it Works / Step by Step */}
      <section id="experiencia" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-amber-400">
            Paso a Paso
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
            ¿Cómo funciona el servicio para tu fiesta?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">
            Desde el primer mensaje hasta el final de la fiesta, todo pensado para que disfrutes sin preocupaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-neutral-900/60 border border-neutral-800/90 hover:border-amber-500/40 transition-all duration-300 space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${step.bg} ${step.color}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black font-mono text-neutral-700">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-100">{step.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 18 Templates Showcase */}
      <section id="plantillas" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-amber-400">
            Colección Exclusiva
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
            18 Modelos en 6 Familias de Diseño
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">
            Cada familia está diseñada por profesionales, con paletas cromáticas cuidadas y tipografías que transmiten la emoción exacta de tu noche.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {families.map((fam) => (
            <div
              key={fam.name}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 hover:scale-102 flex flex-col justify-between shadow-xl"
              style={{ backgroundColor: fam.bg }}
            >
              <div className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 shadow-md"
                    style={{ backgroundColor: fam.color }}
                  />
                  <Badge variant="outline" className="text-[10px] uppercase font-bold border-white/20 text-neutral-300">
                    {fam.tag}
                  </Badge>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-bold text-neutral-100"
                  style={{ fontFamily: fam.font }}
                >
                  {fam.name}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{fam.desc}</p>
              </div>

              <div className="pt-5 sm:pt-6 border-t border-white/10 flex items-center justify-between mt-4">
                <span className="text-[11px] text-neutral-400">3 versiones</span>
                <Link href="/plantillas" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                  Ver modelos <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <Link href="/plantillas">
            <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs sm:text-sm px-6 sm:px-8 py-5 rounded-2xl shadow-xl shadow-amber-500/20">
              Explorar Catálogo Completo de Modelos
            </Button>
          </Link>
        </div>
      </section>

      {/* Realistic Live Screen Feature Section */}
      <section id="pantalla-en-vivo" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" />
              <span>Magia en Vivo durante la fiesta</span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-neutral-100">
              Tus invitados son los fotógrafos de la noche
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-400 leading-relaxed">
              Durante la recepción y el baile, los invitados escanean los códigos QR impresos en las mesas.
              En menos de 3 segundos, sus fotos aparecen proyectadas en la pantalla del salón con su dedicatoria.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-center gap-2.5 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Sin descargas:</strong> Funciona directo en el navegador de iPhone y Android sin instalar nada.</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Panel de moderación en tiempo real:</strong> Ocultás cualquier foto con un clic si lo deseás.</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Descarga ZIP en alta resolución:</strong> Al día siguiente tenés todas las fotos guardadas.</span>
              </li>
            </ul>
          </div>

          {/* Scenic Realistic Projection Stage */}
          <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900/90 p-3.5 sm:p-5 space-y-3">
            {/* Ambient Background & LED Screen Stage */}
            <div className="relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner flex items-center justify-center">
              {/* Photo */}
              <img
                src={config.liveScreenDemo.photoUrl}
                alt="Proyección en Vivo"
                className="w-full h-full object-cover"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

              {/* Top Bar on Stage */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    {config.liveScreenDemo.eventTitle}
                  </span>
                </div>

                <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30">
                  Foto {config.liveScreenDemo.photoNumber}
                </span>
              </div>

              {/* Live Alert Box at Bottom */}
              <div className="absolute bottom-3 inset-x-3 z-10 space-y-1.5 p-3 sm:p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                    📸 {config.liveScreenDemo.uploaderName}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono">Ahora mismo</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-100 font-medium line-clamp-2">
                  "{config.liveScreenDemo.caption}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <QrCode className="w-3.5 h-3.5" />
                Escaneá el QR de mesa para participar
              </span>
              <span className="font-mono text-[10px] text-neutral-500">1080p Full HD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Social Proof */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-amber-400">
            Testimonios Reales
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
            Lo que dicen quienes ya celebraron con nosotros
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {config.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-neutral-900/50 border border-neutral-800/80 space-y-3.5 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80">
                <p className="text-xs font-bold text-neutral-200">{rev.author}</p>
                <p className="text-[10px] text-neutral-500">{rev.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Packages */}
      <section id="planes" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-amber-400">
            Precios Claros & Sin Sorpresas
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
            Elegí el plan perfecto para tu evento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {config.plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border space-y-5 sm:space-y-6 flex flex-col justify-between shadow-xl relative ${
                plan.isFeatured
                  ? 'bg-neutral-900 border-2 border-amber-500 shadow-amber-500/15 md:scale-103'
                  : 'bg-neutral-900/50 border-neutral-800'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest shadow-md">
                  MÁS ELEGIDO
                </div>
              )}

              <div className="space-y-3.5 sm:space-y-4">
                <h3 className={`text-lg sm:text-xl font-bold ${plan.isFeatured ? 'text-amber-400' : 'text-neutral-100'}`}>
                  {plan.name}
                </h3>
                <p className="text-xs text-neutral-400">{plan.description}</p>
                <div className={`text-2xl sm:text-3xl font-black ${plan.isFeatured ? 'text-amber-400' : 'text-neutral-100'}`}>
                  {plan.price}
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-neutral-800">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent(plan.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className={`w-full text-xs font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2 ${
                    plan.isFeatured
                      ? 'bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-black shadow-[#25D366]/25'
                      : 'border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-neutral-200'
                  }`}
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>{plan.buttonText}</span>
                </Button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Official WhatsApp CTA */}
      <aside aria-label="Contacto directo por WhatsApp" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <a
          href={`https://wa.me/${config.contact.whatsappNumber}?text=${encodeURIComponent(config.contact.whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-black text-xs px-4 py-3.5 rounded-full shadow-2xl shadow-[#25D366]/40 transition-all hover:scale-105"
        >
          <WhatsAppIcon className="w-5 h-5 text-neutral-950" />
          <span className="hidden sm:inline font-bold">Hablar con Ariel por WhatsApp</span>
        </a>
      </aside>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-neutral-900 text-center text-xs text-neutral-500 space-y-3">
        <div className="text-amber-400 font-bold text-sm tracking-wide">
          Ariel Producciones
        </div>
        <p>© {new Date().getFullYear()} Ariel Producciones. Todos los derechos reservados.</p>
        <p className="text-[11px] text-neutral-600">
          Experiencias digitales para bodas, 15 años y celebraciones únicas.
        </p>
      </footer>
    </div>
  );
}
