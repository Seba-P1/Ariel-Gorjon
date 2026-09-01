'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CheckCircle2, Send, Loader2, Users, Utensils, Music, MessageSquare } from 'lucide-react';
import { InvitationTheme, Event, Guest } from '@/types/domain';
import { rsvpSchema, type RsvpFormData } from '@/lib/validations/rsvp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface RsvpFormProps {
  theme: InvitationTheme;
  event: Event;
  guest?: Guest | null;
  data?: {
    deadlineText?: string;
    customMessage?: string;
  };
}

export function RsvpForm({ theme, event, guest, data }: RsvpFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema) as any,
    defaultValues: {
      event_id: event.id,
      guest_id: guest?.id || null,
      full_name: guest?.full_name || '',
      email: '',
      phone: '',
      attendees_count: 1,
      status: 'confirmed',
      dietary_notes: '',
      song_request: '',
      message: '',
    },
  });

  async function onSubmit(formData: RsvpFormData) {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || 'No se pudo registrar tu respuesta.');
        return;
      }

      setIsConfirmed(true);
      toast.success('¡Confirmación registrada con éxito! Te esperamos.');
    } catch {
      toast.error('Ocurrió un error al enviar el formulario.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto" id="invitation-rsvp">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xl space-y-6 sm:space-y-8"
        style={{
          backgroundColor: theme.palette.secondary,
          borderColor: `${theme.palette.primary}40`,
        }}
      >
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Confirmación de Asistencia
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            ¿Nos Acompañás?
          </h2>
          <p className="text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.customMessage || 'Por favor confirmanos tu presencia para organizar los detalles.'}
          </p>
          {data?.deadlineText && (
            <p className="text-xs font-semibold text-[var(--theme-primary)]">
              ⏳ {data.deadlineText}
            </p>
          )}
        </div>

        {isConfirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ¡Muchas Gracias!
            </h3>
            <p className="text-sm opacity-90 max-w-md mx-auto" style={{ color: theme.palette.text }}>
              Tu confirmación ha sido guardada. Nos alegra mucho compartir esta noche con vos.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmed(false)}
              className="mt-2 text-xs border-[var(--theme-primary)]/40"
            >
              Modificar respuesta
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-left">
              {/* Asistencia Toggle */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: theme.palette.text }}>¿Vas a asistir?</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange('confirmed')}
                        className={`p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                          field.value === 'confirmed'
                            ? 'bg-[var(--theme-primary)] text-white shadow-md'
                            : 'bg-white/5 border-[var(--theme-primary)]/30 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          color: field.value === 'confirmed' ? (theme.palette.bg === '#0B0B0B' || theme.palette.bg === '#0B0F1A' ? '#000000' : '#FFFFFF') : theme.palette.text,
                        }}
                      >
                        🎉 ¡Sí, confirmo!
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange('declined')}
                        className={`p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                          field.value === 'declined'
                            ? 'bg-red-500/80 text-white shadow-md'
                            : 'bg-white/5 border-[var(--theme-primary)]/30 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          color: field.value === 'declined' ? '#FFFFFF' : theme.palette.text,
                        }}
                      >
                        😔 No podré ir
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: theme.palette.text }}>Nombre y Apellido *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tu nombre completo"
                          className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: theme.palette.text }}>Teléfono / WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: +54 9 11 1234-5678"
                          className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch('status') === 'confirmed' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: theme.palette.text }}>Email (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="attendees_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={{ color: theme.palette.text }}>
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                              Total de Personas (con vos)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={guest ? guest.slots : 10}
                              className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                            />
                          </FormControl>
                          {guest && (
                            <p className="text-[11px] opacity-70" style={{ color: theme.palette.text }}>
                              Máximo disponible según tu invitación: {guest.slots} lugar{guest.slots > 1 ? 'es' : ''}.
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dietary_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: theme.palette.text }}>
                          <span className="flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                            Restricciones alimentarias (Celíaco, vegetariano, etc.)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Menú celíaco para 1 persona"
                            className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="song_request"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: theme.palette.text }}>
                          <span className="flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                            ¿Qué canción no puede faltar en la fiesta?
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tema y Artista"
                            className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: theme.palette.text }}>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                        Mensaje para los anfitriones (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dejá unas palabras de buenos deseos..."
                        rows={3}
                        className="bg-white/80 dark:bg-black/40 border-[var(--theme-primary)]/40 focus-visible:ring-[var(--theme-primary)]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold shadow-lg transition-all hover:scale-[1.01] py-6 text-base"
                style={{
                  backgroundColor: theme.palette.primary,
                  color: theme.palette.bg === '#0B0B0B' || theme.palette.bg === '#0B0F1A' ? '#000000' : '#FFFFFF',
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                Enviar Confirmación
              </Button>
            </form>
          </Form>
        )}
      </motion.div>
    </section>
  );
}
