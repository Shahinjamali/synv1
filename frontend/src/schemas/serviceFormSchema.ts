import {
  z,
  ZodObject,
  ZodRawShape,
  ZodEffects,
  ZodOptional,
  ZodDefault,
  ZodTypeAny, // Import base type
  ZodType, // Import ZodType for variable declaration
} from 'zod';
// Assuming serviceSchema is your base schema, potentially wrapped in ZodEffects
import { serviceSchema } from './serviceSchema';

// --- Helper Functions (Consider moving to a shared utils/zodUtils.ts file) ---

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
      `Could not extract base ZodObject. Expected ZodObject or ZodEffects, received ${schema?.constructor?.name}`
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
  // Check prototype chain for ZodOptional/ZodDefault if direct instanceof fails
  let currentSchema = schemaDef;
  while (currentSchema?._def) {
    if (currentSchema instanceof ZodOptional) {
      currentSchema = currentSchema.unwrap();
      continue; // Continue unwrapping
    }
    if (currentSchema instanceof ZodDefault) {
      currentSchema = currentSchema.removeDefault();
      continue; // Continue unwrapping
    }
    // Add checks for ZodNullable, ZodBranded etc. if needed
    break; // No more known wrappers
  }
  return currentSchema;
}

// --- Schema Creation Logic for Service Form ---

console.log('Generating serviceFormSchema...'); // Log start

// Declare variables outside the try block
let finalServiceFormSchema: ZodType; // Use a base ZodType or a more specific one if possible
let metadataObjectSchema: ZodObject<ZodRawShape>; // Declare here if needed outside try

try {
  // 1. Get the base ZodObject (handles ZodEffects)
  const baseServiceSchema = getBaseSchema(serviceSchema);
  console.log('Base service schema obtained.');

  // 2. Access the schema definition for 'metadata' from the base shape
  let metadataSchemaDefinition = baseServiceSchema.shape.metadata; // Use let if potentially reassigned
  if (!metadataSchemaDefinition) {
    console.warn(
      "Original service schema does not have a 'metadata' field. Defaulting to empty object for metadata form."
    );
    // Option: Create default (if metadata is optional overall)
    metadataSchemaDefinition = z.object({}); // Assign a default empty object schema
  } else {
    console.log("Found 'metadata' definition in base schema.");
  }

  // 3. Unwrap the metadata schema definition to get the core type
  const unwrappedMetadataDefinition = unwrapSchema(metadataSchemaDefinition);
  console.log('Unwrapped metadata definition obtained.');

  // 4. Ensure the unwrapped definition is a ZodObject
  if (!(unwrappedMetadataDefinition instanceof ZodObject)) {
    // This means the 'metadata' field in your original serviceSchema
    // is either missing, not an object, or wrapped in an unexpected way.
    const fieldType =
      unwrappedMetadataDefinition?.constructor?.name ??
      typeof unwrappedMetadataDefinition;
    console.error(
      `Error: Expected unwrapped 'metadata' to be a ZodObject, but got ${fieldType}. Defaulting to empty object.`
    );
    // Default to an empty object if metadata is not as expected or missing after unwrap
    metadataObjectSchema = z.object({}); // Assign the default here
    // console.warn("Metadata schema not found or not an object, defaulting to empty object.");
  } else {
    // Cast to ZodObject<ZodRawShape> now that we've validated it
    metadataObjectSchema =
      unwrappedMetadataDefinition as ZodObject<ZodRawShape>;
    console.log('Validated unwrapped metadata as ZodObject.');
  }

  // 5. Make every key in the metadata object optional, then re-apply defaults
  const metadataFormSchema = metadataObjectSchema // Use the variable declared outside/assigned in step 4
    .partial() // Make all fields optional first
    .extend({
      // Re-apply defaults or specific requirements for the form
      status: z.enum(['active', 'draft', 'archived']).default('active'),
      version: z.string().default('1.0.0'), // As per your original code
      // Add any other fields from metadata that need specific form handling
    });
  console.log('Created metadataFormSchema.');

  // 6. Create the final form schema by:
  //    - Taking the base service schema
  //    - Removing the original 'metadata' field definition
  //    - Adding the new 'metadataFormSchema'
  //    - Making all top-level fields partial for the form (optional)
  // Assign the result to the variable declared outside
  finalServiceFormSchema = baseServiceSchema
    .omit({ metadata: true }) // Omit the original metadata definition
    .extend({ metadata: metadataFormSchema }) // Add the new partial metadata schema
    .partial(); // Make top-level fields partial (if needed for form defaults)

  console.log('Successfully generated final serviceFormSchema.');
} catch (error) {
  console.error('Error creating serviceFormSchema:', error);
  // Handle the error, potentially assign a fallback schema
  // For example, assign a very basic schema or re-throw
  finalServiceFormSchema = z.object({}); // Assign a fallback empty object schema
  console.warn('Assigned fallback schema due to error during generation.');
  // Or re-throw: throw error;
}

// Export the variables declared outside the try...catch block
export const serviceFormSchema = finalServiceFormSchema;

// Type helper for form values - export type directly
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
