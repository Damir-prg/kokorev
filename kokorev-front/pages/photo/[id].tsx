'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDisclosure, Modal, ModalContent, ModalBody } from '@heroui/react';

import { groupApi } from '@/api';
import { Group, Photo } from '@/api/types';
import DefaultLayout from '@/layouts/default';
import { ImageCard } from '@/components/imageCard';

const DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const { onClose } = useDisclosure();

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return;

      try {
        const response = await groupApi.getById(Number(id));

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.data) {
          if (!response.data.isPublished) {
            router.push('/');

            return;
          }
          setGroup(response.data);
        }
      } catch (err) {
        setError('Ошибка при загрузке группы');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      fetchGroup();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="container mx-auto p-4">
          <div>Загрузка...</div>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    router.replace('/');
  }

  if (!group) {
    return (
      <DefaultLayout>
        <div className="container mx-auto p-4">
          <div>Группа не найдена</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{group.title}</h2>
        {group.subtitle && <h2 className="text-xl mb-4">{group.subtitle}</h2>}
        {group.description && <p className="mb-4">{group.description}</p>}

        {group.photos && group.photos.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.photos.map(photo => (
              <div key={photo.id} className="break-inside-avoid mb-4">
                <ImageCard
                  description={group?.subtitle || ''}
                  imageSrc={photo.base64Data}
                  title={group.title}
                  onClick={() => setSelectedPhoto(photo)}
                />
              </div>
            ))}
          </section>
        )}
      </div>
      <Modal
        backdrop={'blur'}
        isOpen={Boolean(selectedPhoto)}
        scrollBehavior="inside"
        size="full"
        onClose={() => {
          onClose();
          setSelectedPhoto(null);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                {selectedPhoto && (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      alt={group.title}
                      className="max-w-full max-h-full object-contain"
                      src={selectedPhoto.base64Data}
                    />
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
};

export default DynamicPage;
