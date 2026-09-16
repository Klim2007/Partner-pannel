import {useEffect,useState,type ReactNode} from 'react';
import {api} from './api';
import BankNavigation from './BankNavigation';
import './home.css';

const company='ТОО «ДЕМО КОМПАНИЯ»';
const accounts=Array.from({length:5},(_,i)=>({number:`DEMO-ACCOUNT-000${i+1}`,currency:i===3?'RUB':'KZT',kind:i===1||i===2?'Сберегательный':'Текущий',balance:['0,00','0,00','100 000,00','0,00','250 000,00'][i]}));
function Block({title,children,extra}:{title:string;children:ReactNode;extra?:ReactNode}){
 const [expanded,setExpanded]=useState(true);
 return <section className="bank-block"><header><h2>{title}</h2>{extra}<button className="bank-collapse" aria-label={`${expanded?'Свернуть':'Развернуть'}: ${title}`} aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'−':'+'}</button></header>{expanded&&children}</section>;
}
function Pages({label='показывать по:'}:{label?:string}){const [size,setSize]=useState(5);return <div className="bank-pages">{label} {[3,5,10].map(n=><button key={n} className={n===size?'selected':''} onClick={()=>setSize(n)} aria-pressed={n===size}>{n}</button>)}</div>}
export default function Home(){
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [direction,setDirection]=useState('Исходящие'),[filter,setFilter]=useState('Все'),[letters,setLetters]=useState('Входящие');
 useEffect(()=>{api.session().then(()=>setReady(true)).catch(()=>setError('Не удалось загрузить главную страницу. Повторите вход.'));},[]);
 const demo=()=>setNotice('Демонстрационная страница: банковские операции не выполняются.');
 const button=(label:string)=> <button className="bank-button" onClick={demo}>{label}</button>;
 if(!ready)return <p role="status">{error||'Загрузка…'}</p>;
 return <div className="bank-home">
  <header className="bank-top"><img src="/reference/ru/img/new/logo.png" alt="VTB"/><div className="bank-date">16 Сентября 2026<br/>Среда</div><div className="bank-company">{company}</div><button onClick={demo} aria-label="Документы">♧</button><button onClick={demo} aria-label="Настройки">⚙</button></header>
  <BankNavigation current="home" onUnavailable={demo}/>
  <main className="bank-content">
   <Block title="Новости"><div className="bank-toolbar">{button('Все новости')}<Pages label="отображать элементов:"/></div></Block>
   <Block title="Счета"><div className="bank-table-scroll"><table><thead><tr>{['№ счета','Валюта','Тип','Статус','Организация','Балансовый остаток','Актуально','Посл. опер.','Выписка'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{accounts.map((a,i)=><tr key={a.number}><td>{a.number}</td><td><span className={`bank-currency ${a.currency.toLowerCase()}`}/>{a.currency}</td><td>{a.kind}</td><td/><td>{company}</td><td className="bank-numeric">{a.balance}</td><td>16.09.2026 06:50</td><td>{i>1?'15.09.2026':''}</td><td><button className="bank-text-link" onClick={demo}>за предыдущий день</button> <button className="bank-text-link" onClick={demo}>за сегодня</button> <button className="bank-text-link" onClick={demo}>за период</button></td></tr>)}</tbody></table></div><div className="bank-toolbar">{button('Все счета')}{button('Обновить остатки')}<Pages/></div></Block>
   <Block title="Платежи"><div className="bank-tabs">{['Исходящие','Входящие'].map(t=><button key={t} className={direction===t?'active':''} onClick={()=>setDirection(t)}>{t}</button>)}</div><div className="bank-toolbar">{button('Создать')}{button('Создать по шаблону')}<span className="bank-payment-action">{button(direction==='Исходящие'?'Все исходящие платежи':'Все входящие платежи')}</span></div><div className="bank-tabs bank-status-tabs">{['Все','На подпись','Отклоненные','Исполненные','На редактирование'].map(t=><button key={t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}</button>)}</div><div className="bank-table-scroll"><table className="bank-payments"><thead><tr>{['Дата и время','№','Контрагент','Назначение','Сумма, KZT','№ счета','Статус'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{direction==='Исходящие'&&accounts.filter((_,i)=>filter==='Все'||(filter==='Исполненные'&&i>0)||(filter==='На редактирование'&&i===0)).map((a,i)=><tr key={a.number}><td>15.09.2026 14:50</td><td>{i+1}</td><td>{company}</td><td>Демонстрационный платёж</td><td className={`bank-numeric ${i===0?'bank-red':''}`}>{['500,00','100 000,00','250 000,00','50 000,00','75 000,00'][i]}</td><td>{a.number}</td><td className={i===0?'bank-red':''}>{i===0?'Ошибка реквизитов':'Исполнен'}</td></tr>)}</tbody></table></div><Pages/></Block>
   <Block title="Письма" extra={<div className="bank-tabs">{['Входящие','Исходящие'].map(t=><button key={t} className={letters===t?'active':''} onClick={()=>setLetters(t)}>{t}</button>)}</div>}><div className="bank-toolbar">{button('Написать')}</div><table className="bank-letters"><thead><tr>{['Тема / сообщение','Вложения','№','Статус','Дата'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody/></table><div className="bank-toolbar">{button('Все входящие письма')}{button('Все исходящие письма')}<Pages label="отображать элементов:"/></div></Block>
   <Block title="Прогнозные поступления"><div className="bank-forecast"/></Block>
  </main>
  {notice&&<div className="bank-notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Закрыть уведомление">×</button></div>}
 </div>;
}
