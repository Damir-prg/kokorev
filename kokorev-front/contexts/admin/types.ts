export interface PhotoGroup {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  groupId: string;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContextType {
  groups: PhotoGroup[];
  selectedGroup: PhotoGroup | null;
  loading: {
    groups: boolean;
    photos: boolean;
    group: boolean;
  };
  error: string | null;
  fetchGroups: () => Promise<void>;
  fetchGroup: (id: string) => Promise<PhotoGroup | null>;
  setGroups: (groups: PhotoGroup[] | ((prev: PhotoGroup[]) => PhotoGroup[])) => void;
  updateGroup: (id: string, data: Partial<PhotoGroup>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  addGroup: (data: Omit<PhotoGroup, 'id'>) => Promise<void>;
  addPhoto: (
    groupId: string,
    photo: Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updatePhoto: (groupId: string, photoId: string, data: Partial<Photo>) => Promise<void>;
  deletePhoto: (groupId: string, photoId: string) => Promise<void>;
  setPhotoAsPreview: (groupId: string, photoId: string) => Promise<void>;
  selectGroup: (group: PhotoGroup | null) => void;
}
