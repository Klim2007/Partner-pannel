import type {Service,Contact,ChatMessage,AssistantReply} from '../shared/types';
async function request<T>(path:string,options?:RequestInit):Promise<T>{const res=await fetch('/api/v1'+path,{...options,credentials:'same-origin',headers:{'Content-Type':'application/json',...options?.headers}});const body=await res.json();if(res.status===401){location.assign('/login/ru.html');throw new Error('Сессия завершена');}if(!res.ok)throw new Error(body.error||'Сервис временно недоступен');return body;}
export interface CatalogRepository {list():Promise<Service[]>}
export const catalog:CatalogRepository={list:()=>request<Service[]>('/services')};
export const api={session:()=>request('/auth/session'),logout:()=>request('/auth/logout',{method:'POST'}),contacts:()=>request<Contact[]>('/contacts'),ask:(message:string,history:ChatMessage[])=>request<AssistantReply>('/assistant/messages',{method:'POST',body:JSON.stringify({message,history})})};
