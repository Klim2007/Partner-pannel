import 'dotenv/config';
import { createApp } from './app.ts';
const port=Number(process.env.API_PORT||3001);
createApp({apiKey:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL,telegram:process.env.TELEGRAM_URL,whatsapp:process.env.WHATSAPP_URL}).listen(port,'127.0.0.1',()=>console.log(`Partner pannel API: http://127.0.0.1:${port}`));
