import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Создание экземпляра Sequelize с параметрами подключения к PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false, // Отключаем логирование SQL-запросов
});

// Функция для проверки подключения к базе данных
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

export default sequelize; 