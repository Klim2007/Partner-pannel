export type PtsFields=Record<string,string>;
export type PtsField={key:string;label:string;type?:'date'|'number';required?:boolean;max?:number;integer?:boolean;options?:string[];readonly?:boolean};
export type PtsSection={title:string;fields:PtsField[];note?:string};
const f=(key:string,label:string,extra:Partial<PtsField>={}):PtsField=>({key,label,...extra});
const person=(p:string):PtsField[]=>[
 f(p+'Surname','Фамилия'),f(p+'Name','Имя'),f(p+'Patronymic','Отчество (при наличии)'),f(p+'Phone','Телефон'),f(p+'BirthDate','Дата рождения',{type:'date'}),f(p+'Citizenship','Гражданство'),f(p+'BirthPlace','Место рождения'),f(p+'Address','Место жительства / пребывания'),f(p+'DocumentType','Вид документа, удостоверяющего личность'),f(p+'DocumentNumber','Номер документа'),f(p+'DocumentDate','Дата выдачи',{type:'date'}),f(p+'Iin','ИИН'),f(p+'Issuer','Наименование выдавшего органа')
];
export function ptsSections(v:PtsFields):PtsSection[]{
 const s:PtsSection[]=[
 {title:'Регистрация и филиал',fields:[f('operation','Вид заявления',{options:['Регистрация','Изменение']}),f('applicationDate','Дата заявления',{type:'date',required:true}),f('branch','Название филиала / ГО'),f('changes','Вносимые изменения')]},
 {title:'Информация о предприятии',fields:[f('fullName','Полное официальное наименование',{required:true}),f('tradeName','Торговое наименование для выписки (до 25 символов)',{max:25,required:true}),f('binIin','БИН / ИИН',{required:true}),f('legalAddress','Юридический адрес ПТС',{required:true})]},
 {title:'Руководитель / индивидуальный предприниматель',fields:person('head')},
 {title:'Учредители / участники',fields:[f('foundersCount','Количество учредителей / участников',{type:'number',integer:true})]}
 ];
 for(let i=1;i<=Math.min(20,Number(v.foundersCount)||0);i++){const p=`founder${i}`;s.push({title:`Учредитель / участник №${i}`,fields:[f(p+'Type','Тип участника',{options:['Физическое лицо','Юридическое лицо']}),f(p+'Surname','Фамилия'),f(p+'Name','Имя'),f(p+'Patronymic','Отчество (при наличии)'),f(p+'DocumentType','Вид документа'),f(p+'DocumentNumber','Номер документа'),f(p+'DocumentDate','Дата выдачи',{type:'date'}),f(p+'BinIin','БИН / ИИН'),f(p+'Issuer','Наименование выдавшего органа'),f(p+'Registration','Полные регистрационные данные участника — юридического лица')]});}
 s.push({title:'Главный бухгалтер',fields:[f('hasAccountant','Наличие главного бухгалтера',{options:['Не предусмотрен','Есть']})]});
 if(v.hasAccountant==='Есть')s.push({title:'Сведения о главном бухгалтере',fields:person('accountant')});
 s.push({title:'Информация о ПТС',fields:[f('totalTerminals','Количество необходимых POS-терминалов (всего)',{type:'number',required:true,integer:true}),f('pointsCount','Количество торговых точек (ПТС)',{type:'number',required:true,integer:true})],note:'Общее число терминалов должно совпадать с суммой по всем точкам.'});
 for(let i=1;i<=Math.min(20,Math.max(1,Number(v.pointsCount)||1));i++){const k=(key:string)=>i===1?key:`point${i}_${key}`;s.push({title:`Торговая точка №${i}`,fields:[f(k('pointName'),'Наименование ПТС (по вывеске)',{required:true}),f(k('pointAddress'),'Фактический адрес: индекс, город, улица, дом',{required:true}),f(k('respName'),'ФИО ответственного работника',{required:true}),f(k('respPhone'),'Телефон ответственного работника',{required:true}),f(k('oked'),'Вид деятельности (ОКЭД)',{required:true}),f(k('purpose'),'Цель использования терминала'),f(k('mcc'),'Merchant Category Code (MCC)',{required:true}),f(k('schedule'),'График работы ПТС',{required:true}),f(k('pointTerminals'),'Количество POS-терминалов в данной точке',{type:'number',required:true,integer:true})]});}
 s.push(
 {title:'Дополнительная информация',fields:[f('installPlace','Место установки POS-терминала (офис, касса / отдел и т.п.)'),f('receiptInfo','Информация для отражения в чеке (включая пробелы и знаки препинания)')]},
 {title:'Банковские реквизиты',fields:[f('bankName','Банк'),f('bic','БИК'),f('account','Р/С')]},
 {title:'Комиссионное вознаграждение Банка, %',note:'В MVP можно указать условия для предпросмотра. Окончательные комиссии устанавливает Банк.',fields:[f('ownCardCommission','Платёжные карточки, эмитированные Банком, %',{type:'number'}),f('otherCardCommission','Платёжные карточки, эмитированные сторонними банками, %',{type:'number'})]},
 {title:'Лимиты на совершение операций',note:'Лимиты устанавливаются и контролируются Банком. Планируемые объёмы и количество операций могут корректироваться Банком по собственной инициативе.',fields:[f('averageCheck','Средний чек',{type:'number'}),f('maxTransaction','Максимальная сумма одной операции',{type:'number'}),f('maxDailyTurnover','Максимальный оборот в сутки',{type:'number'}),f('maxMonthlyTurnover','Максимальный оборот в месяц',{type:'number'}),f('maxDailyTransactions','Максимальное количество операций в сутки',{type:'number',integer:true}),f('maxCardDailyTransactions','Максимальное количество операций по одной платёжной карточке в сутки',{type:'number',integer:true})]},
 {title:'Представитель организации и согласие',fields:[f('bankBin','БИН Банка в согласии на передачу информации'),f('representativePosition','Должность представителя организации'),f('representativeName','ФИО представителя организации'),f('representativeDate','Дата',{type:'date'})]},
 {title:'Отметки Банка',note:'Заполняет сотрудник Банка при приёме заявления.',fields:[f('bankRepresentativePosition','Должность представителя Банка',{readonly:true}),f('bankRepresentativeName','ФИО представителя Банка',{readonly:true}),f('bankAcceptedDate','Дата приёма',{type:'date',readonly:true})]}
 );return s;
}
export function initialPts():PtsFields{return {operation:'Регистрация',applicationDate:new Date().toISOString().slice(0,10),fullName:'ТОО «ДЕМО КОМПАНИЯ»',tradeName:'ДЕМО КОМПАНИЯ',binIin:'000000000000',legalAddress:'г. Астана, ул. Демонстрационная, 1',headSurname:'Иванов',headName:'Иван',headPatronymic:'Иванович',hasAccountant:'Не предусмотрен',foundersCount:'0',pointsCount:'1',totalTerminals:'1',pointTerminals:'1',bankName:'Демонстрационный банк',bic:'DEMO',account:'DEMO-ACCOUNT-0001'};}
export function validatePts(v:PtsFields):string[]{
 const errors:string[]=[];
 for(const section of ptsSections(v))for(const field of section.fields){const value=v[field.key]??'';if(field.readonly)continue;if(field.required&&!value.trim())errors.push(`${section.title}: ${field.label}`);if(value&&field.type==='number'&&(!Number.isFinite(Number(value))||Number(value)<0||(field.integer&&!Number.isInteger(Number(value)))))errors.push(`${field.label}: укажите неотрицательное ${field.integer?'целое ':''}число`);if(field.max&&value.length>field.max)errors.push(`${field.label}: максимум ${field.max} символов`);}
 for(const key of ['pointsCount','foundersCount'])if(Number(v[key])>20)errors.push('В демонстрационной версии можно добавить до 20 точек / участников.');
 if(Number(v.pointsCount)<1||Number(v.totalTerminals)<1)errors.push('Нужны хотя бы одна точка и один терминал.');
 let sum=0;for(let i=1;i<=Math.min(20,Number(v.pointsCount));i++){const n=Number(v[i===1?'pointTerminals':`point${i}_pointTerminals`]);if(!(n>=1))errors.push(`Точка №${i}: количество терминалов должно быть не меньше 1`);sum+=n;}
 if(sum!==Number(v.totalTerminals))errors.push('Общее количество терминалов не совпадает с суммой по точкам.');
 for(const key of ['ownCardCommission','otherCardCommission'])if(Number(v[key])>100)errors.push('Комиссия не может превышать 100%.');
 if(v.operation==='Изменение'&&!v.changes?.trim())errors.push('Укажите вносимые изменения.');return errors;
}
