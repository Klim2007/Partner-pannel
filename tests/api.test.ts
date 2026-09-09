import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.ts';
import {services} from '../server/catalog.ts';
import {retrieve} from '../server/knowledge.ts';
test('catalog has five external connections and insurance without link',()=>{assert.equal(services.length,6);assert.equal(services.filter(s=>s.connectUrl).length,5);assert.equal(services.find(s=>s.id==='S05')?.actionType,'informational');assert.equal(services.find(s=>s.id==='S06')?.connectUrl,'https://buhta.com');});
test('retrieval grounds navigation and support without fabricated bank instructions',()=>{assert.ok(retrieve('Как подключить сервис?').some(s=>s.id==='panel'));assert.ok(retrieve('Как сделать платеж в VTB Business?').some(s=>s.id==='instructions'));assert.equal(retrieve('неизвестная тема xyz').length,0)});
test('local authentication, missing AI setup, contacts and logout',async()=>{
 const server=createApp().listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));const address=server.address();if(!address||typeof address==='string')throw new Error('No server');const base=`http://127.0.0.1:${address.port}`;
 const post=(url:string,body:unknown,cookie='')=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json',cookie},body:JSON.stringify(body)});
 try{
  assert.equal((await fetch(base+'/api/v1/services')).status,401);
  assert.equal((await post('/api/v1/auth/login',{username:'klim',password:'wrong'})).status,401);
  const login=await post('/api/v1/auth/login',{username:'klim',password:'klim'});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];assert.match(login.headers.get('set-cookie')!,/HttpOnly/);
  const catalog=await fetch(base+'/api/v1/services',{headers:{cookie}});assert.equal((await catalog.json()).length,6);
  const contacts=await fetch(base+'/api/v1/contacts',{headers:{cookie}});assert.deepEqual(await contacts.json(),[{id:'telegram',name:'Telegram'},{id:'whatsapp',name:'WhatsApp'}]);
  assert.equal((await post('/api/v1/assistant/messages',{message:''},cookie)).status,400);
  const ai=await post('/api/v1/assistant/messages',{message:'Как подключить сервис?'},cookie);assert.equal(ai.status,503);assert.equal((await ai.json()).code,'AI_NOT_CONFIGURED');
  const external=await fetch(base+'/api/v1/auth/login',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'});assert.equal(external.status,403);
  await post('/api/v1/auth/logout',{},cookie);assert.equal((await fetch(base+'/api/v1/auth/session',{headers:{cookie}})).status,401);
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
