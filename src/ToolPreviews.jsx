import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './tool-previews.css';

const tools=[
 {id:'blender',name:'Blender',mark:'Bl',detail:'3D modeling & animation'},
 {id:'after-effects',name:'After Effects',mark:'Ae',detail:'Motion graphics & compositing'},
 {id:'davinci-resolve',name:'DaVinci Resolve',mark:'Dr',detail:'Editing & color'},
 {id:'figma',name:'Figma',mark:'Fi',detail:'Interface & product design'},
 {id:'illustrator',name:'Illustrator',mark:'Ai',detail:'Vector & identity design'},
 {id:'photoshop',name:'Photoshop',mark:'Ps',detail:'Image making & retouching'}
];

export default function ToolPreviews(){
 const [preview,setPreview]=useState(null);
 const movement=useRef(null),region=useRef(null);
 const hide=()=>setPreview(p=>p?{...p,shown:false}:p);
 useEffect(()=>{
  const close=e=>{if(e.key==='Escape')hide()};
  const outside=e=>{if(!region.current?.contains(e.target))hide()};
  const scroll=()=>{const el=document.activeElement;if(el?.matches('.tool-preview-trigger:focus-visible')){const tool=tools.find(t=>t.id===el.dataset.tool);if(tool)show(tool,el);else hide()}else hide()};
  window.addEventListener('scroll',scroll,{passive:true});
  window.addEventListener('resize',hide);
  window.addEventListener('keydown',close);
  document.addEventListener('pointerdown',outside);
  return()=>{window.removeEventListener('scroll',scroll);window.removeEventListener('resize',hide);window.removeEventListener('keydown',close);document.removeEventListener('pointerdown',outside)};
 },[]);
 const show=(tool,element)=>{
  const r=element.getBoundingClientRect(),width=Math.min(340,innerWidth-32),height=246;
  const x=Math.max(16,Math.min(innerWidth-width-16,r.left+r.width/2-width/2));
  const above=r.top>height+30;
  const y=above?r.top-height-20:Math.min(innerHeight-height-16,r.bottom+20);
  if(movement.current)movement.current.style.transform='translate(0,0) rotate(0deg)';
  setPreview({tool,x,y:Math.max(16,y),width,shown:true});
 };
 const move=e=>{
  if(e.pointerType!=='mouse'||!movement.current)return;
  const r=e.currentTarget.getBoundingClientRect();
  const offset=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));
  movement.current.style.transform=`translate(${offset*7}px,-2px) rotate(${offset*3}deg)`;
 };
 return <div className="tools-preview-region" ref={region}>
  <p className="tools-preview-hint">THE TOOLS BEHIND THE WORK <span>Hover or tap to explore ↗</span></p>
  <div className="tool-grid tool-preview-grid">
   {tools.map(tool=><button type="button" className="tool tool-preview-trigger" key={tool.id}
    data-tool={tool.id} data-active={preview?.shown&&preview.tool.id===tool.id}
    aria-describedby={preview?.shown&&preview.tool.id===tool.id?'tool-workspace-preview':undefined}
    onPointerEnter={e=>{if(e.pointerType==='mouse')show(tool,e.currentTarget)}} onPointerMove={move}
    onPointerLeave={e=>{if(e.pointerType==='mouse'&&!e.currentTarget.matches(':focus-visible'))setPreview(p=>p?.tool.id===tool.id?{...p,shown:false}:p)}}
    onFocus={e=>show(tool,e.currentTarget)} onBlur={hide}
    onClick={e=>show(tool,e.currentTarget)}>
    <span className="tool-monogram" aria-hidden="true">{tool.mark}</span><span className="tool-preview-name">{tool.name}</span><span className="tool-preview-arrow" aria-hidden="true">↗</span>
   </button>)}
  </div>
  <p className="tool-preview-credit">App views from their publishers. Blender: <a href="https://docs.blender.org/manual/en/latest/interface/window_system/introduction.html" target="_blank" rel="noreferrer">Blender Manual</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a> (resized).</p>
  {preview&&createPortal(<div className="tool-workspace-preview" id="tool-workspace-preview" role="tooltip" data-visible={preview.shown}
   style={{left:preview.x,top:preview.y,width:preview.width}}>
   <div className="tool-preview-movement" ref={movement}>
    <div className="tool-preview-heading"><span className="preview-light"/>{preview.tool.name}<span>WORKSPACE</span></div>
    <div className="tool-preview-image"><img src={`/images/tools/${preview.tool.id}.webp`} alt={`${preview.tool.name} application workspace preview`} width="1000" height="625"/></div>
    <div className="tool-preview-footer"><span>{preview.tool.detail}</span><span aria-hidden="true">↗</span></div>
   </div>
  </div>,document.body)}
 </div>;
}
