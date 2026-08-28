import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Ingresá un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const magicLinkSchema = z.object({
  email: z.string().email('Ingresá un correo electrónico válido'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type MagicLinkFormData = z.infer<typeof magicLinkSchema>;
