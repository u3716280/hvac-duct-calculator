import { positive, finiteResults } from './validation.js';
export function area(shape,w,h) {
 positive(w,'ขนาดท่อ');
 if(shape==='round') return positive(Math.PI*w*w/4,'พื้นที่');
 if(shape!=='rect') throw new Error('รูปทรงไม่ถูกต้อง');
 return positive(w*positive(h,'ความสูง'),'พื้นที่');
}
export function calculate({mode,shape,w,h,q,v,ratio=1,step=0.025}) {
 let a;
 if(mode==='size') {
  positive(q,'ปริมาณลม');positive(v,'ความเร็ว');positive(ratio,'อัตราส่วน');positive(step,'ระยะปัด');
  a=q/v;
  const tw=shape==='round'?Math.sqrt(4*a/Math.PI):Math.sqrt(a*ratio);
  const th=shape==='round'?tw:a/tw;
  const up=x=>{const n=x/step, nearest=Math.round(n);return (Math.abs(n-nearest)<=1e-12*Math.max(1,n)?nearest:Math.ceil(n))*step;};
  w=up(tw); h=shape==='round'?w:up(th);
  return finiteResults({a,q,v,tw,th,w,h,actualV:q/area(shape,w,h)});
 }
 a=area(shape,w,h);
 if(mode==='flow') q=a*positive(v,'ความเร็ว');
 else if(mode==='velocity') v=positive(q,'ปริมาณลม')/a;
 else throw new Error('โหมดไม่ถูกต้อง');
 return finiteResults({a,q,v,w,h:shape==='round'?w:h});
}
