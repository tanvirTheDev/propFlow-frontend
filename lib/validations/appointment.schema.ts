import { z } from 'zod';

export const createAppointmentSchema = z.object({
  scheduledAt: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (val) => new Date(val) > new Date(Date.now() + 30 * 60 * 1000),
      'Must be at least 30 minutes in the future',
    ),
  durationMin: z.number().int().min(15).max(480),
  note: z.string().max(500).optional(),
});

export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>;
