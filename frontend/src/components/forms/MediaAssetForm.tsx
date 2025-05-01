'use client';

import { useState } from 'react';
import dimensionPresets from '@/data/images/dimensions.json';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { z } from 'zod';

// Define MediaAssetFormData using the schema directly
type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

interface MediaFormProps {
  mediaAssets: MediaAssetFormData[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAssetFormData[]>>;
  submitting?: boolean;
}

const mediaTypeOptions = [
  'image',
  'thumbnail',
  'icon',
  'banner',
  'productCard',
  'featureBlock',
  'verticalFeature',
  'heroHalf',
  'serviceCard',
  'wideBanner',
  'miniBanner',
  'document',
  'video',
];

const accessOptions = ['public', 'authenticated', 'subscriber', 'restricted'];

const documentTypeOptions = [
  'TDS',
  'SDS',
  'PDS',
  'Certification',
  'Approval',
  'Brochure',
  'CaseStudy',
  'Guide',
  'Other',
];

type DocumentType =
  | 'TDS'
  | 'SDS'
  | 'PDS'
  | 'Certification'
  | 'Approval'
  | 'Brochure'
  | 'CaseStudy'
  | 'Guide'
  | 'Other';

export const MediaAssetForm = ({
  mediaAssets,
  setMediaAssets,
  submitting,
}: MediaFormProps) => {
  const [errors, setErrors] = useState<
    { index: number; field: string; message: string }[]
  >([]);

  const validateField = (
    index: number,
    field: keyof MediaAssetFormData | 'documentType',
    value: string | boolean | string[] | DocumentType
  ) => {
    try {
      const schema =
        field === 'documentType'
          ? mediaAssetFormSchema.shape.metadata._def.innerType.shape
              .documentType
          : mediaAssetFormSchema.shape[field];
      schema.parse(value);
      setErrors((prev) =>
        prev.filter((err) => err.index !== index || err.field !== field)
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => [
          ...prev.filter((err) => err.index !== index || err.field !== field),
          {
            index,
            field,
            message: error.errors[0].message,
          },
        ]);
      }
    }
  };

  const handleMetadataChange = (
    index: number,
    field: keyof MediaAssetFormData | 'documentType',
    value: string | boolean | string[] | DocumentType
  ) => {
    setMediaAssets((prev) => {
      const updated = [...prev];
      const currentAsset = updated[index];

      if (field === 'documentType') {
        updated[index] = {
          ...currentAsset,
          metadata: {
            ...(currentAsset.metadata || {}),
            documentType: value as DocumentType,
          },
        };
      } else {
        updated[index] = {
          ...currentAsset,
          [field]: value,
        };
      }

      return updated;
    });

    validateField(index, field, value);
  };

  const handleDimensionPreset = (
    index: number,
    presetKey: keyof typeof dimensionPresets
  ) => {
    setMediaAssets((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        metadata: {
          ...(updated[index].metadata || {}),
          dimensions: dimensionPresets[presetKey],
        },
      };
      return updated;
    });
  };

  const handleTagsChange = (index: number, value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    handleMetadataChange(index, 'tags', tags);
  };

  return (
    <div className="space-y-4 mt-4">
      {mediaAssets.map((asset, index) => (
        <div key={index} className="border p-4 rounded-md shadow-sm bg-white">
          <h4 className="font-semibold text-sm mb-2">
            {asset.file?.name || `Media Asset ${index + 1}`} –{' '}
            {asset.access || 'unassigned'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                className={`form-control ${
                  errors.some(
                    (err) => err.index === index && err.field === 'title'
                  )
                    ? 'border-red-500'
                    : ''
                }`}
                placeholder="Title (required)"
                value={asset.title || ''}
                onChange={(e) =>
                  handleMetadataChange(index, 'title', e.target.value)
                }
                required
                disabled={submitting}
              />
              {errors.some(
                (err) => err.index === index && err.field === 'title'
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  {
                    errors.find(
                      (err) => err.index === index && err.field === 'title'
                    )?.message
                  }
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Alt Text</label>
              <input
                type="text"
                className="form-control"
                placeholder="Alt Text"
                value={asset.altText || ''}
                onChange={(e) =>
                  handleMetadataChange(index, 'altText', e.target.value)
                }
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={asset.description || ''}
                onChange={(e) =>
                  handleMetadataChange(index, 'description', e.target.value)
                }
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Language</label>
              <input
                type="text"
                className="form-control"
                placeholder="Language (e.g., en)"
                value={asset.language || 'en'}
                onChange={(e) =>
                  handleMetadataChange(index, 'language', e.target.value)
                }
                disabled={submitting}
              />
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-sm font-medium">Media Type</label>
              <select
                className={`form-select ${
                  errors.some(
                    (err) => err.index === index && err.field === 'type'
                  )
                    ? 'border-red-500'
                    : ''
                }`}
                value={asset.type || ''}
                onChange={(e) =>
                  handleMetadataChange(index, 'type', e.target.value)
                }
                disabled={submitting}
              >
                <option value="">Select Media Type</option>
                {mediaTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.some(
                (err) => err.index === index && err.field === 'type'
              ) && (
                <p className="text-red-500 text-xs mt-1">
                  {
                    errors.find(
                      (err) => err.index === index && err.field === 'type'
                    )?.message
                  }
                </p>
              )}
            </div>

            {/* Document Type - Only show if type is 'document' */}
            {asset.type === 'document' && (
              <div>
                <label className="block text-sm font-medium">
                  Document Type
                </label>
                <select
                  className={`form-select ${
                    errors.some(
                      (err) =>
                        err.index === index && err.field === 'documentType'
                    )
                      ? 'border-red-500'
                      : ''
                  }`}
                  value={asset.metadata.documentType ?? ''}
                  onChange={(e) =>
                    handleMetadataChange(
                      index,
                      'documentType',
                      e.target.value as DocumentType
                    )
                  }
                  disabled={submitting}
                >
                  <option value="">Select Document Type</option>
                  {documentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.some(
                  (err) => err.index === index && err.field === 'documentType'
                ) && (
                  <p className="text-red-500 text-xs mt-1">
                    {
                      errors.find(
                        (err) =>
                          err.index === index && err.field === 'documentType'
                      )?.message
                    }
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Access</label>
              <select
                className="form-select"
                value={asset.access || ''}
                onChange={(e) =>
                  handleMetadataChange(index, 'access', e.target.value)
                }
                disabled={submitting}
              >
                <option value="">Select Access</option>
                {accessOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Dimension Preset
              </label>
              <select
                className="form-select"
                onChange={(e) =>
                  handleDimensionPreset(
                    index,
                    e.target.value as keyof typeof dimensionPresets
                  )
                }
                disabled={submitting}
              >
                <option value="">Select Dimension Preset</option>
                {Object.entries(dimensionPresets).map(([key, dim]) => (
                  <option key={key} value={key}>
                    {`${key} (${dim.width}×${dim.height})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Is Primary</label>
              <input
                type="checkbox"
                checked={asset.isPrimary || false}
                onChange={(e) =>
                  handleMetadataChange(index, 'isPrimary', e.target.checked)
                }
                className="mt-1"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Restricted Roles
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Comma-separated roles (e.g., admin,editor)"
                value={asset.restrictedRoles?.join(', ') || ''}
                onChange={(e) =>
                  handleMetadataChange(
                    index,
                    'restrictedRoles',
                    e.target.value
                      .split(',')
                      .map((role) => role.trim())
                      .filter(Boolean)
                  )
                }
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Tags</label>
              <input
                type="text"
                className="form-control"
                placeholder="Comma-separated tags (e.g., product,featured)"
                value={asset.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(index, e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
