// Типы для групп
export interface Group {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  photos?: Photo[];
  createdAt: string;
  updatedAt: string;
  isPublished?: boolean;
}

export interface GroupCreateRequest {
  title: string;
  subtitle?: string;
  description?: string;
  isPublished?: boolean;
}

export interface GroupUpdateRequest {
  title?: string;
  subtitle?: string;
  description?: string;
  isPublished?: boolean;
}

// Типы для фотографий
export interface Photo {
  id: number;
  filename: string;
  base64Data: string;
  groupId: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PreviewPhoto extends Photo {
  group: {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
  };
}

export interface PhotoUploadRequest {
  filename: string;
  base64Data: string;
  groupId: number;
}

export interface PhotoUpdateRequest {
  filename?: string;
  isPreview?: boolean;
}

// Типы для ответов API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
