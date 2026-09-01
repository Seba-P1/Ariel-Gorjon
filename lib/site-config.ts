import { createAdminClient } from '@/lib/supabase/admin';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  buttonText: string;
  whatsappMessage: string;
}

export interface ClientReview {
  id: string;
  author: string;
  event: string;
  quote: string;
  stars: number;
}

export interface SiteConfig {
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
  };
  contact: {
    whatsappNumber: string;
    whatsappText: string;
    instagramHandle: string;
  };
  liveScreenDemo: {
    eventTitle: string;
    photoNumber: string;
    uploaderName: string;
    caption: string;
    photoUrl: string;
  };
  plans: PricingPlan[];
  reviews: ClientReview[];
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: {
    badge: 'Invitaciones Digitales + Fotos en Pantalla Gigante',
    titleMain: 'Hacé de tu fiesta una',
    titleHighlight: 'experiencia inolvidable',
    description:
      'Invitaciones web interactivas con música, mapas GPS y confirmación de asistencia al instante, junto con un álbum interactivo donde tus invitados suben fotos escaneando un código QR que se proyectan en vivo durante la fiesta.',
  },
  contact: {
    whatsappNumber: '5491100000000',
    whatsappText: 'Hola Ariel, quiero información y presupuesto para mi evento',
    instagramHandle: '@arielproducciones',
  },
  liveScreenDemo: {
    eventTitle: 'Boda Sofía & Mateo',
    photoNumber: '42/150',
    uploaderName: 'Familia Pérez',
    caption: '¡Felicidades a los recién casados! Los amamos con todo el corazón ❤️',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
  },
  plans: [
    {
      id: 'plan-esencial',
      name: 'Invitación Esencial',
      price: '$25.000',
      description: 'Para quienes buscan una invitación moderna, elegante y digital.',
      features: [
        'Invitación web 100% personalizada',
        'Confirmación de asistencia online con cupos',
        'Ubicación GPS Waze / Google Maps',
        'Cuenta regresiva en tiempo real',
        'Datos bancarios / CBU / Alias para regalos',
      ],
      isFeatured: false,
      buttonText: 'Contratar Esencial',
      whatsappMessage: 'Hola Ariel, quiero contratar el Plan Esencial',
    },
    {
      id: 'plan-completo',
      name: 'Experiencia Completa',
      price: '$45.000',
      description: 'Invitación interactiva + Álbum en vivo + Pantalla de fiesta en tiempo real.',
      features: [
        'Todo lo del Plan Esencial incluido',
        'Álbum digital con subida QR en mesas (sin descargar apps)',
        'Proyección en vivo para pantalla gigante o proyector',
        'Links personalizados por invitado con control de lugares',
        'Descarga del álbum completo en ZIP en alta resolución',
        'Panel de moderación de fotos en vivo',
      ],
      isFeatured: true,
      buttonText: 'Contratar Experiencia Completa',
      whatsappMessage: 'Hola Ariel, quiero contratar el Plan Experiencia Completa',
    },
    {
      id: 'plan-produccion',
      name: 'Producción Total',
      price: 'Consultar',
      description: 'Para bodas y mega eventos con asistencia técnica presencial y carteles.',
      features: [
        'Todo lo del Plan Experiencia Completa',
        'Operador técnico presencial en el evento',
        'Carteles acrílicos impresos con QR para mesas',
        'Dominio web exclusivo (ej: sofiaymateo.com)',
        'Soporte prioritario 24/7',
      ],
      isFeatured: false,
      buttonText: 'Consultar Presupuesto',
      whatsappMessage: 'Hola Ariel, quiero consultar presupuesto para el Plan Producción Total',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      author: 'Luciana & Gonzalo',
      event: 'Boda en San Isidro',
      quote:
        'La pantalla en vivo fue la atracción de la fiesta. Todos los invitados estaban fascinados subiendo fotos desde las mesas y viéndolas en pantalla gigante.',
      stars: 5,
    },
    {
      id: 'rev-2',
      author: 'Mariela (Mamá de Sofi)',
      event: 'Fiesta de 15 en Pilar',
      quote:
        'La confirmación de asistencia nos ahorró semanas de trabajo. Exportamos la lista a Excel directo para el salón y el catering.',
      stars: 5,
    },
    {
      id: 'rev-3',
      author: 'Esteban & Clara',
      event: 'Casamiento en Luján',
      quote:
        'El diseño de la tarjeta quedó increíble, con la música y el mapa de Waze nadie se perdió para llegar a la estancia.',
      stars: 5,
    },
  ],
};

let cachedConfig: SiteConfig | null = null;

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cachedConfig) return cachedConfig;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('clients')
      .select('notes')
      .eq('full_name', '__SITE_CONFIG__')
      .maybeSingle();

    if (!error && data && data.notes) {
      try {
        const parsed = JSON.parse(data.notes);
        if (parsed && typeof parsed === 'object' && parsed.plans) {
          cachedConfig = { ...DEFAULT_SITE_CONFIG, ...parsed };
          return cachedConfig!;
        }
      } catch {
        // Fallback to defaults if JSON is invalid
      }
    }
  } catch (err) {
    console.warn('Error fetching site config:', err);
  }

  return DEFAULT_SITE_CONFIG;
}

export function invalidateSiteConfigCache() {
  cachedConfig = null;
}
