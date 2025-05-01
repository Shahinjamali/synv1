// src/types/formTypes.ts
import { z } from 'zod';
import { productSchema } from '@/schemas/productSchema';
import { serviceSchema } from '@/schemas/serviceSchema';
import { categorySchema } from '@/schemas/categorySchema';

// --- Clean Frontend Form Types ---
export type ProductFormValues = z.infer<typeof productSchema>;
export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface FieldConfig {
  name: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'file'
    | 'date'
    | 'email'; // or whatever types you support
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string }[]; // only for select, radio
  required?: boolean;
  description?: string; // optional field description
  tooltip?: string; // if you have tooltips in form rendering
  defaultValue?: string | number | boolean;
}
