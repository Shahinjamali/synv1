// ArrayField.tsx
'use client';

import {
  useFormContext,
  useFieldArray,
  FieldErrors,
  FieldError,
} from 'react-hook-form';
import { FieldRenderer } from './FieldRenderer';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'array' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
  subFields?: FieldConfig[];
}

interface ArrayFieldProps {
  field: FieldConfig;
}

const ArrayField = ({ field }: ArrayFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: arrayFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: field.name,
  });

  const getNestedError = (name: string): FieldError | undefined => {
    return name
      .split('.')
      .reduce<
        FieldErrors | FieldError | undefined
      >((obj, key) => (obj && typeof obj === 'object' && key in obj ? (obj as FieldErrors)[key] : undefined), errors) as
      | FieldError
      | undefined;
  };

  return (
    <div className="mb-3">
      <label className="form-label">{field.label}</label>
      {arrayFields.map((arrayField, index) => (
        <div key={arrayField.id} className="border p-3 mb-2 position-relative">
          <FieldRenderer
            fields={field.subFields!.map((subField) => ({
              ...subField,
              name: subField.name
                ? `${field.name}.${index}.${subField.name}`
                : `${field.name}.${index}`, // Use index directly for empty name
            }))}
          />
          {field.subFields?.map((subField) => {
            const subError = getNestedError(
              subField.name
                ? `${field.name}.${index}.${subField.name}`
                : `${field.name}.${index}`
            );
            return subError ? (
              <div
                key={subField.name || index}
                className="invalid-feedback d-block"
              >
                {subError.message}
              </div>
            ) : null;
          })}
          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 mt-2 me-2"
            onClick={() => remove(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => append(field.subFields?.[0]?.name ? {} : '')} // Append empty string for string arrays
      >
        Add {field.label}
      </button>
    </div>
  );
};

export default ArrayField;
