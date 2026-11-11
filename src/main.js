import './styles.css';
import {calculate} from './calculator.js';
import {toSI,fromSI} from './conversions.js';
const $=id=>document.getElementById(id);
const defaults=()=>({shape:'rect',dim:'inch',vu:'m/s',qu:'CFM',w:.254,h:.254,d:.25,v:10,q:toSI(1000,'CFM'),ratio:1,step:.025});
const states={flow:defaults(),velocity:defaults(),size:defaults()};let mode='flow',result=null;
const names={flow:'ปริมาณลม',velocity:'ความเร็วลม',size:'ขนาดท่อ'};
$('app').innerHTML=`<header><div class="mark">ET</div><div><h1>HVAC Duct Calculator</h1><p>เครื่องคำนวณท่อลม · EakThai Technical</p></div><span class="badge">OFFLINE · v1.0</span></header>
<nav aria-label="โหมดคำนวณ">${Object.entries(names).map(([k,v])=>`<button data-mode="${k}">${v}</button>`).join('')}</nav>
<main><section class="card"><h2>ข้อมูลออกแบบ</h2><label>รูปทรงท่อ<select id="shape"><option value="rect">ท่อเหลี่ยม</option><option value="round">ท่อกลม</option></select></label>
<label>หน่วยขนาด<select id="dim"><option value="inch">inch</option><option value="mm">mm</option></select></label>
<div id="dimensions"><label><span id="wlabel">ความกว้าง</span><input id="w" type="number" min="0" step="any"></label><label id="heightrow">ความสูง<input id="h" type="number" min="0" step="any"></label></div>
<div id="flowrow"><label>ปริมาณลม<input id="q" type="number" min="0" step="any"></label><label>หน่วยปริมาณลม<select id="qu"><option>CFM</option><option>m³/h</option><option>L/s</option></select></label></div>
<div><label><span id="vlabel">ความเร็วลม</span><input id="v" type="number" min="0" step="any"></label><label>หน่วยความเร็ว<select id="vu"><option>m/s</option><option>FPM</option></select></label></div>
<div id="sizerows"><label id="ratiorow">อัตราส่วน กว้าง / สูง<select id="ratio">${[1,1.5,2,2.5,3].map(x=>`<option value="${x}">${x.toFixed(1)}</option>`).join('')}</select></label><label>ปัดขนาดขึ้น<select id="step"><option value="0.025">25 mm</option><option value="0.05">50 mm</option></select></label></div>
<button id="reset" class="secondary">รีเซ็ตโหมดนี้</button><p id="error" role="alert"></p></section>
<section class="card results" aria-live="polite"><p class="eyebrow" id="resulttitle"></p><div id="primary">—</div><p id="subtitle"></p><div id="metrics"></div><button id="copy">คัดลอกผลลัพธ์</button><p id="feedback" role="status"></p><details><summary>Engineering Details · รายละเอียดวิศวกรรม</summary><pre id="details"></pre></details></section></main>
<footer>Calculated airflow assumes uniform mean velocity across the unobstructed duct cross-sectional area. Fan performance, duct friction, fitting losses, and air density effects are not included.</footer>`;
const fmt=(x,n=3)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:n}).format(x);
function dimensions(w,h,s){return s.shape==='round'?`Ø${fmt(fromSI(w,s.dim))} ${s.dim}`:`${fmt(fromSI(w,s.dim))} × ${fmt(fromSI(h,s.dim))} ${s.dim}`;}
function update(){
 const s=states[mode];$('feedback').textContent='';
 try{
 result=calculate({mode,shape:s.shape,w:s.shape==='round'?s.d:s.w,h:s.h,q:s.q,v:s.v,ratio:s.ratio,step:s.step});
 const r=result;let metrics=[['ปริมาณลม',`${fmt(fromSI(r.q,'CFM'),2)} CFM`],['ปริมาณลม',`${fmt(r.q*3600,2)} m³/h`],['ปริมาณลม',`${fmt(r.q*1000,2)} L/s`],['ปริมาณลม',`${fmt(r.q,6)} m³/s`],['ความเร็ว',`${fmt(r.v)} m/s · ${fmt(fromSI(r.v,'FPM'),2)} FPM`],['พื้นที่',`${fmt(r.a,8)} m²`]];
 $('resulttitle').textContent=names[mode];
 $('primary').textContent=mode==='flow'?`${fmt(fromSI(r.q,'CFM'),2)} CFM`:mode==='velocity'?`${fmt(fromSI(r.v,s.vu),2)} ${s.vu}`:dimensions(r.w,r.h,s);
 $('subtitle').textContent=mode==='size'?'ขนาดแนะนำหลังปัดขึ้น (ไม่ใช่ขนาดมาตรฐานการค้า)':dimensions(r.w,r.h,s);
 if(mode==='size')metrics.push(['ขนาดตามทฤษฎี',dimensions(r.tw,r.th,s)],['ความเร็วหลังปัด',`${fmt(r.actualV)} m/s`],['พื้นที่หลังปัด',`${fmt(s.shape==='round'?Math.PI*r.w*r.w/4:r.w*r.h,8)} m²`]);
 $('metrics').replaceChildren(...metrics.map(([a,b])=>{const d=document.createElement('div');const label=document.createElement('span');label.textContent=a;const strong=document.createElement('strong');strong.textContent=b;d.append(label,strong);return d;}));
 $('details').textContent=`Mode: ${names[mode]}\nShape: ${s.shape}\nDuct: ${dimensions(r.w,r.h,s)}\nArea: ${r.a} m²\nFormula: ${mode==='flow'?'Q = A × V':mode==='velocity'?'V = Q / A':'A = Q / V; D = √(4A/π); W = √(A × ratio); H = A / W'}\n1 inch = 0.0254 m\n1 ft = 0.3048 m\n1 CFM = ${0.3048**3/60} m³/s\n1 m/s = ${60/.3048} FPM\n1 m³/s = 3600 m³/h = 1000 L/s`;
 $('error').textContent='';$('copy').disabled=false;
 }catch(e){result=null;$('error').textContent=e.message;$('primary').textContent='—';$('subtitle').textContent='กรุณาตรวจสอบข้อมูล';$('metrics').replaceChildren();$('details').textContent='';$('copy').disabled=true;}
}
function render(){const s=states[mode];document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',b.dataset.mode===mode);});for(const k of ['shape','dim','vu','qu','ratio','step'])$(k).value=s[k];
 $('w').value=fromSI(s.shape==='round'?s.d:s.w,s.dim);$('h').value=fromSI(s.h,s.dim);$('q').value=fromSI(s.q,s.qu);$('v').value=fromSI(s.v,s.vu);
 $('dimensions').hidden=mode==='size';$('heightrow').hidden=s.shape==='round';$('wlabel').textContent=s.shape==='round'?'เส้นผ่านศูนย์กลาง':'ความกว้าง';$('flowrow').hidden=mode==='flow';$('v').hidden=mode==='velocity';$('vlabel').hidden=mode==='velocity';$('sizerows').hidden=mode!=='size';$('ratiorow').hidden=s.shape==='round';update();}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render();});
for(const k of ['shape','dim','vu','qu','ratio','step'])$(k).onchange=()=>{states[mode][k]=['ratio','step'].includes(k)?Number($(k).value):$(k).value;render();};
for(const k of ['w','h','q','v'])$(k).oninput=()=>{const s=states[mode];const raw=$(k).value;const x=raw.trim()===''?NaN:Number(raw);const unit=['w','h'].includes(k)?s.dim:k==='q'?s.qu:s.vu;s[k==='w'&&s.shape==='round'?'d':k]=toSI(x,unit);update();};
$('reset').onclick=()=>{states[mode]=defaults();render();};
$('copy').onclick=async()=>{if(!result)return;try{await navigator.clipboard.writeText(`HVAC Duct Calculator\n${names[mode]}\n${$('primary').textContent}\n${$('subtitle').textContent}\n${$('metrics').innerText}\n${$('details').textContent}`);$('feedback').textContent='คัดลอกแล้ว';}catch{$('feedback').textContent='คัดลอกไม่สำเร็จ กรุณาลองอีกครั้ง';}};
render();
