/* ===================== MÚSICA TAURINA: banda de música y toques de clarín y timbales =====================
   Pasodobles compuestos para el juego al estilo clásico de las bandas de plaza (2/4, cadencia andaluza
   y trío en mayor) y toques tradicionales de clarín y timbales para los cambios de tercio y los avisos. */
const NT={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const midi=s=>{const m=/^([A-G][#b]?)(\d)$/.exec(s);return 12*(+m[2]+1)+NT[m[1]]};
const parse=str=>str.trim().split(/\s+/).map(t=>{const [n,d]=t.split(':');return [n==='r'?null:midi(n),+d]});
const CHD={Am:[57,60,64],Dm:[50,53,57],E:[52,56,59],E7:[52,56,62],G:[55,59,62],F:[53,57,60],A:[57,61,64],D:[50,54,57],'F#m':[54,57,61],B7:[47,51,57],C:[48,52,55],G7:[55,59,65],Bm:[47,50,54]};
const PIEZAS={
 feria:{n:'Tarde de feria',bpm:118,secs:[
  {ch:'Am Am Dm E',mel:'A4:.5 C5:.5 E5:.5 A5:.5 A5:2 G#5:.5 F5:.5 E5:.5 D5:.5 E5:2',fan:1},
  {ch:'Am Am Dm E E E Am Am Dm Am G F E E E7 Am',mel:'E5:.75 A5:.25 A5:.5 B5:.25 C6:.25 B5:.5 A5:.5 G#5:.5 A5:.5 F5:.75 D5:.25 F5:.5 A5:.5 G#5:1.5 E5:.5 F5:.5 E5:.5 D5:.5 E5:.5 G#5:.5 B5:.5 D6:.5 C6:.25 B5:.25 C6:1 B5:.5 A5:.5 A5:2 D6:.75 C6:.25 B5:.5 A5:.5 C6:.75 B5:.25 A5:.5 G#5:.5 B5:.5 A5:.5 G5:.5 F5:.5 A5:1 G5:.5 F5:.5 E5:.5 F5:.5 G#5:.5 A5:.5 B5:1 A5:.5 G#5:.5 D6:.5 B5:.5 G#5:.5 E5:.5 A5:1.5 r:.5'},
  {ch:'A A E7 E7 E7 E7 A A D D A F#m B7 E7 A A',mel:'C#5:1 E5:.5 A5:.5 A5:1.5 G#5:.25 A5:.25 B5:1 D5:.5 E5:.5 E5:2 D5:.5 E5:.5 G#5:.5 B5:.5 D6:1 C#6:.5 B5:.5 C#6:1 A5:.5 E5:.5 A5:2 F#5:1 A5:.5 D6:.5 D6:1.5 C#6:.25 B5:.25 C#6:1 A5:.5 E5:.5 F#5:1 A5:.5 C#6:.5 B5:.5 A5:.5 F#5:.5 D#5:.5 E5:.5 G#5:.5 B5:.5 D6:.5 C#6:1 B5:.5 G#5:.5 A5:2',trio:1}]},
 puerta:{n:'Puerta grande',bpm:128,secs:[
  {ch:'D D A7 A7 A7 A7 D D G G D Bm E7 A7 D D',mel:'F#5:1 A5:.5 D6:.5 D6:1.5 C#6:.25 D6:.25 E6:1 G5:.5 A5:.5 A5:2 G5:.5 A5:.5 C#6:.5 E6:.5 G6:1 F#6:.5 E6:.5 F#6:1 D6:.5 A5:.5 D6:2 B5:1 D6:.5 G6:.5 G6:1.5 F#6:.25 E6:.25 F#6:1 D6:.5 A5:.5 B5:1 D6:.5 F#6:.5 E6:.5 D6:.5 B5:.5 G#5:.5 A5:.5 C#6:.5 E6:.5 G6:.5 F#6:1 E6:.5 C#6:.5 D6:2',tr:0}]},
 faena:{n:'Faena',bpm:96,secs:[
  {ch:'Am Am Dm E E E Am Am Dm Am G F E E E7 Am',mel:'E5:.75 A5:.25 A5:.5 B5:.25 C6:.25 B5:.5 A5:.5 G#5:.5 A5:.5 F5:.75 D5:.25 F5:.5 A5:.5 G#5:1.5 E5:.5 F5:.5 E5:.5 D5:.5 E5:.5 G#5:.5 B5:.5 D6:.5 C6:.25 B5:.25 C6:1 B5:.5 A5:.5 A5:2 D6:.75 C6:.25 B5:.5 A5:.5 C6:.75 B5:.25 A5:.5 G#5:.5 B5:.5 A5:.5 G5:.5 F5:.5 A5:1 G5:.5 F5:.5 E5:.5 F5:.5 G#5:.5 A5:.5 B5:1 A5:.5 G#5:.5 D6:.5 B5:.5 G#5:.5 E5:.5 A5:1.5 r:.5',solemne:1}]},
 charanga:{n:'Charanga de fiestas',bpm:136,lead:'clar',secs:[
  {ch:'C C G7 G7 G7 G7 C C F F C Am D7 G7 C C'.replace('D7','D'),mel:'E5:.5 G5:.5 C6:.5 E6:.5 D6:1 C6:.5 B5:.5 D6:.5 B5:.5 G5:.5 F5:.5 G5:2 F5:.5 G5:.5 B5:.5 D6:.5 F6:1 E6:.5 D6:.5 E6:.5 C6:.5 G5:.5 E5:.5 C6:2 A5:.5 C6:.5 F6:.5 A6:.5 G6:1 F6:.5 E6:.5 E6:.5 C6:.5 G5:.5 C6:.5 A5:1 C6:.5 E6:.5 F#5:.5 A5:.5 D6:.5 C6:.5 B5:.5 D6:.5 G6:.5 F6:.5 E6:1 D6:.5 B5:.5 C6:2'}]}};
CHD.D7=[50,54,60];CHD.A7=[57,61,67];
let MZ=null;
function auBus(){const c=AU.ctx;if(AU.rev)return;const len=c.sampleRate*2.2,ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
 AU.rev=c.createConvolver();AU.rev.buffer=ir;AU.revG=c.createGain();AU.revG.gain.value=.32;AU.rev.connect(AU.revG);AU.revG.connect(AU.master)}
function voice(out,t,f,d,v,kind){const c=AU.ctx,g=c.createGain(),fl=c.createBiquadFilter();fl.type='lowpass';
 const P={tpt:{w:['sawtooth','sawtooth','square'],det:[1,1.005,.998],cut:[900,3800],q:2},tbn:{w:['sawtooth','sawtooth'],det:[1,1.004],cut:[500,1600],q:1.4},tuba:{w:['triangle','sawtooth'],det:[1,1.002],cut:[260,620],q:.8},
  hrn:{w:['square','sawtooth'],det:[1,1.003],cut:[600,1400],q:.7},clar:{w:['square','triangle'],det:[1,1.003],cut:[1400,2600],q:1},clarin:{w:['sawtooth','square'],det:[1,1.006],cut:[1600,5200],q:3}}[kind];
 fl.Q.value=P.q;fl.frequency.setValueAtTime(P.cut[0],t);fl.frequency.linearRampToValueAtTime(P.cut[1],t+.05);fl.frequency.exponentialRampToValueAtTime(P.cut[0]*1.3,t+Math.max(.08,d*.9));
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+(kind==='tuba'?.02:.035));g.gain.setValueAtTime(v*.82,t+Math.max(.05,d-.06));g.gain.exponentialRampToValueAtTime(.0001,t+d+.04);
 let lfo=null;if(d>.45&&(kind==='tpt'||kind==='clar'||kind==='clarin')){lfo=c.createOscillator();lfo.frequency.value=5.4;const lg=c.createGain();lg.gain.value=f*.006;lfo.connect(lg);lfo.start(t+.18);lfo.stop(t+d+.05);lfo._g=lg}
 P.w.forEach((w,i)=>{const o=c.createOscillator();o.type=w;o.frequency.value=f*P.det[i];if(lfo)lfo._g.connect(o.frequency);o.connect(fl);o.start(t);o.stop(t+d+.08)});fl.connect(g);g.connect(out)}
function perc(out,t,k,v){const c=AU.ctx;
 if(k==='bombo'){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(48,t+.12);const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.4);o.connect(g);g.connect(out);o.start(t);o.stop(t+.45)}
 else{const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter(),g=c.createGain();
  if(k==='caja'){f.type='bandpass';f.frequency.value=2600;f.Q.value=.7;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.13);const o=c.createOscillator();o.type='triangle';o.frequency.value=190;const og=c.createGain();og.gain.setValueAtTime(v*.6,t);og.gain.exponentialRampToValueAtTime(.0001,t+.06);o.connect(og);og.connect(out);o.start(t);o.stop(t+.08)}
  else{f.type='highpass';f.frequency.value=5200;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.3)}
  s.connect(f);f.connect(g);g.connect(out);s.start(t,Math.random());s.stop(t+(k==='caja'?.15:1.4))}}
function timbal(out,t,f,v,d){const c=AU.ctx,o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(f*1.08,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+(d||.6));o.connect(g);g.connect(out);o.start(t);o.stop(t+(d||.6)+.05)}
/* programa una pieza completa sobre un bus propio (para poder pararla) */
function tocar(key,t0,bus){const P=PIEZAS[key],B=60/P.bpm,lead=P.lead||'tpt';let t=t0;
 for(const sec of P.secs){const chs=sec.ch.split(' '),mel=parse(sec.mel);let tm=t;const vol=sec.solemne?.05:.065;
  for(const [n,d] of mel){if(n!=null){voice(bus,tm,mf(n),d*B*.94,vol,lead);if(!sec.solemne&&(sec.trio||key==='puerta'))voice(bus,tm,mf(n-12),d*B*.94,vol*.55,'tbn');if(key==='charanga')voice(bus,tm,mf(n-12),d*B*.9,vol*.5,'tpt')}tm+=d*B}
  chs.forEach((cn,i)=>{const C=CHD[cn]||CHD.Am,tb=t+i*2*B;
   voice(bus,tb,mf(C[0]-12),B*.8,.13,'tuba');voice(bus,tb+B,mf((C[2]||C[0]+7)-24+12),B*.8,.11,'tuba');
   if(!sec.fan)for(const k of [.5,1.5])for(const n of C)voice(bus,tb+k*B,mf(n),B*.32,sec.solemne?.014:.02,'hrn');
   perc(bus,tb,'bombo',sec.solemne?.25:.42);if(!sec.solemne)for(const k of [.5,1.5])perc(bus,tb+k*B,'caja',.07);
   if(i%4===0&&!sec.solemne)perc(bus,tb,'plato',.05);if(i===chs.length-1&&!sec.solemne)for(let r=0;r<6;r++)perc(bus,tb+B+r*B/6,'caja',.04+r*.01)});
  t+=chs.length*2*B}
 return t-t0}
musicStart=function(key){if(!AU.ctx||!AU.on)return;if(AU.music)return;key=key||AU.next||(W3&&W3.mode==='calle'?'charanga':W3&&W3.mode==='plaza'?'faena':'feria');AU.next=null;
 try{auBus()}catch(e){}AU.music=true;const c=AU.ctx;const bus=c.createGain();bus.gain.value=1;bus.connect(AU.master);if(AU.rev)bus.connect(AU.rev);MZ={bus,key};
 const loop=()=>{if(!AU.music||!AU.ctx||MZ.bus!==bus)return;let dur=1;try{dur=tocar(key,c.currentTime+.08,bus)}catch(e){console.error(e)}AU.mt=setTimeout(loop,Math.max(2,dur)*1000-120)};loop()};
musicStop=function(){AU.music=false;clearTimeout(AU.mt);if(MZ&&MZ.bus&&AU.ctx){const g=MZ.bus.gain,t=AU.ctx.currentTime;try{g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(0,t+.6);const b=MZ.bus;setTimeout(()=>{try{b.disconnect()}catch(e){}},900)}catch(e){}}MZ=null};
/* toque de clarín y timbales (cambio de tercio) y avisos */
clarin=function(kind){if(!AU.ctx||!AU.on)return;try{auBus()}catch(e){}const c=AU.ctx,t=c.currentTime+.05,out=c.createGain();out.gain.value=1;out.connect(AU.master);if(AU.rev)out.connect(AU.rev);
 const seq=kind==='aviso'?[['G5',.25],['C6',.9]]:[['C5',.13],['E5',.13],['G5',.13],['C6',.42],['G5',.13],['C6',.13],['E6',.13],['G6',.85]];let tt=t;
 for(const [n,d] of seq){voice(out,tt,mf(midi(n)),d*.95,.11,'clarin');tt+=d}
 if(kind!=='aviso'){for(let i=0;i<14;i++)timbal(out,t+i*.07,i%2?98:73,.18+i*.01,.25);timbal(out,tt-.1,73,.32,1.2)}
 setTimeout(()=>{try{out.disconnect()}catch(e){}},6000)};
/* contexto: vuelta e indulto con «Puerta grande»; avisos con su toque; la charanga en la calle */
if(typeof actVuelta==='function'){const _av=actVuelta;actVuelta=function(){const o=_av.apply(this,arguments);if(o&&o.init){const i0=o.init;o.init=function(Z){musicStop();AU.next='puerta';return i0.apply(this,arguments)}}return o}}
if(typeof actIndulto==='function'){const _ai2=actIndulto;actIndulto=function(){const o=_ai2.apply(this,arguments);if(o&&o.init){const i0=o.init;o.init=function(Z){musicStop();AU.next='puerta';return i0.apply(this,arguments)}}return o}}
if(typeof irCalle==='function'){const _icM=irCalle;irCalle=function(id){_icM(id);if(CL){musicStop();setTimeout(()=>{if(CL&&!CL.done)musicStart('charanga')},2500)}}}
if(typeof salirCalle==='function'){const _scM=salirCalle;salirCalle=function(){musicStop();return _scM.apply(this,arguments)}}
