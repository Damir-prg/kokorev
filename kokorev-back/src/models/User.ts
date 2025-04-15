import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Интерфейс для модели пользователя
interface UserAttributes {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
}

// Интерфейс для создания пользователя
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Модель пользователя
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public isAdmin!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User; 