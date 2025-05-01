// src/components/MediaAssetForm.tsx
'use client';

import { useState } from 'react';
import {
  useForm,
  FormProvider,
  FieldErrors,
  FieldError,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldRenderer } from './partials/FieldRenderer';
import { MediaUploader } from './partials/MediaUploader';
import { MediaForm } from './partials/MediaForm';
import { CropModal } from './partials/CropModal';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { MediaAsset, CropData } from '@/types/mediaAsset';
import { defaultMediaAssetFormValues } from '@/data/defaults/defaultMediaAssetFormValues';
import { inputConfig } from '@/data/input/inputConfig';

const getSafeErrorData = (errors: FieldErrors) => {
  const safe: Record<string, { message?: string; type?: string }> = {};
  const extract = (key: string, err: unknown) => {
    if (err && typeof err === 'object') {
      if ('message' in err) {
        const fe = err as FieldError;
        safe[key] = { message: fe.message, type: fe.type };
      } else {
        for (const [k, v] of Object.entries(err)) {
          extract(`${key}.${k}`, v);
        }
      }
    }
  };
  for (const [k, v] of Object.entries(errors)) extract(k, v);
  return safe;
};

interface MediaAssetFormProps {
  initialData?: Partial<MediaAsset>;
}

export const MediaAssetForm = ({ initialData }: MediaAssetFormProps) => {
  const [mediaAssets, setMediaAssets] = useState<
    { file?: File; metadata: Partial<MediaAsset>; crop?: CropData }[]
  >([]);
  const [isCropping, setIsCropping] = useState(false);
  const [cropConfig, setCropConfig] = useState<{
    dimension: string;
    width: number;
    height: number;
  } | null>(null);

  // build the RHF form
  const methods = useForm<z.infer<typeof mediaAssetFormSchema>>({
    resolver: zodResolver(mediaAssetFormSchema),
    defaultValues: {
      ...defaultMediaAssetFormValues,
      ...initialData,
    },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // optional: log validation
  if (Object.keys(errors).length) {
    console.warn('MediaAssetForm errors:', getSafeErrorData(errors));
  }

  const onSubmit = async (data: z.infer<typeof mediaAssetFormSchema>) => {
    try {
      // must have exactly one file in mediaAssets
      if (!mediaAssets[0]?.file) {
        throw new Error('Please choose a file first');
      }

      const file = mediaAssets[0].file!;
      const form = new FormData();
      form.append('file', file);
      form.append(
        'metadata',
        JSON.stringify({
          ...data,
          format: file.type.split('/')[1],
          size: file.size,
        })
      );

      const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${base}/api/media/upload`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      alert('Asset uploaded!');
      reset();
      setMediaAssets([]);
    } catch (err) {
      console.error(err);
      alert(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {Object.entries(inputConfig.mediaAsset.sections).map(
          ([sectionKey, fields]) => (
            <section key={sectionKey} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {sectionKey.replace(/([A-Z])/g, ' $1')}
              </h3>

              {sectionKey === 'fileUpload' ? (
                <MediaUploader
                  mediaAssets={mediaAssets}
                  setMediaAssets={setMediaAssets}
                  setIsCropping={setIsCropping}
                  setCropConfig={setCropConfig}
                />
              ) : sectionKey === 'mediaMetadata' ? (
                <>
                  <MediaForm
                    mediaAssets={mediaAssets}
                    setMediaAssets={setMediaAssets}
                  />
                </>
              ) : (
                <FieldRenderer fields={fields} />
              )}
            </section>
          )
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload Asset
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setMediaAssets([]);
            }}
            className="px-4 py-2 bg-gray-300 rounded"
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
};

export default MediaAssetForm;
