import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  street: z.string().min(2, 'Street must be at least 2 characters').max(200),
  city: z.string().min(2, 'City must be at least 2 characters').max(100),
  postalCode: z.string().regex(/^\d{5}$/, 'Must be a valid 5-digit German postal code'),
  country: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
