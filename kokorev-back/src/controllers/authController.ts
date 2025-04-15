import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Контроллер для входа в систему
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль" });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } as jwt.SignOptions
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Ошибка при входе в систему:", error);
    res.status(500).json({ message: "Ошибка при входе в систему" });
  }
};

// Функция для создания администратора (выполняется один раз при первом запуске)
export const createAdminUser = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await User.findOne({
      where: { username: adminUsername },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        username: adminUsername,
        password: hashedPassword,
        isAdmin: true,
      });

      console.log("Администратор успешно создан");
    }
  } catch (error) {
    console.error("Ошибка при создании администратора:", error);
  }
};
