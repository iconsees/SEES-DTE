import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import auth from './routes/auth.js';
import users from './routes/users.js';
import dte from './routes/dte.js';
import expenses from './routes/expenses.js';
import exportsApi from './routes/exports.js';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit:'1mb' }));

const limiter = rateLimit({ windowMs: 15*60*1000, max: 500 });
app.use(limiter);

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/dte', dte);
app.use('/api/expenses', expenses);
app.use('/api/exports', exportsApi);

app.get('/api/health', (_,res)=>res.json({ ok:true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`SEES-DTE API running on :${PORT}`));
