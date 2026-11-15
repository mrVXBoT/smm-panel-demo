import { z } from 'zod';

export function createOrderSchema(options: { minQty?: number; maxQty?: number }) {
  const min = options.minQty ?? 1;
  const max = options.maxQty ?? 100000;

  return z.object({
    categoryId: z.string().min(1, 'Category is required'),
    serviceId: z.string().min(1, 'Service is required'),
    target: z
      .string()
      .min(2, 'Target link or handle must be at least 2 characters')
      .refine(
        (val) =>
          val.startsWith('@') ||
          val.startsWith('http://') ||
          val.startsWith('https://') ||
          val.length >= 3,
        {
          message: 'Please provide a valid @username or URL link',
        },
      ),
    quantity: z
      .number({ invalid_type_error: 'Quantity must be a valid number' })
      .int('Quantity must be an integer')
      .min(min, `Minimum quantity for this service is ${min.toLocaleString()}`)
      .max(max, `Maximum quantity for this service is ${max.toLocaleString()}`),
  });
}

export type OrderFormData = z.infer<ReturnType<typeof createOrderSchema>>;
