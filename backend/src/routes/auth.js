import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Demo-only memory store (reemplazar por DB)
const USERS = [];

router.post('/register', async (req,res)=>{
  const { firstName, lastName, email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error:'Faltan datos' });
  if(USERS.find(u=>u.email===email)) return res.status(400).json({ error:'Ya existe' });
  const hash = await bcrypt.hash(password, 10);
  USERS.push({ id: String(Date.now()), firstName, lastName, email, passwordHash: hash, role:'admin' });
  res.json({ ok:true });
});

router.post('/login', async (req,res)=>{
  const { email, password, demoKey } = req.body;
  if(process.env.DEMO_KEY && demoKey !== process.env.DEMO_KEY) {
    return res.status(401).json({ error:'Clave demo inválida' });
  }
  const u = USERS.find(x=>x.email===email);
  if(!u) return res.status(401).json({ error:'Credenciales' });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if(!ok) return res.status(401).json({ error:'Credenciales' });
  const token = jwt.sign({ sub: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn:'8h' });
  res.json({ token, user:{ id:u.id, firstName:u.firstName, lastName:u.lastName, email:u.email, role:u.role } });
});

export default router;
