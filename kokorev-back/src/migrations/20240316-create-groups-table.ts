import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('groups', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Добавляем внешний ключ в таблицу photos
  await queryInterface.addConstraint('photos', {
    fields: ['groupId'],
    type: 'foreign key',
    name: 'photos_groupId_fkey',
    references: {
      table: 'groups',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Удаляем внешний ключ из таблицы photos
  await queryInterface.removeConstraint('photos', 'photos_groupId_fkey');
  
  // Удаляем таблицу groups
  await queryInterface.dropTable('groups');
} 