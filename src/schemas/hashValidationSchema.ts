import { z } from 'zod';

export const hashValidationSchema = z.object({
  code: z
    .string()
    .min(4, 'El código debe tener exactamente 4 dígitos')
    .max(4, 'El código debe tener exactamente 4 dígitos')
    .regex(/^\d{4}$/, 'El código debe contener solo números')
    .refine((val) => val !== '0000', 'El código no puede ser 0000'),
});

export type HashValidationFormData = z.infer<typeof hashValidationSchema>;
