import express from 'express';
import XLSX from 'xlsx';

const router = express.Router();

router.post('/csv', (req,res)=>{
  const { rows } = req.body; // array de objetos
  const header = Object.keys(rows?.[0] || {});
  const csv = [header.join(',')].concat(rows.map(r=>header.map(h=>JSON.stringify(r[h]??'')).join(','))).join('\n');
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename="export.csv"');
  res.send(csv);
});

router.post('/xlsx', (req,res)=>{
  const { rows, sheetName='Datos' } = req.body;
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows || []);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const out = XLSX.write(wb, { type:'buffer', bookType:'xlsx' });
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="export.xlsx"');
  res.send(out);
});

export default router;
