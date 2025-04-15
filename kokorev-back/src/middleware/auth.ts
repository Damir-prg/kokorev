import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Интерфейс для декодированного токена
interface DecodedToken {
  userId: number;
  isAdmin: boolean;
}

// Расширение интерфейса Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        isAdmin: boolean;
      };
    }
  }
}

// Middleware для проверки аутентификации
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as DecodedToken;
    
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Middleware для проверки прав администратора
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
  }
  next();
}; 