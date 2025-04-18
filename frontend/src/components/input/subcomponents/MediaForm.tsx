// This is an improved version of MediaForm.tsx that adds dimension presets to each media asset
'use client';

import { MediaAsset } from '@/types/mediaAsset';

interface MediaFormProps {
  mediaAssets: { file?: File; metadata: Partial<MediaAsset> }[];
  setMediaAssets: React.Dispatch<
    React.SetStateAction<{ file?: File; metadata: Partial<MediaAsset> }[]>
  >;
}

const dimensionPresets = {
  thumbnail: { width: 150, height: 150 },
  productCard: { width: 285, height: 262 },
  featureBlock: { width: 380, height: 297 },
  verticalFeature: { width: 517, height: 776 },
  heroHalf: { width: 561, height: 508 },
  serviceCard: { width: 410, height: 325 },
  wideBanner: { width: 740, height: 560 },
  miniBanner: { width: 410, height: 189 },
};

const accessOptions = ['public', 'authenticated', 'subscriber', 'restricted'];

export const MediaForm = ({ mediaAssets, setMediaAssets }: MediaFormProps) => {
  const handleMetadataChange = (
    index: number,
    field: string,
    value: unknown
  ) => {
    setMediaAssets((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        metadata: {
          ...updated[index].metadata,
          [field]: value,
        },
      };
      return updated;
    });
  };

  const handleDimensionPreset = (
    index: number,
    presetKey: keyof typeof dimensionPresets
  ) => {
    setMediaAssets((prev) => {
      const updated = [...prev];
      updated[index].metadata = {
        ...updated[index].metadata,
        metadata: {
          ...updated[index].metadata?.metadata,
          dimensions: dimensionPresets[presetKey],
        },
      };
      return updated;
    });
  };

  return (
    <div className="space-y-4 mt-4">
      {mediaAssets.map((asset, index) => (
        <div key={index} className="border p-4 rounded-md shadow-sm bg-white">
          <h4 className="font-semibold text-sm mb-2">
            {asset.file?.name || `Media Asset ${index + 1}`} –{' '}
            {asset.metadata.access || 'unassigned'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={asset.metadata.title || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'title', e.target.value)
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Alt Text"
              value={asset.metadata.altText || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'altText', e.target.value)
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={asset.metadata.description || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'description', e.target.value)
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Language (e.g. en)"
              value={asset.metadata.language || 'en'}
              onChange={(e) =>
                handleMetadataChange(index, 'language', e.target.value)
              }
            />

            <select
              className="form-select"
              value={asset.metadata.access || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'access', e.target.value)
              }
            >
              <option value="">Select Access</option>
              {accessOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              onChange={(e) =>
                handleDimensionPreset(
                  index,
                  e.target.value as keyof typeof dimensionPresets
                )
              }
            >
              <option value="">Select Dimension Preset</option>
              {Object.entries(dimensionPresets).map(([key, dim]) => (
                <option key={key} value={key}>
                  {`${key} (${dim.width}×${dim.height})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
