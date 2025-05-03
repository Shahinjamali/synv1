const {
  z,
  ZodObject,
  ZodRawShape,
  ZodEffects,
  ZodOptional,
  ZodDefault,
  ZodTypeAny,
} = require("zod");
const { serviceSchema } = require("./serviceSchema");

function getBaseSchema(schema) {
  if (schema instanceof ZodEffects) {
    return getBaseSchema(schema._def.schema);
  } else if (schema instanceof ZodObject) {
    return schema;
  } else {
    throw new Error(
      `Could not extract base ZodObject. Expected ZodObject or ZodEffects, received ${schema?.constructor?.name}`
    );
  }
}

function unwrapSchema(schemaDef) {
  if (!schemaDef) {
    return undefined;
  }
  let currentSchema = schemaDef;
  while (currentSchema?._def) {
    if (currentSchema instanceof ZodOptional) {
      currentSchema = currentSchema.unwrap();
      continue;
    }
    if (currentSchema instanceof ZodDefault) {
      currentSchema = currentSchema.removeDefault();
      continue;
    }
    break;
  }
  return currentSchema;
}

let finalServiceFormSchema;
let metadataObjectSchema;

try {
  const baseServiceSchema = getBaseSchema(serviceSchema);

  let metadataSchemaDefinition = baseServiceSchema.shape.metadata;
  if (!metadataSchemaDefinition) {
    console.warn(
      "Original service schema does not have a 'metadata' field. Defaulting to empty object for metadata form."
    );
    metadataSchemaDefinition = z.object({});
  }

  const unwrappedMetadataDefinition = unwrapSchema(metadataSchemaDefinition);

  if (!(unwrappedMetadataDefinition instanceof ZodObject)) {
    const fieldType =
      unwrappedMetadataDefinition?.constructor?.name ??
      typeof unwrappedMetadataDefinition;
    console.error(
      `Error: Expected unwrapped 'metadata' to be a ZodObject, but got ${fieldType}. Defaulting to empty object.`
    );
    metadataObjectSchema = z.object({});
  } else {
    metadataObjectSchema = unwrappedMetadataDefinition;
  }

  const metadataFormSchema = metadataObjectSchema.partial().extend({
    status: z.enum(["active", "draft", "archived"]).default("active"),
    version: z.string().default("1.0.0"),
  });

  finalServiceFormSchema = baseServiceSchema
    .omit({ metadata: true })
    .extend({ metadata: metadataFormSchema })
    .partial();
} catch (error) {
  console.error("Error creating serviceFormSchema:", error);
  finalServiceFormSchema = z.object({});
  console.warn("Assigned fallback schema due to error during generation.");
}

const serviceFormSchema = finalServiceFormSchema;

module.exports = { serviceFormSchema };
