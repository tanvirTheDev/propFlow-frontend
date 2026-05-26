import { z } from 'zod';

export const VISIT_REASONS = [
  'ROUTINE_INSPECTION',
  'METER_READING',
  'MAINTENANCE_CHECK',
  'VIEWING',
  'OTHER',
] as const;

export const visitUnitSchema = z.object({
  unitId: z.string().min(1),
  notifyTenant: z.boolean(),
});

export const createVisitSchema = z.object({
  propertyId: z.string().min(1, 'Select a property'),
  scheduledAt: z
    .string()
    .min(1, 'Date is required')
    .refine((val) => new Date(val) > new Date(), 'Visit must be in the future'),
  durationMin: z.number().int().min(15).max(480),
  reason: z.enum(VISIT_REASONS, { error: 'Select a reason' }),
  note: z.string().max(1000).optional(),
  units: z.array(visitUnitSchema).min(1, 'Select at least one unit'),
});

export type CreateVisitFormData = z.infer<typeof createVisitSchema>;
