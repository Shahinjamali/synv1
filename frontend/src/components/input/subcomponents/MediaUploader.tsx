import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MediaAsset } from '@/types/mediaAsset';

interface MediaUploaderProps {
  mediaAssets: { file?: File; metadata: Partial<MediaAsset>; crop?: any }[];
  setMediaAssets: React.Dispatch<
    React.SetStateAction<
      { file?: File; metadata: Partial<MediaAsset>; crop?: any }[]
    >
  >;
  setIsCropping: (value: boolean) => void;
  setCropConfig: (config: {
    dimension: string;
    width: number;
    height: number;
  }) => void;
}

export const MediaUploader = ({
  mediaAssets,
  setMediaAssets,
  setIsCropping,
  setCropConfig,
}: MediaUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newAssets = acceptedFiles.map((file) => {
        const metadata: Partial<MediaAsset> = {
          type: file.type.startsWith('image')
            ? 'image'
            : file.type.includes('pdf')
              ? 'document'
              : 'video',
          title: file.name,
          access: 'public',
          language: 'en',
        };
        if (metadata.type === 'image') {
          setIsCropping(true);
          setCropConfig({ dimension: 'thumbnail', width: 150, height: 150 });
        }
        return { file, metadata };
      });
      setMediaAssets([...mediaAssets, ...newAssets]);
    },
    [mediaAssets, setMediaAssets, setIsCropping, setCropConfig]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
      'video/mp4': ['.mp4'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div
          {...getRootProps()}
          className={`border border-2 p-4 text-center ${isDragActive ? 'border-primary' : 'border-secondary'}`}
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? 'Drop files here'
              : 'Drag files here or click to upload (jpg, png, pdf, mp4)'}
          </p>
        </div>
        {mediaAssets.length > 0 && (
          <ul className="list-group mt-3">
            {mediaAssets.map((asset, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>{asset.metadata.title}</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    setMediaAssets(mediaAssets.filter((_, i) => i !== index))
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
