import { Button, Form, Input, Switch, Textarea } from '@heroui/react';
import { useState } from 'react';

import { useAdmin } from '@/contexts/admin/AdminContext';
import { PhotoGroup } from '@/contexts/admin/types';

interface EditGroupFormProps {
  group: PhotoGroup;
}

export const EditGroupForm = ({ group }: EditGroupFormProps) => {
  const { updateGroup, deleteGroup, loading, fetchGroups } = useAdmin();
  const [formData, setFormData] = useState({
    name: group.name,
    subtitle: group.subtitle || '',
    description: group.description || '',
    isPublished: group.isPublished,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGroup(group.id, formData);
      await fetchGroups();
    } catch (error) {
      console.error('Ошибка при обновлении группы:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      try {
        await deleteGroup(group.id);
      } catch (error) {
        console.error('Ошибка при удалении группы:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (isSelected: boolean) => {
    setFormData(prev => ({ ...prev, isPublished: isSelected }));
  };

  return (
    <Form className="mb-4" onSubmit={handleSubmit}>
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1 flex flex-col gap-2">
          <Input
            isRequired
            label="Название группы"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Подзаголовок"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>
        <Textarea
          className="flex-1 "
          label="Описание"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-2">
          <Switch
            color="secondary"
            isSelected={formData.isPublished}
            onValueChange={handleSwitchChange}
          >
            Опубликовано
          </Switch>
          <Button
            className="flex-1"
            color="danger"
            disabled={loading.groups}
            onPress={handleDelete}
          >
            Удалить группу
          </Button>
          <Button className="flex-1" color="secondary" disabled={loading.groups} type="submit">
            Сохранить изменения
          </Button>
        </div>
      </div>
    </Form>
  );
};
