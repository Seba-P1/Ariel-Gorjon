import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Camera, Users, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function DashboardPage() {
  const admin = createAdminClient();

  const [{ count: eventsCount }, { count: rsvpsCount }, { count: photosCount }] = await Promise.all([
    admin.from('events').select('*', { count: 'exact', head: true }),
    admin.from('rsvps').select('*', { count: 'exact', head: true }),
    admin.from('photos').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Panel de Control
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Bienvenido al centro de operaciones de eventos de Ariel Gorjón.
          </p>
        </div>

        <Link href="/eventos">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
            <Calendar className="w-4 h-4 mr-2" />
            Gestionar Eventos
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-neutral-800 bg-neutral-900/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Eventos Totales
            </CardTitle>
            <Calendar className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{eventsCount ?? 0}</div>
            <p className="text-xs text-neutral-500 mt-1">Eventos registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Confirmaciones de Asistencia
            </CardTitle>
            <Users className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{rsvpsCount ?? 0}</div>
            <p className="text-xs text-neutral-500 mt-1">Invitados confirmados acumulados</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Fotos del Álbum
            </CardTitle>
            <Camera className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-100">{photosCount ?? 0}</div>
            <p className="text-xs text-neutral-500 mt-1">Fotos subidas en vivo por invitados</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300">
              Estado del Sistema
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Plataforma 100% Operativa
            </div>
            <p className="text-xs text-neutral-500 mt-2">18 plantillas, eventos, álbum y proyección</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader>
            <CardTitle className="text-lg text-neutral-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              18 Modelos de Tarjetas Digitales
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Catálogo completo con 6 familias de diseño: Elegante Clásica, Moderna Minimal, Floral Romántica, Glamour Dorada, Neón Fiesta y Rústica Boho.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/plantillas">
              <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800 text-neutral-200">
                Ver Catálogo de Plantillas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/40">
          <CardHeader>
            <CardTitle className="text-lg text-neutral-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Gestión de Clientes y Eventos
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Creá y personalizá eventos, gestioná listas de invitados con links únicos, moderá fotos del álbum y exportá a Excel/CSV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/eventos">
              <Button variant="outline" size="sm" className="border-neutral-700 hover:bg-neutral-800 text-neutral-200">
                Administrar Eventos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
