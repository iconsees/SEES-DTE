import React, { useEffect, useState } from 'react'

const styles = { c:'#1366C2', bg:'#F5F7FA', text:'#2C3E50', dark:'#083E8C', card:{ background:'#fff', border:'1px solid #E6EEF9', borderRadius:12, padding:16, marginBottom:12 } }

async function api(path, opts){ const res = await fetch(`/api${path}`, opts); if(!res.ok) throw new Error('API error'); return res.json(); }

export default function App(){
  const [dtes,setDtes]=useState([])
  const [exps,setExps]=useState([])
  const [form,setForm]=useState({ cliente:'', monto:'', diaMes:1, tipo:'Factura', descripcion:'' })
  const [gasto,setGasto]=useState({ fecha:'', descripcion:'', monto:'' })

  useEffect(()=>{ (async()=>{ try{ setDtes(await api('/dte')); setExps([]);}catch(e){ console.warn(e) } })() },[])

  const totalVentas = dtes.filter(d=>d.pagado).reduce((s,d)=>s+d.monto,0)
  const totalGastos = exps.reduce((s,e)=>s+e.monto,0)
  const utilidad = totalVentas - totalGastos

  return (
    <div style={{ fontFamily:'Montserrat, system-ui, sans-serif', background:styles.bg, color:styles.text, minHeight:'100vh', padding:16, maxWidth:1100, margin:'0 auto' }}>
      <header style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <img src="/logo-ees.svg" alt="EES" style={{ height:28 }} />
        <h1 style={{ margin:0, color:styles.dark }}>DTE</h1>
      </header>

      <section style={styles.card}>
        <h3>Resumen</h3>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          <div><b>Ventas cobradas:</b> ${totalVentas.toFixed(2)}</div>
          <div><b>Gastos:</b> ${totalGastos.toFixed(2)}</div>
          <div><b>Utilidad:</b> ${utilidad.toFixed(2)}</div>
        </div>
      </section>

      <section style={styles.card}>
        <h3>Programar DTE mensual</h3>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <input placeholder="Cliente" value={form.cliente} onChange={e=>setForm({...form, cliente:e.target.value})} />
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span>$</span>
            <input placeholder="Monto" type="number" value={form.monto} onChange={e=>setForm({...form, monto:e.target.value})} />
          </div>
          <select value={form.diaMes} onChange={e=>setForm({...form, diaMes:Number(e.target.value)})}>
            {Array.from({length:28},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          <select value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value})}>
            <option>Factura</option><option>Boleta</option>
          </select>
          <input placeholder="Descripción" value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} style={{ flex:1 }} />
          <button onClick={async()=>{
            const created = await api('/dte/schedule', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
            setDtes([created, ...dtes])
          }} style={{ background:styles.c, color:'#fff', border:'none', padding:'8px 12px', borderRadius:8 }}>Programar</button>
        </div>
      </section>

      <section style={styles.card}>
        <h3>DTEs</h3>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr><th>Cliente</th><th>Monto</th><th>Día</th><th>Tipo</th><th>Estado</th><th>Pagado</th></tr></thead>
            <tbody>
              {dtes.map(d=>(
                <tr key={d.id}>
                  <td>{d.cliente}</td>
                  <td>${d.monto.toFixed(2)}</td>
                  <td>{d.diaMes}</td>
                  <td>{d.tipo}</td>
                  <td>{d.estado}</td>
                  <td><input type="checkbox" checked={!!d.pagado} onChange={async(e)=>{
                    const upd = await api(`/dte/${d.id}/pagado`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pagado:e.target.checked })})
                    setDtes(dtes.map(x=>x.id===d.id?upd:x))
                  }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
