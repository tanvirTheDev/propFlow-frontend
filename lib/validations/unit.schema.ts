import { z } from 'zod';

export const unitSchema = z.object({
  unitNumber: z.string().min(1, 'Unit number is required').max(20),
  floor: z.number().int().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  sizeM2: z.number().min(1).optional(),
  notes: z.string().max(1000).optional(),
});

export type UnitFormValues = z.infer<typeof unitSchema>;
