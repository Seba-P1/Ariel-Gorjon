import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { APP_CONFIG } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: `${APP_CONFIG.name} — Plataforma de Eventos`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  authors: [{ name: APP_CONFIG.author }],
  creator: APP_CONFIG.author,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: APP_CONFIG.url,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-500 selection:text-neutral-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={200}>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
