import type { Source } from '../shared/types.ts';
import { services } from './catalog.ts';
export const knowledge:Source[] = [
 {id:'panel',title:'Витрина: использование',url:'https://github.com/Klim2007/Partner-pannel/blob/main/docs/BT.md',text:'В локальной витрине шесть партнёрских сервисов. Наведите указатель на изображение либо нажмите его, чтобы увидеть описание и условия. Подключить открывает сайт поставщика в новой вкладке. Оформление происходит у поставщика. Страхование содержит только общее предложение, без перехода. Никаких банковских операций витрина не выполняет.',keywords:['витрин','сервис','подключ','партнер','партнёр','карточ','панел']},
 {id:'instructions',title:'Официальные инструкции VTB Business',url:'https://ib.vtb-bank.kz/doc/ru/instruction_ru.html',text:'На официальной странице входа VTB Business в верхней части находится ссылка «Инструкции». Она ведёт на https://ib.vtb-bank.kz/doc/ru/instruction_ru.html. Пошаговое содержание банковских операций пока не добавлено в базу помощника: направляйте к официальным инструкциям, не придумывайте шаги выполнения платежей.',keywords:['инструкц','платеж','платёж','выписк','перевод','счёт','счет','подпис','документ','vtb','business']},
 {id:'support',title:'Поддержка интернет-банка',url:'https://ib.vtb-bank.kz/ru/html/login.html',text:'На странице входа указаны контакты поддержки СДБО: +7(727)330-67-67, +7-702-017-67-67, onlineservice@vtb-bank.kz. Контакты Telegram и WhatsApp для локальной панели ещё не подтверждены. Не выдавать эти номера за адрес WhatsApp.',keywords:['помощ','поддерж','связ','банк','телефон','контакт','парол','ошиб','войти']},
 ...services.map(s=>({id:s.id,title:s.name,url:s.sourceUrl??'https://github.com/Klim2007/Partner-pannel/blob/main/docs/BT.md',text:[s.name,s.description,s.offer,s.terms,s.actionType==='informational'?'Переход не предусмотрен.':`Сайт: ${s.connectUrl}`].join(' '),keywords:[s.provider.toLowerCase(),...s.name.toLowerCase().split(/\s+/).filter(x=>x.length>4).map(x=>x.slice(0,5))]}))
];
export function retrieve(question:string):Source[] {
 const q=question.toLowerCase();
 return knowledge.map(source=>({source,score:source.keywords.reduce((n,key)=>n+(q.includes(key)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.source);
}
