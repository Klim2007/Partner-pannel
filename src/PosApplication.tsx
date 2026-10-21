import {useEffect,useRef,useState} from 'react';
import './pos-application.css';
import PdfPreview from './PdfPreview';

export default function PosApplication({onClose,onSend,pdfUrl,title='Заявление на регистрацию ПТС'}:{onClose:()=>void;onSend:()=>void;pdfUrl:string;title?:string}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [signed,setSigned]=useState(false);
 const [pdfReady,setPdfReady]=useState(false);
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close()},[]);
 return <dialog ref={dialog} className="pos-application" aria-labelledby="pos-application-title" onCancel={onClose}>
  <header><h2 id="pos-application-title">{title}</h2><button aria-label="Закрыть заявку" onClick={onClose}>×</button></header>
  <p className="pos-demo-note">Проверьте все страницы PDF. В MVP подпись и отправка демонстрационные: юридически значимая ЭЦП и передача в Банк не подключены.</p>
  <PdfPreview url={pdfUrl} onReady={setPdfReady}/>
  <footer><div><a href={pdfUrl} target="_blank" rel="noopener noreferrer">Открыть / скачать PDF</a><p role="status">{signed?'Демонстрационный шаг подписи выполнен.':'Перед отправкой проверьте PDF и выполните шаг «подписать ЭЦП».'}</p></div><div className="pos-application-actions"><button onClick={()=>setSigned(true)} disabled={signed||!pdfReady}>подписать ЭЦП</button><button disabled={!signed||!pdfReady} onClick={()=>{if(signed&&pdfReady)onSend()}}>отправить</button></div></footer>
 </dialog>;
}
