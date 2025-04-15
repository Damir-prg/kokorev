import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input } from '@heroui/react';

import { authApi } from '../../api/api';

export const LoginForm: FC = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login(credentials.username, credentials.password);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('Ошибка авторизации: отсутствуют данные');
      }

      // Сохраняем токен
      localStorage.setItem('token', response.data.token);
      // Перенаправляем на страницу управления фотографиями
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  return (
    <section className="flex items-center justify-center">
      <Form
        className="flex flex-col items-center justify-center max-w-full sm:max-w-1/3 bg-default-700/10 rounded-lg border border-white/20 p-4 gap-4"
        onSubmit={handleSubmit}
      >
        <h3 className="text-xl sm:text-3xl text-center">Вход в панель администратора</h3>
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        <Input
          aria-label="login"
          label="Имя администратора"
          placeholder="Тут надо писать букавы"
          size="lg"
          type="text"
          value={credentials.username}
          variant="underlined"
          onChange={e => setCredentials({ ...credentials, username: e.target.value })}
        />
        <Input
          aria-label="login"
          label="Пароль"
          placeholder="Очень секретный пароль"
          size="lg"
          type="password"
          value={credentials.password}
          variant="underlined"
          onChange={e => setCredentials({ ...credentials, password: e.target.value })}
        />

        <Button className="w-full" color="secondary" size="lg" type="submit">
          Войти
        </Button>
      </Form>
    </section>
  );
};
