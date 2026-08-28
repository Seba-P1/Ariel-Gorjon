# 🎯 PLAN MAESTRO — Plataforma de Servicios de Ariel

> Documento técnico completo, listo para implementación con **Antigravity** + **Supabase**.
> Desarrollo autónomo, todo replicable y modificable.

---

## 📑 ÍNDICE

1. [Visión y Arquitectura General](#1-visión-y-arquitectura-general)
2. [Stack Tecnológico Definitivo](#2-stack-tecnológico-definitivo)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Base de Datos — SQL Completo para Supabase](#4-base-de-datos--sql-completo-para-supabase)
5. [Variables de Entorno](#5-variables-de-entorno)
6. [Seguridad (Políticas RLS + Buenas Prácticas)](#6-seguridad-políticas-rls--buenas-prácticas)
7. [Prompts para Antigravity — FASE POR FASE](#7-prompts-para-antigravity--fase-por-fase)
8. [Deploy y Post-Lanzamiento](#8-deploy-y-post-lanzamiento)
9. [Checklist de Verificación Final](#9-checklist-de-verificación-final)

---

## 1. VISIÓN Y ARQUITECTURA GENERAL

### Producto
Plataforma SaaS multi-evento para Ariel. Cada evento nuevo = configuración en el panel, sin tocar código. Tres módulos principales:

- **Módulo A**: Tarjetas Virtuales / Invitaciones digitales (15–20 estilos generados por motor de temas).
- **Módulo B**: Álbum en vivo por QR + Pantalla proyectada en tiempo real.
- **Módulo C**: Panel administrativo unificado.

### Arquitectura de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTES / INVITADOS                    │
│  (Navegan invitaciones · Confirman RSVP · Suben fotos QR)   │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTPS
┌───────────────────────▼─────────────────────────────────────┐
│                    NEXT.JS 14 (Vercel)                      │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐    │
│  │  Landing     │ │ Invitaciones │ │  Panel Admin      │    │
│  │  público     │ │  públicas    │ │  (protegido)      │    │
│  └──────────────┘ └──────────────┘ └───────────────────┘    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API Routes (App Router) + Server Actions          │     │
│  └────────────────────────────────────────────────────┘     │
└───┬──────────────────┬─────────────────┬───────────────┬────┘
    │                  │                 │               │
┌───▼──────────┐  ┌────▼────────┐  ┌─────▼─────┐  ┌──────▼─────┐
│  SUPABASE    │  │  SUPABASE   │  │ SUPABASE  │  │ SUPABASE   │
│  Postgres    │  │  Storage    │  │  Auth     │  │  Realtime  │
│  (data + RLS)│  │  (fotos)    │  │  (admin)  │  │  (pantalla)│
└──────────────┘  └─────────────┘  └───────────┘  └────────────┘
```

### Roles del sistema

| Rol           | Acceso                                                        |
|---------------|---------------------------------------------------------------|
| `superadmin`  | Ariel. Gestiona todo: eventos, plantillas, clientes, fotos.   |
| `client`      | Cliente final (opcional, fase 2). Ve solo su evento.          |
| `guest`       | Anónimo. Solo puede: ver invitación pública, RSVP, subir foto.|
| `moderator`   | Ariel o asistente. Aprueba/rechaza fotos desde móvil.         |

---

## 2. STACK TECNOLÓGICO DEFINITIVO

| Capa                   | Tecnología                                | Versión mínima |
|------------------------|-------------------------------------------|----------------|
| Framework              | Next.js (App Router) + TypeScript         | 14.2+          |
| Estilos                | Tailwind CSS + shadcn/ui                  | 3.4+ / última  |
| Animaciones            | Framer Motion                             | 11+            |
| Base de datos          | Supabase (Postgres 15+)                   | Cloud          |
| Auth                   | Supabase Auth (email + magic link)        | Cloud          |
| Storage                | Supabase Storage (buckets)                | Cloud          |
| Tiempo real (pantalla) | Supabase Realtime                         | Cloud          |
| ORM / cliente DB       | `@supabase/supabase-js` + Zod             | última         |
| Validación             | Zod                                       | 3+             |
| Forms                  | React Hook Form                           | 7+             |
| QR                     | `qrcode` + `qrcode.react`                 | última         |
| Export Excel / ZIP     | `xlsx` + `jszip` + `file-saver`           | última         |
| Iconografía            | `lucide-react`                            | última         |
| Fuentes                | `next/font` (Google Fonts)                | integrado      |
| Deploy                 | Vercel                                    | Cloud          |
| Dominio                | (adquirir en Namecheap / NIC.ar)          | —              |

**Ventaja clave del stack**: Supabase reemplaza 4 servicios (DB + Auth + Storage + Realtime) con una sola consola, un solo SDK, y RLS integrado.

---

## 3. ESTRUCTURA DEL PROYECTO

```
ariel-platform/
├── app/                                # App Router de Next.js
│   ├── (public)/                       # Rutas públicas
│   │   ├── page.tsx                    # Landing principal
│   │   ├── invitacion/[slug]/          # Invitación pública
│   │   │   ├── page.tsx
│   │   │   └── rsvp/page.tsx
│   │   ├── album/[slug]/               # PWA subida de fotos
│   │   │   └── page.tsx
│   │   └── pantalla/[slug]/            # Vista fullscreen para proyectar
│   │       └── page.tsx
│   ├── (admin)/                        # Rutas protegidas
│   │   ├── layout.tsx                  # Middleware auth
│   │   ├── dashboard/page.tsx
│   │   ├── eventos/
│   │   │   ├── page.tsx                # Lista
│   │   │   ├── nuevo/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detalle + editor
│   │   │       ├── invitacion/page.tsx # Configurar invitación
│   │   │       ├── rsvp/page.tsx       # Ver confirmaciones
│   │   │       ├── album/page.tsx      # Galería + moderación
│   │   │       └── qr/page.tsx         # Generar QRs imprimibles
│   │   ├── plantillas/page.tsx
│   │   ├── clientes/page.tsx
│   │   └── configuracion/page.tsx
│   ├── login/page.tsx
│   ├── api/                            # API Routes
│   │   ├── upload/route.ts             # Signed URL para subida
│   │   ├── rsvp/route.ts
│   │   ├── moderate/route.ts
│   │   └── zip/[eventId]/route.ts      # Descarga masiva
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn/ui
│   ├── invitations/                    # Componentes de invitación
│   │   ├── sections/                   # Cada sección modular
│   │   │   ├── Hero.tsx
│   │   │   ├── Countdown.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── LocationMap.tsx
│   │   │   ├── DressCode.tsx
│   │   │   ├── Story.tsx
│   │   │   ├── PhotoAlbum.tsx
│   │   │   ├── RsvpForm.tsx
│   │   │   ├── Gifts.tsx
│   │   │   ├── MusicPlayer.tsx
│   │   │   ├── SongRequests.tsx
│   │   │   ├── InstagramWall.tsx
│   │   │   ├── Godparents.tsx
│   │   │   ├── Accommodation.tsx
│   │   │   ├── Trivia.tsx
│   │   │   └── LiveAlbumQr.tsx
│   │   ├── themes/                     # Definición de temas visuales
│   │   │   ├── elegante-clasica.ts
│   │   │   ├── moderna-minimal.ts
│   │   │   ├── floral-romantica.ts
│   │   │   ├── glamour-dorada.ts
│   │   │   ├── neon-fiesta.ts
│   │   │   └── rustica-boho.ts
│   │   └── InvitationRenderer.tsx      # Motor: combina tema + secciones + datos
│   ├── screen/
│   │   ├── SlideshowScreen.tsx
│   │   ├── Transitions.tsx
│   │   └── StandbyView.tsx
│   ├── admin/
│   │   ├── EventForm.tsx
│   │   ├── PhotoModerator.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── RsvpTable.tsx
│   │   ├── ThemePicker.tsx
│   │   └── QrGenerator.tsx
│   └── landing/                        # Componentes de la landing
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Cliente browser
│   │   ├── server.ts                   # Cliente server
│   │   ├── admin.ts                    # Cliente service_role
│   │   └── middleware.ts
│   ├── validations/                    # Schemas Zod
│   │   ├── event.ts
│   │   ├── rsvp.ts
│   │   ├── photo.ts
│   │   └── invitation.ts
│   ├── utils/
│   │   ├── qr.ts
│   │   ├── zip.ts
│   │   ├── image.ts                    # Compresión, EXIF stripping
│   │   ├── rate-limit.ts
│   │   └── slugify.ts
│   └── constants.ts
├── types/
│   ├── database.ts                     # Tipos generados desde Supabase
│   └── domain.ts
├── middleware.ts                       # Protección de rutas admin
├── public/
│   ├── themes-assets/                  # SVGs, texturas decorativas
│   └── fonts/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. BASE DE DATOS — SQL COMPLETO PARA SUPABASE

> **Cómo usar**: abrí Supabase → SQL Editor → New Query → pegá TODO el bloque y ejecutá.
> Está pensado para ejecutar de una sola vez, en el orden correcto (extensiones → tipos → tablas → índices → funciones → triggers → RLS → seeds → storage).

### 4.1 Bloque 1 — Extensiones y tipos

```sql
-- =========================================================
-- EXTENSIONES
-- =========================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- =========================================================
-- ENUMS
-- =========================================================
create type user_role as enum ('superadmin', 'client', 'moderator');
create type event_status as enum ('draft', 'active', 'archived');
create type event_type as enum ('boda', 'cumple15', 'cumpleanos', 'bautismo', 'comunion', 'corporativo', 'otro');
create type photo_status as enum ('pending', 'approved', 'rejected');
create type rsvp_status as enum ('pending', 'confirmed', 'declined');
create type template_family as enum ('elegante-clasica','moderna-minimal','floral-romantica','glamour-dorada','neon-fiesta','rustica-boho');
```

### 4.2 Bloque 2 — Tablas

```sql
-- =========================================================
-- PROFILES (extiende auth.users)
-- =========================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         citext unique not null,
  full_name     text,
  role          user_role not null default 'client',
  phone         text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =========================================================
-- CLIENTES (personas que contratan a Ariel)
-- =========================================================
create table public.clients (
  id            uuid primary key default uuid_generate_v4(),
  full_name     text not null,
  email         citext,
  phone         text,
  notes         text,
  profile_id    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =========================================================
-- PLANTILLAS DE INVITACIÓN
-- =========================================================
create table public.templates (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  family          template_family not null,
  variant         text not null,                          -- 'v1' | 'v2' | 'v3'...
  description     text,
  preview_url     text,                                   -- imagen preview
  default_theme   jsonb not null default '{}'::jsonb,     -- paleta, fuentes, animaciones
  default_sections jsonb not null default '[]'::jsonb,    -- secciones + orden
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =========================================================
-- EVENTOS
-- =========================================================
create table public.events (
  id                uuid primary key default uuid_generate_v4(),
  client_id         uuid references public.clients(id) on delete set null,
  slug              text unique not null,                 -- boda-garcia-x7k2
  title             text not null,
  event_type        event_type not null default 'otro',
  event_date        timestamptz,
  location_name     text,
  location_address  text,
  location_lat      numeric(10,7),
  location_lng      numeric(10,7),
  cover_image_url   text,
  status            event_status not null default 'draft',

  -- Invitación
  template_id       uuid references public.templates(id) on delete set null,
  theme_config      jsonb not null default '{}'::jsonb,   -- overrides sobre el tema base
  sections_config   jsonb not null default '[]'::jsonb,   -- secciones activas + orden + contenido
  music_url         text,
  hashtag           text,
  instagram_handle  text,

  -- Álbum en vivo
  album_enabled     boolean not null default true,
  album_manual_approval boolean not null default false,  -- false = las fotos se muestran solas apenas se suben (default). true = cada foto queda 'pending' hasta que alguien la apruebe/rechace desde el panel antes de que aparezca en pantalla.
  album_slide_duration_ms integer not null default 3000 check (album_slide_duration_ms between 1500 and 15000),
  album_transition  text not null default 'fade' check (album_transition in ('fade','slide','zoom')),
  album_show_captions boolean not null default true,
  album_watermark_url text,
  album_retention_days integer not null default 90 check (album_retention_days between 7 and 365),  -- red de contención: días desde event_date antes de que el cron de retención borre fotos no descargadas

  -- QR / acceso
  screen_token      text unique not null default encode(gen_random_bytes(12),'hex'),

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index events_client_id_idx on public.events(client_id);
create index events_status_idx    on public.events(status);
create index events_date_idx      on public.events(event_date);

-- =========================================================
-- INVITADOS PERSONALIZADOS (opcional por evento)
-- =========================================================
create table public.guests (
  id            uuid primary key default uuid_generate_v4(),
  event_id      uuid not null references public.events(id) on delete cascade,
  full_name     text not null,
  slots         integer not null default 1 check (slots between 1 and 20),
  personal_slug text not null,                             -- ?g=xxxxx
  created_at    timestamptz not null default now(),
  unique (event_id, personal_slug)
);

create index guests_event_id_idx on public.guests(event_id);

-- =========================================================
-- CONFIRMACIONES (RSVP)
-- =========================================================
create table public.rsvps (
  id              uuid primary key default uuid_generate_v4(),
  event_id        uuid not null references public.events(id) on delete cascade,
  guest_id        uuid references public.guests(id) on delete set null,
  full_name       text not null,
  email           citext,
  phone           text,
  attendees_count integer not null default 1 check (attendees_count between 1 and 20),
  status          rsvp_status not null default 'confirmed',
  dietary_notes   text,
  song_request    text,
  message         text,
  ip_address      inet,
  user_agent      text,
  created_at      timestamptz not null default now()
);

create index rsvps_event_id_idx on public.rsvps(event_id);
create index rsvps_status_idx   on public.rsvps(status);

-- =========================================================
-- FOTOS DEL ÁLBUM EN VIVO
-- =========================================================
create table public.photos (
  id                uuid primary key default uuid_generate_v4(),
  event_id          uuid not null references public.events(id) on delete cascade,
  storage_path      text not null,                        -- path completo en Supabase Storage
  thumbnail_path    text,
  display_path      text,                                 -- versión 1920px para pantalla
  original_filename text,
  mime_type         text,
  size_bytes        bigint,
  width             integer,
  height            integer,
  caption           text,                                 -- pie de página del invitado
  uploader_name     text,
  status            photo_status not null default 'pending',
  moderated_by      uuid references public.profiles(id) on delete set null,
  moderated_at      timestamptz,
  reject_reason     text,
  ip_address        inet,
  user_agent        text,
  created_at        timestamptz not null default now()
);

create index photos_event_id_idx  on public.photos(event_id);
create index photos_status_idx    on public.photos(status);
create index photos_created_idx   on public.photos(created_at desc);

-- =========================================================
-- CANCIONES SUGERIDAS
-- =========================================================
create table public.song_requests (
  id            uuid primary key default uuid_generate_v4(),
  event_id      uuid not null references public.events(id) on delete cascade,
  requester     text,
  song_title    text not null,
  artist        text,
  spotify_url   text,
  created_at    timestamptz not null default now()
);

create index song_requests_event_id_idx on public.song_requests(event_id);

-- =========================================================
-- RATE LIMIT (uploads / rsvps por IP)
-- =========================================================
create table public.rate_limits (
  id           bigserial primary key,
  key          text not null,               -- 'upload:<event>:<ip>' | 'rsvp:<event>:<ip>'
  window_start timestamptz not null default now(),
  count        integer not null default 1
);

create index rate_limits_key_window_idx on public.rate_limits(key, window_start);

-- =========================================================
-- AUDIT LOG (opcional pero recomendado)
-- =========================================================
create table public.audit_log (
  id          bigserial primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index audit_actor_idx  on public.audit_log(actor_id);
create index audit_entity_idx on public.audit_log(entity_type, entity_id);
```

### 4.3 Bloque 3 — Funciones y triggers

```sql
-- =========================================================
-- updated_at automático
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_clients_updated
before update on public.clients
for each row execute function public.set_updated_at();

create trigger trg_templates_updated
before update on public.templates
for each row execute function public.set_updated_at();

create trigger trg_events_updated
before update on public.events
for each row execute function public.set_updated_at();

-- =========================================================
-- Crear profile automáticamente al registrar user en Auth
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- Helper: es superadmin?
-- =========================================================
create or replace function public.is_superadmin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  );
$$;

-- =========================================================
-- Helper: es moderador o superadmin?
-- =========================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('superadmin','moderator')
  );
$$;

-- =========================================================
-- Rate limit check (llamada desde API antes de INSERT)
-- =========================================================
create or replace function public.check_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
) returns boolean
language plpgsql
as $$
declare
  v_count integer;
begin
  delete from public.rate_limits
  where window_start < now() - make_interval(secs => p_window_seconds * 4);

  select coalesce(sum(count),0) into v_count
  from public.rate_limits
  where key = p_key
    and window_start > now() - make_interval(secs => p_window_seconds);

  if v_count >= p_max then
    return false;
  end if;

  insert into public.rate_limits(key, count) values (p_key, 1);
  return true;
end;
$$;

-- =========================================================
-- Slug único autogenerado si viene vacío
-- =========================================================
create or replace function public.ensure_event_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or length(new.slug) = 0 then
    new.slug := lower(
      regexp_replace(coalesce(new.title,'evento'),'[^a-zA-Z0-9]+','-','g')
    ) || '-' || substr(encode(gen_random_bytes(4),'hex'),1,6);
  end if;
  return new;
end;
$$;

create trigger trg_events_slug
before insert on public.events
for each row execute function public.ensure_event_slug();
```

### 4.4 Bloque 4 — Row Level Security (RLS)

```sql
-- =========================================================
-- ACTIVAR RLS EN TODAS LAS TABLAS
-- =========================================================
alter table public.profiles       enable row level security;
alter table public.clients        enable row level security;
alter table public.templates      enable row level security;
alter table public.events         enable row level security;
alter table public.guests         enable row level security;
alter table public.rsvps          enable row level security;
alter table public.photos         enable row level security;
alter table public.song_requests  enable row level security;
alter table public.rate_limits    enable row level security;
alter table public.audit_log      enable row level security;

-- =========================================================
-- PROFILES
-- =========================================================
create policy "profiles_self_read"
  on public.profiles for select
  using (auth.uid() = id or public.is_superadmin());

create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- =========================================================
-- CLIENTS (solo staff/superadmin)
-- =========================================================
create policy "clients_admin_all"
  on public.clients for all
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- =========================================================
-- TEMPLATES
-- Lectura: cualquiera (para renderizar previews públicos)
-- Escritura: solo superadmin
-- =========================================================
create policy "templates_public_read"
  on public.templates for select
  using (is_active = true or public.is_superadmin());

create policy "templates_admin_write"
  on public.templates for all
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- =========================================================
-- EVENTS
-- Lectura pública: eventos con status='active' (para invitación pública)
-- Escritura: solo superadmin
-- =========================================================
create policy "events_public_read_active"
  on public.events for select
  using (status = 'active' or public.is_superadmin());

create policy "events_admin_write"
  on public.events for all
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- =========================================================
-- GUESTS
-- Lectura pública SOLO cuando se accede con personal_slug conocido
-- (esto lo hacemos por API route con service_role, no directo desde el cliente)
-- =========================================================
create policy "guests_admin_all"
  on public.guests for all
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- =========================================================
-- RSVPS
-- Insert público: cualquiera puede confirmar en un evento activo
-- Lectura: solo superadmin
-- =========================================================
create policy "rsvps_public_insert"
  on public.rsvps for insert
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.status = 'active'
    )
  );

create policy "rsvps_admin_read"
  on public.rsvps for select
  using (public.is_superadmin());

create policy "rsvps_admin_write"
  on public.rsvps for update using (public.is_superadmin()) with check (public.is_superadmin());
create policy "rsvps_admin_delete"
  on public.rsvps for delete using (public.is_superadmin());

-- =========================================================
-- PHOTOS
-- Insert: SOLO server-side con service_role (nunca desde el cliente con
-- la anon key). Todo el insert pasa por /api/upload, que ya valida tipo
-- real de archivo, tamaño, rate limit y decide el status inicial según
-- album_manual_approval. Si dejamos una policy de insert pública acá,
-- cualquiera puede pegarle directo a la REST API de Supabase con la
-- anon key (que es pública, viaja en el JS del sitio) y saltear todas
-- esas validaciones. Por eso NO hay policy de insert para anon/authenticated:
-- sin policy = bloqueado por default con RLS activo, igual que rate_limits.
-- Lectura pública: SOLO fotos aprobadas (pantalla)
-- Staff: ve todo, modera
-- =========================================================
create policy "photos_service_only_insert"
  on public.photos for insert
  using (false)
  with check (false);

create policy "photos_public_read_approved"
  on public.photos for select
  using (status = 'approved' or public.is_staff());

create policy "photos_staff_update"
  on public.photos for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "photos_admin_delete"
  on public.photos for delete
  using (public.is_superadmin());

-- =========================================================
-- SONG REQUESTS
-- =========================================================
create policy "songs_public_insert"
  on public.song_requests for insert
  with check (
    exists (select 1 from public.events e where e.id = event_id and e.status='active')
  );

create policy "songs_admin_read"
  on public.song_requests for select using (public.is_superadmin());

-- =========================================================
-- RATE LIMITS y AUDIT LOG (solo backend con service_role)
-- Bloqueamos acceso desde anon/authenticated normal
-- =========================================================
create policy "rate_limits_service_only"
  on public.rate_limits for all
  using (false)
  with check (false);

create policy "audit_admin_read"
  on public.audit_log for select using (public.is_superadmin());
```

### 4.5 Bloque 5 — Storage buckets

```sql
-- =========================================================
-- BUCKETS (ejecutar en SQL Editor, luego confirmar en Storage UI)
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-photos', 'event-photos', false, 10485760,
   array['image/jpeg','image/png','image/webp','image/heic','image/heif']),
  ('event-photos-display', 'event-photos-display', true, 2097152,
   array['image/webp']),
  ('event-covers', 'event-covers', true, 5242880,
   array['image/jpeg','image/png','image/webp']),
  ('templates-assets', 'templates-assets', true, 5242880,
   array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('event-music', 'event-music', true, 15728640,
   array['audio/mpeg','audio/mp3','audio/ogg','audio/wav'])
on conflict (id) do nothing;

-- =========================================================
-- STORAGE POLICIES
--
-- Dos buckets para las fotos del álbum, a propósito:
--   event-photos          (privado) -> original + thumbnail. Para descarga
--                                       de Ariel y grilla del panel. Nadie
--                                       lo lee sin ser staff.
--   event-photos-display   (público) -> SOLO la versión 1920px optimizada
--                                       que usa la pantalla en vivo. Pública
--                                       a propósito: así la pantalla la
--                                       muestra directo con una URL fija,
--                                       sin depender de URLs firmadas que
--                                       vencen a los 60 minutos (una fiesta
--                                       dura más que eso). No tiene EXIF,
--                                       no tiene metadata sensible, es
--                                       la versión "para mostrar", nunca
--                                       la que se entrega al cliente.
-- En los dos casos, subir y borrar es SOLO server-side (service_role desde
-- /api/upload y /api/photos/[id]/delete). Nunca directo desde el cliente.
-- =========================================================

create policy "photos_service_only_upload"
on storage.objects for insert
to public
with check (false);

create policy "photos_staff_read"
on storage.objects for select
to authenticated
using (
  bucket_id = 'event-photos'
  and public.is_staff()
);

create policy "photos_staff_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'event-photos'
  and public.is_superadmin()
);

create policy "photos_display_public_read"
on storage.objects for select
to public
using (bucket_id = 'event-photos-display');

create policy "photos_display_service_only_upload"
on storage.objects for insert
to public
with check (false);

create policy "photos_display_staff_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'event-photos-display'
  and public.is_superadmin()
);

-- event-covers: lectura pública, escritura solo staff
create policy "covers_public_read"
on storage.objects for select
to public
using (bucket_id = 'event-covers');

create policy "covers_admin_write"
on storage.objects for insert
to authenticated
with check (bucket_id = 'event-covers' and public.is_superadmin());

create policy "covers_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'event-covers' and public.is_superadmin());

create policy "covers_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'event-covers' and public.is_superadmin());

-- Mismas políticas para templates-assets y event-music (idénticas a covers)
create policy "templates_public_read"
on storage.objects for select to public using (bucket_id = 'templates-assets');
create policy "templates_admin_write"
on storage.objects for insert to authenticated with check (bucket_id = 'templates-assets' and public.is_superadmin());

create policy "music_public_read"
on storage.objects for select to public using (bucket_id = 'event-music');
create policy "music_admin_write"
on storage.objects for insert to authenticated with check (bucket_id = 'event-music' and public.is_superadmin());
```

### 4.6 Bloque 6 — Seeds iniciales (18 plantillas)

```sql
-- =========================================================
-- SEED: 6 familias × 3 variantes = 18 plantillas
-- =========================================================
insert into public.templates (slug, name, family, variant, description, default_theme, default_sections) values
-- Elegante Clásica
('elegante-clasica-v1','Elegante Clásica — Marfil','elegante-clasica','v1','Serif dorado, marcos finos, tonos crema.',
 '{"palette":{"primary":"#B8935A","secondary":"#F5EFE4","bg":"#FFFDF8","text":"#3A2F22","accent":"#8A6A3F"},"fonts":{"heading":"Cormorant Garamond","body":"Lato"},"animations":"fade-up","ornaments":"classic-frames"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","story","photo-album","rsvp","gifts","music"]'::jsonb),

('elegante-clasica-v2','Elegante Clásica — Negro & Oro','elegante-clasica','v2','Contraste elegante, tipografía alta.',
 '{"palette":{"primary":"#D4AF37","secondary":"#111111","bg":"#0B0B0B","text":"#F5EFE4","accent":"#C9A227"},"fonts":{"heading":"Playfair Display","body":"Inter"},"animations":"fade","ornaments":"gold-lines"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","photo-album","rsvp","gifts","live-album-qr"]'::jsonb),

('elegante-clasica-v3','Elegante Clásica — Vintage','elegante-clasica','v3','Bordes ornamentados, papel envejecido.',
 '{"palette":{"primary":"#7A5C3E","secondary":"#EDE0C8","bg":"#F7EFDD","text":"#3A2F22","accent":"#B8935A"},"fonts":{"heading":"Great Vibes","body":"Cormorant"},"animations":"typewriter","ornaments":"vintage-borders"}'::jsonb,
 '["hero","story","countdown","event-details","location","dress-code","rsvp","gifts","godparents"]'::jsonb),

-- Moderna Minimal
('moderna-minimal-v1','Moderna Minimal — Blanco','moderna-minimal','v1','Espacios amplios, sans humanista.',
 '{"palette":{"primary":"#111827","secondary":"#F3F4F6","bg":"#FFFFFF","text":"#111827","accent":"#6B7280"},"fonts":{"heading":"Inter","body":"Inter"},"animations":"slide-up","ornaments":"none"}'::jsonb,
 '["hero","countdown","event-details","location","rsvp","gifts","live-album-qr","music"]'::jsonb),

('moderna-minimal-v2','Moderna Minimal — Sage','moderna-minimal','v2','Paleta verde salvia, moderno.',
 '{"palette":{"primary":"#6B7F6A","secondary":"#EFF2EC","bg":"#FAFBF8","text":"#22302A","accent":"#A8B8A0"},"fonts":{"heading":"Fraunces","body":"Inter"},"animations":"fade-up","ornaments":"soft-shapes"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","photo-album","rsvp","live-album-qr"]'::jsonb),

('moderna-minimal-v3','Moderna Minimal — Tipográfica','moderna-minimal','v3','Impacto tipográfico, foto grande.',
 '{"palette":{"primary":"#000000","secondary":"#FFFFFF","bg":"#FFFFFF","text":"#000000","accent":"#FF3B30"},"fonts":{"heading":"Archivo Black","body":"Inter"},"animations":"reveal","ornaments":"stripes"}'::jsonb,
 '["hero","event-details","countdown","location","rsvp","gifts","instagram-wall","live-album-qr"]'::jsonb),

-- Floral Romántica
('floral-romantica-v1','Floral Romántica — Rosa','floral-romantica','v1','Acuarelas de rosas, tonos suaves.',
 '{"palette":{"primary":"#D48CA0","secondary":"#FDECEE","bg":"#FFF7F8","text":"#4B2C36","accent":"#C6708B"},"fonts":{"heading":"Parisienne","body":"Lato"},"animations":"petals","ornaments":"watercolor-flowers"}'::jsonb,
 '["hero","story","countdown","event-details","location","dress-code","photo-album","rsvp","song-requests","gifts"]'::jsonb),

('floral-romantica-v2','Floral Romántica — Botánica','floral-romantica','v2','Hojas verdes, eucalyptus.',
 '{"palette":{"primary":"#6A8A6D","secondary":"#EDF2E9","bg":"#F8FAF5","text":"#2E3D2F","accent":"#B0C5A1"},"fonts":{"heading":"Cormorant","body":"Lato"},"animations":"leaves","ornaments":"botanical"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","rsvp","gifts","live-album-qr"]'::jsonb),

('floral-romantica-v3','Floral Romántica — Dusty Blue','floral-romantica','v3','Azul empolvado + flores blancas.',
 '{"palette":{"primary":"#7C9CB3","secondary":"#EAF1F5","bg":"#F6FAFB","text":"#25384A","accent":"#B4C8D6"},"fonts":{"heading":"Playfair Display","body":"Nunito"},"animations":"fade","ornaments":"floral-corners"}'::jsonb,
 '["hero","countdown","event-details","location","photo-album","rsvp","song-requests","gifts"]'::jsonb),

-- Glamour Dorada
('glamour-dorada-v1','Glamour — Oro & Blanco','glamour-dorada','v1','Purpurina, tipografía script.',
 '{"palette":{"primary":"#D4AF37","secondary":"#FFFFFF","bg":"#FFFDF7","text":"#2A2312","accent":"#B8935A"},"fonts":{"heading":"Allura","body":"Montserrat"},"animations":"shimmer","ornaments":"glitter"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","photo-album","rsvp","gifts","live-album-qr","music"]'::jsonb),

('glamour-dorada-v2','Glamour — Rosa Champagne','glamour-dorada','v2','Tonos champagne y rosa cuarzo.',
 '{"palette":{"primary":"#C9A27E","secondary":"#F7E8D9","bg":"#FFFAF3","text":"#3A2E22","accent":"#E4C6A6"},"fonts":{"heading":"Sacramento","body":"Poppins"},"animations":"fade-up","ornaments":"pearls"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","photo-album","rsvp","gifts","live-album-qr"]'::jsonb),

('glamour-dorada-v3','Glamour — Cumple 15 Real','glamour-dorada','v3','Estilo quince, tiara y brillos.',
 '{"palette":{"primary":"#E0A6C6","secondary":"#F9E6F0","bg":"#FFF7FB","text":"#3F1F32","accent":"#D4AF37"},"fonts":{"heading":"Great Vibes","body":"Poppins"},"animations":"sparkle","ornaments":"tiara"}'::jsonb,
 '["hero","story","countdown","event-details","location","dress-code","photo-album","rsvp","song-requests","gifts","live-album-qr"]'::jsonb),

-- Neon Fiesta
('neon-fiesta-v1','Neon — Cyber','neon-fiesta','v1','Neon violeta/cyan, energía club.',
 '{"palette":{"primary":"#8B5CF6","secondary":"#22D3EE","bg":"#0B0F1A","text":"#F0F6FC","accent":"#F472B6"},"fonts":{"heading":"Orbitron","body":"Rajdhani"},"animations":"glow","ornaments":"neon-lines"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","music","song-requests","rsvp","live-album-qr","instagram-wall"]'::jsonb),

('neon-fiesta-v2','Neon — Retro 80s','neon-fiesta','v2','Grid morado, sol de synthwave.',
 '{"palette":{"primary":"#F472B6","secondary":"#8B5CF6","bg":"#1A0B2E","text":"#F0F6FC","accent":"#22D3EE"},"fonts":{"heading":"Press Start 2P","body":"VT323"},"animations":"scanlines","ornaments":"retro-grid"}'::jsonb,
 '["hero","countdown","event-details","location","music","song-requests","rsvp","live-album-qr"]'::jsonb),

('neon-fiesta-v3','Neon — Neon Blanco','neon-fiesta','v3','Tubos de neón blanco brillante.',
 '{"palette":{"primary":"#FFFFFF","secondary":"#1F2937","bg":"#0A0A0A","text":"#FFFFFF","accent":"#22D3EE"},"fonts":{"heading":"Bebas Neue","body":"Inter"},"animations":"flicker","ornaments":"neon-tubes"}'::jsonb,
 '["hero","countdown","event-details","location","rsvp","music","live-album-qr","instagram-wall"]'::jsonb),

-- Rustica Boho
('rustica-boho-v1','Rústica Boho — Kraft','rustica-boho','v1','Papel kraft, tipografía manuscrita.',
 '{"palette":{"primary":"#8B6B3D","secondary":"#E8D5B7","bg":"#F5EBD6","text":"#3A2712","accent":"#B48A5C"},"fonts":{"heading":"Amatic SC","body":"Merriweather"},"animations":"fade","ornaments":"kraft-texture"}'::jsonb,
 '["hero","story","countdown","event-details","location","dress-code","rsvp","gifts","godparents","accommodation"]'::jsonb),

('rustica-boho-v2','Rústica Boho — Terracota','rustica-boho','v2','Tonos tierra, pampas grass.',
 '{"palette":{"primary":"#C97B5A","secondary":"#F3E1D0","bg":"#FDF6EE","text":"#4A2A1A","accent":"#8B5A3C"},"fonts":{"heading":"Playfair Display","body":"Lora"},"animations":"fade-up","ornaments":"pampas"}'::jsonb,
 '["hero","story","countdown","event-details","location","dress-code","photo-album","rsvp","gifts","live-album-qr"]'::jsonb),

('rustica-boho-v3','Rústica Boho — Desert','rustica-boho','v3','Cactus, arena, sunset.',
 '{"palette":{"primary":"#D97757","secondary":"#F5D3B0","bg":"#FEF3E2","text":"#3E2418","accent":"#8AA26F"},"fonts":{"heading":"Fraunces","body":"Nunito"},"animations":"sun-rise","ornaments":"cactus"}'::jsonb,
 '["hero","countdown","event-details","location","dress-code","rsvp","gifts","live-album-qr","accommodation"]'::jsonb);
```

### 4.7 Bloque 7 — Post-instalación (crear tu usuario superadmin)

```sql
-- =========================================================
-- Después de registrarte con tu email en Supabase Auth,
-- ejecutá esto reemplazando 'tu-email@dominio.com'
-- =========================================================
update public.profiles
set role = 'superadmin', full_name = 'Ariel'
where email = 'tu-email@dominio.com';
```

---

## 5. VARIABLES DE ENTORNO

Archivo `.env.local` (nunca lo subas a git):

```bash
# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...            # SOLO server-side, nunca en cliente

# ===== APP =====
NEXT_PUBLIC_APP_URL=https://ariel.com.ar
NEXT_PUBLIC_APP_NAME="Ariel Producciones"

# ===== RATE LIMIT =====
UPLOAD_RATE_LIMIT_PER_HOUR=20
RSVP_RATE_LIMIT_PER_HOUR=5

# ===== SEGURIDAD =====
NEXTAUTH_SECRET=generar-con-openssl-rand-base64-32
ALLOWED_ORIGINS=https://ariel.com.ar,https://www.ariel.com.ar

# ===== OPCIONAL (fase 2) =====
GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=                                    # emails de confirmación
```

Archivo `.env.example` idéntico pero con valores vacíos, para commitear.

---

## 6. SEGURIDAD (POLÍTICAS RLS + BUENAS PRÁCTICAS)

### 6.1 Principios

1. **Zero trust en el cliente**: toda validación crítica pasa también por el servidor (Zod en API routes).
2. **Service role solo server-side**: la clave `SUPABASE_SERVICE_ROLE_KEY` nunca sale del backend.
3. **RLS activado en TODAS las tablas** (ya definido arriba).
4. **URLs firmadas** para acceder a fotos privadas (expiración corta, 60 min).
5. **Tokens no adivinables** para eventos (`upload_token`, `screen_token` de 24 hex chars).
6. **Rate limiting** en subidas, RSVPs y logins (tabla `rate_limits` + función `check_rate_limit`).
7. **Sanitización de EXIF**: al subir foto, se strippean coordenadas GPS antes de guardar.
8. **Validación de tipo real de archivo**: chequeo de magic bytes, no solo extensión.
9. **CSP headers** estrictos en `next.config.js`.
10. **2FA opcional** para Ariel (Supabase Auth soporta TOTP).

### 6.2 Configuración CSP (en `next.config.js`)

```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://*.supabase.co https://maps.googleapis.com https://maps.gstatic.com;
  media-src 'self' https://*.supabase.co;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-src https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim();

// export headers in next.config
```

### 6.3 Checklist seguridad pre-lanzamiento

- [ ] Todas las tablas con RLS activado.
- [ ] Service role key nunca expuesta al navegador.
- [ ] Rate limit en `/api/upload`, `/api/rsvp`, `/api/moderate`.
- [ ] Validación Zod en TODAS las API routes.
- [ ] CSP headers configurados.
- [ ] HSTS activo (Vercel lo hace por defecto en HTTPS).
- [ ] Auth con contraseñas ≥ 12 chars + verificación de email.
- [ ] Backups automáticos de Supabase habilitados (Point-in-time recovery si es plan Pro).
- [ ] Auditoría (`audit_log`) escribe en cada acción sensible.
- [ ] Política de retención definida (ej. borrar fotos pasados 90 días del evento).

---

## 7. PROMPTS PARA ANTIGRAVITY — FASE POR FASE

> **Cómo usar cada prompt**: creás un chat/tarea nueva en Antigravity, pegás el prompt entero como instrucción inicial, y dejás que genere. Después de cada fase revisás el resultado antes de pasar a la siguiente.
>
> Los prompts están escritos como "system prompt + tarea". Todos asumen que ya tenés:
>
> - Repo inicializado con `npx create-next-app@latest ariel-platform --typescript --tailwind --app --src-dir=false --import-alias "@/*"`
> - Supabase creado con TODO el SQL de la sección 4 ejecutado.
> - `.env.local` completo con las variables de la sección 5.

---

### 🟦 PROMPT FASE 0 — Setup Base + Clientes Supabase

```
CONTEXTO
Estoy construyendo una plataforma SaaS multi-evento con Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui y Supabase (Postgres + Auth + Storage + Realtime). El proyecto ya está inicializado y la base de datos ya tiene el schema completo aplicado.

TAREA
Implementá la capa de infraestructura base del proyecto:

1) Instalá dependencias exactas:
   - @supabase/supabase-js @supabase/ssr
   - zod react-hook-form @hookform/resolvers
   - lucide-react framer-motion
   - clsx tailwind-merge class-variance-authority
   - qrcode qrcode.react jszip file-saver xlsx
   - date-fns

2) Inicializá shadcn/ui con `npx shadcn@latest init` usando: estilo "new-york", color base "neutral", CSS variables true. Instalá los componentes: button, input, label, textarea, select, dialog, dropdown-menu, toast, sonner, card, tabs, table, badge, avatar, switch, slider, form, checkbox, separator, sheet, tooltip, skeleton, progress.

3) Creá la estructura de carpetas descrita más abajo.

4) Implementá los 3 clientes de Supabase:
   - `lib/supabase/client.ts` → cliente browser (usa NEXT_PUBLIC_SUPABASE_ANON_KEY, createBrowserClient de @supabase/ssr)
   - `lib/supabase/server.ts` → cliente server (createServerClient con cookies() de next/headers)
   - `lib/supabase/admin.ts` → cliente service_role (createClient con SUPABASE_SERVICE_ROLE_KEY, SOLO para uso en API routes / server actions)

5) Generá los tipos TypeScript a partir del schema de la DB en `types/database.ts` (asumí que el usuario correrá `supabase gen types typescript --project-id XXX > types/database.ts` — dejá el archivo con un placeholder tipado `export type Database = { public: { Tables: {...} } }` con las 10 tablas descritas y sus columnas).

6) Middleware de autenticación en `middleware.ts`:
   - Protege TODAS las rutas bajo `/dashboard`, `/eventos`, `/plantillas`, `/clientes`, `/configuracion`.
   - Si no hay sesión, redirige a `/login?next=<ruta-original>`.
   - Si hay sesión pero role != 'superadmin', redirige a `/login` con mensaje "acceso denegado".
   - Usa `updateSession` helper con @supabase/ssr para refrescar tokens.

7) Página `/login` con Supabase Auth UI custom (no uses el widget, hacelo con shadcn):
   - Form email + password (React Hook Form + Zod).
   - Botón "Enviar magic link" alternativo.
   - Manejo de errores con toast.
   - Redirect a `?next` o `/dashboard`.

8) Layout raíz con:
   - Metadata SEO base (title, description, OG).
   - Fuente Inter cargada con next/font.
   - Providers: Toaster (sonner) y ThemeProvider (dark/light).

9) `next.config.js` con headers de seguridad (CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy: camera=(self)).

10) `lib/constants.ts` con constantes del proyecto (nombres de buckets, límites, etc).

11) README.md con instrucciones de setup local.

CRITERIOS DE ACEPTACIÓN
- `npm run dev` levanta sin errores ni warnings de TS.
- `/login` renderiza y permite login (asumiendo user creado en Supabase Dashboard).
- Middleware bloquea `/dashboard` si no hay sesión.
- No hay ninguna referencia al service role key en código que llegue al browser.

FORMATO DE SALIDA
Devolveme cada archivo completo con su path. No omitas nada. Sin explicaciones, solo código.
```

---

### 🟦 PROMPT FASE 1 — Motor de Invitaciones (Renderer + Temas + Secciones)

```
CONTEXTO
Fase 1 del proyecto (Fase 0 ya completada). Tengo Next.js 14 con Supabase configurado. La tabla `templates` tiene 18 plantillas (6 familias × 3 variantes) con `default_theme` (paleta, fuentes, animaciones) y `default_sections` (array ordenado). La tabla `events` tiene `theme_config` y `sections_config` que overridean lo del template.

TAREA
Construí el motor de renderizado de invitaciones y las 6 familias visuales.

1) Sistema de temas (`components/invitations/themes/`):
   Creá un archivo por cada familia con esta interfaz:
   ```ts
   export interface InvitationTheme {
     slug: string;
     name: string;
     family: TemplateFamily;
     variant: string;
     palette: { primary, secondary, bg, text, accent };
     fonts: { heading: string; body: string; // google fonts };
     animations: string;
     ornaments: string;
     cssVars: Record<string,string>;   // se inyectan en :root del contenedor
     backgroundClass?: string;
   }
   ```
   Implementá los 18 temas con los slugs exactos que están en la DB.

2) Loader de fuentes: `lib/fonts.ts` que cargue con `next/font/google` las 20+ fuentes usadas por los temas, con `display: swap` y `variable: '--font-xxx'`.

3) Componentes de sección modulares en `components/invitations/sections/`:
   Cada sección recibe `props: { theme: InvitationTheme; data: any; }`. Implementá TODAS:
   - Hero (portada con foto/video de fondo, título, fecha, botón "Ver invitación" con scroll)
   - Countdown (días/horas/min/seg en tiempo real, con animación)
   - EventDetails (fecha completa, hora, ceremonia + fiesta si aplica)
   - LocationMap (Google Maps embed via iframe simple, botón "Cómo llegar")
   - DressCode (texto + swatches de colores sugeridos)
   - Story (timeline vertical con hitos)
   - PhotoAlbum (carrusel horizontal con lightbox, hasta 10 fotos)
   - RsvpForm (nombre, email, teléfono, acompañantes, restricciones, mensaje) — submit a `/api/rsvp`
   - Gifts (CBU/alias con botón copiar, links a listas externas)
   - MusicPlayer (audio con play/pause flotante)
   - SongRequests (input simple, submit a `/api/song-request`)
   - InstagramWall (hashtag + @, con placeholder si no hay embed real)
   - Godparents (grid de personas destacadas con foto y rol)
   - Accommodation (cards con nombre, dirección, teléfono, precio orientativo)
   - Trivia (5 preguntas configurables, guarda score en localStorage)
   - LiveAlbumQr (destaca CTA con QR a la URL de subida, importante!)

4) Motor de renderizado `components/invitations/InvitationRenderer.tsx`:
   - Props: `{ event: Event; template: Template; guest?: Guest }`
   - Combina `template.default_theme` con `event.theme_config` (deep merge, event pisa).
   - Combina `template.default_sections` con `event.sections_config` (event pisa el orden y contenido).
   - Aplica CSS variables del tema en un `<div>` contenedor.
   - Renderiza dinámicamente cada sección según el orden.
   - Si viene `guest`, muestra nombre personalizado en Hero.
   - Todas las animaciones con Framer Motion `whileInView`, respetando `prefers-reduced-motion`.

5) Página pública `app/(public)/invitacion/[slug]/page.tsx`:
   - Server Component: busca evento por slug con Supabase, valida `status='active'`, obtiene template.
   - Si viene `?g=<personal_slug>`, busca guest y lo pasa al renderer.
   - SEO: OpenGraph con cover_image, título, fecha.
   - 404 si no existe o está en draft.

6) Página `app/(public)/invitacion/[slug]/rsvp/page.tsx`:
   - Muestra form completo standalone (por si se comparte solo el RSVP).
   - Mismo diseño que dentro de la invitación.

7) API `app/api/rsvp/route.ts`:
   - POST con Zod validation.
   - Rate limit por IP (5/hora).
   - Insert en `rsvps`.
   - Retorna `{ ok: true }` o error tipado.

CRITERIOS DE ACEPTACIÓN
- Puedo entrar a `/invitacion/boda-garcia-x7k2` y ver la invitación renderizada con el tema correcto.
- Cambio `theme_config.palette.primary` en la DB y el color se refleja al recargar.
- El formulario RSVP guarda en la DB y muestra confirmación.
- Todas las fuentes cargan sin FOUC.
- Lighthouse Performance ≥ 90 en mobile.

FORMATO DE SALIDA
Cada archivo completo con su path. Los 18 temas completos. Sin ejemplos parciales.
```

---

### 🟦 PROMPT FASE 2 — RSVP Avanzado + Invitados Personalizados + Export

```
CONTEXTO
Fase 2. Ya tengo invitaciones funcionando y RSVP básico. Ahora necesito el sistema completo de gestión de confirmaciones y invitados personalizados (links únicos con nombre precargado).

TAREA
1) Panel admin `/eventos/[id]/rsvp/page.tsx`:
   - Tabla con: nombre, email, teléfono, acompañantes, status (badge), fecha, restricciones, mensaje, canción.
   - Filtros: status (todos/confirmados/rechazados), buscador por nombre/email.
   - Contadores arriba: total confirmados, total personas (sumando acompañantes), % de respuesta.
   - Botones: Export Excel (.xlsx con xlsx library), Export CSV, Export PDF (usa una impresión CSS-friendly, `window.print()`).
   - Acciones por fila: editar (dialog), eliminar (confirmación).
   - Refresh en tiempo real con Supabase Realtime (suscripción a INSERT en `rsvps` filtrado por event_id).

2) Gestión de invitados personalizados `/eventos/[id]/invitados/page.tsx`:
   - Tabla de guests (nombre, slots, link personal).
   - Botón "Nuevo invitado" (dialog con nombre + slots).
   - Import masivo: upload de CSV o pegar lista con formato "Nombre, slots" por línea.
   - Cada guest tiene un `personal_slug` generado auto (8 chars hex).
   - Botón "Copiar link" que copia `https://ariel.com.ar/invitacion/[slug]?g=[personal_slug]`.
   - Botón "Enviar por WhatsApp" que abre `https://wa.me/?text=<mensaje-precargado>`.
   - QR individual por invitado (dialog con QR + botón descargar PNG).

3) Modificar el Hero de la invitación para que cuando venga `?g=`, muestre "Familia García" (o el nombre) en grande.

4) Server actions en `app/eventos/[id]/actions.ts`:
   - `createGuest(eventId, data)`
   - `bulkCreateGuests(eventId, list)`
   - `deleteGuest(guestId)`
   - `updateRsvp(rsvpId, data)`
   - `deleteRsvp(rsvpId)`
   - Todas con validación Zod y check de `is_superadmin()`.

5) API `app/api/rsvp/route.ts` mejorado:
   - Si viene `guestId` en el body, asocia el RSVP a ese guest.
   - Valida que `attendees_count <= guest.slots`.

6) Componente `RsvpTable.tsx` reusable con la lógica de filtros/paginación/export.

7) `lib/utils/export.ts`:
   - `exportToExcel(data, filename)` con xlsx
   - `exportToCsv(data, filename)` puro JS
   - Formateo de fechas en español.

CRITERIOS DE ACEPTACIÓN
- Puedo crear 50 invitados con import CSV en < 5 segundos.
- El link personal muestra el nombre correcto y precarga el form.
- Export Excel abre en Excel/Google Sheets sin problemas.
- Tiempo real: si abro dos pestañas del panel RSVP y confirmo desde el celular, ambas se actualizan.

FORMATO DE SALIDA
Cada archivo completo. Nada de "TODO", nada de placeholders.
```

---

### 🟦 PROMPT FASE 3 — Álbum en Vivo (PWA de Subida + Backend)

```
CONTEXTO
Fase 3. Ya tengo invitaciones + RSVP + invitados. Ahora el módulo estrella: fotos subidas por QR desde el celular de los invitados en la fiesta.

TAREA
1) PWA de subida `app/(public)/album/[slug]/page.tsx`:
   - Server Component que valida: evento existe, `status='active'`, `album_enabled=true`.
   - Client Component con:
     - Título grande "📸 Compartí tus fotos de [nombre evento]"
     - Input file (accept="image/*", capture="environment") con botón grande "Tocar para elegir foto"
     - Preview de la foto seleccionada (canvas, con compresión inline a max 2400px lado mayor, JPEG 85%).
     - Input caption (textarea, máx 200 chars, contador visible)
     - Input nombre (opcional)
     - Botón "Subir" con estado loading + progreso.
     - Después de subir: mensaje "¡Listo! Tu foto aparecerá en pantalla en unos segundos" + botón "Subir otra".
   - Sin login, sin registro.
   - PWA manifest en `public/manifest.json` (iconos, nombre, standalone).
   - `<meta name="apple-mobile-web-app-capable" content="yes">`.
   - Diseño mobile-first, botones grandes (min 48px), font-size ≥ 16px (evita zoom iOS).

2) Compresión + strip EXIF en cliente (`lib/utils/image.ts`):
   - `compressImage(file: File, maxSize=2400, quality=0.85): Promise<Blob>` con canvas.
   - Elimina metadata al re-encodear.
   - Detecta HEIC/HEIF y convierte si es posible (fallback: upload original).
   - Valida tipo real con FileReader leyendo los primeros bytes.

3) API `app/api/upload/route.ts`:
   - POST con FormData (file + caption + uploader_name + event_id).
   - Server-side:
     - Rate limit por IP (20/hora, usando `check_rate_limit`).
     - Valida que evento existe y `album_enabled=true`.
     - Valida MIME real (magic bytes: `image/webp`, `image/jpeg`, `image/png`).
     - Valida tamaño ≤ 10MB.
     - Upload al bucket `event-photos` con path `${event_id}/${uuid}.${ext}` usando cliente admin.
     - Genera 2 versiones adicionales SERVER-SIDE con `sharp`:
       - `thumbnail_400.webp` (400px lado mayor, 80%)
       - `display_1920.webp` (1920px lado mayor, 85%)
     - Insert en `photos` con status='pending' (o 'approved' si `album_auto_approve=true`).
     - Retorna `{ ok: true, id }` o error.
   - Loggea en `audit_log`.

4) Instalá `sharp` como dep de servidor.

5) Vista `app/(public)/album/[slug]/success` (post-upload) o inline según sea más simple.

6) `next.config.js`: agregá `serverActions: { bodySizeLimit: '12mb' }` y `images.remotePatterns` con supabase.

CRITERIOS DE ACEPTACIÓN
- Desde el celular escaneo el QR, subo una foto de 8MB, se comprime a ~500KB antes de subir.
- La foto queda en Supabase Storage y en la tabla `photos` con las 3 versiones.
- Si intento subir un `.pdf` renombrado a `.jpg`, el servidor lo rechaza.
- Si intento 21 uploads en 1 hora desde la misma IP, el 21° falla con 429.
- Los datos GPS de la foto NO se guardan.

FORMATO DE SALIDA
Todos los archivos. Código de compresión completo. Sin librerías innecesarias.
```

---

### 🟦 PROMPT FASE 4 — Pantalla Slideshow en Tiempo Real

```
CONTEXTO
Fase 4. Ya se pueden subir fotos por QR. Ahora la pantalla que se proyecta en la fiesta: URL fullscreen que muestra las fotos aprobadas en loop con transiciones y las nuevas aparecen en tiempo real.

TAREA
1) Página `app/(public)/pantalla/[slug]/page.tsx`:
   - Server Component: valida evento existe + `status='active'` + `album_enabled=true`. Verifica un query param `?token=<screen_token>` que coincida con `events.screen_token` (para que no cualquiera pueda proyectar).
   - Client Component `SlideshowScreen`:
     - Carga fotos aprobadas iniciales (últimas 50, orden desc por created_at).
     - Suscripción Realtime a INSERT/UPDATE en `photos` filtrando por event_id: cuando llega una foto nueva con status='approved', la agrega al principio de la cola con flag `isNew=true`.
     - Loop de slideshow:
       - Intervalo = `event.album_slide_duration_ms` (default 3000).
       - Si hay fotos nuevas con `isNew=true`, muéstralas primero (una vez cada una), después vuelve al orden.
       - Al pasar por una foto, quítale `isNew`.
     - Transiciones: fade / slide / zoom (según `event.album_transition`), con Framer Motion AnimatePresence.
     - Layout:
       - Fullscreen negro.
       - Foto centrada con `object-fit: contain`, max-height 85vh.
       - Overlay inferior con caption + nombre del uploader (si `album_show_captions=true`), tipografía grande (48px), sombra fuerte para legibilidad.
       - Watermark opcional (`album_watermark_url`) en esquina inferior derecha con opacidad 0.6.
       - Contador de fotos en esquina superior derecha "12 fotos • #hashtag".
       - QR de subida en esquina inferior izquierda (pequeño, con "Sumate: escaneá").
     - Vista standby (sin fotos todavía):
       - Logo del evento + "Sé el primero en subir una foto" + QR grande animado.
     - Precarga: siempre carga en memoria las próximas 3 fotos como `<Image priority>` invisible, para transiciones sin lag.
     - Manejo de errores: si una foto falla al cargar, la salta.
     - Auto-fullscreen: botón "🖥️ Fullscreen" en la esquina que llama a `requestFullscreen()`. Se auto-oculta a los 3s.
     - Prevención de sleep: usar Wake Lock API (`navigator.wakeLock.request('screen')`).
     - Reconexión Realtime: si se pierde la conexión, mostrar banner discreto y reintentar cada 5s.
   - No indexable (`robots noindex`).

2) Componente `Transitions.tsx` con las 3 transiciones parametrizadas.

3) `StandbyView.tsx` con el QR grande + animación de "escaneame".

4) En el panel `/eventos/[id]/album/page.tsx`:
   - Botón "Abrir pantalla" que copia y abre la URL con token.
   - Sliders para ajustar `album_slide_duration_ms` (2000–10000 en pasos de 500), `album_transition` (fade/slide/zoom), toggles para captions/watermark.
   - Preview embebido de la pantalla en un iframe pequeño (útil para probar).

5) Middleware: excluir `/pantalla/*` de cualquier protección (es público con token).

CRITERIOS DE ACEPTACIÓN
- Abro `/pantalla/boda-garcia-x7k2?token=xxx` en fullscreen en el navegador.
- Desde otro dispositivo subo una foto → aparece en pantalla en < 4 segundos.
- Si desactivo internet 10s y lo vuelvo a activar, la suscripción se recupera.
- El navegador NO baja el brillo durante 30 minutos (Wake Lock).
- Sin token válido, retorna 401.

FORMATO DE SALIDA
Todos los archivos. Código completo del slideshow con manejo de estados.
```

---

### 🟦 PROMPT FASE 5 — Panel Admin Completo (Moderación + Descargas + CRUD)

```
CONTEXTO
Fase 5. Todo el frontend público funciona. Ahora el panel admin que usa Ariel para todo el día a día.

TAREA
1) Layout admin `app/(admin)/layout.tsx`:
   - Sidebar responsive (colapsable en mobile) con items: Dashboard, Eventos, Plantillas, Clientes, Configuración.
   - Header con avatar, nombre, botón logout.
   - Tema dark/light toggle.
   - Breadcrumbs.

2) `/dashboard/page.tsx`:
   - Cards con métricas: eventos activos, próximos 7 días, fotos totales hoy, RSVPs esta semana.
   - Lista "Próximos eventos" (5 más cercanos).
   - Lista "Últimas fotos subidas" (grilla 8 fotos, click abre moderación).
   - Chart simple (últimas 4 semanas de actividad).

3) `/eventos/page.tsx`:
   - Tabla de todos los eventos con: título, cliente, fecha, tipo, status (badge), acciones.
   - Filtros: status, tipo, rango de fechas, buscador.
   - Botón "Nuevo evento" → wizard modal de 3 pasos: datos básicos → plantilla → módulos activos.

4) `/eventos/nuevo/page.tsx`:
   - Wizard con React Hook Form multi-step:
     - Paso 1: cliente (select existente o crear inline), título, tipo, fecha, ubicación.
     - Paso 2: elegir template (grilla con previews clickeables).
     - Paso 3: módulos (toggles: álbum en vivo, RSVP, canciones), config de álbum.
   - Al finalizar: inserta evento con status='draft' y redirige a `/eventos/[id]`.

5) `/eventos/[id]/page.tsx`:
   - Tabs: General / Invitación / Invitados / RSVP / Álbum / QR / Peligro.
   - **General**: form con datos básicos, botón "Publicar" (cambia status a active), "Archivar".
   - **Invitación**: editor visual:
     - Panel izquierdo: preview live de la invitación en iframe (responsive: mobile/tablet/desktop toggle).
     - Panel derecho: acordeón con:
       - Tema: color pickers para los 5 colores, selectores de fuentes (10 pares aprobados).
       - Secciones: lista drag-and-drop (dnd-kit) para reordenar + toggles on/off + editor de contenido por sección (accordions expandibles).
       - Assets: upload de cover_image, música, watermark.
     - Cada cambio se guarda con debounce 800ms (server action).
   - **Invitados**: (ya hecho en fase 2).
   - **RSVP**: (ya hecho en fase 2).
   - **Álbum**: descrito abajo (punto 6 y 7).
   - **QR**: descrito abajo (punto 8).
   - **Peligro**: botones eliminar evento (soft delete con confirmación de texto tipeado).

6) Moderación mobile-first `/eventos/[id]/album/moderacion/page.tsx`:
   - Optimizada para celular en la fiesta.
   - Muestra UNA foto pendiente en pantalla completa.
   - Debajo: caption + nombre.
   - Dos botones ENORMES: ✅ Aprobar (verde) y ❌ Rechazar (rojo).
   - Al tocar: actualiza status y muestra la siguiente automáticamente.
   - Contador arriba: "3 pendientes".
   - Toggle "Auto-aprobar" arriba (cambia `album_auto_approve` del evento).
   - Suscripción realtime: si llegan nuevas, se agregan a la cola.

7) Galería completa `/eventos/[id]/album/page.tsx`:
   - Grilla responsive de todas las fotos (masonry o grid).
   - Filtros: status (todas/pendientes/aprobadas/rechazadas), rango de fechas, buscador por caption.
   - Selección múltiple (checkbox por foto o "seleccionar todas visibles").
   - Barra de acciones flotante cuando hay selección:
     - Aprobar seleccionadas / Rechazar / Eliminar.
     - **Descargar ZIP** (llama a `/api/zip/[eventId]` con IDs seleccionados).
   - Click en foto: lightbox con: preview grande, metadata (uploader, fecha, tamaño, IP hasheada), botones aprobar/rechazar/eliminar.
   - Panel de config del álbum arriba (los sliders de fase 4).

8) `/eventos/[id]/qr/page.tsx`:
   - 3 secciones:
     - **QR de invitación**: PNG grande de la URL pública de invitación. Botón descargar PNG/SVG/PDF.
     - **QR de subida de fotos**: PNG grande de la URL `/album/[slug]`. Botón descargar. Opción "Generar PDF imprimible" que genera un PDF A5 con: título del evento, QR grande, texto "Escaneá para subir tus fotos", diseño elegante. Se genera server-side con `@react-pdf/renderer` o similar.
     - **QR de pantalla**: URL con token para proyectar. Botón "Copiar" y "Abrir".

9) API `app/api/zip/[eventId]/route.ts`:
   - GET con query `?ids=uuid1,uuid2,...` (opcional, si no viene descarga todas las aprobadas).
   - Valida auth + is_superadmin.
   - Obtiene metadata de fotos.
   - Genera signed URLs.
   - Descarga cada foto stream y las mete en un ZIP con `jszip`.
   - Retorna el ZIP con nombre `${event.slug}-fotos.zip`.
   - Loggea en audit_log.
   - Streaming response (para muchas fotos).

10) `/plantillas/page.tsx`:
    - Grilla de las 18 plantillas con preview.
    - Click para ver detalle + preview live (misma URL de invitación pero con datos demo).
    - Botón "Duplicar" (crea variante nueva editable).
    - Solo lectura para las 18 base.

11) `/clientes/page.tsx`:
    - CRUD simple de clientes.
    - Ver eventos asociados a cada uno.

12) `/configuracion/page.tsx`:
    - Perfil de Ariel (nombre, avatar, email).
    - Cambio de password.
    - 2FA (setup TOTP con QR).
    - Retention policy: input "eliminar fotos automáticamente pasados X días del evento" (guarda config en tabla nueva `settings` o en profile.metadata).

CRITERIOS DE ACEPTACIÓN
- Puedo crear un evento nuevo en < 60 segundos.
- Puedo cambiar el color primario de la invitación y ver el cambio en el preview en < 1 seg.
- Modero 50 fotos en < 2 minutos desde el celular.
- Descargo un ZIP de 200 fotos sin timeout.
- Todos los cambios quedan reflejados en la DB con audit log.

FORMATO DE SALIDA
Todos los archivos completos. Sin resúmenes ni omisiones.
```

---

### 🟦 PROMPT FASE 6 — Landing Principal (Estructura Premium con Placeholders)

```
CONTEXTO
Fase 6. Panel y funcionalidad completos. Falta la landing pública que verá el visitante nuevo. Por ahora estructura premium con placeholders; después se rellena con el contenido real de Ariel.

TAREA
Construí una landing de 1 página, moderna, con animaciones sobrias, mobile-first.

Estructura en `app/(public)/page.tsx`:

1) **Nav** sticky con blur, links a secciones (Servicios, Trabajos, Cómo funciona, Contacto), botón CTA "Pedir presupuesto" (WhatsApp).

2) **Hero**:
   - Video de fondo (placeholder de Pexels/Coverr o color sólido).
   - Overlay oscuro.
   - Título grande "Creamos momentos que se recuerdan".
   - Subtítulo.
   - 2 CTAs: "Ver servicios" + "Ver demo de invitación".
   - Scroll indicator animado.

3) **Servicios** (4 cards en grid):
   - Tarjetas Virtuales (icono + descripción + "Ver ejemplo" → invitación demo).
   - Fotografía & Video (icono + descripción + "Ver portfolio").
   - Álbum en Vivo + Pantalla (icono + descripción + "Ver demo" → link a una pantalla demo con fotos precargadas).
   - Cobertura Integral (books, videos, cubos 3D, reels).
   - Cada card con hover elevation + micro-animación.

4) **Cómo funciona** (3 pasos con iconos + números grandes):
   - 1. Contás tu evento.
   - 2. Elegimos plantilla y estilo.
   - 3. Recibís todo listo el día de la fiesta.

5) **Trabajos** (grilla masonry de 8 placeholders):
   - Componente que acepta array de items (foto o video).
   - Hover: overlay con título del proyecto.
   - Click: lightbox.
   - Configurable después desde el panel (tabla `portfolio_items` — la agrego al schema como opcional).

6) **Demo interactiva**:
   - Sección con 2 previews grandes:
     - iframe con una invitación de muestra funcional.
     - iframe con la pantalla en vivo con 5 fotos hardcodeadas.
   - Texto: "Probalo vos mismo".

7) **Testimonios** (carrusel de 3 placeholder cards).

8) **Contacto**:
   - Form (nombre, email, teléfono, tipo de evento, fecha estimada, mensaje) → submit a `/api/contact` (por ahora solo guarda en tabla `contact_requests`, no envía email).
   - Info: WhatsApp con botón directo, Instagram, email.
   - Mapa opcional de zona de cobertura.

9) **Footer**:
   - Logo, tagline, redes, copyright, links a políticas.

10) Estilo global:
    - Paleta neutra + 1 acento (definir 2-3 opciones en `tailwind.config`).
    - Tipografía: pareja premium (ej. Fraunces + Inter).
    - Animaciones scroll-triggered sobrias (fade-up, stagger).
    - Micro-interacciones en botones (hover scale sutil).
    - Cursor custom opcional en desktop.

11) Nueva tabla en Supabase (agregala al SQL):
```sql
create table public.portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text,
  media_type text check (media_type in ('image','video')),
  media_url text not null,
  thumbnail_url text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.portfolio_items enable row level security;
create policy "portfolio_public_read" on public.portfolio_items for select using (is_active = true);
create policy "portfolio_admin_write" on public.portfolio_items for all
  using (public.is_superadmin()) with check (public.is_superadmin());

create table public.contact_requests (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text,
  phone text,
  event_type text,
  event_date date,
  message text,
  ip_address inet,
  created_at timestamptz default now()
);
alter table public.contact_requests enable row level security;
create policy "contact_public_insert" on public.contact_requests for insert with check (true);
create policy "contact_admin_read" on public.contact_requests for select using (public.is_superadmin());
```

12) Panel `/portfolio` y `/contactos` en admin (CRUD de estos dos).

13) SEO: `robots.ts`, `sitemap.ts` dinámico, metadata completa.

CRITERIOS DE ACEPTACIÓN
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 en mobile.
- Todo el contenido "de Ariel" es placeholder editable después.
- Formulario de contacto guarda en la DB y muestra confirmación visual.
- Ninguna imagen es de stock con marca comercial (usar Unsplash/Pexels o SVGs).

FORMATO DE SALIDA
Todos los archivos completos.
```

---

### 🟦 PROMPT FASE 7 — Hardening + Tests + Deploy

```
CONTEXTO
Fase 7 final. Todo funciona. Ahora endurecemos, testeamos y desplegamos.

TAREA
1) Tests E2E con Playwright (`tests/e2e/`):
   - `auth.spec.ts`: login flow, protección de rutas.
   - `invitation.spec.ts`: renderizado público, RSVP submit, invitado personalizado.
   - `album-upload.spec.ts`: subida de foto, rate limit, validación.
   - `screen.spec.ts`: carga de pantalla, tiempo real (mock realtime).
   - `admin-flow.spec.ts`: crear evento → publicar → moderar foto → descargar zip.
   - Configuración en `playwright.config.ts` con projects para Chromium/WebKit/Mobile Safari.

2) Tests unitarios con Vitest (`tests/unit/`):
   - Helpers de compresión, validación Zod, deep merge de themes, slugify.

3) Endurecimiento:
   - Instalá y configurá `@vercel/edge-config` o similar para feature flags.
   - Configurá `next.config.js` con:
     - `poweredByHeader: false`
     - Headers completos (CSP, HSTS, X-Frame, etc).
     - Redirect www ↔ apex.
     - Image optimization con dominio de Supabase.
   - Sanitización adicional de inputs con DOMPurify en cualquier contenido rich text.
   - Log estructurado con Pino (opcional).

4) Monitoreo:
   - Integrá Sentry (o al menos deja el hook listo).
   - Configurá health check `/api/health` que valide conexión a Supabase.

5) Documentación (`docs/`):
   - `INSTALACION.md`: paso a paso desde cero.
   - `PANEL.md`: manual de uso para Ariel con capturas (dejá placeholders).
   - `RUNBOOK.md`: qué hacer si algo se rompe (fotos no aparecen, pantalla no actualiza, etc).
   - `BACKUP.md`: cómo restaurar backups de Supabase.
   - `TROUBLESHOOTING.md`.

6) Script `scripts/seed-demo.ts`:
   - Crea 1 cliente demo, 1 evento demo (activo), 10 invitados, 5 RSVPs, 15 fotos aprobadas.
   - Útil para probar la landing / demo pública.

7) GitHub Actions `.github/workflows/ci.yml`:
   - En cada PR: lint + typecheck + tests unitarios + build.
   - En main: deploy a Vercel (via integración nativa).

8) Deploy checklist:
   - Configurar dominio en Vercel.
   - Variables de entorno en Vercel (prod).
   - DNS: A + CNAME.
   - Supabase: backups habilitados, alertas configuradas.
   - Verificar CSP no rompe nada en prod.
   - Verificar Realtime funciona en prod.

9) Post-deploy: correr Playwright contra prod para smoke test.

CRITERIOS DE ACEPTACIÓN
- Todos los tests pasan.
- Lighthouse ≥ 90 en todas las páginas.
- No hay warnings en build.
- Deploy automático desde main a Vercel funciona.
- Documentación completa.

FORMATO DE SALIDA
Todos los archivos + workflows + scripts.
```

---

## 8. DEPLOY Y POST-LANZAMIENTO

### 8.1 Orden de deploy

1. **Supabase**: crear proyecto → ejecutar bloques SQL 4.1 a 4.6 en orden → verificar RLS en el UI (Tables → RLS toggle).
2. **Repo GitHub**: crear repo privado → push del código.
3. **Vercel**: importar repo → agregar variables de entorno → deploy.
4. **Dominio**: configurar DNS (A → 76.76.21.21 para Vercel, o CNAME según el caso).
5. **Registrarse en la app**: crear tu usuario con el email de Ariel → correr bloque 4.7 para hacerlo superadmin.
6. **Smoke test**: crear evento demo → publicar → probar invitación, RSVP, subida de foto, pantalla.

### 8.2 Backups

- Supabase plan Free: backup diario automático (retención 7 días).
- Recomendado plan Pro ($25/mes) cuando haya eventos reales: Point-in-Time Recovery.
- Script mensual `scripts/backup-storage.ts` que exporta el bucket `event-photos` a un cold storage (opcional).

### 8.3 Escalado

- Free/Pro de Supabase alcanza hasta ~500 eventos con ~1000 fotos c/u sin problemas.
- Si crece: migrar Storage a Cloudflare R2 (mismo Postgres, solo cambia el proveedor de archivos).
- CDN: Vercel + Supabase ya tienen CDN incluido.

---

## 9. CHECKLIST DE VERIFICACIÓN FINAL

### Funcional

- [ ] Login / logout funciona con 2FA opcional.
- [ ] Puedo crear un evento nuevo en < 1 minuto.
- [ ] Las 18 plantillas se ven distintas y todas renderizan.
- [ ] Cambio de color en panel se refleja en < 1 segundo en preview.
- [ ] RSVP público funciona, guarda en DB, se ve en tiempo real en panel.
- [ ] Invitado personalizado con `?g=` muestra su nombre.
- [ ] Export Excel/CSV/PDF de RSVPs funciona.
- [ ] QR de subida abre PWA en mobile.
- [ ] Foto sube, se comprime, guarda 3 versiones (thumb/display/original).
- [ ] Moderación mobile es fluida (aprobar/rechazar con 1 toque).
- [ ] Pantalla muestra fotos en tiempo real con transiciones.
- [ ] Wake Lock previene sleep en pantalla.
- [ ] Descarga ZIP de 100+ fotos funciona.
- [ ] Landing carga con Lighthouse ≥ 90.

### Seguridad

- [ ] RLS activo en todas las tablas.
- [ ] Service role key nunca en cliente.
- [ ] Rate limit en /api/upload y /api/rsvp.
- [ ] CSP headers configurados.
- [ ] EXIF strippeado en fotos.
- [ ] Validación de tipo real de archivo.
- [ ] Tokens de screen y upload no adivinables.
- [ ] Audit log escribe en acciones sensibles.

### DevOps

- [ ] CI/CD Vercel automático.
- [ ] Tests E2E pasan.
- [ ] Backups Supabase activos.
- [ ] Monitoreo básico configurado.
- [ ] Documentación completa.

---

## 🚀 CIERRE

Con este documento tenés:

- **1 esquema SQL completo** listo para pegar en Supabase (secciones 4.1 a 4.7).
- **8 prompts detallados** para Antigravity, uno por fase, con criterios de aceptación estrictos (sección 7).
- **Todas las decisiones de arquitectura fundamentadas** (stack, seguridad, escalado).
- **Checklists de verificación** para no dejar cabos sueltos.

Cada prompt de Antigravity está diseñado para ser autocontenido: podés ejecutarlo, revisar el resultado, ajustar si algo no cierra, y pasar al siguiente. El SQL está pensado para correrse una sola vez, en orden, sin dependencias externas.

**Orden recomendado de ejecución:**

1. Ejecutar SQL en Supabase (4.1 → 4.6).
2. Crear proyecto Next.js localmente.
3. Ejecutar Prompt Fase 0 en Antigravity.
4. Ejecutar Prompts 1 a 7 en orden, verificando cada uno.
5. Ejecutar bloque 4.7 después de registrar tu usuario admin.
6. Deploy a Vercel.
7. Correr checklist final.

Todo está pensado para ser modificable: si mañana Ariel quiere una plantilla nueva, se agrega un registro en `templates`. Si quiere un módulo de pagos, se suma sin romper nada. Si quiere un módulo de emails automáticos, se enchufa Resend. Nada está acoplado.
