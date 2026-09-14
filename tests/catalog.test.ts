import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {httpCatalog} from '../src/api.ts';
import {services} from '../server/catalog.ts';
test('catalog repository switches to an external HTTP source (AC10)',async()=>{
 const fixture=[{...services[0],id:'T01',name:'Тестовый сервис из внешнего источника'},{...services[4],id:'T02'}];
 const server=createServer((req,res)=>{if(req.url==='/catalog.json'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(fixture));}else{res.writeHead(404,{'Content-Type':'application/json'});res.end('{}');}}).listen(0,'127.0.0.1');
 await new Promise<void>(resolve=>server.once('listening',resolve));const address=server.address();if(!address||typeof address==='string')throw new Error('No server');const base=`http://127.0.0.1:${address.port}`;
 try{
  assert.deepEqual(await httpCatalog(base+'/catalog.json').list(),fixture);
  await assert.rejects(httpCatalog(base+'/missing.json').list(),/Каталог временно недоступен/);
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
