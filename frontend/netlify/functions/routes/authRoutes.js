import { Router } from 'express';
import bcrypt from 'bcrypt';

const router = Router();
const LOGIN_USERNAME = process.env.LOGIN_USERNAME || 'admin';
const LOGIN_PASSWORD_HASH = process.env.LOGIN_PASSWORD_HASH;

export async function login(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (username !== LOGIN_USERNAME) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  if (!LOGIN_PASSWORD_HASH) {
    return res.status(500).json({ message: 'Server auth not configured. Set LOGIN_PASSWORD_HASH in .env.' });
  }

  const passwordTrimmed = typeof password === 'string' ? password.trim() : '';
  const hashTrimmed = LOGIN_PASSWORD_HASH.trim();
  const match = await bcrypt.compare(passwordTrimmed, hashTrimmed);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ message: 'Session error.' });
    }
    req.session.user = { username };
    res.json({ ok: true, user: { username } });
  });
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error.' });
    }
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
}

export function me(req, res) {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ message: 'Not authenticated.' });
}

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);

export default router;
