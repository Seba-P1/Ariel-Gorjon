# 🎯 Ariel Producciones — Plataforma SaaS Multi-Evento

Plataforma integral para gestión de eventos sociales y corporativos, desarrollada con **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** y **Supabase** (Postgres, Auth, Storage, Realtime).

---

## 🚀 Arquitectura y Módulos

1. **Módulo A: Invitaciones Digitales / Tarjetas Virtuales**
   - 18 plantillas personalizables agrupadas en 6 familias visuales.
   - Cuenta regresiva, mapa interactivo, confirmación RSVP, lista de regalos/CBU, sugerencias musicales y detalles de fiesta.

2. **Módulo B: Álbum en Vivo por QR + Proyección en Tiempo Real**
   - Subida PWA directa desde el celular de los invitados sin registros.
   - Proyección en pantalla completa con soporte de transiciones y Realtime WebSocket.
   - Moderación móvil de fotos con 1 toque.

3. **Módulo C: Panel Administrativo Unificado**
   - Gestión integral de eventos, clientes, galerías de fotos y plantillas.
   - Exportación de RSVPs a Excel (.xlsx) y CSV.
   - Generación de QRs imprimibles y descarga masiva en ZIP.

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Animaciones**: Framer Motion
- **Base de Datos & Auth**: Supabase (Postgres 15+, RLS activado)
- **Almacenamiento**: Supabase Storage
- **Tiempo Real**: Supabase Realtime Channels
- **Validación & Forms**: Zod + React Hook Form

---

## ⚙️ Configuración Local

### 1. Clonar e Instalar dependencias
```bash
git clone https://github.com/Seba-P1/Ariel-Gorjon.git
cd Ariel-Gorjon
npm install
```

### 2. Variables de Entorno
Copia `.env.example` a `.env.local` y completa los datos de tu proyecto de Supabase:
```bash
cp .env.example .env.local
```

Variables requeridas:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Ariel Producciones"
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔒 Seguridad
- **RLS (Row Level Security)** activado en todas las tablas.
- Service Role Key protegida y restringida a server components y API routes.
- Rate limiting por IP en subida de fotos y RSVPs.
- CSP estricto y sanitización de metadata EXIF.
