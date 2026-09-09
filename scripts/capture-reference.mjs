// Import the public login's HTML/CSS/images mechanically, retaining visual markup.
// Bank scripts and dynamic tokens are removed; only our local authentication runs.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const origin = 'https://ib.vtb-bank.kz';
const downloaded = new Set();
async function asset(url) {
  const parsed = new URL(url);
  if(parsed.origin !== origin) throw new Error('Unexpected asset origin');
  const local = '/reference' + parsed.pathname;
  if(downloaded.has(url)) return local;
  downloaded.add(url);
  const response = await fetch(url); if(!response.ok) throw new Error(`${response.status}: ${url}`);
  let data = Buffer.from(await response.arrayBuffer());
  if(parsed.pathname.endsWith('.css')) {
    let css=data.toString('utf8');
    const matches=[...css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)];
    for(const match of matches) {
      if(match[1].startsWith('data:')) continue;
      const resource=new URL(match[1],url);
      const target=await asset(resource.href);
      css=css.replace(match[0],`url("${target}${resource.hash}")`);
    }
    data=Buffer.from(css);
  }
  const destination=path.join('public',local);
  await mkdir(path.dirname(destination),{recursive:true}); await writeFile(destination,data);
  return local;
}
await mkdir('public/login',{recursive:true}); await mkdir('docs/reference',{recursive:true});
for(const language of ['ru','en','kz']) {
  const url=`${origin}/${language}/html/login.html`;
  const response=await fetch(url); if(!response.ok) throw new Error(`${response.status}: ${url}`);
  let html=await response.text();
  html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi,'').replace(/<input\b[^>]*(?:CSRFToken)[^>]*>/gi,'');
  for(const match of [...html.matchAll(/<(?:link|img)\b[^>]*(?:href|src)="([^"]+)"[^>]*>/gi)]) {
    const remote=new URL(match[1],url).href;
    html=html.replace(match[0],match[0].replace(match[1],await asset(remote)));
  }
  html=html.replace(/<a\b([^>]*?)href="([^"]+)"/gi,(_,before,href)=>`<a${before}href="${href==='#'?'#':new URL(href,url).href}"`);
  const keyboard=await asset(`${origin}/${language}/img/logon/keyboard.png`);
  html=html.replace('<!--keyboardInput-->',`<img src="${keyboard}" class="keyboardInputInitiator" role="button" tabindex="0" alt="Отобразить виртуальную клавиатуру" id="localKeyboardButton">`);
  html=html.replace('<html ',`<html lang="${language==='kz'?'kk':language}" `);
  html=html.replace('</head>','<meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; script-src \'self\'; connect-src \'self\'; form-action \'self\'; object-src \'none\'"></head>');
  html=html.replace('</body>','<script src="/login/local.js" defer></script></body>');
  await writeFile(`public/login/${language}.html`,html);
  console.log(`Captured ${language}: ${html.length} characters`);
}
await writeFile('docs/reference/manifest.json',JSON.stringify({capturedAt:new Date().toISOString(),source:`${origin}/ru/html/login.html`,changes:['Bank scripts and hidden tokens removed','Local resource paths','Local login handler and keyboard icon'],assets:[...downloaded]},null,2));
