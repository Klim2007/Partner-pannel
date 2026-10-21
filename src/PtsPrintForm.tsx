import {useEffect,useRef,useState} from 'react';
import type {PtsFields} from './PosFieldsForm';
import './pos-fields.css';

// Печатная форма «Заявление на регистрацию ПТС»: автозаполнение из Correqts (демо-профиль)
// + поля, введённые клиентом вручную. Подписывается ЭЦП (демо-шаг), затем — следующая форма.
const AUTO:[string,string][]=[
 ['Полное официальное наименование','ТОО «ДЕМО КОМПАНИЯ»'],
 ['Торговое (сокращённое) наименование','ДЕМО КОМПАНИЯ'],
 ['БИН / ИИН','000000000000 (демо)'],
 ['Юридический адрес ПТС','г. Астана, ул. Демонстрационная, 1 (демо)'],
 ['Руководитель','Иванов Иван Иванович (демо)'],
 ['Телефон руководителя','+7 700 000 00 00 (демо)'],
 ['Банк','Демонстрационный банк'],
 ['БИК','DEMO'],
 ['Расчётный счёт','DEMO-ACCOUNT-0001'],
];

export default function PtsPrintForm({fields,onClose,onNext}:{fields:PtsFields;onClose:()=>void;onNext:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [signed,setSigned]=useState(false);
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close()},[]);
 const manual:[string,string][]=[
  ['Количество необходимых POS-терминалов (всего)',fields.totalTerminals],
  ['Количество торговых точек (ПТС)',fields.pointsCount],
  ['Наименование ПТС (по вывеске)',fields.pointName],
  ['Фактический адрес ПТС',fields.pointAddress],
  ['ФИО ответственного работника',fields.respName],
  ['Телефон ответственного работника',fields.respPhone],
  ['Вид деятельности (ОКЭД)',fields.oked],
  ['Цель использования терминала',fields.purpose],
  ['Merchant Category Code (MCC)',fields.mcc],
  ['График работы ПТС',fields.schedule],
  ['Количество POS-терминалов в точке',fields.pointTerminals],
  ['Место установки POS-терминала',fields.installPlace],
  ['Информация для чека',fields.receiptInfo],
 ];
 const row=([k,val]:[string,string])=><div className="pp-row" key={k}><span className="pp-key">{k}</span><span className="pp-val">{val||'—'}</span></div>;
 return <dialog ref={dialog} className="pos-print" aria-labelledby="pp-title" onCancel={onClose}>
  <header><h2 id="pp-title">Заявление на регистрацию ПТС</h2><button aria-label="Закрыть" onClick={onClose}>×</button></header>
  <p className="pf-note">Печатная форма. Демонстрационный режим — юридически значимая ЭЦП не создаётся, данные в банк не отправляются.</p>
  <div className="pp-doc" tabIndex={0} aria-label="Печатная форма заявления">
   <h3>Заявление на регистрацию Предприятия торговли и сервиса (ПТС)</h3>
   <div className="pp-block-title">Реквизиты организации (автозаполнение из Correqts)</div>
   {AUTO.map(row)}
   <div className="pp-block-title">Сведения, заполненные клиентом</div>
   {manual.map(row)}
   <div className="pp-sign">{signed?'✔ Подписано ЭЦП (демонстрационно)':'Подпись: ____________________  /  дата: __.__.____'}</div>
  </div>
  <footer>
   <p role="status" className="pf-status">{signed?'Демонстрационный шаг подписи выполнен. Далее — заявление о присоединении.':'Проверьте данные и подпишите форму ЭЦП.'}</p>
   <div className="pf-actions">
    <button className="pf-cancel" onClick={onClose}>Отмена</button>
    <button className="pf-submit" disabled={signed} onClick={()=>setSigned(true)}>подписать ЭЦП</button>
    <button className="pf-submit" disabled={!signed} onClick={()=>{if(signed)onNext()}}>Далее</button>
   </div>
  </footer>
 </dialog>;
}
