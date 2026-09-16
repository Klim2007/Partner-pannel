import {useEffect,useRef,useState} from 'react';
import {LogOut} from 'lucide-react';
import BankNavigation from './BankNavigation';
import {api} from './api';
import './pos-terminal.css';
import PosApplication from './PosApplication';

const reasons=[
 'Возможность принимать безналичные платежи всеми основными способами;',
 'Повышение лояльности клиентов за счёт быстрой и удобной оплаты покупок на вашем сайте в момент оформления заказа;',
 'Увеличение среднего чека и рост выручки;',
 'Минимизация риска отказа от товара благодаря оплате при оформлении покупки;',
 'Удобный контроль и анализ движения средств в каждый момент времени;',
 'Безопасность платежей благодаря протоколу 3D-Secure.',
];
const advantages=[
 'Удобная тестовая площадка;',
 'Доступные API (открытая библиотека сервисов);',
 'Приём платежей онлайн 24/7;',
 'Личный кабинет с удобным интерфейсом;',
 'Простота и удобство платёжного интерфейса;',
 'Аналитика платежей;',
 'Техническая поддержка 24/7.',
];
const contracts=[
 'Заявление о присоединении к типовой форме Договора о предоставлении услуг Интернет-эквайринга ДО АО Банк ВТБ (Казахстан) (на условиях присоединения)',
 'Договор о предоставлении услуг Интернет-эквайринга ДО АО Банк ВТБ (Казахстан) (на условиях присоединения)',
];

export default function InternetAcquiring(){
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
   <BankNavigation current="internet"/>
   {error&&<p role="alert">{error}</p>}
   <div className="pos-layout"><div className="pos-copy">
   <section className="pos-hero" aria-labelledby="ia-title">
    <div><h1 id="ia-title">Интернет-эквайринг</h1><h2>Для юридических лиц и индивидуальных предпринимателей</h2><p>Принимайте безналичную оплату товаров и услуг по картам платёжной системы «Мир» на сайтах, в приложениях или мессенджерах.</p><button className="pos-connect" onClick={()=>setApplicationOpen(true)}>Подключить интернет-эквайринг</button></div>
   </section>
   <section className="pos-section" aria-labelledby="ia-reasons"><h2 id="ia-reasons">Зачем вам интернет-эквайринг?</h2><ul>{reasons.map(text=><li key={text}>{text}</li>)}</ul></section>
   <section className="pos-section" aria-labelledby="ia-advantages"><h2 id="ia-advantages">Основные преимущества</h2><ul>{advantages.map(text=><li key={text}>{text}</li>)}</ul></section>
   <button className="pos-documents" onClick={()=>notify('Пакет документов пока не добавлен в локальную версию.')}>Пакет документов</button>
   <section className="pos-section pos-contracts" aria-labelledby="ia-contracts"><h2 id="ia-contracts">Типовые формы договоров</h2><div>{contracts.map(text=><p key={text}>{text}</p>)}</div></section>
   </div><aside className="pos-visual" aria-label="Интернет-эквайринг"><picture><source srcSet="/images/internet-acquiring.webp" type="image/webp"/><img className="pos-terminal-image" src="/images/internet-acquiring.png" alt="Ноутбук с онлайн-покупками: корзина супермаркета на экране и банковская карта" width="900" height="600"/></picture></aside></div>
  </main>
  {applicationOpen&&<PosApplication title="Заявка на подключение интернет-эквайринга" onClose={()=>setApplicationOpen(false)} onSend={()=>{setApplicationOpen(false);notify('Ваша заявка принята в работу. Демонстрационный режим — в банк не отправлено.')}}/>}
  <dialog ref={dialog} className="pos-notification" aria-labelledby="ia-notification-text"><p id="ia-notification-text">{message}</p><form method="dialog"><button autoFocus>Понятно</button></form></dialog>
 </div>;
}
