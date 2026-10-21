import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createDemoBudget} from '../server/demo-budget.ts';
test('public AI budget persists across sessions/restarts, expires and fails closed',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'pannel-budget-'));
 try {
  const file=path.join(dir,'budget.json'),reserve=createDemoBudget(file,2);
  assert.equal(reserve(1000),true);assert.equal(reserve(1001),true);
  assert.equal(createDemoBudget(file,2)(1002),false);
  assert.equal(reserve(86402000),true);
  writeFileSync(file,'broken');assert.equal(reserve(86402001),false);
 }finally{rmSync(dir,{recursive:true});}
});
