'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
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
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const families = [
    {
      name: 'Elegante Clásica',
      desc: 'Tipografía serif sofisticada, fondos marfil y detalles en oro pulido.',
      color: '#C5A059',
      bg: '#0D1117',
    },
    {
      name: 'Moderna Minimal',
      desc: 'Líneas limpias, tipografía sans vanguardista y estética monocromática con acento dorado.',
      color: '#E5E7EB',
      bg: '#000000',
    },
    {
      name: 'Floral Romántica',
      desc: 'Tonos rosa empolvado, botánica suave y cursiva fluida para bodas de ensueño.',
      color: '#F472B6',
      bg: '#1A0B14',
    },
    {
      name: 'Glamour Dorada',
      desc: 'Alto impacto visual en negro carbón con brillos y dorados de fiesta nocturna.',
      color: '#F59E0B',
      bg: '#0B0B0B',
    },
    {
      name: 'Neón Fiesta',
      desc: 'Energía pura con degradados cian y magenta para cumpleaños de 15 y fiestas electrónicas.',
      color: '#06B6D4',
      bg: '#0A0612',
    },
    {
      name: 'Rústica Boho',
      desc: 'Calidez terrosa en tonos terracota, lino y estética campestre al aire libre.',
      color: '#EA580C',
      bg: '#120B08',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                ARIEL PRODUCCIONES
              </span>
              <span className="text-[10px] text-neutral-400 block tracking-widest uppercase font-medium">
                Experiencias Digitales para Eventos
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-300">
            <a href="#experiencia" className="hover:text-amber-400 transition-colors">
              La Experiencia
            </a>
            <Link href="/plantillas" className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-400">
              <Sparkles className="w-3 h-3" />
              18 Plantillas
            </Link>
            <a href="#pantalla-en-vivo" className="hover:text-amber-400 transition-colors">
              Álbum & Pantalla
            </a>
            <a href="#planes" className="hover:text-amber-400 transition-colors">
              Planes
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-800 hover:bg-neutral-900 text-neutral-200 text-xs font-semibold rounded-xl"
              >
                Panel de Control
              </Button>
            </Link>
            <a
              href="https://wa.me/5491100000000?text=Hola%20Ariel,%20quiero%20información%20para%20mi%20evento"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                Contactar
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/20 via-rose-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Invitaciones Digitales + Fotos en Pantalla Gigante</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]"
          >
            Hacé de tu fiesta una{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              experiencia inolvidable
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Invitaciones web interactivas con música, mapas y confirmación RSVP al instante, junto con un
            álbum PWA donde tus invitados suben fotos con código QR y se proyectan en vivo durante la
            fiesta.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/plantillas">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-black text-sm px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2" />
                Explorar las 18 Plantillas en Vivo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <a
              href="#pantalla-en-vivo"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-neutral-800 hover:bg-neutral-900 text-neutral-200 font-semibold text-sm px-8 py-6 rounded-2xl"
              >
                <Tv className="w-4 h-4 mr-2 text-sky-400" />
                Ver Demo en Pantalla
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section id="experiencia" className="py-24 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400">
            Todo en una sola plataforma
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            La solución integral para tu evento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100">Invitación Interactiva</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                16 módulos intercambiables: cuenta regresiva, mapas Waze/Google, dress code, regalos con CBU,
                música y mensajes emotivos.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-amber-400">18 Estilos Exclusivos →</div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-sky-500/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 w-fit">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100">RSVP con Cupos</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Confirmación por invitado o grupo familiar con límites de acompañantes, dietas celíaco/veggie y
                exportación directa a Excel.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-sky-400">Control en Tiempo Real →</div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-rose-500/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 w-fit">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100">Álbum PWA por QR</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Sin descargar aplicaciones. Los invitados escanean el código QR en las mesas y suben fotos en
                alta calidad al instante.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-rose-400">Descarga Completa ZIP →</div>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-violet-500/40 transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-400 w-fit">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100">Pantalla Gigante</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Proyección en vivo para proyectores y pantallas LED de salón con efectos visuales y alertas
                emergentes en cada nueva foto.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-violet-400">Modo Fullscreen F11 →</div>
          </div>
        </div>
      </section>

      {/* 18 Templates Showcase */}
      <section id="plantillas" className="py-24 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400">
            Diseños de Vanguardia
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            18 Plantillas en 6 Familias de Estilo
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
            Cada plantilla está curada con paletas de color HSL armoniosas, 20+ tipografías Google Fonts y
            animaciones fluidas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((fam) => (
            <div
              key={fam.name}
              className="p-8 rounded-3xl border border-neutral-800/80 transition-all hover:scale-105 flex flex-col justify-between"
              style={{ backgroundColor: fam.bg }}
            >
              <div className="space-y-4">
                <div
                  className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                  style={{ backgroundColor: fam.color }}
                />
                <h3 className="text-2xl font-bold text-neutral-100">{fam.name}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{fam.desc}</p>
              </div>

              <div className="pt-6">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider border-white/20 text-neutral-300"
                >
                  3 Versiones por Familia
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Screen & Album Showcase */}
      <section id="pantalla-en-vivo" className="py-24 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" />
              <span>Magia en Vivo durante la fiesta</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Tus invitados son los fotógrafos de la noche
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Durante la recepción y el baile, los invitados escanean los códigos QR impresos en las mesas.
              En menos de 5 segundos, sus fotos aparecen proyectadas en la pantalla del salón con su nombre y
              dedicatoria.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sin descargas: funciona en cualquier navegador de iPhone y Android.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Panel de moderación en tiempo real para ocultar cualquier foto inadecuada.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Descarga del álbum completo en alta calidad en archivo ZIP al día siguiente.</span>
              </li>
            </ul>
          </div>

          {/* Visual Showcase Box */}
          <div className="relative p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[11px] font-mono text-neutral-500">pantalla.arielproducciones.com</span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center p-6 text-center">
              <div className="space-y-3">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-bold text-base text-neutral-200">¡Nueva Foto de Familia Pérez!</h4>
                <p className="text-xs text-neutral-400">"¡Felicidades a los recién casados! Los amamos ❤️"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Packages */}
      <section id="planes" className="py-24 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400">
            Precios Claros & Sin Sorpresas
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Elegí el plan perfecto para tu evento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Invitación Esencial</h3>
              <p className="text-xs text-neutral-400">Para quienes buscan una invitación moderna y elegante.</p>
              <div className="text-3xl font-black text-neutral-100">$25.000</div>
              <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-neutral-800">
                <li className="flex items-center gap-2">✓ Invitación web personalizada</li>
                <li className="flex items-center gap-2">✓ Confirmación RSVP básica</li>
                <li className="flex items-center gap-2">✓ Ubicación GPS y cuenta regresiva</li>
                <li className="flex items-center gap-2">✓ Datos bancarios / regalos</li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491100000000?text=Hola%20Ariel,%20quiero%20el%20Plan%20Esencial"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full border-neutral-800 text-xs font-semibold">
                Contratar Esencial
              </Button>
            </a>
          </div>

          {/* Plan 2: Destacado */}
          <div className="p-8 rounded-3xl bg-neutral-900 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase tracking-wider">
              Más Elegido
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-400">Experiencia Completa</h3>
              <p className="text-xs text-neutral-300">Invitación interactiva + Álbum en vivo + Pantalla de fiesta.</p>
              <div className="text-3xl font-black text-amber-400">$45.000</div>
              <ul className="space-y-2.5 text-xs text-neutral-200 pt-4 border-t border-neutral-800">
                <li className="flex items-center gap-2">✓ Todo lo del plan Esencial</li>
                <li className="flex items-center gap-2">✓ Álbum PWA con subida QR</li>
                <li className="flex items-center gap-2">✓ Proyección en pantalla gigante en vivo</li>
                <li className="flex items-center gap-2">✓ Links personales por invitado (slots)</li>
                <li className="flex items-center gap-2">✓ Descarga ZIP en alta resolución</li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491100000000?text=Hola%20Ariel,%20quiero%20el%20Plan%20Experiencia%20Completa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs">
                Contratar Experiencia Completa
              </Button>
            </a>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Producción Total</h3>
              <p className="text-xs text-neutral-400">Para bodas y mega eventos con asistencia técnica presencial.</p>
              <div className="text-3xl font-black text-neutral-100">Consultar</div>
              <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-neutral-800">
                <li className="flex items-center gap-2">✓ Todo lo del plan Experiencia Completa</li>
                <li className="flex items-center gap-2">✓ Operador técnico presencial en el evento</li>
                <li className="flex items-center gap-2">✓ Carteles acrílicos con QR para mesas</li>
                <li className="flex items-center gap-2">✓ Dominio web exclusivo (ej: sofiaymateo.com)</li>
              </ul>
            </div>
            <a
              href="https://wa.me/5491100000000?text=Hola%20Ariel,%20quiero%20el%20Plan%20Producción%20Total"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full border-neutral-800 text-xs font-semibold">
                Consultar Presupuesto
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-900 text-center text-xs text-neutral-500 space-y-4">
        <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Ariel Producciones</span>
        </div>
        <p>© {new Date().getFullYear()} Ariel Producciones. Todos los derechos reservados.</p>
        <p className="text-[11px] text-neutral-600">
          Diseñado y desarrollado para eventos inolvidables en Argentina y Latinoamérica.
        </p>
      </footer>
    </div>
  );
}
