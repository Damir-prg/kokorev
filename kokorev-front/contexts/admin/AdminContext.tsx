import type { AdminContextType } from './types';

import React, { createContext, useContext, useState, useCallback } from 'react';

import { PhotoGroup, Photo } from './types';

import { groupApi, photoApi } from '@/api';
import { Group, GroupCreateRequest, GroupUpdateRequest, ApiResponse } from '@/api/types';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Type guard для проверки наличия данных в ответе API
const hasData = <T,>(response: ApiResponse<T>): response is { data: T } & ApiResponse<T> => {
  return response.data !== undefined;
};

const convertApiGroupToPhotoGroup = (group: Group): PhotoGroup => {
  return {
    id: group.id?.toString() || '',
    name: group.title || '',
    subtitle: group.subtitle || '',
    description: group.description || '',
    photos: (group.photos || []).map(photo => ({
      id: photo.id?.toString() || '',
      url: photo.base64Data || '',
      title: photo.filename || '',
      description: '', // API не поддерживает описание для фото
      groupId: photo.groupId?.toString() || '',
      isPreview: photo.isPreview || false,
      createdAt: photo.createdAt || new Date().toISOString(),
      updatedAt: photo.updatedAt || new Date().toISOString(),
    })),
    createdAt: group.createdAt || new Date().toISOString(),
    updatedAt: group.updatedAt || new Date().toISOString(),
    isPublished: group.isPublished || false,
  };
};

const convertPhotoGroupToGroupCreateRequest = (
  group: Omit<PhotoGroup, 'id' | 'photos' | 'createdAt' | 'updatedAt'>
): GroupCreateRequest => ({
  title: group.name,
  subtitle: group.subtitle,
  description: group.description,
  isPublished: group.isPublished,
});

const convertPhotoGroupToGroupUpdateRequest = (group: Partial<PhotoGroup>): GroupUpdateRequest => ({
  title: group.name,
  subtitle: group.subtitle,
  description: group.description,
  isPublished: group.isPublished,
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<PhotoGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<PhotoGroup | null>(null);
  const [loading, setLoading] = useState({
    groups: false,
    photos: false,
    group: false,
  });
  const [error, setError] = useState<string | null>(null);

  const updateGroups = useCallback(
    (newGroups: PhotoGroup[] | ((prev: PhotoGroup[]) => PhotoGroup[])) => {
      setGroups(newGroups);
    },
    []
  );

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, groups: true }));
      setError(null);
      const response = await groupApi.getAll();

      if (response.error) {
        throw new Error(response.error);
      }
      if (hasData(response)) {
        const newGroups = response.data.map(convertApiGroupToPhotoGroup);

        updateGroups(newGroups);
      }
    } catch (err) {
      setError('Failed to fetch groups');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  }, [updateGroups]);

  const updateGroup = useCallback(async (id: string, group: Partial<PhotoGroup>) => {
    setLoading(prev => ({ ...prev, groups: true }));
    try {
      const request = convertPhotoGroupToGroupUpdateRequest(group);
      const response = await groupApi.update(Number(id), request);

      if (response.error) {
        throw new Error(response.error);
      }
      if (hasData(response)) {
        const updatedGroup = convertApiGroupToPhotoGroup(response.data);

        setGroups(prevGroups => prevGroups.map(g => (g.id === id ? updatedGroup : g)));
      }
    } catch (err) {
      setError('Failed to update group');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  }, []);

  const deleteGroup = useCallback(
    async (id: string) => {
      setLoading(prev => ({ ...prev, groups: true }));
      try {
        const response = await groupApi.delete(Number(id));

        if (response.error) {
          throw new Error(response.error);
        }
        setGroups(prevGroups => prevGroups.filter(g => g.id !== id));
        if (selectedGroup?.id === id) {
          setSelectedGroup(null);
        }
      } catch (err) {
        setError('Failed to delete group');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, groups: false }));
      }
    },
    [selectedGroup]
  );

  const createGroup = useCallback(
    async (group: Omit<PhotoGroup, 'id' | 'photos' | 'createdAt' | 'updatedAt'>) => {
      try {
        setLoading(prev => ({ ...prev, group: true }));
        setError(null);
        const request = convertPhotoGroupToGroupCreateRequest(group);
        const response = await groupApi.create(request);

        if (response.error) {
          throw new Error(response.error);
        }
        if (hasData(response)) {
          const newGroup = convertApiGroupToPhotoGroup(response.data);

          setGroups(prevGroups => [...prevGroups, newGroup]);
        }
      } catch (err) {
        setError('Failed to create group');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, group: false }));
      }
    },
    []
  );

  const addPhoto = useCallback(
    async (groupId: string, photo: Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setLoading(prev => ({ ...prev, photos: true }));
        setError(null);
        const request = {
          filename: photo.title || 'photo',
          base64Data: photo.url,
          groupId: Number(groupId),
        };
        const response = await photoApi.upload([request]);

        if (response.error) {
          throw new Error(response.error);
        }
        if (hasData(response) && response.data[0]) {
          await fetchGroups();
        }
      } catch (err) {
        setError('Failed to add photo');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, photos: false }));
      }
    },
    [fetchGroups]
  );

  const updatePhoto = useCallback(
    async (groupId: string, photoId: string, photo: Partial<Photo>) => {
      try {
        setLoading(prev => ({ ...prev, photos: true }));
        setError(null);
        const request = {
          filename: photo.title,
          isPreview: photo.isPreview,
        };
        const response = await photoApi.update(Number(photoId), request);

        if (response.error) {
          throw new Error(response.error);
        }
        if (hasData(response)) {
          const updatedGroup = await fetchGroup(groupId);

          if (updatedGroup) {
            setGroups(prevGroups => prevGroups.map(g => (g.id === groupId ? updatedGroup : g)));
          }
        }
      } catch (err) {
        setError('Failed to update photo');
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, photos: false }));
      }
    },
    []
  );

  const deletePhoto = useCallback(async (groupId: string, photoId: string) => {
    try {
      setLoading(prev => ({ ...prev, photos: true }));
      setError(null);
      const response = await photoApi.delete(Number(photoId));

      if (response.error) {
        throw new Error(response.error);
      }
      const updatedGroup = await fetchGroup(groupId);

      if (updatedGroup) {
        setGroups(prevGroups => prevGroups.map(g => (g.id === groupId ? updatedGroup : g)));
      }
    } catch (err) {
      setError('Failed to delete photo');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, photos: false }));
    }
  }, []);

  const setPhotoAsPreview = useCallback(async (groupId: string, photoId: string) => {
    try {
      setLoading(prev => ({ ...prev, photos: true }));
      setError(null);
      const response = await photoApi.setPreview(Number(photoId));

      if (response.error) {
        throw new Error(response.error);
      }
      if (hasData(response)) {
        const updatedGroup = await fetchGroup(groupId);

        if (updatedGroup) {
          setGroups(prevGroups => prevGroups.map(g => (g.id === groupId ? updatedGroup : g)));
        }
      }
    } catch (err) {
      setError('Failed to set photo as preview');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, photos: false }));
    }
  }, []);

  const fetchGroup = async (id: string): Promise<PhotoGroup | null> => {
    try {
      const response = await groupApi.getById(Number(id));

      if (response.data) {
        return convertApiGroupToPhotoGroup(response.data);
      }

      return null;
    } catch (error) {
      console.error('Ошибка при получении группы:', error);

      return null;
    }
  };

  const value = {
    groups,
    selectedGroup,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    selectGroup: setSelectedGroup,
    addPhoto,
    updatePhoto,
    deletePhoto,
    setPhotoAsPreview,
    fetchGroup,
    setGroups: updateGroups,
    addGroup: createGroup,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }

  return context;
};
