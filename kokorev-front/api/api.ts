import axios, { InternalAxiosRequestConfig } from 'axios';

import {
  Group,
  GroupCreateRequest,
  GroupUpdateRequest,
  Photo,
  PhotoUploadRequest,
  PhotoUpdateRequest,
  ApiResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Создание экземпляра axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление токена к запросам
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Методы для работы с группами
export const groupApi = {
  // Получение всех групп с превью
  getAll: async (): Promise<ApiResponse<Group[]>> => {
    try {
      const response = await api.get('/groups');

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при получении групп' };
    }
  },

  // Получение группы по ID со всеми фотографиями
  getById: async (id: number): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.get(`/groups/${id}`);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при получении группы' };
    }
  },

  // Создание группы
  create: async (data: GroupCreateRequest): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.post('/groups', data);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при создании группы' };
    }
  },

  // Обновление группы
  update: async (id: number, data: GroupUpdateRequest): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.put(`/groups/${id}`, data);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при обновлении группы' };
    }
  },

  // Удаление группы
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/groups/${id}`);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при удалении группы' };
    }
  },

  // Переключение статуса публикации группы
  togglePublish: async (id: number): Promise<ApiResponse<Group>> => {
    try {
      const response = await api.patch(`/groups/${id}/publish`);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при изменении статуса публикации группы' };
    }
  },
};

// Методы для работы с фотографиями
export const photoApi = {
  // Загрузка множества фотографий
  upload: async (photos: PhotoUploadRequest[]): Promise<ApiResponse<Photo[]>> => {
    try {
      const response = await api.post('/photos', { photos });

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при загрузке фотографий' };
    }
  },

  // Получение фотографий по ID группы
  getByGroup: async (groupId: number): Promise<ApiResponse<Photo[]>> => {
    try {
      const response = await api.get(`/photos/group/${groupId}`);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при получении фотографий' };
    }
  },

  // Получение всех превью фотографий с информацией о группах
  getPreviewPhotos: async (): Promise<ApiResponse<Photo[]>> => {
    try {
      const response = await api.get('/photos/preview');

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при получении превью фотографий' };
    }
  },

  // Обновление фотографии
  update: async (id: number, data: PhotoUpdateRequest): Promise<ApiResponse<Photo>> => {
    try {
      const response = await api.put(`/photos/${id}`, data);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при обновлении фотографии' };
    }
  },

  // Установка фотографии как превью
  setPreview: async (photoId: number): Promise<ApiResponse<Photo>> => {
    try {
      const response = await api.put(`/photos/${photoId}/preview`);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при установке превью' };
    }
  },

  // Удаление фотографии
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/photos/${id}`);

      return response.data;
    } catch (error) {
      return { error: 'Ошибка при удалении фотографии' };
    }
  },
};

// Методы для аутентификации
export const authApi = {
  // Вход в систему
  login: async (username: string, password: string): Promise<ApiResponse<{ token: string }>> => {
    try {
      const response = await api.post('/auth/login', { username, password });

      return { data: { token: response.data.token } };
    } catch {
      return { error: 'Ошибка при входе в систему' };
    }
  },
};
