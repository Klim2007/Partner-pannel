import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowRight,ChevronRight,LogOut,Check,MessageCircle,Send,X,RotateCcw,Headphones,ShieldCheck,LoaderCircle} from 'lucide-react';
import {api,catalog} from './api';
import type {Service,Contact,ChatMessage,AssistantReply} from '../shared/types';

function ServiceCard({service:s}:{service:Service}) {
 const [open,setOpen]=useState(false);const [suppressed,setSuppressed]=useState(false);const ref=useRef<HTMLElement>(null);
 useEffect(()=>{const close=(event:PointerEvent)=>{if(!ref.current?.contains(event.target as Node)){setOpen(false);setSuppressed(false);}};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[]);
 return <article ref={ref} className={`service-card ${open?'is-open':''}`} onPointerEnter={e=>{if(e.pointerType==='mouse'){setSuppressed(false);setOpen(true);}}} onPointerLeave={()=>{if(!ref.current?.contains(document.activeElement)){setOpen(false);setSuppressed(false);}}} onFocus={()=>{if(!suppressed)setOpen(true)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node)){setOpen(false);setSuppressed(false);}}} onKeyDown={e=>{if(e.key==='Escape'){setSuppressed(true);setOpen(false);}}}>
  <header className="card-header"><span className="service-number">0{s.displayOrder}</span><span className="provider">{s.provider}</span></header>
  <h2>{s.name}</h2>
  <div className="visual-wrap">
   <picture><source srcSet={s.imageUrl} type="image/webp"/><img className="service-image" src={s.imageUrl.replace('.webp','.png')} alt={s.imageAlt} loading={s.displayOrder>3?'lazy':'eager'}/></picture>
   <button className="visual-trigger" aria-label={`Подробнее: ${s.name}`} aria-expanded={open} onClick={()=>{setSuppressed(false);setOpen(true)}}><span className="view-hint">Узнать больше <ArrowUpRight size={16}/></span></button>
   <div className="card-details" inert={!open} aria-hidden={!open}>
    <p className="offer">{s.offer}</p><p className="description">{s.description}</p>
    {s.benefits.length>0&&<ul>{s.benefits.map(b=><li key={b}><Check size={14}/>{b}</li>)}</ul>}
    {s.terms&&<p className="terms">{s.terms}</p>}
    {s.connectUrl&&<a className="connect-button" href={s.connectUrl} target="_blank" rel="noopener noreferrer">Подключить <ArrowUpRight size={18}/></a>}
    <button className="close-card" aria-label="Закрыть подробности" onClick={()=>{setSuppressed(true);setOpen(false);}}><X size={16}/></button>
   </div>
  </div>
 </article>;
}

function Chat(){
 const [open,setOpen]=useState(false),[value,setValue]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [messages,setMessages]=useState<(ChatMessage&{sources?:AssistantReply['sources']})[]>([]);
 const [retry,setRetry]=useState<{text:string;history:ChatMessage[]}|null>(null);
 const end=useRef<HTMLDivElement>(null),input=useRef<HTMLTextAreaElement>(null),launcher=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(open)input.current?.focus()},[open]);useEffect(()=>{end.current?.scrollIntoView({block:'nearest'});},[messages,busy,error]);
 async function send(text:string,history:ChatMessage[]=messages,isRetry=false){if(busy||!text.trim())return;setBusy(true);setError('');if(!isRetry){setMessages(m=>[...m,{role:'user',content:text}]);setValue('');}setRetry({text,history});try{const answer=await api.ask(text,history);setMessages(m=>[...m,{role:'assistant',content:answer.answer,sources:answer.sources}]);setRetry(null);}catch(e){setError(e instanceof Error?e.message:'Не удалось получить ответ');}finally{setBusy(false);}}
 function close(){setOpen(false);launcher.current?.focus()}
 return <div className="assistant">
 {open&&<section className="chat-window" role="dialog" aria-modal="false" aria-label="VTBшка — AI-помощник" onKeyDown={e=>{if(e.key==='Escape')close();}}>
  <header className="chat-header"><picture><source srcSet="/images/mascot.webp" type="image/webp"/><img src="/images/mascot.png" alt=""/></picture><div><strong>VTBшка</strong><span>Ваш AI-помощник</span></div><button onClick={close} aria-label="Закрыть чат"><X size={20}/></button></header>
  <div className="chat-messages" role="log" aria-live="polite">
   <div className="welcome"><span className="welcome-emoji">Здравствуйте!</span><p>Я VTBшка. Помогу разобраться в сервисах и найти инструкции VTB Business.</p><div className="suggestions">{['Как подключить сервис?','Где найти инструкции?'].map(q=><button key={q} disabled={busy} onClick={()=>send(q)}>{q}<ArrowUpRight size={14}/></button>)}</div></div>
   {messages.map((m,i)=><div className={`message is-${m.role}`} key={i}><p>{m.content}</p>{m.sources&&m.sources.length>0&&<div className="sources"><small>Материалы по вопросу</small>{m.sources.map(s=><a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight size={12}/></a>)}</div>}</div>)}
   {busy&&<p className="thinking"><LoaderCircle size={16}/>VTBшка готовит ответ…</p>}
   {error&&<div className="chat-error" role="alert">{error}{retry&&<button onClick={()=>send(retry.text,retry.history,true)}><RotateCcw size={14}/>Повторить</button>}</div>}<div ref={end}/>
  </div>
  <form className="chat-form" onSubmit={e=>{e.preventDefault();send(value)}}><textarea ref={input} aria-label="Вопрос VTBшке" placeholder="Задайте вопрос…" maxLength={2000} value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(value)}}}/><button disabled={busy||!value.trim()} aria-label="Отправить вопрос"><ArrowRight size={20}/></button></form>
  <p className="chat-footnote">Не отправляйте пароли и коды подтверждения</p>
 </section>}
 <button ref={launcher} className={`assistant-launcher ${open?'active':''}`} onClick={()=>setOpen(!open)} aria-label={open?'Свернуть VTBшку':'Открыть VTBшку — AI-помощника'} aria-expanded={open}><span className="assistant-label"><strong>VTBшка</strong><span>Могу помочь?</span></span><picture><source srcSet="/images/mascot.webp" type="image/webp"/><img src="/images/mascot.png" alt="Маскот VTBшка"/></picture><span className="assistant-dot"/></button>
 </div>;
}

export default function App(){
 const [services,setServices]=useState<Service[]>([]),[contacts,setContacts]=useState<Contact[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 async function load(){setLoading(true);setError('');try{await api.session();const [items,links]=await Promise.all([catalog.list(),api.contacts()]);setServices(items);setContacts(links);}catch(e){setError(e instanceof Error?e.message:'Не удалось загрузить сервисы');}finally{setLoading(false);}}
 useEffect(()=>{if(location.pathname==='/'){location.replace('/login/ru.html');return;}void load();},[]);
 async function logout(){try{await api.logout();location.assign('/login/ru.html');}catch{setError('Не удалось завершить сессию. Повторите выход.');}}
 return <div className="app-shell">
  <header className="app-header"><a className="brand" href="/panel" aria-label="VTB Business"><img src="/reference/ru/img/new/logo.png" alt="VTB"/><span>БИЗНЕС</span></a><div className="header-right"><span className="user-avatar">К</span><span className="username">klim</span><button className="logout" onClick={logout} aria-label="Выйти"><LogOut size={19}/></button></div></header>
  <main className="main-content"><div className="breadcrumb"><span>VTB Business</span><ChevronRight size={13}/><span>Продукты и услуги</span><ChevronRight size={13}/><strong>Партнёрские сервисы</strong></div>
   <section className="page-intro"><div><div className="eyebrow"><span/>БОЛЬШЕ ВОЗМОЖНОСТЕЙ ДЛЯ БИЗНЕСА</div><h1>Программы партнеров<br/>для вашего бизнеса</h1><p>Полезные сервисы для ежедневных задач и новых возможностей.</p></div><div className="intro-note"><span>Всё необходимое</span><strong>в одном месте<ArrowUpRight size={23}/></strong><small>Выбирайте. Знакомьтесь. Подключайте.</small></div></section>
   <div className="section-heading"><h2>Сервисы для вашего бизнеса <span>{services.length||6}</span></h2><span className="hover-note">Наведите на изображение, чтобы узнать условия</span></div>
   {loading?<div className="loading" role="status"><LoaderCircle/>Загружаем сервисы…</div>:error?<div className="load-error" role="alert"><p>{error}</p><button onClick={load}>Повторить загрузку</button></div>:services.length===0?<p className="loading">Сервисы пока не добавлены.</p>:<div className="services-grid">{services.map(s=><ServiceCard key={s.id} service={s}/>)}</div>}
   <section className="contact-strip"><div className="contact-description"><span className="contact-symbol"><Headphones size={25}/></span><div><h2>Быстрая связь с Банком</h2><p>Поможем с вопросами по VTB Business</p></div></div><div className="contact-actions">{contacts.map(c=><span className="contact-badge" key={c.id}>{c.id==='telegram'?<Send size={19}/>:<MessageCircle size={20}/>}<span>{c.name}</span></span>)}</div></section>
   <footer className="page-footer"><span>© VTB Kazakhstan</span><span><ShieldCheck size={15}/>Сервисы предоставляются партнёрами</span><span>VTB Business</span></footer>
  </main><Chat/>
 </div>;
}
