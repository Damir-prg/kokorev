import React, { useState } from 'react';
import { Button, Form, Input, Textarea } from '@heroui/react';

import { useAdmin } from '@/contexts/admin/AdminContext';

export const CreatePhotoGroup = () => {
  const { addGroup, loading, error: contextError } = useAdmin();
  const [newGroup, setNewGroup] = useState({
    name: '',
    subtitle: '',
    description: '',
    photos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newGroup.name.trim()) {
      setError('Название группы обязательно');

      return;
    }

    try {
      setError(null);
      await addGroup(newGroup);
      setNewGroup({
        name: '',
        subtitle: '',
        description: '',
        photos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании группы');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setNewGroup(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form
      className="flex flex-col bg-default-700/10 rounded-lg border border-white/20 p-4"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl text-left">Создать новую группу</h3>
      {(error || contextError) && (
        <span className="text-left text-sm text-red-400">{error || contextError}</span>
      )}
      <Input
        isRequired
        aria-label="group-name"
        label="Название группы"
        name="name"
        value={newGroup.name}
        onChange={handleChange}
      />
      <Input
        aria-label="group-subtitle"
        label="Подзаголовок"
        name="subtitle"
        value={newGroup.subtitle}
        onChange={handleChange}
      />
      <Textarea
        aria-label="group-description"
        label="Описание группы"
        name="description"
        value={newGroup.description}
        onChange={handleChange}
      />
      <Button className="w-full" color="secondary" isLoading={loading.groups} type="submit">
        Создать группу
      </Button>
    </Form>
  );
};
