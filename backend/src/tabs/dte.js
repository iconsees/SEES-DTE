import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const DTEs = [];

router.get('/', (req,res)=> res.json(DTEs));

router.post('/schedule', (req,res)=>{
  const { cliente, monto, diaMes, tipo, descripcion } = req.body;
  const item = { id: uuidv4(), cliente, monto:Number(monto), diaMes, tipo, descripcion, estado:'programado', pagado:false, creado:new Date().toISOString() };
  DTEs.unshift(item);
  res.json(item);
});

router.put('/:id/pagado', (req,res)=>{
  const d = DTEs.find(x=>x.id===req.params.id);
  if(!d) return res.status(404).json({ error:'No encontrado' });
  d.pagado = !!req.body.pagado;
  res.json(d);
});

export default router;
