import Group from './Group';
import Photo from './Photo';

// Определяем связи между моделями
export const setupAssociations = () => {
  // Группа имеет много фотографий
  Group.hasMany(Photo, {
    foreignKey: 'groupId',
    as: 'photos',
  });

  // Фотография принадлежит группе
  Photo.belongsTo(Group, {
    foreignKey: 'groupId',
    as: 'group',
  });

  return { Group, Photo };
}; 