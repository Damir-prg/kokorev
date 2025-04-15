import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Обновляем таблицу photos
  await queryInterface.changeColumn('photos', 'base64Data', {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  });

  // Обновляем таблицу groups
  await queryInterface.changeColumn('groups', 'description', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  // Добавляем индекс для оптимизации поиска превью
  await queryInterface.addIndex('photos', ['groupId', 'isPreview'], {
    name: 'photos_group_preview_idx',
  });

  // Добавляем поле subtitle
  await queryInterface.addColumn('groups', 'subtitle', {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Удаляем индекс
  await queryInterface.removeIndex('photos', 'photos_group_preview_idx');

  // Возвращаем описание к обязательному полю
  await queryInterface.changeColumn('groups', 'description', {
    type: DataTypes.STRING,
    allowNull: false,
  });

  // Возвращаем тип base64Data к обычному TEXT
  await queryInterface.changeColumn('photos', 'base64Data', {
    type: DataTypes.TEXT,
    allowNull: false,
  });

  // Удаляем поле subtitle
  await queryInterface.removeColumn('groups', 'subtitle');
} 