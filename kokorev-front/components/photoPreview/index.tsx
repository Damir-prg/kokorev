'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { ImageCard } from '../imageCard';

import { photoApi } from '@/api';
import { PreviewPhoto } from '@/api/types';

export const PhotoPreview = () => {
  const [photos, setPhotos] = useState<PreviewPhoto[]>([]);
  const router = useRouter();

  const fetchPreviewPhotos = async () => {
    try {
      const response = await photoApi.getPreviewPhotos();

      if (Array.isArray(response)) {
        setPhotos(response);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoClick = (photo: PreviewPhoto) => {
    router.push(`/photo/${photo.groupId}`);
  };

  useEffect(() => {
    fetchPreviewPhotos();
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos?.map(photo => (
        <div key={photo.id} className="break-inside-avoid mb-4">
          <ImageCard
            description={photo.group?.subtitle || ''}
            imageSrc={photo.base64Data}
            mode={'hover'}
            title={photo.group?.title || ''}
            onClick={() => handlePhotoClick(photo)}
          />
        </div>
      ))}
    </section>
  );
};
