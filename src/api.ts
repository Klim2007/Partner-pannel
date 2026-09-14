import type {Service,Contact,ChatMessage,AssistantReply} from '../shared/types';
async function request<T>(path:string,options?:RequestInit):Promise<T>{const res=await fetch('/api/v1'+path,{...options,credentials:'same-origin',headers:{'Content-Type':'application/json',...options?.headers}});const body=await res.json();if(res.status===401){location.assign('/login/ru.html');throw new Error('Сессия завершена');}if(!res.ok)throw new Error(body.error||'Сервис временно недоступен');return body;}
export interface CatalogRepository {list():Promise<Service[]>}
export const httpCatalog=(url:string):CatalogRepository=>({list:async()=>{const res=await fetch(url,{headers:{Accept:'application/json'}});if(!res.ok)throw new Error('Каталог временно недоступен');return await res.json() as Service[];}});
// AC10: VITE_CATALOG_URL переключает каталог на внешний HTTP-источник (JSON Service[]); отображающие компоненты не меняются.
const catalogUrl:string|undefined=import.meta.env?.VITE_CATALOG_URL;
export const catalog:CatalogRepository=catalogUrl?httpCatalog(catalogUrl):{list:()=>request<Service[]>('/services')};
export const api={session:()=>request('/auth/session'),logout:()=>request('/auth/logout',{method:'POST'}),contacts:()=>request<Contact[]>('/contacts'),ask:(message:string,history:ChatMessage[])=>request<AssistantReply>('/assistant/messages',{method:'POST',body:JSON.stringify({message,history})})};
