import { Request, Response } from 'express';
import Group from '../models/Group';
import Photo from '../models/Photo';
import { ApiResponse } from '../types/api';

// Создание новой группы
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Необходимо указать title' });
    }

    const group = await Group.create({
      title,
      subtitle: subtitle || '',
      description: description || '',
      isPublished: false
    });

    res.status(201).json({ 
      data: group
    } as ApiResponse<Group>);
  } catch (error) {
    console.error('Ошибка при создании группы:', error);
    res.status(500).json({ message: 'Ошибка при создании группы' });
  }
};

// Получение всех групп с их превью
export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: Photo,
        as: 'photos',
        where: { isPreview: true },
        required: false,
        attributes: ['id', 'filename', 'base64Data'],
      }],
      attributes: ['id', 'title', 'description'],
    });

    res.json({ data: groups || [] } as ApiResponse<Group[]>);
  } catch (error) {
    console.error('Ошибка при получении групп:', error);
    res.status(500).json({ error: 'Ошибка при получении групп' } as ApiResponse<null>);
  }
};

// Получение группы по ID со всеми фотографиями
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const group = await Group.findByPk(id, {
      include: [{
        model: Photo,
        as: 'photos',
        attributes: ['id', 'filename', 'base64Data', 'isPreview'],
      }],
      attributes: ['id', 'title', 'subtitle', 'description', 'isPublished'],
    });

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    res.json({ 
      data: group
    } as ApiResponse<Group>);
  } catch (error) {
    console.error('Ошибка при получении группы:', error);
    res.status(500).json({ message: 'Ошибка при получении группы' });
  }
};

// Обновление группы
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, isPublished } = req.body;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    // Обновляем только те поля, которые были переданы
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    await group.update(updateData);

    // Получаем обновленную группу
    const updatedGroup = await Group.findByPk(id);
    
    if (!updatedGroup) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    res.json({
      message: 'Группа успешно обновлена',
      group: updatedGroup
    });
  } catch (error) {
    console.error('Ошибка при обновлении группы:', error);
    res.status(500).json({ message: 'Ошибка при обновлении группы' });
  }
};

// Удаление группы и всех её фотографий
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    // Удаляем все фотографии группы
    await Photo.destroy({ where: { groupId: id } });
    
    // Удаляем саму группу
    await group.destroy();

    res.json({ message: 'Группа и все её фотографии успешно удалены' });
  } catch (error) {
    console.error('Ошибка при удалении группы:', error);
    res.status(500).json({ message: 'Ошибка при удалении группы' });
  }
};

export const groupController = {
  // Получить все группы с фотографиями
  async getAll(req: Request, res: Response) {
    try {
      const groups = await Group.findAll({
        include: [
          {
            model: Photo,
            as: 'photos',
            attributes: ['id', 'filename', 'base64Data', 'isPreview', 'createdAt', 'updatedAt'],
            order: [['isPreview', 'DESC'], ['createdAt', 'ASC']],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json({ data: groups } as ApiResponse<Group[]>);
    } catch (error) {
      console.error('Ошибка при получении групп:', error);
      res.status(500).json({ error: 'Ошибка при получении групп' } as ApiResponse<null>);
    }
  },

  // Получить группу по ID со всеми фотографиями
  async getById(req: Request, res: Response) {
    try {
      const group = await Group.findByPk(req.params.id, {
        include: [
          {
            model: Photo,
            as: 'photos',
          },
        ],
        attributes: ['id', 'title', 'subtitle', 'description', 'isPublished'],
      });

      if (!group) {
        return res.status(404).json({ error: 'Группа не найдена' } as ApiResponse<null>);
      }

      res.json({ 
        data: group
      } as ApiResponse<Group>);
    } catch (error) {
      console.error('Ошибка при получении группы:', error);
      res.status(500).json({ error: 'Ошибка при получении группы' } as ApiResponse<null>);
    }
  },

  // Создать новую группу
  async create(req: Request, res: Response) {
    try {
      const { title, subtitle, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Название группы обязательно' } as ApiResponse<null>);
      }

      const group = await Group.create({
        title,
        subtitle,
        description,
        isPublished: false
      });

      res.status(201).json({ 
        data: group
      } as ApiResponse<Group>);
    } catch (error) {
      console.error('Ошибка при создании группы:', error);
      res.status(500).json({ error: 'Ошибка при создании группы' } as ApiResponse<null>);
    }
  },

  // Обновить группу
  async update(req: Request, res: Response) {
    try {
      const { title, subtitle, description } = req.body;
      const group = await Group.findByPk(req.params.id);

      if (!group) {
        return res.status(404).json({ error: 'Группа не найдена' } as ApiResponse<null>);
      }

      if (title) group.title = title;
      if (subtitle !== undefined) group.subtitle = subtitle;
      if (description !== undefined) group.description = description;

      await group.save();

      res.json({ data: group } as ApiResponse<Group>);
    } catch (error) {
      console.error('Ошибка при обновлении группы:', error);
      res.status(500).json({ error: 'Ошибка при обновлении группы' } as ApiResponse<null>);
    }
  },

  // Удалить группу
  async delete(req: Request, res: Response) {
    try {
      const group = await Group.findByPk(req.params.id);

      if (!group) {
        return res.status(404).json({ error: 'Группа не найдена' } as ApiResponse<null>);
      }

      await group.destroy();

      res.json({ message: 'Группа успешно удалена' } as ApiResponse<null>);
    } catch (error) {
      console.error('Ошибка при удалении группы:', error);
      res.status(500).json({ error: 'Ошибка при удалении группы' } as ApiResponse<null>);
    }
  },

  async togglePublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const group = await Group.findByPk(Number(id));
      
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      group.isPublished = !group.isPublished;
      await group.save();
      
      return res.json(group);
    } catch (error) {
      console.error('Error toggling group publish status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
}; 