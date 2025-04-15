import { Button, Form, Input, Select, SelectItem } from '@heroui/react';
import React, { useRef, useState } from 'react';

import { useAdmin } from '@/contexts/admin/AdminContext';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const PhotoUploadForm = () => {
  const { groups, addPhoto, loading, error: contextError, fetchGroups } = useAdmin();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0 || !selectedGroup) {
      setError('Выберите файлы и группу');

      return;
    }

    try {
      setError(null);

      for (let i = 0; i < fileInputRef.current.files.length; i++) {
        const file = fileInputRef.current.files[i];
        const base64 = await convertFileToBase64(file);

        await addPhoto(selectedGroup, {
          url: base64,
          title: file.name,
          description: '',
          groupId: selectedGroup,
          isPreview: false,
        });
      }

      await fetchGroups();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      event.currentTarget?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке фотографий');
    }
  };

  return (
    <Form
      className="flex flex-col bg-default-700/10 rounded-lg border border-white/20 gap-4 p-4"
      onSubmit={handleFileSelect}
    >
      <h3 className="text-xl text-left">Загрузить фотографии</h3>
      {(error || contextError) && (
        <span className="text-left text-sm text-red-400">{error || contextError}</span>
      )}
      <Select
        isRequired
        label="Выберите группу"
        selectedKeys={[selectedGroup]}
        onSelectionChange={keys => setSelectedGroup(Array.from(keys)[0] as string)}
      >
        {groups.map(group => (
          <SelectItem
            key={group.id}
            description={group.description}
            textValue={`${group.name} ${group.subtitle ? `(${group.subtitle})` : ''}`}
            title={`${group.name} ${group.subtitle ? `(${group.subtitle})` : ''}`}
          />
        ))}
      </Select>
      <Input ref={fileInputRef} multiple accept="image/*" type="file" />
      <Button className="w-full" color="secondary" isLoading={loading.photos} type="submit">
        Загрузить
      </Button>
      {selectedGroup && (
        <div className="text-sm text-default-500 mt-2">
          Фотографий в группе: {groups.find(g => g.id === selectedGroup)?.photos.length || 0}
        </div>
      )}
    </Form>
  );
};
