'use client';
import { useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import Image from 'next/image';
import 'react-image-crop/dist/ReactCrop.css';
import { MediaAsset } from '@/types/mediaAsset';

// Define CropData to match UnifiedDataInput
interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect?: number;
}

interface CropModalProps {
  mediaAssets: {
    file?: File;
    metadata: Partial<MediaAsset>;
    crop?: CropData;
  }[];
  setMediaAssets: React.Dispatch<
    React.SetStateAction<
      { file?: File; metadata: Partial<MediaAsset>; crop?: CropData }[]
    >
  >;
  cropConfig: { dimension: string; width: number; height: number };
  setIsCropping: (value: boolean) => void;
  setCropConfig: React.Dispatch<
    React.SetStateAction<{
      dimension: string;
      width: number;
      height: number;
    } | null>
  >;
}

export const CropModal = ({
  mediaAssets,
  setMediaAssets,
  cropConfig,
  setIsCropping,
  setCropConfig,
}: CropModalProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: cropConfig.width,
    height: cropConfig.height,
    x: 0,
    y: 0,
  });
  const [imageSrc, setImageSrc] = useState<string>('');

  // Load last uploaded image
  useEffect(() => {
    const lastAsset = mediaAssets[mediaAssets.length - 1];
    if (lastAsset?.file && !imageSrc) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(lastAsset.file);
    }
  }, [mediaAssets, imageSrc]);

  const handleCrop = () => {
    const newAssets = [...mediaAssets];
    const lastAsset = newAssets[newAssets.length - 1];
    const cropData: CropData = {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
      aspect: cropConfig.width / cropConfig.height,
    };
    lastAsset.crop = cropData;
    lastAsset.metadata = {
      ...lastAsset.metadata,
      metadata: {
        ...(lastAsset.metadata.metadata || {}),
        dimensions: {
          width: crop.width,
          height: crop.height,
        },
      },
    };
    setMediaAssets(newAssets);
    setIsCropping(false);
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crop Image ({cropConfig.dimension})</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setIsCropping(false)}
            />
          </div>
          <div className="modal-body">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={cropConfig.width / cropConfig.height}
              >
                {/* Use Next.js Image component */}
                <Image
                  src={imageSrc}
                  alt="Crop preview"
                  width={cropConfig.width}
                  height={cropConfig.height}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  unoptimized // Required for data URLs
                />
              </ReactCrop>
            )}
            <p className="mt-2">
              Crop to {cropConfig.width}x{cropConfig.height}px
            </p>
            <div className="mb-3">
              <label htmlFor="cropDimension" className="form-label">
                Crop Dimension
              </label>
              <select
                id="cropDimension"
                className="form-select"
                value={cropConfig.dimension}
                onChange={(e) => {
                  const dimensions: Record<
                    string,
                    { width: number; height: number }
                  > = {
                    thumbnail: { width: 150, height: 150 }, // Square thumbnail (already defined)
                    productCard: { width: 285, height: 262 }, // Small product card image
                    featureBlock: { width: 380, height: 297 }, // Home page or grid feature block
                    verticalFeature: { width: 517, height: 776 }, // Tall vertical product feature (brochure-style)
                    heroHalf: { width: 561, height: 508 }, // Hero section half-width image
                    serviceCard: { width: 410, height: 325 }, // Standard service/product card
                    wideBanner: { width: 740, height: 560 }, // Homepage or section banner
                    miniBanner: { width: 410, height: 189 },
                  };
                  const { width, height } =
                    dimensions[e.target.value] || dimensions.thumbnail;
                  setCropConfig({ dimension: e.target.value, width, height });
                  setCrop((prev) => ({
                    ...prev,
                    width,
                    height,
                  }));
                }}
              >
                <option value="thumbnail">Thumbnail (150×150)</option>
                <option value="banner">Banner (1200×400)</option>
                <option value="product">Product Image (600×600)</option>
                <option value="productCard">Product Card (285×262)</option>
                <option value="featureBlock">Feature Block (380×297)</option>
                <option value="verticalFeature">
                  Vertical Feature (517×776)
                </option>
                <option value="heroHalf">Hero Half (561×508)</option>
                <option value="serviceCard">Service Card (410×325)</option>
                <option value="wideBanner">Wide Banner (740×560)</option>
                <option value="miniBanner">Mini Banner (410×189)</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCropping(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCrop}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
