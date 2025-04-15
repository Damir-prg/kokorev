'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@heroui/react';

import DefaultLayout from '@/layouts/default';
import { CreatePhotoGroup } from '@/components/forms/createPhotoGroup';
import { PhotoUploadForm } from '@/components/forms/photoUpload';
import GroupsList from '@/components/photoGroup/groupsList';
import { AdminProvider } from '@/contexts/admin/AdminContext';

export default function AdminPage() {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      router.push('/login');

      setHasToken(false);

      return;
    }

    setHasToken(true);
  }, [router]);

  if (!hasToken) {
    return (
      <DefaultLayout>
        <Spinner className="w-full h-full" />
      </DefaultLayout>
    );
  }

  return (
    <AdminProvider>
      <DefaultLayout>
        <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
        <section aria-label="form-groups" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CreatePhotoGroup />
          <PhotoUploadForm />
        </section>
        <GroupsList />
      </DefaultLayout>
    </AdminProvider>
  );
}
