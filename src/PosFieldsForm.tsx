import {useEffect,useRef,useState} from 'react';
import {initialPts,ptsSections,validatePts,type PtsFields} from '../shared/pts';
export type {PtsFields} from '../shared/pts';
import './pos-fields.css';
export default function PosFieldsForm({onClose,onSubmit}:{onClose:()=>void;onSubmit:(d:PtsFields)=>void|Promise<void>}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [v,setV]=useState<PtsFields>(initialPts),[errors,setErrors]=useState<string[]>([]),[busy,setBusy]=useState(false);
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close()},[]);
 async function submit(){const e=validatePts(v);setErrors(e);if(e.length)return;setBusy(true);try{await onSubmit(v)}finally{setBusy(false)}}
 return <dialog ref={dialog} className="pos-fields" aria-labelledby="pf-title" onCancel={onClose}>
  <header><h2 id="pf-title">Заявление на регистрацию ПТС — Приложение №4</h2><button onClick={onClose} aria-label="Закрыть">×</button></header>
  <p className="pf-note">Проверьте и дополните данные всех разделов. Реквизиты организации заполнены демонстрационными значениями. После продолжения откроется PDF заявления.</p>
  <form onSubmit={e=>{e.preventDefault();void submit()}} className="pf-form">
   <div className="pf-grid">{ptsSections(v).map(section=><section className="pf-group" key={section.title}><h3>{section.title}</h3>{section.note&&<p>{section.note}</p>}<div className="pf-group-fields">{section.fields.map(f=><label key={f.key} className="pf-field"><span>{f.label}{f.required?' *':''}</span>{f.options?<select name={f.key} value={v[f.key]||f.options[0]} onChange={e=>setV(s=>({...s,[f.key]:e.target.value}))}>{f.options.map(o=><option key={o}>{o}</option>)}</select>:<input name={f.key} type={f.type||'text'} value={v[f.key]||''} readOnly={f.readonly} placeholder={f.readonly?'Заполняется Банком':undefined} min={f.type==='number'?0:undefined} step={f.type==='number'?(f.integer?'1':'any'):undefined} maxLength={f.max??1000} onChange={e=>setV(s=>({...s,[f.key]:e.target.value}))}/>}</label>)}</div></section>)}</div>
   <footer>{errors.length>0&&<div role="alert" className="pf-error"><strong>Проверьте данные:</strong><ul>{errors.map((e,i)=><li key={i}>{e}</li>)}</ul></div>}<div className="pf-actions"><button type="button" onClick={onClose} className="pf-cancel">Отмена</button><button disabled={busy} className="pf-submit">{busy?'Формирование…':'Продолжить к PDF'}</button></div></footer>
  </form>
 </dialog>;
}
