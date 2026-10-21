import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {services} from '../server/catalog.ts';
import {retrieve} from '../server/knowledge.ts';
test('DION replaces CRM with its own visual and connection URL',()=>{
 const service=services.find(s=>s.id==='S04')!;
 assert.equal(service.name,'Автоматизация Вашего бизнеса');
 assert.equal(service.provider,'DION');
 assert.equal(service.connectUrl,'https://diongo.ru/solutions/msb');
 assert.equal(service.sourceUrl,service.connectUrl);
 assert.ok(existsSync('public'+service.imageUrl));
 assert.doesNotMatch(JSON.stringify(services),/bitrix|битрикс/i);
 assert.ok(retrieve('DION').some(s=>s.id==='S04'));
});
