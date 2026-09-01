'use client';

import * as React from 'react';
import { SiteConfig, PricingPlan, ClientReview } from '@/lib/site-config';
import { saveSiteConfig } from '@/app/(admin)/configuracion/actions';
import { toast } from 'sonner';
import {
  Save,
  Globe,
  DollarSign,
  Star,
  Tv,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  FileText,
  Layout,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface SiteConfigManagerProps {
  initialConfig: SiteConfig;
}

export function SiteConfigManager({ initialConfig }: SiteConfigManagerProps) {
  const [config, setConfig] = React.useState<SiteConfig>(initialConfig);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('plans');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await saveSiteConfig(config);
      if (!res.ok) {
        toast.error('Error al guardar: ' + res.error);
        return;
      }
      toast.success('¡Configuración de la web y landing actualizada exitosamente!');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Plan Handlers
  const handleUpdatePlan = (index: number, field: keyof PricingPlan, value: any) => {
    const updated = [...config.plans];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, plans: updated });
  };

  const handleUpdatePlanFeature = (planIndex: number, featureIndex: number, text: string) => {
    const updatedPlans = [...config.plans];
    const updatedFeatures = [...updatedPlans[planIndex].features];
    updatedFeatures[featureIndex] = text;
    updatedPlans[planIndex].features = updatedFeatures;
    setConfig({ ...config, plans: updatedPlans });
  };

  const handleAddPlanFeature = (planIndex: number) => {
    const updatedPlans = [...config.plans];
    updatedPlans[planIndex].features.push('Nuevo beneficio del plan');
    setConfig({ ...config, plans: updatedPlans });
  };

  const handleRemovePlanFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...config.plans];
    updatedPlans[planIndex].features = updatedPlans[planIndex].features.filter((_, i) => i !== featureIndex);
    setConfig({ ...config, plans: updatedPlans });
  };

  const handleAddPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: 'Nuevo Plan',
      price: '$30.000',
      description: 'Descripción del nuevo servicio.',
      features: ['Característica 1', 'Característica 2'],
      isFeatured: false,
      buttonText: 'Contratar Plan',
      whatsappMessage: 'Hola Ariel, me interesa el Nuevo Plan',
    };
    setConfig({ ...config, plans: [...config.plans, newPlan] });
  };

  const handleRemovePlan = (index: number) => {
    setConfig({ ...config, plans: config.plans.filter((_, i) => i !== index) });
  };

  // Review Handlers
  const handleUpdateReview = (index: number, field: keyof ClientReview, value: any) => {
    const updated = [...config.reviews];
    updated[index] = { ...updated[index], [field]: value };
    setConfig({ ...config, reviews: updated });
  };

  const handleAddReview = () => {
    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      author: 'Nuevo Cliente',
      event: 'Boda en Buenos Aires',
      quote: '¡Excelente experiencia! La pantalla en vivo y las invitaciones encantaron a todos los invitados.',
      stars: 5,
    };
    setConfig({ ...config, reviews: [...config.reviews, newRev] });
  };

  const handleRemoveReview = (index: number) => {
    setConfig({ ...config, reviews: config.reviews.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Sticky Top Bar */}
      <div className="sticky top-4 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-neutral-900/95 border border-neutral-800 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight">
              Personalizador de la Web
            </h1>
            <p className="text-[11px] text-neutral-400">
              Modificá planes, precios, opiniones de clientes y WhatsApp de contacto.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 rounded-xl h-10 px-5 w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1.5" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      {/* Main Tabs — 4 buttons stacked vertically (one below the other) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-col gap-2 p-2 bg-neutral-900/90 border border-neutral-800 rounded-2xl w-full">
          <TabsTrigger
            value="plans"
            className="w-full justify-start text-xs sm:text-sm font-semibold py-3 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all flex items-center gap-3"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/80 group-data-[state=active]/tabs-trigger:bg-amber-500/20 text-amber-400 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Planes & Precios</span>
              <span className="text-[10px] text-neutral-400 font-normal hidden sm:block">Ajustar tarifas, beneficios y planes</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="w-full justify-start text-xs sm:text-sm font-semibold py-3 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all flex items-center gap-3"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-400 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Testimonios de Clientes</span>
              <span className="text-[10px] text-neutral-400 font-normal hidden sm:block">Opiniones de parejas y familias</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="hero"
            className="w-full justify-start text-xs sm:text-sm font-semibold py-3 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all flex items-center gap-3"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Textos Principales & Contacto</span>
              <span className="text-[10px] text-neutral-400 font-normal hidden sm:block">Título de portada, descripción y WhatsApp</span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="screen"
            className="w-full justify-start text-xs sm:text-sm font-semibold py-3 px-4 data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/30 border border-transparent rounded-xl transition-all flex items-center gap-3"
          >
            <div className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-400 shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block font-bold">Muestra de Pantalla en Vivo</span>
              <span className="text-[10px] text-neutral-400 font-normal hidden sm:block">Proyección demo para la landing page</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* 1. PLANES & PRECIOS */}
        <TabsContent value="plans" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Planes de Servicio ({config.plans.length} Planes)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Ajustá precios y características que verán tus clientes en la página principal.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPlan}
              className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9 rounded-xl self-start sm:self-auto font-semibold shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {config.plans.map((plan, pIdx) => (
              <div
                key={plan.id}
                className={`p-4 sm:p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${
                  plan.isFeatured
                    ? 'bg-neutral-900/90 border-amber-500 ring-1 ring-amber-500/30 shadow-lg'
                    : 'bg-neutral-900/50 border-neutral-800'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        plan.isFeatured
                          ? 'bg-amber-500 text-neutral-950 border-amber-500 font-black'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {plan.isFeatured ? 'PLAN DESTACADO' : `PLAN #${pIdx + 1}`}
                    </Badge>

                    {config.plans.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePlan(pIdx)}
                        className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-300">Nombre del Plan</Label>
                    <Input
                      value={plan.name}
                      onChange={(e) => handleUpdatePlan(pIdx, 'name', e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs font-bold h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-300">Precio Visible</Label>
                    <Input
                      value={plan.price}
                      onChange={(e) => handleUpdatePlan(pIdx, 'price', e.target.value)}
                      placeholder="Ej: $45.000 o Consultar"
                      className="bg-neutral-950 border-neutral-800 text-sm font-black text-amber-400 h-9 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-300">Descripción Breve</Label>
                    <Textarea
                      value={plan.description}
                      onChange={(e) => handleUpdatePlan(pIdx, 'description', e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs min-h-[50px] rounded-xl"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-neutral-400">Destacar con cinta "Más Elegido"</span>
                    <Switch
                      checked={plan.isFeatured || false}
                      onCheckedChange={(val) => handleUpdatePlan(pIdx, 'isFeatured', val)}
                    />
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-neutral-300">Beneficios incluidos:</Label>
                      <button
                        type="button"
                        onClick={() => handleAddPlanFeature(pIdx)}
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3 h-3" /> Agregar
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5">
                          <span className="text-emerald-400 text-xs font-bold shrink-0">✓</span>
                          <Input
                            value={feat}
                            onChange={(e) => handleUpdatePlanFeature(pIdx, fIdx, e.target.value)}
                            className="bg-neutral-950 border-neutral-800 text-xs h-8 rounded-lg flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePlanFeature(pIdx, fIdx)}
                            className="text-neutral-500 hover:text-rose-400 p-1 shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Button text */}
                <div className="pt-3 border-t border-neutral-800 space-y-1">
                  <Label className="text-[11px] text-neutral-400">Texto del Botón:</Label>
                  <Input
                    value={plan.buttonText}
                    onChange={(e) => handleUpdatePlan(pIdx, 'buttonText', e.target.value)}
                    className="bg-neutral-950 border-neutral-800 text-xs h-8 rounded-lg font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 2. TESTIMONIOS */}
        <TabsContent value="reviews" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Testimonios de Clientes</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Opiniones reales de parejas y familias para transmitir confianza.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddReview}
              className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9 rounded-xl self-start sm:self-auto font-semibold shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar Testimonio
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.reviews.map((rev, rIdx) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleUpdateReview(rIdx, 'stars', s)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s <= rev.stars ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveReview(rIdx)}
                      className="text-rose-400 hover:bg-rose-500/10 h-7 w-7 p-0 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-neutral-400">Opinión del Cliente</Label>
                    <Textarea
                      value={rev.quote}
                      onChange={(e) => handleUpdateReview(rIdx, 'quote', e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs min-h-[70px] rounded-xl italic"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-neutral-500">Nombre / Pareja</Label>
                    <Input
                      value={rev.author}
                      onChange={(e) => handleUpdateReview(rIdx, 'author', e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs h-8 rounded-lg font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-neutral-500">Lugar / Evento</Label>
                    <Input
                      value={rev.event}
                      onChange={(e) => handleUpdateReview(rIdx, 'event', e.target.value)}
                      className="bg-neutral-950 border-neutral-800 text-xs h-8 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 3. HERO & TEXTOS */}
        <TabsContent value="hero" className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Textos Principales & Contacto WhatsApp
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Badge Superior</Label>
                <Input
                  value={config.hero.badge}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, badge: e.target.value } })
                  }
                  className="bg-neutral-950 border-neutral-800 text-xs h-10 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  Número de WhatsApp (con código país, ej: 5491100000000)
                </Label>
                <Input
                  value={config.contact.whatsappNumber}
                  onChange={(e) =>
                    setConfig({ ...config, contact: { ...config.contact, whatsappNumber: e.target.value } })
                  }
                  className="bg-neutral-950 border-neutral-800 text-xs font-mono h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Título Principal (Primera parte)</Label>
                <Input
                  value={config.hero.titleMain}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, titleMain: e.target.value } })
                  }
                  className="bg-neutral-950 border-neutral-800 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Título Destacado (Gradiente Oro)</Label>
                <Input
                  value={config.hero.titleHighlight}
                  onChange={(e) =>
                    setConfig({ ...config, hero: { ...config.hero, titleHighlight: e.target.value } })
                  }
                  className="bg-neutral-950 border-neutral-800 text-xs h-10 rounded-xl text-amber-400 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">Párrafo Descriptivo de la Portada</Label>
              <Textarea
                value={config.hero.description}
                onChange={(e) =>
                  setConfig({ ...config, hero: { ...config.hero, description: e.target.value } })
                }
                className="bg-neutral-950 border-neutral-800 text-xs min-h-[80px] rounded-xl"
              />
            </div>
          </div>
        </TabsContent>

        {/* 4. MUESTRA DE PANTALLA EN VIVO */}
        <TabsContent value="screen" className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
            <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
              <Tv className="w-4 h-4 text-sky-400" />
              Muestra Visual de la Pantalla en Vivo
            </h2>
            <p className="text-xs text-neutral-400">
              Personalizá la foto y el mensaje de muestra que se proyecta en el showcase de la landing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Título del Evento de Muestra</Label>
                <Input
                  value={config.liveScreenDemo.eventTitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      liveScreenDemo: { ...config.liveScreenDemo, eventTitle: e.target.value },
                    })
                  }
                  className="bg-neutral-950 border-neutral-800 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-300">Invitado que Sube la Foto</Label>
                <Input
                  value={config.liveScreenDemo.uploaderName}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      liveScreenDemo: { ...config.liveScreenDemo, uploaderName: e.target.value },
                    })
                  }
                  className="bg-neutral-950 border-neutral-800 text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">Mensaje / Dedicatoria en Pantalla</Label>
              <Input
                value={config.liveScreenDemo.caption}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    liveScreenDemo: { ...config.liveScreenDemo, caption: e.target.value },
                  })
                }
                className="bg-neutral-950 border-neutral-800 text-xs h-10 rounded-xl italic"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-300">URL de la Foto de Muestra</Label>
              <Input
                value={config.liveScreenDemo.photoUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    liveScreenDemo: { ...config.liveScreenDemo, photoUrl: e.target.value },
                  })
                }
                className="bg-neutral-950 border-neutral-800 text-xs font-mono h-10 rounded-xl"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
