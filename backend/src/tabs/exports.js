import express from 'express';
import ExcelJS from 'exceljs';

const router = express.Router();

router.post('/xlsx', async (req,res)=>{
  const { rows = [], sheetName='Datos' } = req.body;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  if(rows.length){
    ws.columns = Object.keys(rows[0]).map(h=>({ header:h, key:h }));
    rows.forEach(r => ws.addRow(r));
  }
  const buf = await wb.xlsx.writeBuffer();
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="export.xlsx"');
  res.send(Buffer.from(buf));
});

export default router;
