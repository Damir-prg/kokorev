import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Интерфейс для модели фотографии
interface PhotoAttributes {
  id: number;
  filename: string;
  base64Data: string;
  groupId: number;
  uploadedBy: number;
  isPreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для создания фотографии
interface PhotoCreationAttributes extends Optional<PhotoAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Модель фотографии
class Photo extends Model<PhotoAttributes, PhotoCreationAttributes> implements PhotoAttributes {
  public id!: number;
  public filename!: string;
  public base64Data!: string;
  public groupId!: number;
  public uploadedBy!: number;
  public isPreview!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Ассоциации будут добавлены через setupAssociations
  public group?: any;
}

Photo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    base64Data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    isPreview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Photo',
    tableName: 'photos',
  }
);

export default Photo; 