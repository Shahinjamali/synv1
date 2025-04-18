'use client';

import { useFormContext, FieldErrors, FieldError } from 'react-hook-form';
import ArrayField from './ArrayField';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'array' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
  subFields?: FieldConfig[];
}

interface FieldRendererProps {
  fields: FieldConfig[];
}

const getNestedError = (
  errors: FieldErrors,
  name: string
): FieldError | undefined => {
  const keys = name.split('.');
  let result: FieldErrors | FieldError | undefined = errors;

  for (const key of keys) {
    if (result && typeof result === 'object' && 'message' in result) {
      // If it's already a FieldError, stop iterating
      return result as FieldError;
    }

    if (result && typeof result === 'object' && key in result) {
      result = (result as FieldErrors)[key];
    } else {
      return undefined;
    }
  }

  return result as FieldError | undefined;
};

export const FieldRenderer = ({ fields }: FieldRendererProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      {fields.map((field) => {
        const error = getNestedError(errors, field.name);

        if (field.type === 'array') {
          return <ArrayField key={field.name} field={field} />;
        }

        return (
          <div key={field.name} className="mb-3">
            <label htmlFor={field.name} className="form-label">
              {field.label}
              {field.required && <span className="text-danger ms-1">*</span>}
            </label>
            {field.type === 'text' && (
              <input
                type="text"
                id={field.name}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                {...register(field.name, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                })}
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                id={field.name}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                {...register(field.name, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                })}
              />
            )}
            {field.type === 'dropdown' && (
              <select
                id={field.name}
                className={`form-select ${error ? 'is-invalid' : ''}`}
                {...register(field.name, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                })}
              >
                <option value="">Select...</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === 'checkbox' && (
              <div className="form-check">
                <input
                  type="checkbox"
                  id={field.name}
                  className="form-check-input"
                  {...register(field.name)}
                />
                <label htmlFor={field.name} className="form-check-label">
                  {field.label}
                </label>
              </div>
            )}
            {error && <div className="invalid-feedback">{error.message}</div>}
          </div>
        );
      })}
    </>
  );
};
