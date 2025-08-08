import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const EXPENSES = []; // demo storage

router.get('/', (req,res)=> res.json(EXPENSES));

router.post('/', (req,res)=>{
  const { fecha, descripcion, monto } = req.body;
  const e = { id: uuidv4(), fecha, descripcion, monto: Number(monto) };
  EXPENSES.push(e);
  res.json(e);
});

export default router;
