import {existsSync, readFileSync, mkdirSync, writeFileSync, renameSync} from 'node:fs';
import path from 'node:path';

// One application process; reserve before contacting the provider, including failures.
export function createDemoBudget(file:string, limit=50) {
 return (now=Date.now())=>{
  try {
   const parsed:unknown=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):[];
   if(!Array.isArray(parsed)||!parsed.every(t=>typeof t==='number'&&Number.isFinite(t)))return false;
   const recent=parsed.filter(t=>now-t<86400000);
   if(recent.length>=limit)return false;
   mkdirSync(path.dirname(file),{recursive:true});
   writeFileSync(file+'.tmp',JSON.stringify([...recent,now]));
   renameSync(file+'.tmp',file);
   return true;
  } catch {return false;} // Fail closed if the durable budget cannot be read/written.
 };
}
