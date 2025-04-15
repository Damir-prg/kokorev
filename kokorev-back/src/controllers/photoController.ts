import { Request, Response } from 'express';
import Photo from '../models/Photo';
import Group from '../models/Group';
import { ApiResponse } from '../types/api';

// Контроллер для загрузки множества фотографий
export const uploadPhotos = async (req: Request, res: Response) => {
  try {
    const { photos } = req.body;

    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ message: 'Необходимо отправить массив фотографий' });
    }

    // Проверяем, есть ли уже превью в группе
    const groupId = photos[0].groupId;
    const existingPreview = await Photo.findOne({ 
      where: { 
        groupId,
        isPreview: true 
      } 
    });
    const hasPreview = existingPreview !== null;

    const uploadedPhotos = await Promise.all(
      photos.map(async (photoData, index) => {
        const { filename, base64Data, groupId } = photoData;

        if (!filename || !base64Data || !groupId) {
          throw new Error('Необходимо указать filename, base64Data и groupId для каждой фотографии');
        }

        // Проверяем, что это изображение
        if (!base64Data.startsWith('data:image/')) {
          throw new Error('Неверный формат данных. Ожидается изображение');
        }

        // Проверяем существование группы
        const group = await Group.findByPk(groupId);
        if (!group) {
          throw new Error('Группа не найдена');
        }

        return Photo.create({
          filename,
          base64Data,
          groupId: parseInt(groupId),
          uploadedBy: req.user!.id,
          isPreview: !hasPreview && index === 0, // Устанавливаем превью только если в группе нет превью и это первая фотография в загрузке
        });
      })
    );

    res.status(201).json({
      message: 'Фотографии успешно загружены',
      photos: uploadedPhotos.map(photo => ({
        id: photo.id,
        filename: photo.filename,
        base64Data: photo.base64Data,
        groupId: photo.groupId,
        isPreview: photo.isPreview,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt
      }))
    });
  } catch (error) {
    console.error('Ошибка при загрузке фотографий:', error);
    res.status(500).json({ message: 'Ошибка при загрузке фотографий' });
  }
};

// Контроллер для установки фотографии как превью
export const setPreviewPhoto = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;

    const photo = await Photo.findByPk(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Фотография не найдена' });
    }

    // Снимаем флаг превью со всех фотографий в группе
    await Photo.update(
      { isPreview: false },
      { where: { groupId: photo.groupId } }
    );

    // Устанавливаем флаг превью для выбранной фотографии
    await photo.update({ isPreview: true });

    res.json({ message: 'Фотография успешно установлена как превью' });
  } catch (error) {
    console.error('Ошибка при установке превью:', error);
    res.status(500).json({ message: 'Ошибка при установке превью' });
  }
};

// Контроллер для получения всех превью фотографий с информацией о группах
export const getAllPreviewPhotos = async (req: Request, res: Response) => {
  try {
    const previewPhotos = await Photo.findAll({
      where: { isPreview: true },
      include: [{
        model: Group,
        as: 'group',
        where: { isPublished: true },
        attributes: ['id', 'title', 'subtitle', 'description'],
      }],
      attributes: ['id', 'filename', 'base64Data', 'groupId'],
    });

    res.json(previewPhotos || []);
  } catch (error) {
    console.error('Ошибка при получении превью фотографий:', error);
    res.status(500).json({ message: 'Ошибка при получении превью фотографий' });
  }
};

// Контроллер для получения фотографий по ID группы
export const getPhotosByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const photos = await Photo.findAll({
      where: { groupId: parseInt(groupId) },
      attributes: ['id', 'filename', 'base64Data', 'groupId', 'isPreview'],
      order: [['isPreview', 'DESC']], // Сначала превью, потом остальные
    });

    res.json(photos || []);
  } catch (error) {
    console.error('Ошибка при получении фотографий:', error);
    res.status(500).json({ message: 'Ошибка при получении фотографий' });
  }
};

// Контроллер для удаления фотографии
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const photo = await Photo.findByPk(id);
    if (!photo) {
      return res.status(404).json({ message: 'Фотография не найдена' });
    }

    const isPreview = photo.isPreview;
    await photo.destroy();

    // Если удалили превью, устанавливаем новое превью из оставшихся фотографий
    if (isPreview) {
      const newPreview = await Photo.findOne({
        where: { groupId: photo.groupId },
        order: [['createdAt', 'ASC']],
      });

      if (newPreview) {
        await newPreview.update({ isPreview: true });
      }
    }

    res.json({ message: 'Фотография успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении фотографии:', error);
    res.status(500).json({ message: 'Ошибка при удалении фотографии' });
  }
};

export const photoController = {
  // Загрузить фотографию
  async upload(req: Request, res: Response) {
    try {
      const { groupId, base64Data, filename } = req.body;
      const uploadedBy = req.user?.id; // Получаем ID пользователя из аутентификации

      if (!groupId || !base64Data || !filename || !uploadedBy) {
        return res.status(400).json({ error: 'groupId, base64Data, filename и uploadedBy обязательны' } as ApiResponse<null>);
      }

      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Группа не найдена' } as ApiResponse<null>);
      }

      // Проверяем, есть ли уже фотографии в группе
      const existingPhotos = await Photo.count({ where: { groupId } });
      
      // Если это первая фотография в группе, автоматически делаем её превью
      const isPreview = existingPhotos === 0;

      const photo = await Photo.create({
        groupId,
        base64Data,
        filename,
        uploadedBy,
        isPreview,
      });

      res.status(201).json({ data: photo } as ApiResponse<Photo>);
    } catch (error) {
      console.error('Ошибка при загрузке фотографии:', error);
      res.status(500).json({ error: 'Ошибка при загрузке фотографии' } as ApiResponse<null>);
    }
  },

  // Получить фотографии группы
  async getByGroup(req: Request, res: Response) {
    try {
      const photos = await Photo.findAll({
        where: { groupId: req.params.groupId },
        include: [
          {
            model: Group,
            as: 'group',
          },
        ],
        order: [['isPreview', 'DESC'], ['createdAt', 'ASC']], // Сначала превью, потом по дате создания
      });

      res.json({ data: photos || [] } as ApiResponse<Photo[]>);
    } catch (error) {
      console.error('Ошибка при получении фотографий:', error);
      res.status(500).json({ error: 'Ошибка при получении фотографий' } as ApiResponse<null>);
    }
  },

  // Получить превью фотографии всех групп
  async getPreviewPhotos(req: Request, res: Response) {
    try {
      const photos = await Photo.findAll({
        where: { isPreview: true },
        include: [
          {
            model: Group,
            as: 'group',
          },
        ],
      });

      res.json({ data: photos || [] } as ApiResponse<Photo[]>);
    } catch (error) {
      console.error('Ошибка при получении превью фотографий:', error);
      res.status(500).json({ error: 'Ошибка при получении превью фотографий' } as ApiResponse<null>);
    }
  },

  // Установить фотографию как превью
  async setPreview(req: Request, res: Response) {
    try {
      const photo = await Photo.findByPk(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: 'Фотография не найдена' } as ApiResponse<null>);
      }

      // Снимаем превью со всех фотографий группы
      await Photo.update(
        { isPreview: false },
        { where: { groupId: photo.groupId } }
      );

      // Устанавливаем новое превью
      await photo.update({ isPreview: true });

      res.json({ data: photo } as ApiResponse<Photo>);
    } catch (error) {
      console.error('Ошибка при установке превью:', error);
      res.status(500).json({ error: 'Ошибка при установке превью' } as ApiResponse<null>);
    }
  },

  // Удалить фотографию
  async delete(req: Request, res: Response) {
    try {
      const photo = await Photo.findByPk(req.params.id);
      if (!photo) {
        return res.status(404).json({ error: 'Фотография не найдена' } as ApiResponse<null>);
      }

      const isPreview = photo.isPreview;
      await photo.destroy();

      // Если удалили превью, устанавливаем новое превью (первую фотографию в группе)
      if (isPreview) {
        const newPreview = await Photo.findOne({
          where: { groupId: photo.groupId },
          order: [['createdAt', 'ASC']], // Берем самую старую фотографию
        });

        if (newPreview) {
          await newPreview.update({ isPreview: true });
        }
      }

      res.json({ message: 'Фотография успешно удалена' } as ApiResponse<null>);
    } catch (error) {
      console.error('Ошибка при удалении фотографии:', error);
      res.status(500).json({ error: 'Ошибка при удалении фотографии' } as ApiResponse<null>);
    }
  },

  // Обновление фотографии
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { filename, isPreview } = req.body;

      const photo = await Photo.findByPk(id);
      if (!photo) {
        return res.status(404).json({ error: 'Фотография не найдена' } as ApiResponse<null>);
      }

      // Если устанавливаем превью, снимаем флаг со всех фотографий группы
      if (isPreview) {
        await Photo.update(
          { isPreview: false },
          { where: { groupId: photo.groupId } }
        );
      }

      // Обновляем фотографию
      await photo.update({
        filename: filename || photo.filename,
        isPreview: isPreview !== undefined ? isPreview : photo.isPreview,
      });

      res.json({ data: photo } as ApiResponse<Photo>);
    } catch (error) {
      console.error('Ошибка при обновлении фотографии:', error);
      res.status(500).json({ error: 'Ошибка при обновлении фотографии' } as ApiResponse<null>);
    }
  },
}; 