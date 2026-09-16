if(!['localhost','127.0.0.1','[::1]',''].includes(location.hostname)){
 const notice=document.createElement('aside');
 notice.textContent='ДЕМО MVP — не настоящий интернет-банк. Не вводите реальные банковские данные. Заявки и ЭЦП имитируются. Вход: klim / klim. AI: общий лимит 50 запросов за 24 часа.';
 notice.style.cssText='position:relative;z-index:9999;padding:12px 16px;background:#fff0c2;color:#332500;font:14px/1.5 Arial,sans-serif;text-align:center;';
 document.body.prepend(notice);
}
