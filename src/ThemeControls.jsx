import React,{useEffect,useRef,useState} from 'react';
import './themes.css';

export function ThemeToggle(){
 const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'dark');
 useEffect(()=>{
  document.documentElement.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#ffffff':'#000000');
  try{localStorage.setItem('siva-theme',theme)}catch{}
 },[theme]);
 return <button className="theme-toggle" type="button" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`} title={`Switch to ${theme==='dark'?'light':'dark'} theme`}>
  {theme==='dark'?<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>:<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/></svg>}
  <span>{theme==='dark'?'Light':'Dark'}</span>
 </button>;
}

export function SiteBackground(){
 const ref=useRef();
 useEffect(()=>{
  let frame=0;
  const paint=()=>{ref.current?.style.setProperty('--grid-x',`${-window.scrollY*.18}px`);frame=0};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(paint)};
  paint();window.addEventListener('scroll',scroll,{passive:true});
  return()=>{window.removeEventListener('scroll',scroll);cancelAnimationFrame(frame)};
 },[]);
 return <div ref={ref} className="site-atmosphere" aria-hidden="true"><div/></div>;
}
