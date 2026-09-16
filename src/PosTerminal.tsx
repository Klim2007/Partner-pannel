import {useEffect,useRef,useState} from 'react';
import {LogOut} from 'lucide-react';
import BankNavigation from './BankNavigation';
import {api} from './api';
import './pos-terminal.css';
import PosApplication from './PosApplication';

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
 const [applicationOpen,setApplicationOpen]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{api.session().then(()=>setReady(true)).catch(()=>setError('Не удалось загрузить страницу. Повторите вход.'));},[]);
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
    <div><h1 id="pos-title">Эквайринг</h1><h2>Эквайринг по обслуживанию карт «Мир»</h2><p>Услуга для торговых точек (магазинов, киосков, автозаправок, супермаркетов), для проведения расчетов в безналичной форме с банковской карты клиента через – POS-терминал.</p><button className="pos-connect" onClick={()=>setApplicationOpen(true)}>Подключить POS Терминал</button></div>
   </section>
   <section className="pos-section" aria-labelledby="pos-benefits"><h2 id="pos-benefits">Возможности:</h2><p>Получайте деньги на расчетный счет вашей организации – срок поступления до 3-х рабочих дней после дня проведения операции.</p><ul>{benefits.map(text=><li key={text}>{text}</li>)}</ul></section>
   <section className="pos-section" aria-labelledby="pos-steps"><h2 id="pos-steps">Как подключить</h2><ul>{steps.map(text=><li key={text}>{text}</li>)}</ul></section>
   <button className="pos-documents" onClick={()=>notify('Пакет документов пока не добавлен в локальную версию.')}>Пакет документов</button>
   <section className="pos-section pos-contracts" aria-labelledby="pos-contracts"><h2 id="pos-contracts">Типовые формы договоров</h2><div>{contracts.map(text=><p key={text}>{text}</p>)}</div></section>
   </div><aside className="pos-visual" aria-label="POS-терминал"><picture><source srcSet="/images/pos-touchscreen.webp" type="image/webp"/><img className="pos-terminal-image" src="/images/pos-touchscreen.png" alt="Современный POS-терминал с сенсорным экраном без кнопочной клавиатуры" width="900" height="600"/></picture></aside></div>
  </main>
  {applicationOpen&&<PosApplication onClose={()=>setApplicationOpen(false)} onSend={()=>{setApplicationOpen(false);notify('Ваша заявка принята в работу. Демонстрационный режим — в банк не отправлено.')}}/>}
  <dialog ref={dialog} className="pos-notification" aria-labelledby="pos-notification-text"><p id="pos-notification-text">{message}</p><form method="dialog"><button autoFocus>Понятно</button></form></dialog>
 </div>;
}
