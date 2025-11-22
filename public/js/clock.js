// clock.js
const $ = s => document.querySelector(s);
const clock = {h:$('#hours'),m:$('#minutes'),s:$('#seconds'),ap:$('#ampm')};
let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const urlTz = new URLSearchParams(location.search).get('tz');
if(urlTz) tz = urlTz;
const update = () => {
  const now = new Date();
  const t = new Intl.DateTimeFormat('en-US',{
    timeZone:tz,hour12:true,hour:'2-digit',minute:'2-digit',second:'2-digit'
  }).formatToParts(now);
  const h = t.find(p=>p.type==='hour').value;
  clock.h.textContent = h;
  clock.m.textContent = t.find(p=>p.type==='minute').value;
  clock.s.textContent = t.find(p=>p.type==='second').value;
  clock.ap.textContent = t.find(p=>p.type==='dayPeriod')?.value||'';
};
update(); setInterval(update, 1000);
// sync drift every 60 s
setInterval(async()=>{
  const {epoch} = await fetch('/api/time.json').then(r=>r.json());
  const drift = Date.now() - epoch;
  if(Math.abs(drift)>1000) location.reload();
},60000);
