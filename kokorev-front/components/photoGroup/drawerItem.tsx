import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  ScrollShadow,
  useDisclosure,
} from '@heroui/react';
import React, { useState } from 'react';

import { ImageCard } from '../imageCard';

import { EditGroupForm } from './editGroupForm';

import { useAdmin } from '@/contexts/admin/AdminContext';
import { PhotoGroup, Photo } from '@/contexts/admin/types';

export const DrawerItem = ({
  isOpen,
  onOpenChange,
  group,
}: ReturnType<typeof useDisclosure> & { group: PhotoGroup }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { updatePhoto, deletePhoto, loading, fetchGroup, setGroups } = useAdmin();

  const handlePhotoClick = (photo: Photo) => {
    if (photo.isPreview) {
      return;
    }

    if (photo.id === selectedPhoto?.id) {
      setSelectedPhoto(null);
    } else {
      setSelectedPhoto(photo);
    }
  };

  const handleSetPreview = async () => {
    if (!selectedPhoto) return;

    try {
      await updatePhoto(group.id, selectedPhoto.id, { isPreview: true });
      setSelectedPhoto(null);
      const updatedGroup = await fetchGroup(group.id);

      if (updatedGroup) {
        setGroups((prevGroups: PhotoGroup[]) =>
          prevGroups.map((g: PhotoGroup) => (g.id === group.id ? updatedGroup : g))
        );
      }
    } catch (error) {
      console.error('Ошибка при установке превью:', error);
    }
  };

  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;

    if (window.confirm('Вы уверены, что хотите удалить эту фотографию?')) {
      try {
        await deletePhoto(group.id, selectedPhoto.id);
        setSelectedPhoto(null);
        const updatedGroup = await fetchGroup(group.id);

        if (updatedGroup) {
          setGroups((prevGroups: PhotoGroup[]) =>
            prevGroups.map((g: PhotoGroup) => (g.id === group.id ? updatedGroup : g))
          );
        }
      } catch (error) {
        console.error('Ошибка при удалении фотографии:', error);
      }
    }
  };

  const getImageCardMode = (photo: Photo) => {
    if (photo.id === selectedPhoto?.id) return 'selected';
    if (photo.isPreview) return 'hover';

    return 'selectable';
  };

  const photos = group.photos
    .sort((a, b) => {
      if (a.isPreview && !b.isPreview) return -1;
      if (!a.isPreview && b.isPreview) return 1;

      return a.id.localeCompare(b.id);
    })
    .filter(photo => photo.url);

  return (
    <Drawer isOpen={isOpen} size="5xl" onOpenChange={onOpenChange}>
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">{group.name}</DrawerHeader>
            <DrawerBody>
              <EditGroupForm group={group} />
              <ScrollShadow>
                <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 gap-4">
                  {photos &&
                    photos.map(photo => (
                      <div key={photo.id} className="break-inside-avoid mb-4">
                        <ImageCard
                          description={group.subtitle || ''}
                          imageSrc={photo.url}
                          mode={getImageCardMode(photo)}
                          title={group.name}
                          onClick={() => handlePhotoClick(photo)}
                        />
                      </div>
                    ))}
                </div>
              </ScrollShadow>
            </DrawerBody>
            <DrawerFooter className="flex gap-2">
              <Button
                className="text-xs cursor-pointer"
                color="danger"
                disabled={loading.photos || !selectedPhoto}
                size="sm"
                variant="ghost"
                onPress={handleDeletePhoto}
              >
                Удалить фото
              </Button>
              <Button
                className="text-xs cursor-pointer"
                color="secondary"
                disabled={loading.photos || !selectedPhoto}
                size="sm"
                variant="ghost"
                onPress={handleSetPreview}
              >
                Сделать превью
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
