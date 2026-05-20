import { z } from 'zod';

export const TicketCategoryEnum = z.enum(['PLUMBING', 'HEATING', 'INTERNET', 'CLEANING', 'NOISE', 'ELECTRICITY', 'OTHER']);
export const TicketPriorityEnum = z.enum(['URGENT', 'NORMAL', 'LOW']);
export const EmergencyTypeEnum = z.enum(['WATER_LEAKAGE', 'HEATING_FAILURE', 'ELECTRICAL_HAZARD', 'SECURITY_ISSUE', 'OTHER']);

export const createTicketSchema = z
  .object({
    unitId: z.string().uuid(),
    category: TicketCategoryEnum,
    priority: TicketPriorityEnum,
    title: z.string().min(5, 'Min. 5 characters').max(200),
    description: z.string().min(10, 'Min. 10 characters').max(2000),
    photos: z.array(z.string().url()).max(3),
    isEmergency: z.boolean(),
    emergencyType: EmergencyTypeEnum.optional(),
  })
  .refine((d) => !d.isEmergency || d.emergencyType, {
    message: 'Emergency type is required',
    path: ['emergencyType'],
  });

export const emergencyTicketSchema = z.object({
  emergencyType: EmergencyTypeEnum,
  description: z.string().min(1).max(2000).optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type EmergencyTicketFormData = z.infer<typeof emergencyTicketSchema>;
