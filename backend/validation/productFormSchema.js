const {
  z,
  ZodObject,
  ZodRawShape,
  ZodEffects,
  ZodOptional,
  ZodDefault,
  ZodTypeAny,
} = require("zod");
const { productSchema } = require("./productSchema");

function getBaseSchema(schema) {
  if (schema instanceof ZodEffects) {
    return getBaseSchema(schema._def.schema);
  } else if (schema instanceof ZodObject) {
    return schema;
  } else {
    throw new Error(
      "Could not extract base ZodObject from the provided schema."
    );
  }
}

function unwrapSchema(schemaDef) {
  if (!schemaDef) {
    return undefined;
  }
  if (schemaDef instanceof ZodOptional) {
    return unwrapSchema(schemaDef.unwrap());
  }
  if (schemaDef instanceof ZodDefault) {
    return unwrapSchema(schemaDef.removeDefault());
  }
  return schemaDef;
}

const baseProductSchema = getBaseSchema(productSchema);
const metadataSchemaDefinition = baseProductSchema.shape.metadata;
const unwrappedMetadataDefinition = unwrapSchema(metadataSchemaDefinition);

if (!(unwrappedMetadataDefinition instanceof ZodObject)) {
  throw new Error(
    "The 'metadata' field in the base product schema must be a ZodObject (potentially wrapped in optional/default)."
  );
}

const metadataObjectSchema = unwrappedMetadataDefinition;

const metadataFormSchema = metadataObjectSchema.partial().extend({
  status: z.enum(["active", "draft", "archived"]).default("active"),
  displayOrder: z.number().int().min(0).default(0),
});

const productFormSchema = baseProductSchema
  .omit({ metadata: true })
  .extend({ metadata: metadataFormSchema })
  .partial();

module.exports = { productFormSchema };
