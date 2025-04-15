import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Photo from './Photo';

// Интерфейс для модели группы
interface GroupAttributes {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Интерфейс для создания группы
interface GroupCreationAttributes extends Optional<GroupAttributes, 'id'> {}

// Модель группы
class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
  public id!: number;
  public title!: string;
  public subtitle?: string;
  public description?: string;
  public isPublished!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Ассоциации будут добавлены через setupAssociations
  public photos?: Photo[];
}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
  }
);

export default Group; 