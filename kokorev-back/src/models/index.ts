import { Sequelize } from 'sequelize';
import Group from './Group';
import Photo from './Photo';

// Определение ассоциаций
Group.hasMany(Photo, { foreignKey: 'groupId', as: 'photos' });
Photo.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

export { Group, Photo }; 