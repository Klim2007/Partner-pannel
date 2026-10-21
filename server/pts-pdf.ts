import {readFile} from 'node:fs/promises';
import {PDFDocument,rgb,type PDFFont} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {ptsSections,type PtsFields} from '../shared/pts.ts';
import {consents} from './pts-consents.ts';
export async function createPtsPdf(item:{id:string;fields:PtsFields}):Promise<Uint8Array>{
 const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 const [regularBytes,boldBytes]=await Promise.all([readFile(process.env.PTS_FONT_REGULAR||'C:/Windows/Fonts/arial.ttf'),readFile(process.env.PTS_FONT_BOLD||'C:/Windows/Fonts/arialbd.ttf')]);
 const font=await doc.embedFont(regularBytes,{subset:true}),bold=await doc.embedFont(boldBytes,{subset:true});
 const ink=rgb(.1,.13,.18),border=rgb(.65,.68,.72),left=38,width=519;
 let page=doc.addPage([595,842]),y=794;
 function ensure(h:number){if(y-h<48){page=doc.addPage([595,842]);y=794;}}
 function wrap(text:string,w:number,size:number,face:PDFFont=font):string[]{
  const lines:string[]=[];for(const paragraph of String(text).split('\n')){let line='';for(const word of paragraph.split(/\s+/)){if(face.widthOfTextAtSize((line?line+' ':'')+word,size)<=w){line+=(line?' ':'')+word;continue;}if(line){lines.push(line);line='';}for(const ch of word){if(face.widthOfTextAtSize(line+ch,size)>w){lines.push(line);line='';}line+=ch;}}lines.push(line);}return lines;
 }
 function paragraph(text:string,size=9,face=font){for(const line of wrap(text,width,size,face)){ensure(size+5);page.drawText(line,{x:left,y:y-size,font:face,size,color:ink});y-=size+5;}y-=5;}
 function heading(title:string){ensure(62);page.drawRectangle({x:left,y:y-25,width,height:25,color:rgb(.92,.94,.97)});page.drawText(title,{x:left+6,y:y-17,font:bold,size:10,color:ink});y-=25;}
 function row(label:string,value:string){const a=wrap(label,245,9),b=wrap(value||'____________________',248,9);const h=Math.max(a.length,b.length)*13+10;ensure(h);page.drawRectangle({x:left,y:y-h,width,height:h,borderWidth:.45,borderColor:border});page.drawLine({start:{x:left+259,y},end:{x:left+259,y:y-h},thickness:.45,color:border});a.forEach((t,i)=>page.drawText(t,{x:left+5,y:y-14-i*13,size:9,font,color:ink}));b.forEach((t,i)=>page.drawText(t,{x:left+265,y:y-14-i*13,size:9,font,color:ink}));y-=h;}
 paragraph('Приложение №4 к Положению о торговом эквайринге ДО АО Банк ВТБ (Казахстан)',9,bold);
 paragraph('от «___» _____________ 2026 г. №_______');
 paragraph('ЗАЯВЛЕНИЕ НА РЕГИСТРАЦИЮ ПРЕДПРИЯТИЯ ТОРГОВЛИ И СЕРВИСА / ВНЕСЕНИЕ ИЗМЕНЕНИЙ В НАСТРОЙКИ POS-ТЕРМИНАЛА',12,bold);
 paragraph(`Номер: ${item.id}. Демонстрационная форма. Юридически значимая ЭЦП не создана.`,8);
 for(const section of ptsSections(item.fields)){
  if(section.title==='Представитель организации и согласие'){
   heading('Согласия предприятия / ИП');
   for(const text of consents)paragraph(text.replace('_________________________',item.fields.bankBin||'_________________________'),9);
  }
  heading(section.title);
  for(const f of section.fields){let value=f.readonly?'':(item.fields[f.key]||f.options?.[0]||'');if(f.type==='date'&&/^\d{4}-\d{2}-\d{2}$/.test(value))value=value.split('-').reverse().join('.');row(f.label,value);}
  if(section.title==='Представитель организации и согласие'||section.title==='Отметки Банка')row('Подпись','');
  y-=10;
  if(section.title==='Лимиты на совершение операций')paragraph('*Планируемые объёмы и количество операций могут корректироваться Банком по собственной инициативе.',9);
 }
 paragraph('М.П. ____________________',9);
 doc.getPages().forEach((p,i)=>p.drawText(`${item.id}   •   ${i+1} / ${doc.getPageCount()}`,{x:left,y:26,font,size:8,color:ink}));
 doc.setTitle('Заявление на регистрацию ПТС — Приложение №4');
 return doc.save();
}
