import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { initDb } from './db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const dbPromise = initDb();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_PATH = path.resolve(__dirname, 'api-cache.json');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const db = await dbPromise;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await dbPromise;

  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  req.session.userId = user.id;
  res.json({ success: true });
});

// PROFILE (protected)
app.get('/profile', requireAuth, async (req, res) => {
  const db = await dbPromise;
  const user = await db.get('SELECT email FROM users WHERE id = ?', [req.session.userId]);
  res.json({ user });
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});


const cache = new Map();

// CACHE
app.get('/data', requireAuth, async (req, res) => {
  try {
    // Пытаемся прочитать кэш
    const fileContent = await fs.readFile(CACHE_PATH, 'utf-8');
    const cache = JSON.parse(fileContent);

    // Проверяем актуальность данных
    if (Date.now() - cache.timestamp < 60000) {
      return res.json(cache.data);
    }
  } catch (error) {
    // Игнорируем ошибку если файл не найден
    if (error.code !== 'ENOENT') {
      console.error('Cache read error:', error);
    }
  }

  // Генерируем новые данные
  const newData = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    randomValue: Math.floor(Math.random() * 1000),
    status: 'active'
  };

  // Сохраняем в кэш
  try {
    await fs.writeFile(
        CACHE_PATH,
        JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }),
        'utf-8'
    );
  } catch (error) {
    console.error('Cache write error:', error);
  }

  res.json(newData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});