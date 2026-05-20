import { z } from 'zod';

export const inviteSchema = z.object({
  unitId: z.string().uuid('Please select a unit'),
  email: z.string().email('Valid email required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;
