import {useEffect,useRef,useState} from 'react';
import './pos-application.css';

export default function PosApplication({onClose,onSend}:{onClose:()=>void;onSend:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [signed,setSigned]=useState(false);
 const [zoomed,setZoomed]=useState(false);
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close()},[]);
 return <dialog ref={dialog} className="pos-application" aria-labelledby="pos-application-title" onCancel={onClose}>
  <header><h2 id="pos-application-title">Заявка на подключение POS Терминала</h2><button aria-label="Закрыть заявку" onClick={onClose}>×</button></header>
  <p className="pos-demo-note">Демонстрационный режим. Заявка заполнена тестовыми реквизитами организации. ЭЦП и отправка в банк не подключены.</p>
  <button className="pos-document-zoom" aria-pressed={zoomed} onClick={()=>setZoomed(!zoomed)}>{zoomed?'По ширине окна':'Увеличить документ'}</button>
  <div className={`pos-application-pages ${zoomed?'document-zoomed':''}`} tabIndex={0} aria-label="Заполненная заявка, 4 страницы">{[1,2,3,4].map(page=><img key={page} src={`/documents/pos-application-page-${page}.png`} alt={`Автозаполненная заявка, страница ${page} из 4`} loading={page===1?'eager':'lazy'}/>)}</div>
  <footer><div><a href="/documents/pos-application-demo.pdf" target="_blank" rel="noopener noreferrer">Открыть заполненный PDF</a><p role="status">{signed?'Демонстрационный шаг подписи выполнен. Юридически значимая ЭЦП не создана.':'Перед отправкой выполните демонстрационный шаг подписи.'}</p></div><div className="pos-application-actions"><button onClick={()=>setSigned(true)} disabled={signed}>подписать ЭЦП</button><button disabled={!signed} onClick={()=>{if(signed)onSend()}}>отправить</button></div></footer>
 </dialog>;
}
