'use client';

import { useState, useEffect } from 'react';
import {
  useForm,
  FormProvider,
  FieldErrors,
  FieldError,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldRenderer } from './partials/FieldRenderer';
import { CategorySelector } from './partials/CategorySelector';
import { MediaUploader } from './partials/MediaUploader';
import { MediaForm } from './partials/MediaForm';
import { CropModal } from './partials/CropModal';
import { categoryFormSchema } from '@/schemas/categoryFormSchema';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { Category } from '@/types/category';
import { inputConfig } from '@/data/input/inputConfig';
import { defaultCategoryFormValues } from '@/data/defaults/defaultCategoryFormValues';

type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

interface CategoryFormProps {
  categories: Category[];
  initialData?: Partial<Category>;
  onSubmit: (data: z.infer<typeof categoryFormSchema>) => Promise<void>;
  submitting: boolean;
  mediaAssets: MediaAssetFormData[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAssetFormData[]>>;
}

const getSafeErrorData = (errors: FieldErrors) => {
  const safeErrors: Record<string, { message?: string; type?: string }> = {};

  const extractError = (key: string, error: unknown) => {
    if (error && typeof error === 'object') {
      if (
        'message' in error &&
        typeof (error as FieldError).message === 'string'
      ) {
        safeErrors[key] = {
          message: (error as FieldError).message,
          type: (error as FieldError).type || undefined,
        };
      } else {
        Object.entries(error as Record<string, unknown>).forEach(
          ([nestedKey, nestedError]) =>
            extractError(`${key}.${nestedKey}`, nestedError)
        );
      }
    }
  };

  Object.entries(errors).forEach(([key, value]) => extractError(key, value));
  return safeErrors;
};

export default function CategoryForm({
  categories,
  initialData,
  onSubmit,
  submitting,
  mediaAssets,
  setMediaAssets,
}: CategoryFormProps) {
  const [isCropping, setIsCropping] = useState(false);
  const [cropConfig, setCropConfig] = useState<{
    dimension: string;
    width: number;
    height: number;
  } | null>(null);
  const [mediaErrors, setMediaErrors] = useState<string[]>([]);

  const methods = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      ...defaultCategoryFormValues,
      ...initialData,
    },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const title = watch('title');

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Safe Errors:', getSafeErrorData(errors));
    }
  }, [errors]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title) {
        const slug = title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        setValue('slug', slug);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [title, setValue]);

  const validateMediaAssets = () => {
    const errors: string[] = [];
    mediaAssets.forEach((asset, index) => {
      try {
        mediaAssetFormSchema.parse(asset);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            errors.push(`Media Asset ${index + 1}: ${err.message}`);
          });
        }
      }
    });
    return errors;
  };

  const onFormSubmit = async (data: z.infer<typeof categoryFormSchema>) => {
    const mediaValidationErrors = validateMediaAssets();
    if (mediaValidationErrors.length > 0) {
      setMediaErrors(mediaValidationErrors);
      return;
    }

    try {
      await onSubmit(data);
      reset();
      setMediaAssets([]);
      setIsCropping(false);
      setCropConfig(null);
    } catch (error) {
      console.error('Submission error:', error);
      setMediaErrors([
        error instanceof Error ? error.message : 'Unknown error',
      ]);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {mediaErrors.length > 0 && (
          <div className="alert alert-danger mb-4">
            <ul>
              {mediaErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {Object.entries(inputConfig.category.sections).map(
          ([sectionKey, fields]) => (
            <div key={sectionKey}>
              <h2 className="text-lg font-semibold capitalize mt-4 mb-2">
                {sectionKey.replace(/([A-Z])/g, ' $1')}
              </h2>
              {sectionKey === 'categorization' ? (
                <CategorySelector
                  modelType="category"
                  categories={categories}
                  subcategories={[]}
                />
              ) : sectionKey === 'media' ? (
                <>
                  <MediaUploader
                    mediaAssets={mediaAssets}
                    setMediaAssets={setMediaAssets}
                    setIsCropping={setIsCropping}
                    setCropConfig={setCropConfig}
                  />
                  <MediaForm
                    mediaAssets={mediaAssets}
                    setMediaAssets={setMediaAssets}
                    submitting={submitting}
                  />
                </>
              ) : (
                <FieldRenderer fields={fields} />
              )}
            </div>
          )
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            disabled={submitting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {isCropping && cropConfig && (
        <CropModal
          mediaAssets={mediaAssets}
          setMediaAssets={setMediaAssets}
          cropConfig={cropConfig}
          setIsCropping={setIsCropping}
          setCropConfig={setCropConfig}
        />
      )}
    </FormProvider>
  );
}
