'use client';

import { useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import Image from 'next/image';
import 'react-image-crop/dist/ReactCrop.css';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { z } from 'zod';
import dimensionPresets from '@/data/images/dimensions.json';

// Define MediaAssetFormData using the imported schema
type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

interface CropModalProps {
  mediaAssets: MediaAssetFormData[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAssetFormData[]>>;
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

type DimensionKey = keyof typeof dimensionPresets;

// Utility to generate cropped image File
const getCroppedImageFile = (
  imageSrc: string,
  crop: Crop,
  fileName: string
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg');
    };
    image.onerror = () => reject(new Error('Failed to load image'));
  });
};

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
    if (
      lastAsset?.file &&
      lastAsset.file.type.startsWith('image/') &&
      !imageSrc
    ) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(lastAsset.file);
    } else if (!lastAsset?.file || !lastAsset.file.type.startsWith('image/')) {
      setIsCropping(false); // Close modal if not an image
    }
  }, [mediaAssets, imageSrc, setIsCropping]);

  const handleCrop = async () => {
    const lastAsset = mediaAssets[mediaAssets.length - 1];
    if (!lastAsset?.file || !imageSrc) return;

    try {
      const croppedFile = await getCroppedImageFile(
        imageSrc,
        crop,
        lastAsset.file.name
      );

      const newAssets = [...mediaAssets];
      newAssets[newAssets.length - 1] = {
        ...lastAsset,
        file: croppedFile,
        metadata: {
          ...(lastAsset.metadata || {}),
          dimensions: {
            width: crop.width,
            height: crop.height,
          },
        },
      };

      setMediaAssets(newAssets);
      setIsCropping(false);
      setCropConfig(null);
    } catch (error) {
      console.error('Crop error:', error);
      alert('Failed to crop image. Please try again.');
    }
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
            {imageSrc ? (
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
            ) : (
              <p>Loading image...</p>
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
                  const key = e.target.value as DimensionKey;
                  const { width, height } =
                    dimensionPresets[key] || dimensionPresets.thumbnail;

                  setCropConfig({ dimension: key, width, height });
                  setCrop((prev) => ({
                    ...prev,
                    width,
                    height,
                  }));
                }}
              >
                <option value="">Select Dimension</option>
                {Object.entries(dimensionPresets).map(([key, dim]) => (
                  <option key={key} value={key}>
                    {`${key} (${dim.width}×${dim.height})`}
                  </option>
                ))}
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
