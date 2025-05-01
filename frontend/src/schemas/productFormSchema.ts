import {
  z,
  ZodObject,
  ZodRawShape,
  ZodEffects,
  ZodOptional,
  ZodDefault,
  ZodTypeAny, // Import base type
} from 'zod';
// Assuming productSchema is your base schema, potentially wrapped in ZodEffects
import { productSchema } from './productSchema';

// Function to safely get the base ZodObject, handling ZodEffects wrapper
function getBaseSchema(schema: ZodTypeAny): ZodObject<ZodRawShape> {
  if (schema instanceof ZodEffects) {
    // Recursively call in case of nested effects
    return getBaseSchema(schema._def.schema);
  } else if (schema instanceof ZodObject) {
    return schema as ZodObject<ZodRawShape>;
  } else {
    // Handle other potential wrappers if necessary (e.g., ZodLazy)
    throw new Error(
      'Could not extract base ZodObject from the provided schema.'
    );
  }
}

// Function to safely unwrap a schema definition (removes Optional, Default, etc.)
function unwrapSchema(
  schemaDef: ZodTypeAny | undefined
): ZodTypeAny | undefined {
  if (!schemaDef) {
    return undefined;
  }
  if (schemaDef instanceof ZodOptional) {
    return unwrapSchema(schemaDef.unwrap());
  }
  if (schemaDef instanceof ZodDefault) {
    return unwrapSchema(schemaDef.removeDefault());
  }
  // Add checks for ZodNullable, ZodBranded etc. if needed
  return schemaDef;
}

// --- Schema Creation Logic ---

// 1. Get the base ZodObject (handles ZodEffects)
const baseProductSchema = getBaseSchema(productSchema);

// 2. Access the schema definition for 'metadata' from the base shape
const metadataSchemaDefinition = baseProductSchema.shape.metadata;

// 3. Unwrap the metadata schema definition to get the core type
const unwrappedMetadataDefinition = unwrapSchema(metadataSchemaDefinition);

// 4. Ensure the unwrapped definition is a ZodObject
if (!(unwrappedMetadataDefinition instanceof ZodObject)) {
  // This means the 'metadata' field in your original productSchema
  // is either missing, not an object, or wrapped in an unexpected way.
  // Option A: Throw an error if metadata MUST be an object
  throw new Error(
    "The 'metadata' field in the base product schema must be a ZodObject (potentially wrapped in optional/default)."
  );
  // Option B: Default to an empty object if metadata is truly optional or can be absent
  // const metadataObjectSchema = z.object({});
  // console.warn("Metadata schema not found or not an object, defaulting to empty object.");
}

// Cast to ZodObject<ZodRawShape> now that we've validated it
const metadataObjectSchema =
  unwrappedMetadataDefinition as ZodObject<ZodRawShape>;

// 5. Make every key in the metadata object optional, then re-apply defaults
const metadataFormSchema = metadataObjectSchema
  .partial() // Make all fields optional first
  .extend({
    // Re-apply defaults or specific requirements for the form
    status: z.enum(['active', 'draft', 'archived']).default('active'),
    displayOrder: z.number().int().min(0).default(0),
    // Add any other fields from metadata that need specific form handling
  });

// 6. Create the final form schema by:
//    - Taking the base product schema
//    - Removing the original 'metadata' field definition
//    - Adding the new 'metadataFormSchema'
//    - Making all top-level fields partial for the form
export const productFormSchema = baseProductSchema
  .omit({ metadata: true }) // Omit the original metadata definition
  .extend({ metadata: metadataFormSchema }) // Add the new partial metadata schema
  .partial(); // Make top-level fields partial (optional step, depends on form needs)

// Type helper for form values
export type ProductFormValues = z.infer<typeof productFormSchema>;

console.log('Successfully generated productFormSchema'); // Add log for confirmation
