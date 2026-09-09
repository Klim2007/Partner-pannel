export interface Service { id:string; name:string; provider:string; description:string; benefits:string[]; terms:string; offer:string; imageUrl:string; imageAlt:string; connectUrl:string|null; displayOrder:number; actionType:'external'|'informational'; sourceUrl:string|null }
export interface Contact { id:'telegram'|'whatsapp'; name:string }
export interface Source { id:string; title:string; url:string; text:string; keywords:string[] }
export interface ChatMessage { role:'user'|'assistant'; content:string }
export interface AssistantReply { answer:string; sources:Pick<Source,'id'|'title'|'url'>[] }
