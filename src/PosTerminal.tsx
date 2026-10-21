import {useEffect,useRef,useState} from 'react';
import {LogOut} from 'lucide-react';
import BankNavigation from './BankNavigation';
import {api} from './api';
import './pos-terminal.css';
import PosApplication from './PosApplication';
import MyApplications from './MyApplications';
import PosFieldsForm, {type PtsFields} from './PosFieldsForm';
import type {PosApplication as PosApplicationRecord} from './api';

const benefits=[
 'Оптимальная комиссия за обслуживание;',
 'Бесплатная установка оборудования, предоставление рекламных и расходных материалов;',
 'Бесплатное обучение работников вашей организации;',
 'Сервисное обслуживание оборудования и консультация;',
 'Бесконтактные платежи с Mir Pay в одно касание.',
];
const steps=[
 'Ознакомьтесь с тарифами и условиями договора;',
 'Подайте заявку на подключение эквайринга в отделении банка;',
 'После одобрения заявки подпишите договор с банком.',
 'После заключения договора сотрудники банка установят оборудование на объекте, проведут его настройку и тестирование, обучение персонала.',
];
const contracts=[
 'Типовая форма - Договор эквайринга ДО АО Банк ВТБ (Казахстан) (без открытия банковского счета) (на условиях присоединения)',
 'Заявление 1 о присоединении к типовой форме Договора эквайринга ДО АО Банк ВТБ (Казахстан) (без открытия банковского счета) (на условиях присоединения)',
 'Типовая форма - Договор эквайринга ДО АО Банк ВТБ (Казахстан) (с открытием банковского счета) (на условиях присоединения)',
 'Заявление 1 о присоединении к типовой форме Договора эквайринга (с открытием счета)ДО АО Банк ВТБ (Казахстан) (на условиях присоединения)',
];

export default function PosTerminal(){
 const [ready,setReady]=useState(false),[error,setError]=useState('');
 const [message,setMessage]=useState('');
 const [step,setStep]=useState<'none'|'fields'|'pdf'>('none');
 const [activeApplication,setActiveApplication]=useState<PosApplicationRecord|null>(null);
 const [applications,setApplications]=useState<PosApplicationRecord[]>([]);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{api.session().then(async()=>{setApplications(await api.applications());setReady(true)}).catch(()=>setError('Не удалось загрузить страницу. Повторите вход.'));},[]);
 function notify(text:string){setMessage(text);dialog.current?.showModal()}
 async function logout(){try{await api.logout();location.assign('/login/ru.html')}catch{setError('Не удалось завершить сессию. Повторите выход.')}}
 if(!ready)return <p role="status">{error||'Загрузка…'}</p>;
 return <div className="app-shell pos-page">
  <header className="app-header"><a className="brand" href="/home" aria-label="VTB Business — главная"><img src="/reference/ru/img/new/logo.png" alt="VTB"/><span>БИЗНЕС</span></a><div className="header-right"><span className="user-avatar">К</span><span className="username">klim</span><button className="logout" onClick={logout} aria-label="Выйти"><LogOut size={19}/></button></div></header>
  <main className="main-content">
   <BankNavigation current="pos"/>
   {error&&<p role="alert">{error}</p>}
   <div className="pos-layout"><div className="pos-copy">
   <section className="pos-hero" aria-labelledby="pos-title">
    <div><h1 id="pos-title">Эквайринг</h1><h2>Эквайринг по обслуживанию карт «Мир»</h2><p>Услуга для торговых точек (магазинов, киосков, автозаправок, супермаркетов), для проведения расчетов в безналичной форме с банковской карты клиента через – POS-терминал.</p><button className="pos-connect" onClick={()=>setStep('fields')}>Подключить POS Терминал</button></div>
   </section>
   <section className="pos-section" aria-labelledby="pos-benefits"><h2 id="pos-benefits">Возможности:</h2><p>Получайте деньги на расчетный счет вашей организации – срок поступления до 3-х рабочих дней после дня проведения операции.</p><ul>{benefits.map(text=><li key={text}>{text}</li>)}</ul></section>
   <section className="pos-section" aria-labelledby="pos-steps"><h2 id="pos-steps">Как подключить</h2><ul>{steps.map(text=><li key={text}>{text}</li>)}</ul></section>
   <button className="pos-documents" onClick={()=>notify('Пакет документов пока не добавлен в локальную версию.')}>Пакет документов</button>
   <section className="pos-section pos-contracts" aria-labelledby="pos-contracts"><h2 id="pos-contracts">Типовые формы договоров</h2><div>{contracts.map(text=><p key={text}>{text}</p>)}</div></section>
   </div><aside className="pos-visual" aria-label="POS-терминал"><picture><source srcSet="/images/pos-touchscreen.webp" type="image/webp"/><img className="pos-terminal-image" src="/images/pos-touchscreen.png" alt="Современный POS-терминал с сенсорным экраном без кнопочной клавиатуры" width="900" height="600"/></picture>
    <MyApplications product="POS-терминал" revision={applications.length+applications.filter(item=>item.status==='Принята в работу').length}/>
   </aside></div>
  </main>
  {step==='fields'&&<PosFieldsForm onClose={()=>setStep('none')} onSubmit={async d=>{try{const item=await api.createApplication(d as unknown as Record<string,string>);setActiveApplication(item);setApplications(items=>[item,...items.filter(x=>x.id!==item.id)]);setStep('pdf')}catch(e){notify(e instanceof Error?e.message:'Не удалось сформировать заявление')}}}/>} 
  {step==='pdf'&&activeApplication&&<PosApplication title="ЗАЯВЛЕНИЕ НА РЕГИСТРАЦИЮ ПТС / POS-ТЕРМИНАЛА" pdfUrl={api.applicationPdf(activeApplication.id)} onClose={()=>setStep('none')} onSend={async()=>{try{const item=await api.submitApplication(activeApplication.id);setApplications(items=>items.map(x=>x.id===item.id?item:x));setStep('none');notify('Ваша заявка принята в работу. Номер заявки: '+item.id);}catch(e){notify(e instanceof Error?e.message:'Не удалось отправить заявку')}}}/>} 
  <dialog ref={dialog} className="pos-notification" aria-labelledby="pos-notification-text"><p id="pos-notification-text">{message}</p><form method="dialog"><button autoFocus>Понятно</button></form></dialog>
 </div>;
}
