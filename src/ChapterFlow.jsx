import React,{Children,Fragment,isValidElement,useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './chapter-flow.css';
gsap.registerPlugin(ScrollTrigger);
function flatten(children){return Children.toArray(children).flatMap(child=>isValidElement(child)&&child.type===Fragment?flatten(child.props.children):[child])}
function PixelEdge({tone}){
 const ref=useRef(),seed=useRef(Math.random()*10000);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d');if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,visible=false,disposed=false,last=-Infinity,width=0,height=0,cell=0,columns=0,dpr=1;
  const random=(column,beat,salt=0)=>{const value=Math.sin(seed.current+column*127.1+beat*311.7+salt*73.3)*43758.5453;return value-Math.floor(value)};
  const resize=()=>{
   width=canvas.parentElement.clientWidth;columns=Math.ceil(width/28);cell=width/columns;height=Math.ceil(cell*5);dpr=Math.min(devicePixelRatio||1,2);
   canvas.width=Math.ceil(width*dpr);canvas.height=Math.ceil(height*dpr);canvas.style.height=`${height}px`;canvas.style.top=`${1-height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;paint(performance.now());
  };
  const paint=now=>{
   if(!width)return;
   const rect=canvas.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+height)));
   const envelope=reduce.matches?0:Math.pow(Math.sin(progress*Math.PI),1.15);
   const phase=now*.0014+progress*9+seed.current,beat=Math.floor(phase),fraction=phase-beat,blend=fraction*fraction*(3-2*fraction);
   ctx.clearRect(0,0,width,height);ctx.fillStyle=tone==='light'?'#fff':'#000';
   for(let col=0;col<columns;col++){
    const noise=random(col,beat)*(1-blend)+random(col,beat+1)*blend;
    const blocks=1+Math.floor(envelope*(.35+noise*3.65));
    const x=Math.round(col*cell),right=Math.round((col+1)*cell),front=Math.round(height-blocks*cell);
    ctx.fillRect(x,front,right-x,height-front+1);
    // Detached cells and missing cells keep the front porous, rather than a repeated skyline.
    if(envelope>.25&&random(col,beat,2)>.66){const y=front-Math.round(cell*2);if(y>=cell)ctx.fillRect(x,y,right-x,Math.round(cell))}
    if(blocks>2&&random(col,beat,3)>.72)ctx.clearRect(x,front+Math.round(cell),right-x,Math.round(cell));
   }
  };
  const tick=now=>{raf=0;if(disposed||!visible||document.hidden||reduce.matches)return;if(now-last>=105){paint(now);last=now}raf=requestAnimationFrame(tick)};
  const wake=()=>{if(visible&&!document.hidden&&!reduce.matches&&!raf)raf=requestAnimationFrame(tick)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){paint(performance.now());wake()}else{cancelAnimationFrame(raf);raf=0}},{rootMargin:'60px'});
  const resized=new ResizeObserver(resize);resized.observe(canvas.parentElement);observer.observe(canvas);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()};
  const preference=()=>{cancelAnimationFrame(raf);raf=0;paint(performance.now());wake()};
  resize();document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',preference);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resized.disconnect();document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',preference)};
 },[tone]);
 return <canvas ref={ref} className="chapter-edge" aria-hidden="true"/>;
}
export default function ChapterFlow({children}){
 const ref=useRef(),[base,setBase]=useState(()=>document.documentElement.dataset.theme||'dark'),chapters=flatten(children);
 useEffect(()=>{const observer=new MutationObserver(()=>setBase(document.documentElement.dataset.theme||'dark'));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect()},[]);
 useEffect(()=>{
  let frame=0,last='';const header=document.querySelector('.site-header'),footer=document.querySelector('.footer'),sections=Array.from(ref.current.children);
  const paint=()=>{frame=0;ref.current?.style.setProperty('--chapter-drift',`${-window.scrollY*.18}px`);const line=Math.max(header?.getBoundingClientRect().height||88,innerHeight*.35);let active=sections[0];sections.forEach(section=>{if(section.getBoundingClientRect().top<=line)active=section});const tone=active?.dataset.theme||base;if(tone!==last){last=tone;header?.setAttribute('data-chapter-theme',tone);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',tone==='light'?'#ffffff':'#000000')}footer?.setAttribute('data-chapter-theme',sections.at(-1)?.dataset.theme||base)};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(paint)};paint();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
  const refresh=()=>{ScrollTrigger.refresh();paint()};document.fonts?.ready.then(refresh);
  return()=>{window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);cancelAnimationFrame(frame);header?.removeAttribute('data-chapter-theme');footer?.removeAttribute('data-chapter-theme')};
 },[base,chapters.length]);
 return <div className="chapter-flow" ref={ref}>{chapters.map((child,i)=><div className={`chapter chapter-${i}`} key={child.key||i} data-theme={i%2?(base==='dark'?'light':'dark'):base}>{i>0&&<PixelEdge tone={i%2?(base==='dark'?'light':'dark'):base}/>}{child}</div>)}</div>
}
