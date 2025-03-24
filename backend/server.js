require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

const SECRET_KEY = process.env.SECRET_KEY || 'development-secret-key';
const TOKEN_EXPIRES_IN = '1h';

let users = [];

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, SECRET_KEY);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
  } else {
    res.status(401).json({ error: 'Требуется авторизация' });
  }
};

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name, email, password: hashedPassword };
    users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN });

    res.status(201).json({ message: 'Регистрация прошла успешно!', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN });

    res.json({ message: 'Авторизация успешна!', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/protected', authenticateJWT, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  // Создайте данные, которые будут отправлены в ответ
  const secretData = {
    timestamp: Date.now(),
    info: 'Это защищенная информация, доступная только авторизованным пользователям.'
  };

  res.json({
    message: 'Доступ к защищенным данным разрешен',
    secretData,  // Убедитесь, что эти данные возвращаются
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});