/* ===================== SONIDO DE PLAZA SIN ZUMBIDOS =====================
   - Aplausos hechos de palmas reales (miles de palmadas cortas), no con un pulso cuadrado que zumba.
   - Murmullo del público natural, con oleadas suaves, y volumen actualizado sin saturar el audio.
   - Banda de música con timbre de metales de verdad: una sola onda por nota (sin batidos), ataque suave y vibrato ligero. */
const SND={buf:{},waves:null,lastLv:-1,lastT:0};
function sndBuf(key,secs,fill){const c=AU.ctx;if(SND.buf[key])return SND.buf[key];const n=Math.floor(c.sampleRate*secs),b=c.createBuffer(2,n,c.sampleRate);for(let ch=0;ch<2;ch++)fill(b.getChannelData(ch),c.sampleRate,ch);SND.buf[key]=b;return b}
/* palmas: cada palmada es un chasquido breve de ruido con su propio brillo */
function sndAplauso(){return sndBuf('apl',4,(d,sr)=>{const N=d.length;for(let k=0;k<N/sr*190;k++){const st=Math.floor(Math.random()*N),len=Math.floor(sr*(.012+Math.random()*.02)),a=.25+Math.random()*.75,br=.35+Math.random()*.6;let lp=0;
  for(let i=0;i<len&&st+i<N;i++){const e=Math.exp(-i/(len*.28));const w=Math.random()*2-1;lp=lp+(w-lp)*br;d[st+i]+=(w-lp*.6)*e*a*.16}}
 for(let i=0;i<N;i++)d[i]=Math.tanh(d[i]*1.4)})}
/* murmullo: ruido coloreado con oleadas lentas (sin tonos fijos) */
function sndMurmullo(){return sndBuf('mur',8,(d,sr)=>{const N=d.length;let b0=0,b1=0,b2=0,env=.6,tg=.6;for(let i=0;i<N;i++){if(i%Math.floor(sr*.35)===0)tg=.35+Math.random()*.65;env+=(tg-env)*.00004;const w=Math.random()*2-1;b0=.997*b0+w*.03;b1=.985*b1+w*.06;b2=.9*b2+w*.12;d[i]=(b0+b1*.8+b2*.35)*env*.9}
 // fundido de los extremos para que el bucle no haga clic
 const F=Math.floor(sr*.2);for(let i=0;i<F;i++){const k=i/F;d[i]*=k;d[N-1-i]*=k}})}
applause=function(dur,v){if(!AU.ctx)return;try{const c=AU.ctx,t=c.currentTime,s=c.createBufferSource();s.buffer=sndAplauso();s.loop=true;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=600;const pk=c.createBiquadFilter();pk.type='peaking';pk.frequency.value=2200;pk.gain.value=3;
 const g=c.createGain(),V=Math.min(.9,v*2.2);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(V,t+.35);g.gain.setValueAtTime(V,t+Math.max(.5,dur-.9));g.gain.exponentialRampToValueAtTime(.0001,t+dur+.4);
 s.connect(hp);hp.connect(pk);pk.connect(g);g.connect(AU.master);if(AU.rev)g.connect(AU.rev);s.start(t,Math.random()*3);s.stop(t+dur+.5)}catch(e){}};
crowdStart=function(){if(!AU.ctx||AU.crowd)return;try{const c=AU.ctx,s=c.createBufferSource();s.buffer=sndMurmullo();s.loop=true;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=140;
 const g=c.createGain();g.gain.value=.0001;s.connect(hp);hp.connect(lp);lp.connect(g);g.connect(AU.master);s.start(0,Math.random()*6);g.gain.setTargetAtTime(.05,c.currentTime,.8);AU.crowd={s,g,lp};SND.lastLv=-1}catch(e){}};
crowdLevel=function(v){if(!AU.crowd||!AU.ctx)return;const now=AU.ctx.currentTime;if(Math.abs(v-SND.lastLv)<.006&&now-SND.lastT<1)return;if(now-SND.lastT<.12)return;SND.lastLv=v;SND.lastT=now;
 const g=AU.crowd.g.gain;try{g.cancelScheduledValues(now);g.setTargetAtTime(Math.max(.0001,v*1.25),now,.35);AU.crowd.lp.frequency.setTargetAtTime(1200+v*5000,now,.4)}catch(e){}};
const _crowdStopS=typeof crowdStop==='function'?crowdStop:null;
crowdStop=function(){if(AU.crowd&&AU.ctx){const c=AU.ctx,cr=AU.crowd;try{cr.g.gain.cancelScheduledValues(c.currentTime);cr.g.gain.setTargetAtTime(.0001,c.currentTime,.25);cr.s.stop(c.currentTime+1)}catch(e){}AU.crowd=null;return}if(_crowdStopS)_crowdStopS()};
/* pitos del tendido: más cortos y menos agudos */
whistles=function(v){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime;for(let i=0;i<6;i++){const o=c.createOscillator();o.type='sine';const st=t+Math.random()*1.4,f=1500+Math.random()*900;o.frequency.setValueAtTime(f,st);o.frequency.linearRampToValueAtTime(f*(.9+Math.random()*.15),st+.35);const g=c.createGain();g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(v*.035,st+.04);g.gain.exponentialRampToValueAtTime(.0001,st+.45);o.connect(g);g.connect(AU.master);o.start(st);o.stop(st+.5)}};
/* timbres de banda: ondas con los armónicos de cada instrumento */
function sndWaves(){if(SND.waves)return SND.waves;const c=AU.ctx;const mk=h=>{const re=new Float32Array(h.length+1),im=new Float32Array(h.length+1);h.forEach((a,i)=>im[i+1]=a);return c.createPeriodicWave(re,im,{disableNormalization:false})};
 SND.waves={tpt:mk([1,.85,.72,.6,.48,.36,.27,.2,.14,.1,.07,.05]),tbn:mk([1,.75,.55,.42,.3,.2,.12,.08,.05]),tuba:mk([1,.5,.22,.1,.05]),hrn:mk([1,.45,.25,.14,.08,.04]),clar:mk([1,.04,.55,.03,.32,.02,.18,.01,.09]),clarin:mk([1,.9,.8,.66,.52,.4,.3,.22,.16,.11,.08])};return SND.waves}
voice=function(out,t,f,d,v,kind){const c=AU.ctx;const W=sndWaves()[kind]||sndWaves().tpt;const g=c.createGain(),fl=c.createBiquadFilter();fl.type='lowpass';
 const cut={tpt:[1400,4200],tbn:[700,2000],tuba:[380,800],hrn:[800,1700],clar:[1800,3200],clarin:[2200,5600]}[kind]||[1400,4000];fl.Q.value=.4;
 fl.frequency.setValueAtTime(cut[0],t);fl.frequency.linearRampToValueAtTime(cut[1],t+.06);fl.frequency.exponentialRampToValueAtTime(cut[0]*1.4,t+Math.max(.1,d*.9));
 const at=kind==='tuba'?.03:kind==='hrn'?.05:.045;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v*.9,t+at);g.gain.setValueAtTime(v*.8,t+Math.max(at+.01,d-.07));g.gain.exponentialRampToValueAtTime(.0001,t+d+.06);
 const o=c.createOscillator();o.setPeriodicWave(W);o.frequency.value=f;
 if(d>.4&&kind!=='tuba'&&kind!=='hrn'){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.2;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.004,t+Math.min(.5,d*.6));l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+d+.08)}
 o.connect(fl);fl.connect(g);g.connect(out);o.start(t);o.stop(t+d+.1)};
/* ole más natural: el grito del tendido sube y se abre */
oleSnd=function(big){if(!AU.ctx)return;try{const c=AU.ctx,t=c.currentTime,s=c.createBufferSource();s.buffer=sndMurmullo();const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(big?.9:.55,t+.15);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);
 for(const [a,b] of [[380,620],[760,1050]]){const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=2.2;f.frequency.setValueAtTime(a,t);f.frequency.linearRampToValueAtTime(b,t+.4);s.connect(f);f.connect(g)}g.connect(AU.master);if(AU.rev)g.connect(AU.rev);s.start(t,Math.random()*6);s.stop(t+1.2)}catch(e){}};
