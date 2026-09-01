'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { InvitationTheme } from '@/types/domain';
import { Button } from '@/components/ui/button';

interface GiftsProps {
  theme: InvitationTheme;
  data?: {
    title?: string;
    description?: string;
    cbu?: string;
    alias?: string;
    bankName?: string;
    holderName?: string;
    externalRegistryUrl?: string;
  };
}

export function Gifts({ theme, data }: GiftsProps) {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const alias = data?.alias || 'ARIEL.FIESTA.2026';
  const cbu = data?.cbu || '0000003100012345678901';
  const bank = data?.bankName || 'Mercado Pago / Banco Galicia';
  const holder = data?.holderName || 'Ariel Gorjón';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copiado al portapapeles`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 max-w-3xl mx-auto text-center" id="invitation-gifts">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-sm space-y-5 sm:space-y-6"
        style={{
          backgroundColor: theme.palette.secondary,
          borderColor: `${theme.palette.primary}40`,
        }}
      >
        <div className="inline-flex p-3 sm:p-4 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] mb-1 sm:mb-2">
          <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[var(--theme-primary)]">
            Mesa de Regalos
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: theme.fonts.heading, color: theme.palette.text }}
          >
            {data?.title || 'Tu Presencia es Nuestro Mejor Regalo'}
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto" style={{ color: theme.palette.text }}>
            {data?.description ||
              'Si deseás hacernos un presente, podés colaborar con nuestra luna de miel o proyecto a través de los siguientes datos bancarios:'}
          </p>
        </div>

        {/* Bank Details Box */}
        <div
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-black/40 border space-y-4 max-w-lg mx-auto text-left"
          style={{ borderColor: `${theme.palette.primary}30` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs opacity-70 block" style={{ color: theme.palette.text }}>
                Titular
              </span>
              <span className="font-semibold text-sm" style={{ color: theme.palette.text }}>
                {holder}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs opacity-70 block" style={{ color: theme.palette.text }}>
                Entidad
              </span>
              <span className="font-semibold text-sm" style={{ color: theme.palette.text }}>
                {bank}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--theme-primary)]/20 space-y-3">
            {/* Alias */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs opacity-70 block" style={{ color: theme.palette.text }}>
                  Alias
                </span>
                <span className="font-mono font-bold text-sm tracking-wide text-[var(--theme-primary)]">
                  {alias}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(alias, 'Alias')}
                className="h-8 border-[var(--theme-primary)]/40 hover:bg-[var(--theme-primary)]/10"
              >
                {copiedKey === 'Alias' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                <span className="text-xs">{copiedKey === 'Alias' ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>

            {/* CBU */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs opacity-70 block" style={{ color: theme.palette.text }}>
                  CBU
                </span>
                <span className="font-mono text-xs opacity-90 truncate max-w-[180px] sm:max-w-none block" style={{ color: theme.palette.text }}>
                  {cbu}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(cbu, 'CBU')}
                className="h-8 border-[var(--theme-primary)]/40 hover:bg-[var(--theme-primary)]/10"
              >
                {copiedKey === 'CBU' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                <span className="text-xs">{copiedKey === 'CBU' ? 'Copiado' : 'Copiar'}</span>
              </Button>
            </div>
          </div>
        </div>

        {data?.externalRegistryUrl && (
          <div className="pt-2">
            <a href={data.externalRegistryUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-[var(--theme-primary)] text-xs font-semibold hover:bg-[var(--theme-primary)]/10"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-[var(--theme-primary)]" />
                Ver Lista de Regalos Externa
              </Button>
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
}
