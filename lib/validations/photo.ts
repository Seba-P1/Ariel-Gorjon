import { z } from 'zod';

export const photoUploadSchema = z.object({
  event_id: z.string().uuid(),
  caption: z.string().max(200, 'El pie de foto no puede superar los 200 caracteres').nullable().optional(),
  uploader_name: z.string().max(100, 'El nombre no puede superar los 100 caracteres').nullable().optional(),
});

export const photoModerationSchema = z.object({
  photo_id: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  reject_reason: z.string().max(300).optional(),
});

export type PhotoUploadData = z.infer<typeof photoUploadSchema>;
export type PhotoModerationData = z.infer<typeof photoModerationSchema>;
