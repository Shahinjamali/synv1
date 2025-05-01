'use client';

import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { z } from 'zod';
import Image from 'next/image';

// Types
type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

interface MediaUploaderProps {
  mediaAssets: MediaAssetFormData[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAssetFormData[]>>;
  setIsCropping: (value: boolean) => void;
  setCropConfig: (config: {
    dimension: string;
    width: number;
    height: number;
  }) => void;
}

// Allowed media types
const allowedMediaTypes = new Set([
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
]);

export const MediaUploader = ({
  mediaAssets,
  setMediaAssets,
  setIsCropping,
  setCropConfig,
}: MediaUploaderProps) => {
  const detectAssetType = (file: File): MediaAssetFormData['type'] | null => {
    if (file.type.startsWith('image/')) return 'image';
    if (
      file.type.includes('pdf') ||
      file.type.includes('word') ||
      file.type.includes('presentation') ||
      file.type.includes('excel')
    )
      return 'document';
    if (file.type.startsWith('video/')) return 'video';
    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newAssets: MediaAssetFormData[] = acceptedFiles.reduce<
        MediaAssetFormData[]
      >((acc, file) => {
        const type = detectAssetType(file);
        if (type && allowedMediaTypes.has(type)) {
          acc.push({
            file,
            type,
            title: file.name,
            altText: '',
            description: '',
            language: 'en',
            isPrimary: false,
            access: 'public',
            restrictedRoles: [],
            tags: [],
            metadata: {},
          });
        }
        return acc;
      }, []);

      if (newAssets.length > 0) {
        setMediaAssets((prev) => [...prev, ...newAssets]);

        const hasNewImage = newAssets.some((asset) => asset.type === 'image');
        if (hasNewImage) {
          setIsCropping(true);
          setCropConfig({ dimension: 'thumbnail', width: 150, height: 150 });
        }
      }
    },
    [setMediaAssets, setIsCropping, setCropConfig]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: useMemo(
      () => ({
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/webp': ['.webp'],
        'image/svg+xml': ['.svg'],
        'application/pdf': ['.pdf'],
        'video/mp4': ['.mp4'],
        'video/mpeg': ['.mpeg'],
        'video/quicktime': ['.mov'],
        'video/x-msvideo': ['.avi'],
        'video/webm': ['.webm'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ['.docx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
          '.xlsx',
        ],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          ['.pptx'],
        'application/zip': ['.zip'],
        'application/x-rar-compressed': ['.rar'],
      }),
      []
    ),
    maxSize: 20 * 1024 * 1024, // 20 MB limit
  });

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border border-2 p-4 text-center rounded ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}`}
        >
          <input {...getInputProps()} />
          <p className="m-0">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select (jpg, png, pdf, mp4...)'}
          </p>
        </div>

        {/* Media preview list */}
        {Array.isArray(mediaAssets) && mediaAssets.length > 0 && (
          <ul className="list-group mt-3">
            {mediaAssets.map((asset, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ maxWidth: '70%' }}
                >
                  {/* Thumbnail Preview */}
                  {asset.file instanceof File && asset.type === 'image' ? (
                    <Image
                      src={URL.createObjectURL(asset.file)}
                      alt={asset.altText || asset.title}
                      width={40}
                      height={40}
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                      unoptimized
                    />
                  ) : (
                    <i
                      className="bi bi-file-earmark-text"
                      style={{ fontSize: '1.5rem' }}
                    ></i> // Bootstrap icon for document/video
                  )}
                  <span className="text-truncate">{asset.title}</span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    setMediaAssets((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
