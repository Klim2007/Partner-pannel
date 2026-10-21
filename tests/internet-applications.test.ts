import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.ts';
test('internet applications: create, submit, list, PDF and session isolation',async()=>{
 const server=createApp().listen(0,'127.0.0.1');
 await new Promise<void>(resolve=>server.once('listening',resolve));
 const address=server.address();assert.ok(address&&typeof address!=='string');
 const base=`http://127.0.0.1:${address.port}/api/v1`;
 try{
  const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'klim',password:'klim'})});
  const cookie=login.headers.get('set-cookie')!.split(';')[0];
  const created=await fetch(base+'/applications/internet',{method:'POST',headers:{cookie}});
  assert.equal(created.status,201);const item=await created.json();assert.equal(item.product,'Интернет-эквайринг');
  const submitted=await fetch(base+`/applications/${item.id}/submit`,{method:'POST',headers:{cookie}});
  assert.equal((await submitted.json()).status,'Принята в работу');
  const list=await fetch(base+'/applications',{headers:{cookie}});assert.equal((await list.json())[0].id,item.id);
  const pdf=await fetch(base+`/applications/${item.id}/pdf`,{headers:{cookie}});
  assert.equal(pdf.status,200);assert.match(pdf.headers.get('content-type')!,/pdf/);
  assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,5).toString(),'%PDF-');
  assert.equal((await fetch(base+`/applications/${item.id}/pdf`)).status,401);
 }finally{await new Promise<void>(resolve=>server.close(()=>resolve()))}
});
