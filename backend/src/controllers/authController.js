import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByUsername } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('[AUTH] Tentativa de login:', { rawUsername: username });

    const user = await getUserByUsername(username);
    console.log('[AUTH] Resultado getUserByUsername:', {
      found: !!user,
      usernameDB: user?.username,
      role: user?.role,
    });

    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('[AUTH] Erro no login:', error);
    res.status(500).json({ message: 'Erro no login', error: error?.message || String(error) });
  }
};

import { sendWelcomeEmail } from '../config/mailer.js';

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) return res.status(400).json({ message: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, hashedPassword, 'user', email);

    // Envia e-mail de boas-vindas
    if (email) {
      try {
        await sendWelcomeEmail(email, username);
      } catch (mailError) {
        // Apenas loga o erro, não impede o cadastro
        console.error('Erro ao enviar e-mail:', mailError);
      }
    }

    res.status(201).json({ message: 'Usuário criado', user: newUser });
  } catch (error) {
    console.error('[AUTH] Erro no registro:', error);
    res.status(500).json({ message: 'Erro no registro', error: error?.message || String(error) });
  }
};
