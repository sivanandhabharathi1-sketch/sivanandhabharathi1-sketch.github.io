import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './target-cursor.css';
const COUNT=36;
export default function TargetCursor(){
 const [portalHost,setPortalHost]=useState(document.body),layer=useRef(),dot=useRef(),label=useRef(),tiles=useRef([]);
 useEffect(()=>{
  const media=matchMedia('(any-hover: hover) and (any-pointer: fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,visible=false,pressed=false,host=document.body,index=0,lastPoint=null,target=null;
  const mouse={x:0,y:0},center={x:0,y:0},pool=Array.from({length:COUNT},()=>({x:0,y:0,born:-1000}));
  const hide=()=>{visible=false;lastPoint=null;document.documentElement.classList.remove('target-cursor-ready');if(layer.current)layer.current.dataset.active='false';cancelAnimationFrame(raf);raf=0;pool.forEach(p=>p.born=-1000)};
  const inspect=el=>{const next=document.querySelector('dialog[open]')||document.body;if(next!==host){host=next;setPortalHost(next)}target=el?.closest?.('a[href],button:not(:disabled),input,textarea,select,canvas')||null};
  const tick=time=>{
   raf=0;if(!visible||document.hidden||!media.matches){hide();return}
   if(!layer.current||!dot.current){raf=requestAnimationFrame(tick);return}
   center.x+=(mouse.x-center.x)*.65;center.y+=(mouse.y-center.y)*.65;
   layer.current.dataset.active='true';dot.current.style.transform=`translate3d(${center.x}px,${center.y}px,0) scale(${pressed?.65:target?1.3:1})`;
   const text=target?(target.matches('canvas')?'DRAG':target.matches('input,textarea,select')?'':target.closest('.project-card')?'VIEW':'OPEN'):'';
   label.current.textContent=text;label.current.style.transform=`translate3d(${center.x+21}px,${center.y+15}px,0)`;
   if(!reduced.matches&&lastPoint){const dx=mouse.x-lastPoint.x,dy=mouse.y-lastPoint.y,d=Math.hypot(dx,dy),steps=Math.min(12,Math.floor(d/10));for(let n=1;n<=steps;n++){const t=n/steps,p=pool[index++%COUNT];p.x=Math.round((lastPoint.x+dx*t)/4)*4;p.y=Math.round((lastPoint.y+dy*t)/4)*4;p.born=time}if(steps)lastPoint={...mouse}}
   pool.forEach((p,i)=>{const age=(time-p.born)/450,el=tiles.current[i];if(!el)return;el.style.opacity=age<1?String(Math.max(0,(1-age)*.55)):'0';if(age<1)el.style.transform=`translate3d(${p.x}px,${p.y}px,0) scale(${Math.ceil((1-age)*3)/3})`});
   raf=requestAnimationFrame(tick);
  };
  const move=e=>{if(e.pointerType==='touch'||!media.matches||document.querySelector('.loading-intro')){hide();return}mouse.x=e.clientX;mouse.y=e.clientY;if(!visible){center.x=mouse.x;center.y=mouse.y;lastPoint={...mouse}}visible=true;inspect(e.target);document.documentElement.classList.add('target-cursor-ready');if(!raf)raf=requestAnimationFrame(tick)};
  const down=e=>{if(e.pointerType==='touch')hide();else pressed=true},up=()=>pressed=false,out=e=>{if(!e.relatedTarget)hide()},key=e=>{if(e.key==='Tab'||e.key==='Escape')hide()},visibility=()=>{if(document.hidden)hide()},scroll=()=>{if(visible)inspect(document.elementFromPoint(mouse.x,mouse.y))};
  const observer=new MutationObserver(scroll);observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerdown',down);document.addEventListener('pointerup',up);document.addEventListener('pointerout',out);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',hide);document.addEventListener('scroll',scroll,{capture:true,passive:true});media.addEventListener('change',hide);
  return()=>{hide();observer.disconnect();document.removeEventListener('pointermove',move);document.removeEventListener('pointerdown',down);document.removeEventListener('pointerup',up);document.removeEventListener('pointerout',out);document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',hide);document.removeEventListener('scroll',scroll,true);media.removeEventListener('change',hide)};
 },[]);
 return createPortal(<div className="pixel-cursor" ref={layer} data-active="false" aria-hidden="true">{Array.from({length:COUNT},(_,i)=><i className="pixel-cursor-trail" key={i} ref={el=>tiles.current[i]=el}/>)}<i className="pixel-cursor-dot" ref={dot}/><span className="pixel-cursor-label" ref={label}/></div>,portalHost)
}
