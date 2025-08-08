import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import auth from './tabs/auth.js';
import users from './tabs/users.js';
import dte from './tabs/dte.js';
import exportsApi from './tabs/exports.js';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 500 }));

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/dte', dte);
app.use('/api/exports', exportsApi);

app.get('/api/health', (_,res)=>res.json({ ok:true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('SEES-DTE API up on :' + PORT));
