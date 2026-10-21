import {useEffect,useRef,useState} from 'react';
import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc=workerUrl;
export default function PdfPreview({url,onReady}:{url:string;onReady:(ready:boolean)=>void}){
 const container=useRef<HTMLDivElement>(null);
 const [status,setStatus]=useState('Загрузка PDF…'),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let cancelled=false;const abort=new AbortController();let task:ReturnType<typeof getDocument>|undefined;
  const host=container.current!;host.replaceChildren();setStatus('Загрузка PDF…');setError('');onReady(false);
  (async()=>{
   try{
    const response=await fetch(url,{credentials:'same-origin',signal:abort.signal});
    if(!response.ok)throw new Error(response.status===401?'Сессия завершена. Войдите снова.':'Не удалось загрузить PDF. Повторите попытку.');
    if(!response.headers.get('content-type')?.includes('application/pdf'))throw new Error('Сервер не вернул PDF. Обновите страницу.');
    task=getDocument({data:new Uint8Array(await response.arrayBuffer())});const pdf=await task.promise;
    if(cancelled)return;
    for(let n=1;n<=pdf.numPages;n++){
     const page=await pdf.getPage(n);if(cancelled)return;
     const viewport=page.getViewport({scale:1.5});const canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`PDF: страница ${n} из ${pdf.numPages}`);canvas.dataset.page=String(n);
     await page.render({canvas,viewport}).promise;if(cancelled)return;host.append(canvas);
    }
    setStatus(`PDF загружен: ${pdf.numPages} стр.`);onReady(true);
   }catch(e){if(!cancelled){setStatus('');setError(e instanceof Error?e.message:'Не удалось отобразить PDF');}}
  })();
  return()=>{cancelled=true;abort.abort();void task?.destroy();};
 },[url,attempt,onReady]);
 return <div className="pos-pdf-viewer"><p role="status">{status}</p>{error&&<p role="alert">{error} <button onClick={()=>setAttempt(x=>x+1)}>Повторить</button></p>}<div ref={container} className="pos-pdf-canvases"/></div>;
}
