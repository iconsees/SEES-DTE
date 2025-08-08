import express from 'express';
const router = express.Router();

// Demo-only list
const USERS = [];

router.get('/', (req,res)=>{
  res.json(USERS.map(({passwordHash, ...u})=>u));
});

export default router;
