import express from 'express';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Campos obrigatórios' });
  const existe = await User.findOne({ where: { email } });
  if (existe) return res.status(400).json({ error: 'E-mail já cadastrado' });
  const hash = await bcrypt.hash(senha, 10);
  const novo = await User.create({ nome, email, senha: hash });
  res.status(201).json({ id: novo.id, nome: novo.nome, email: novo.email });
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });
  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return res.status(400).json({ error: 'Senha inválida' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
});

export default router; 