import express from "express";
import cors from "cors";
import { createAdminUser } from "./controllers/authController";
import { authenticate, isAdmin } from "./middleware/auth";
import { testConnection } from "./config/database";
import { runMigrations } from "./config/migrations";
import sequelize from "./config/database";
import routes from "./routes";
import { setupAssociations } from "./models/associations";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Увеличиваем лимит для base64 данных

// Routes
app.use("/api", routes);

// Инициализация приложения
const startServer = async () => {
  try {
    // Проверка подключения к базе данных
    await testConnection();

    // Устанавливаем ассоциации
    setupAssociations();

    // Синхронизация моделей с базой данных
    await sequelize.sync({ alter: true,force: true });

    // Запуск миграций
    await runMigrations(sequelize);

    // Создание администратора при первом запуске
    await createAdminUser();

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера:", error);
    process.exit(1);
  }
};

startServer();
