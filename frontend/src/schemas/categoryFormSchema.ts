import { z, ZodObject, ZodRawShape, ZodEffects } from 'zod';
import { categorySchema } from './categorySchema'; // Assuming this is the ZodEffects schema

// Ensure categorySchema is actually ZodEffects before accessing _def.schema
if (!(categorySchema instanceof ZodEffects)) {
  throw new Error('Expected categorySchema to be a ZodEffects type');
}

// 1. Access the underlying ZodObject from the ZodEffects
const baseCategorySchema = categorySchema._def.schema as ZodObject<ZodRawShape>;

// 2. Now work with the base ZodObject
const raw = baseCategorySchema._def.shape();

// Pull out the metadata object (ensure 'metadata' exists and is an object)
// Add type checks for robustness
const metaOrig =
  raw.metadata instanceof ZodObject
    ? (raw.metadata as ZodObject<ZodRawShape>)
    : z.object({}); // Provide a default empty object if metadata isn't as expected

// Make every key optional, but re-default the two you need
const metadataForm = metaOrig.partial().extend({
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  displayOrder: z.number().default(0),
});

// 3. Use the base ZodObject for omit/extend
export const categoryFormSchema = baseCategorySchema
  // drop the original metadata
  .omit({ metadata: true })
  // re-add our “form” metadata
  .extend({ metadata: metadataForm })
  // allow partial top-level so defaultValues can be incomplete
  .partial();

// Type assertion for clarity (optional, but good practice)
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
