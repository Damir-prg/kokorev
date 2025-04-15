import { Sequelize } from 'sequelize';
import { up, down } from '../migrations/20240318-update-group-description-type';

export const runMigrations = async (sequelize: Sequelize) => {
  try {
    // Запуск миграции
    await up(sequelize.getQueryInterface());
    console.log('Миграции успешно выполнены');
  } catch (error) {
    console.error('Ошибка при выполнении миграций:', error);
    // В случае ошибки откатываем изменения
    await down(sequelize.getQueryInterface());
    throw error;
  }
}; 