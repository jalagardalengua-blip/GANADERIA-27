// QA: la bancarrota no se puede cerrar ni saltar, y sigue al volver a abrir la partida
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(2000);
const r=await p.evaluate(async()=>{startReal(1);closeModal(true);S.money=-120000;advance();const t=()=>{const h=document.querySelector('#ov h2,#ov .sheet');return h?h.innerText.slice(0,40):''};
 const a=/Bancarrota/i.test(t());closeModal();await new Promise(r=>setTimeout(r,50));const b=/Bancarrota/i.test(t());closeModal(true);const m=S.month;advance();const c=S.month===m&&/Bancarrota/i.test(t());return {a,b,c,over:S.over}});
await p.reload();await p.waitForTimeout(1500);await p.evaluate(()=>continuar());await p.waitForTimeout(300);r.d=await p.evaluate(()=>/Bancarrota/i.test((document.querySelector('#ov')||{}).innerText||''));
console.log(JSON.stringify(r),errs);console.log(r.a&&r.b&&r.c&&r.d&&!errs.length?'BANCARROTA OK':'BANCARROTA MAL');await b.close()})();
