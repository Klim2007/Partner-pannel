import {useEffect,useState} from 'react';
import {api,type PosApplication} from './api';

export default function MyApplications({product,revision=0}:{product:string;revision?:number}){
 const [items,setItems]=useState<PosApplication[]>([]);
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(true);
 async function refresh(){
  setLoading(true);setError('');
  try{setItems((await api.applications()).filter(item=>item.product===product))}
  catch(e){setError(e instanceof Error?e.message:'Не удалось загрузить заявки')}
  finally{setLoading(false)}
 }
 useEffect(()=>{void refresh()},[product,revision]);
 return <section className="my-applications" aria-labelledby="my-applications-title">
  <div className="my-applications-heading"><h2 id="my-applications-title">Мои заявки</h2><button onClick={refresh} disabled={loading} aria-label="Обновить заявки">Обновить</button></div>
  {error&&<p role="alert">{error}</p>}
  {loading?<p role="status">Загрузка…</p>:items.length===0?<p className="my-applications-empty">Поданные заявления появятся здесь.</p>:<ul>{items.map(item=>{const pdf=api.applicationPdf(item.id);return <li key={item.id}><div><strong>{item.product}</strong><span>{item.id} · {new Date(item.createdAt).toLocaleDateString('ru-RU')}</span><em>{item.status}</em></div><div className="application-actions"><a href={pdf} target="_blank" rel="noopener noreferrer">PDF</a><button onClick={()=>window.open(pdf,'_blank','noopener,noreferrer')}>Печать</button></div></li>})}</ul>}
 </section>;
}
