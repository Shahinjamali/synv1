// media main list page\n\nexport default function MediaPage() {\n  return <div>media page</div>;\n}
'use client';

import { getMediaAssets } from '@/utils/api';
import { MediaAsset } from '@/types/mediaAsset';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function MediaAssetsPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMediaAssets()
      .then((res) => {
        setAssets(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Media Assets Manager</h1>
      <Link href="./media/new" className="btn-primary mb-4 inline-block">
        ➕ Upload New Media
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : assets.length === 0 ? (
        <p>No media assets found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div key={asset._id} className="border p-2 rounded bg-white shadow">
              {asset.type.startsWith('image') && (
                <Image
                  src={asset.url}
                  alt={asset.altText || ''}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <div className="mt-2 text-xs">{asset.title || asset.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
