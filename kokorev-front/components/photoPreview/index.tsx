'use client';

import React, { useState, useEffect } from 'react';

import { ImageCard } from '../imageCard';

import { photoApi } from '@/api';
import { PreviewPhoto } from '@/api/types';
import { useRouter } from 'next/router';

export const PhotoPreview = () => {
  const [photos, setPhotos] = useState<PreviewPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPreviewPhotos = async () => {
    try {
      setLoading(true);
      const response = await photoApi.getPreviewPhotos();

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setPhotos(response.data as PreviewPhoto[]);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      setError('Failed to fetch preview photos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo: PreviewPhoto) => {
    router.push(`/photo/${photo.groupId}`);
  };

  useEffect(() => {
    fetchPreviewPhotos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!photos || photos.length === 0) {
    return <div>No photos found</div>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map(photo => (
        <div key={photo.id} className="break-inside-avoid mb-4">
          <ImageCard
            description={photo.group?.subtitle || ''}
            imageSrc={photo.base64Data}
            mode={'hover'}
            onClick={() => handlePhotoClick(photo)}
            title={photo.group?.title || ''}
          />
        </div>
      ))}
    </section>
  );
};
