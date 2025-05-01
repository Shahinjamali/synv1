'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { uploadMediaAsset } from '@/utils/api';
import { MediaUploader } from '@/components/forms/partials/MediaUploader';
import { MediaForm } from '@/components/forms/partials/MediaForm';
import { z } from 'zod';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';

type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

export default function NewMediaPage() {
  const router = useRouter();
  const [mediaAssets, setMediaAssets] = useState<MediaAssetFormData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = async () => {
    setSubmitting(true);
    try {
      for (const asset of mediaAssets) {
        if (asset.file instanceof File) {
          await uploadMediaAsset(asset.file, {
            type: asset.type,
            title: asset.title,
            altText: asset.altText,
            description: asset.description,
            language: asset.language,
            isPrimary: asset.isPrimary,
            access: asset.access,
            restrictedRoles: asset.restrictedRoles,
            metadata: asset.metadata,
            tags: asset.tags,
            owner: { type: 'orphaned', id: null },
            status: 'orphaned',
          });
        }
      }
      setMediaAssets([]);
      router.push('../');
    } catch (err) {
      console.error('[Upload Media Error]', err);
      alert('Failed to upload media.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">➕ Upload New Media</h1>
      <MediaUploader
        mediaAssets={mediaAssets}
        setMediaAssets={setMediaAssets}
        setIsCropping={() => {}}
        setCropConfig={() => {}}
      />
      <MediaForm
        mediaAssets={mediaAssets}
        setMediaAssets={setMediaAssets}
        submitting={submitting}
      />
      <div className="mt-4">
        <button
          onClick={handleUpload}
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
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </button>
      </div>
    </div>
  );
}
