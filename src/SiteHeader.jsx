import React,{useEffect,useRef,useState} from 'react';

const links=[['home','/','Home'],['work','/work/','Work'],['about','/about/','About'],['contact','/contact/','Contact']];
const pixels=[[[1,0],[0,0]],[[0,1],[2,0]],[[1,1],[1,1]],[[2,1],[0,2]],[[1,2],[2,2]]];
export default function SiteHeader({page}){
 const [scrolled,setScrolled]=useState(()=>window.scrollY>32),[open,setOpen]=useState(false);
 const header=useRef(),toggle=useRef();
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>32);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
 useEffect(()=>{
  const desktop=matchMedia('(min-width:701px)');
  const close=()=>{if(desktop.matches)setOpen(false)};
  desktop.addEventListener('change',close);return()=>desktop.removeEventListener('change',close);
 },[]);
 useEffect(()=>{
  if(!open)return;
  header.current.querySelector('.nav a')?.focus();
  const outside=e=>{if(!header.current?.contains(e.target))setOpen(false)};
  const keyboard=e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false);toggle.current?.focus()}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',keyboard);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',keyboard)};
 },[open]);
 return <header ref={header} className={`site-header reference-nav ${page==='home'&&!scrolled?'nav-clear':'nav-solid'}`}>
  <a className="wordmark" href="/" aria-label="Siva home">siva<i/></a>
  <button ref={toggle} className="pixel-menu-toggle" type="button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="primary-navigation" onClick={()=>setOpen(value=>!value)}>
   <span className="pixel-menu-symbol" aria-hidden="true">{pixels.map(([closed,opened],i)=><i key={i} style={{'--closed-x':`${closed[0]*8}px`,'--closed-y':`${closed[1]*8}px`,'--open-x':`${opened[0]*8}px`,'--open-y':`${opened[1]*8}px`,'--pixel-delay':`${i*-.45}s`}}/>)}</span>
  </button>
  <nav id="primary-navigation" className={`nav ${open?'mobile-nav-open':''}`} aria-label="Main navigation">
   {links.map(([id,url,label])=><a key={id} href={url} aria-current={page===id?'page':undefined} onClick={()=>setOpen(false)}>{label}</a>)}
  </nav>
 </header>;
}
