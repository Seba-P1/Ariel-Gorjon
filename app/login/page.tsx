'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { loginSchema, magicLinkSchema, type LoginFormData, type MagicLinkFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const errorParam = searchParams.get('error');

  const [isLoading, setIsLoading] = React.useState(false);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    if (errorParam === 'access_denied') {
      toast.error('Acceso denegado. Se requieren permisos de superadministrador.');
    }
  }, [errorParam]);

  const passwordForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const magicLinkForm = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onPasswordSubmit(data: LoginFormData) {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error('Error al iniciar sesión: ' + (error.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : error.message));
        return;
      }

      toast.success('¡Bienvenido Ariel! Redirigiendo...');
      router.push(next);
      router.refresh();
    } catch {
      toast.error('Ocurrió un error inesperado al conectar.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onMagicLinkSubmit(data: MagicLinkFormData) {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        toast.error('Error al enviar Magic Link: ' + error.message);
        return;
      }

      setMagicLinkSent(true);
      toast.success('Enlace mágico enviado. Revisá tu casilla de correo.');
    } catch {
      toast.error('Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
          Ariel Producciones
        </h1>
        <p className="text-sm text-neutral-400">
          Panel de control y administración de eventos
        </p>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl text-neutral-100 font-semibold">Iniciar sesión</CardTitle>
          <CardDescription className="text-neutral-400">
            Ingresá tus credenciales para acceder a la gestión
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-950 border border-neutral-800 mb-6">
              <TabsTrigger value="password" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400">
                <KeyRound className="w-4 h-4 mr-2" />
                Contraseña
              </TabsTrigger>
              <TabsTrigger value="magic" className="data-[state=active]:bg-neutral-800 data-[state=active]:text-amber-400">
                <Mail className="w-4 h-4 mr-2" />
                Magic Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-300">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                            <Input
                              placeholder="ariel@ejemplo.com"
                              type="email"
                              autoComplete="email"
                              className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-amber-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-300">Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                            <Input
                              placeholder="••••••••"
                              type="password"
                              autoComplete="current-password"
                              className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-amber-500"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200 mt-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    Ingresar al Panel
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="magic">
              {magicLinkSent ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-3">
                  <Mail className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="font-semibold text-neutral-100">Enlace enviado</h3>
                  <p className="text-xs text-neutral-400">
                    Revisá tu bandeja de entrada y hacé click en el enlace para ingresar de forma directa.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMagicLinkSent(false)}
                    className="border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                  >
                    Volver a enviar
                  </Button>
                </div>
              ) : (
                <Form {...magicLinkForm}>
                  <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)} className="space-y-4">
                    <FormField
                      control={magicLinkForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300">Email registrado</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                              <Input
                                placeholder="ariel@ejemplo.com"
                                type="email"
                                autoComplete="email"
                                className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-amber-500"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200 mt-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Enviar Magic Link
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-neutral-800/60 pt-4">
          <p className="text-xs text-neutral-500 text-center">
            Acceso restringido únicamente a administradores autorizados.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-4 text-neutral-100">
      <React.Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      }>
        <LoginFormContent />
      </React.Suspense>
    </div>
  );
}
