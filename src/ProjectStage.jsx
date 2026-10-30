import React,{useEffect,useRef,useState} from 'react';
import './project-stage.css';

// Separate nested transforms keep the scroll reveal, float and pointer tilt independent.
export default function ProjectStage({project,index}){
 const ref=useRef(),[active,setActive]=useState(false);
 useEffect(()=>{const io=new IntersectionObserver(([entry])=>setActive(entry.isIntersecting),{threshold:.12});io.observe(ref.current);return()=>io.disconnect()},[]);
 const types=['laptop','layers','glide','tablet','artwork'];
 const move=e=>{if(e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--rx',`${-(e.clientY-r.top-r.height/2)/r.height*7}deg`);e.currentTarget.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/r.width*9}deg`)};
 const reset=e=>{e.currentTarget.style.setProperty('--rx','0deg');e.currentTarget.style.setProperty('--ry','0deg')};
 return <div ref={ref} className={`project-stage stage-${index} stage-${types[index]} ${active?'stage-active':''}`} onPointerMove={move} onPointerLeave={reset} style={{'--delay':`${index*-.9}s`}}>
  <span className="stage-orbit" aria-hidden="true"/>
  <div className="stage-tilt"><div className="stage-float">
   {index===1&&<><span className="depth-sheet depth-sheet-back" aria-hidden="true"><img src={project.thumbnail} alt="" loading="lazy"/></span><span className="depth-sheet depth-sheet-mid" aria-hidden="true"><img src={project.thumbnail} alt="" loading="lazy"/></span></>}
   <div className="stage-browser">
   <div className="stage-chrome" aria-hidden="true"><span className="stage-dots"><i/><i/><i/></span><span>{project.url.includes('framer.app')?'FRAMER / ':''}{project.title}</span><span>↗</span></div>
   <div className="stage-screen"><img src={project.thumbnail||project.image} alt={`${project.title} original project preview`} loading="lazy" width="1250" height="650"/></div>
  </div>{index===0&&<span className="laptop-base" aria-hidden="true"><i/></span>}</div></div>
  <span className="stage-floor" aria-hidden="true"/>
 </div>;
}
