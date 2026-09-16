import {useEffect,useRef,useState} from 'react';
import './bank-navigation.css';

export default function BankNavigation({current,onUnavailable}:{current:'home'|'panel'|'pos'|'internet';onUnavailable?:()=>void}) {
 const [notice,setNotice]=useState(false);
 const [mobileOpen,setMobileOpen]=useState(false);
 const [productsOpen,setProductsOpen]=useState(false);
 const [category,setCategory]=useState<string|null>(null);
 const products=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const submenus:Record<string,string[]>={
  'Эквайринг':['Интернет-эквайринг','POS терминал'],
  'Депозиты':['Открытие депозита','Ведомость по начисленному вознаграждению','Сберегательные счета','Виды вкладов'],
 };
 useEffect(()=>{const close=(event:PointerEvent)=>{if(!products.current?.contains(event.target as Node)){setProductsOpen(false);setCategory(null)}};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[]);
 const unavailable=()=>onUnavailable?onUnavailable():setNotice(true);
 const select=()=>{setProductsOpen(false);setCategory(null);trigger.current?.focus();unavailable()};
 return <>
  <nav className={`bank-nav shared-bank-nav ${mobileOpen?'mobile-open':''}`} aria-label="Основная навигация">
   <button className="mobile-navigation-toggle" aria-expanded={mobileOpen} onClick={()=>{setMobileOpen(!mobileOpen);setProductsOpen(false);setCategory(null)}}>{mobileOpen?'Закрыть меню':'☰ Меню'}</button>
   <a href="/home" aria-current={current==='home'?'page':undefined}>ГЛАВНАЯ</a>
   {['СЧЕТА И КАРТЫ','ПЛАТЕЖНЫЕ ДОКУМЕНТЫ','ВЫПИСКИ','ВАЛЮТНЫЕ ОПЕРАЦИИ'].map(label=><button key={label} onClick={unavailable}>{label}</button>)}
   <div className="products-navigation" ref={products} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){setProductsOpen(false);setCategory(null)}}} onKeyDown={event=>{if(event.key==='Escape'){setProductsOpen(false);setCategory(null);trigger.current?.focus();event.stopPropagation()}}}>
    <button ref={trigger} className="products-trigger" aria-current={current==='pos'||current==='internet'?'true':undefined} aria-expanded={productsOpen} aria-controls="products-dropdown" onClick={()=>{setProductsOpen(!productsOpen);setCategory(null)}}>ПРОДУКТЫ И УСЛУГИ</button>
    {productsOpen&&<div id="products-dropdown" className="products-dropdown">
     {['Эквайринг','Депозиты','Банковские гарантии','Кредитные документы','Справки','Запросы на отзыв'].map((label,index)=><div className="products-row" key={label} onPointerEnter={event=>{if(event.pointerType==='mouse')setCategory(label)}}>
      <button aria-expanded={submenus[label]?category===label:undefined} aria-controls={submenus[label]?`products-submenu-${index}`:undefined} onFocus={()=>setCategory(label)} onClick={()=>submenus[label]?setCategory(label):select()}>{label}{label!=='Запросы на отзыв'&&<span aria-hidden="true">▸</span>}</button>
      {category===label&&submenus[label]&&<div id={`products-submenu-${index}`} className="products-submenu" aria-label={label}>{submenus[label].map(item=>item==='POS терминал'?<a key={item} href="/pos-terminal" aria-current={current==='pos'?'page':undefined}>{item}</a>:item==='Интернет-эквайринг'?<a key={item} href="/internet-acquiring" aria-current={current==='internet'?'page':undefined}>{item}</a>:<button key={item} onClick={select}>{item}</button>)}</div>}
     </div>)}
    </div>}
   </div>
   <button onClick={unavailable}>ПИСЬМА</button>
   <a href="/panel" aria-current={current==='panel'?'page':undefined}>ПАРТНЕРСКИЕ СЕРВИСЫ</a>
   <span>klim</span>
  </nav>
  {notice&&<div className="navigation-notice" role="status">Раздел пока доступен только в демонстрационном режиме.<button onClick={()=>setNotice(false)} aria-label="Закрыть уведомление">×</button></div>}
 </>;
}
