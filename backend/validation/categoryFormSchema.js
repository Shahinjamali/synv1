const { z, ZodObject, ZodRawShape, ZodEffects } = require("zod");
const { categorySchema } = require("./categorySchema"); // Adjust path if needed

// Ensure categorySchema is actually ZodEffects before accessing _def.schema
if (!(categorySchema instanceof ZodEffects)) {
  throw new Error("Expected categorySchema to be a ZodEffects type");
}

// 1. Access the underlying ZodObject from the ZodEffects
const baseCategorySchema = categorySchema._def.schema;

// 2. Now work with the base ZodObject
const raw = baseCategorySchema._def.shape();

// Pull out the metadata object (ensure 'metadata' exists and is an object)
const metaOrig =
  raw.metadata instanceof ZodObject ? raw.metadata : z.object({}); // Provide a default empty object if metadata isn't as expected

// Make every key optional, but re-default the two you need
const metadataForm = metaOrig.partial().extend({
  status: z.enum(["active", "draft", "archived"]).default("active"),
  displayOrder: z.number().default(0),
});

// 3. Use the base ZodObject for omit/extend
const categoryFormSchema = baseCategorySchema
  .omit({ metadata: true })
  .extend({ metadata: metadataForm })
  .partial();

// Final export
module.exports = {
  categoryFormSchema,
};
