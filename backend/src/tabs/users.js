import express from 'express';
const router = express.Router();
const USERS = [];
router.get('/', (req,res)=> res.json(USERS.map(({passwordHash, ...u})=>u)));
export default router;
