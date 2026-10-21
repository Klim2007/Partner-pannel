const username=document.querySelector('#userName');
const demoNotice=document.createElement('script');demoNotice.src='/demo-notice.js';document.body.append(demoNotice);
const password=document.querySelector('#password');
const mobileStyles=document.createElement('link');mobileStyles.rel='stylesheet';mobileStyles.href='/login/mobile.css';document.head.append(mobileStyles);
const originalLabels=[...document.querySelectorAll('.login_label')];
originalLabels[0]?.closest('.row')?.classList.add('mobile-auth-labels');
username.closest('.row')?.classList.add('mobile-auth-fields');
for(const [index,input] of [username,password].entries()){const label=document.createElement('label');label.className='mobile-auth-label';label.htmlFor=input.id;label.textContent=originalLabels[index]?.textContent?.trim()||(index?'Пароль':'Пользователь');input.before(label);}
username.setAttribute('aria-label','Пользователь');password.setAttribute('aria-label','Пароль');
username.autocomplete='username';password.autocomplete='current-password';
username.focus();
const errorFrame=document.querySelector('#errorFrame');
function showError(text) {document.querySelector('#errorMessage').textContent=text;errorFrame.style.display='block';errorFrame.setAttribute('role','alert');}
let submitting=false;
async function login(){
 if(submitting) return;
 if(!username.value||!password.value){showError('Введите пользователя и пароль');return;}
 submitting=true;
 try {const response=await fetch('/api/v1/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:username.value,password:password.value})});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Не удалось войти');location.assign('/panel');}
 catch(error){showError(error.message==='Failed to fetch'?'Сервер недоступен. Повторите попытку.':error.message);}
 finally{submitting=false;}
}
document.querySelector('#submitButton').addEventListener('click',login);
for(const input of [username,password]) {input.addEventListener('keydown',event=>{if(event.key==='Enter')login();}); input.addEventListener('input',()=>{errorFrame.style.display='none';});input.addEventListener('keyup',event=>{document.querySelector('#capsIndicator').style.visibility=event.getModifierState('CapsLock')?'visible':'hidden';});}
document.querySelector('#forgotPassword').addEventListener('click',()=>showError('Для локальной демонстрации: пользователь klim, пароль klim.'));
document.querySelector('.top a[href="#"]').addEventListener('click',event=>{event.preventDefault();username.value='klim';password.value='klim';login();});
for(const language of ['ru','en','kz']) {const el=document.querySelector('.language.'+language);el.setAttribute('role','button');el.tabIndex=0;const change=()=>location.assign(`/login/${language}.html`);el.addEventListener('click',change);el.addEventListener('keydown',event=>{if(event.key==='Enter')change();});}
let keyboard;
function toggleKeyboard(){
 if(keyboard){keyboard.remove();keyboard=null;return;}
 keyboard=document.createElement('div');keyboard.id='localKeyboardPanel';keyboard.setAttribute('role','dialog');keyboard.setAttribute('aria-label','Виртуальная клавиатура');
 Object.assign(keyboard.style,{position:'fixed',top:'190px',left:'50%',transform:'translateX(-50%)',zIndex:'1000',background:'white',padding:'16px',border:'1px solid #00a9ff',boxShadow:'0 8px 32px #00288233',width:'360px'});
 for(const row of ['1234567890','qwertyuiop','asdfghjkl','zxcvbnm']) {const line=document.createElement('div');for(const letter of row){const key=document.createElement('button');key.textContent=letter;key.type='button';key.style.cssText='padding:4px 7px;margin:2px;color:#002882;background:#f1f7ff;border:1px solid #ccd9eb';key.onclick=()=>{password.value+=letter;};line.append(key);}keyboard.append(line);}
 for(const [label,action] of [['⌫',()=>password.value=password.value.slice(0,-1)],['Закрыть',toggleKeyboard]]){const key=document.createElement('button');key.textContent=label;key.onclick=action;keyboard.append(key);}
 document.body.append(keyboard);
}
document.querySelector('#localKeyboardButton').addEventListener('click',toggleKeyboard);
document.querySelector('#localKeyboardButton').addEventListener('keydown',event=>{if(event.key==='Enter')toggleKeyboard();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&keyboard)toggleKeyboard();});
