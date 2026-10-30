import React,{useLayoutEffect,useRef} from 'react';
import gsap from 'gsap';
import './loading-intro.css';

export default function LoadingIntro({mode,onReveal,onComplete}){
 const host=useRef(),callbacks=useRef({onReveal,onComplete});callbacks.current={onReveal,onComplete};
 useLayoutEffect(()=>{
  const oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const reduce=mode==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preview=import.meta.env.DEV&&new URLSearchParams(location.search).has('loader-preview');
  let finished=false,revealed=false;
  const blocks=[...host.current.querySelectorAll('.loader-cube')];
  const morph=()=>{
   // A miniature pixel edge: uneven columns, gaps and detached squares.
   const heights=Array.from({length:9},()=>2+Math.floor(Math.random()*5));
   const cells=blocks.map((_,i)=>{
    const col=i%9,row=Math.floor(i/9),front=7-heights[col];
    const attached=row>=front&&row<7;
    const detached=row===front-2&&Math.random()>.6;
    return (attached&&Math.random()>.18)||detached;
   });
   gsap.to(blocks,{opacity:i=>cells[i]?1:0,scale:i=>cells[i]?1:.7,
    duration:reduce?0:.2,ease:'power2.out',stagger:reduce?0:{each:.002,from:'random'},overwrite:'auto'});
  };
  gsap.set(blocks,{opacity:0,scale:.7});morph();
  const pulse=reduce?null:setInterval(morph,330);
  const line=gsap.fromTo(host.current.querySelector('.loader-line-fill'),{scaleX:0},{scaleX:1,duration:reduce?.15:2.5,ease:'power1.inOut',repeat:preview&&!reduce?-1:0,repeatDelay:.35});
  const reveal=()=>{if(!revealed){revealed=true;callbacks.current.onReveal()}};
  const done=()=>{if(finished)return;finished=true;reveal();callbacks.current.onComplete()};
  const tl=preview?null:gsap.timeline({onComplete:done});
  if(!preview)tl.call(reveal,[],reduce?.15:2.55).to(host.current,{opacity:0,duration:reduce?.1:.3,ease:'none'});
  const escape=e=>{if(e.key==='Escape'){tl?.kill();done()}};window.addEventListener('keydown',escape);
  const safety=preview?null:setTimeout(()=>{tl?.kill();done()},3400);
  return()=>{line.kill();gsap.killTweensOf(blocks);clearInterval(pulse);clearTimeout(safety);tl?.kill();window.removeEventListener('keydown',escape);document.body.style.overflow=oldOverflow};
 },[mode]);
 return <div ref={host} className="loading-intro pixel-loader" role="status" aria-label="Loading Siva's portfolio"><div className="loader-mark" aria-hidden="true"><div className="random-cube-loader">{Array.from({length:63},(_,i)=><i className="loader-cube" key={i} style={{left:(i%9)*7,top:Math.floor(i/9)*7}}/>)}</div><span className="loader-line"><i className="loader-line-fill"/></span></div></div>
}
