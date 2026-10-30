import React,{Children,cloneElement,isValidElement,useEffect,useRef} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';
import './paper-world.css';

function words(children){
 return Children.map(children,(child,index)=>{
  if(typeof child==='string')return child.split(/(\s+)/).map((word,i)=>/^\s+$/.test(word)?word:<span className="word-mask" key={`${index}-${i}`}><span className="reveal-word">{word}</span></span>);
  if(isValidElement(child)&&child.props.children)return cloneElement(child,{},words(child.props.children));
  return child;
 });
}
export function RevealTitle({as:Tag='h2',children,...props}){return <Tag {...props} className={`motion-title ${props.className||''}`}>{words(children)}</Tag>}

export function usePortfolioMotion(root,enabled,paused){
 const smooth=useRef();
 useEffect(()=>{
  if(!enabled)return;
  const nativeTouch=matchMedia('(max-width: 700px)').matches;
  const lenis=nativeTouch?null:new Lenis({lerp:.09,smoothWheel:true,syncTouch:false,wheelMultiplier:.9,anchors:{offset:-100},prevent:node=>!!node.closest('dialog')});
  smooth.current=lenis;
  lenis?.on('scroll',ScrollTrigger.update);
  const tick=time=>lenis?.raf(time*1000);if(lenis)gsap.ticker.add(tick);
  const ctx=gsap.context(()=>{
   const mm=gsap.matchMedia();
   mm.add({desktop:'(min-width: 701px)',mobile:'(max-width: 700px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
    if(context.conditions.reduce)return;
    const desktop=context.conditions.desktop;
    if(!desktop){
     const heading=root.current.querySelector('.work .section-heading');
     if(heading)gsap.fromTo(heading,{y:36},{y:0,ease:'none',scrollTrigger:{trigger:heading,start:'top bottom',end:'top 55%',scrub:.3}});
    }
    gsap.utils.toArray('.motion-title').forEach(title=>{
     gsap.fromTo(title.querySelectorAll('.reveal-word'),{yPercent:105,rotation:desktop?3:0},{yPercent:0,rotation:0,stagger:.045,ease:'none',scrollTrigger:{trigger:title,start:'top 98%',end:'top 75%',scrub:.35}});
    });
    gsap.utils.toArray('.chapter').forEach((chapter,index)=>{
     const section=chapter.querySelector(':scope > section');
     if(!section||section.classList.contains('skills-cloud')||section.classList.contains('hero')||(!desktop&&section.classList.contains('work')))return;
     // Animate the content only. The full-width surface and pixel canvas stay untouched.
     const travel=desktop?110:48;
     const timeline=gsap.timeline({scrollTrigger:{trigger:chapter,start:'top bottom',end:'bottom top',scrub:.65,invalidateOnRefresh:true}});
     timeline.fromTo(section,{y:travel,scale:desktop?.955:.985,transformOrigin:'50% 0%'},{y:0,scale:1,ease:'none',duration:.75})
      .to(section,{y:0,scale:1,duration:Math.max(.2,chapter.offsetHeight/innerHeight-.2)})
      .to(section,{y:desktop?-90:-30,scale:desktop?.975:1,ease:'none',duration:.45});
     const heading=section.querySelector('.section-heading,.practice-intro,.contact-heading');
     if(heading)gsap.fromTo(heading,{x:desktop?(index%2?48:-48):0},{x:0,ease:'none',scrollTrigger:{trigger:chapter,start:'top bottom',end:'top 15%',scrub:.55}});
    });
    const experience=root.current.querySelector('.experience-layout');
    if(experience){
     const trigger=experience.closest('.chapter');
     gsap.fromTo(experience.querySelector('.experience-duration'),{x:desktop?-75:0,y:desktop?65:24,rotation:desktop?-4:0},{x:0,y:0,rotation:0,ease:'none',scrollTrigger:{trigger,start:'top bottom',end:'top 12%',scrub:.55}});
     gsap.fromTo(experience.querySelector('.experience-copy'),{x:desktop?65:0,y:desktop?20:12},{x:0,y:0,ease:'none',scrollTrigger:{trigger,start:'top bottom',end:'top 12%',scrub:.55}});
    }
    gsap.utils.toArray('.profile-disciplines>div,.company-experience article').forEach((el,index)=>gsap.fromTo(el,{y:desktop?55:24,x:desktop?(index%2?20:-20):0},{y:0,x:0,ease:'none',scrollTrigger:{trigger:el,start:'top 98%',end:'top 63%',scrub:.4}}));
    // Independent foreground layers add depth without moving chapter surfaces.
    gsap.utils.toArray('.section-label').forEach(label=>{
     gsap.fromTo(label,{y:desktop?22:12},{y:0,ease:'none',scrollTrigger:{trigger:label,start:'top 98%',end:'top 65%',scrub:.35}});
    });
    gsap.utils.toArray('.experience-skills li').forEach((skill,i)=>{
     gsap.fromTo(skill,{y:desktop?36:18,opacity:.45},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:skill.closest('.experience-skills'),start:`top ${94-i*2}%`,end:`top ${67-i*2}%`,scrub:.3}});
    });
    gsap.utils.toArray('.page-next').forEach(section=>{
     const link=section.querySelector('.text-link');
     if(link)gsap.fromTo(link,{x:desktop?50:0,y:desktop?0:20,opacity:.35},{x:0,y:0,opacity:1,ease:'none',scrollTrigger:{trigger:section,start:'top 90%',end:'top 45%',scrub:.4}});
    });
    if(desktop)gsap.utils.toArray('.project-caption').forEach((caption,i)=>{
     gsap.fromTo(caption,{x:i%2?24:-24},{x:0,ease:'none',scrollTrigger:{trigger:caption,start:'top bottom',end:'top 70%',scrub:.35}});
    });
    const hero=root.current.querySelector('.hero');
    if(hero){
     const folder=hero.querySelector('.glass-folder-scene');
     if(folder)gsap.fromTo(folder,{y:0,rotation:-2},{y:desktop?-34:-14,rotation:desktop?4:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.5}});
     const footer=hero.querySelector('.hero-bottom');
     if(footer)gsap.fromTo(footer,{y:desktop?24:12},{y:0,ease:'none',scrollTrigger:{trigger:footer,start:'top bottom',end:'top 65%',scrub:.4}});

     gsap.fromTo('.pressure-chunk',{yPercent:105,opacity:0},{yPercent:0,opacity:1,duration:1.1,stagger:.12,delay:.18,ease:'power3.out'});
     gsap.to('.hero-art',{y:desktop?35:15,scale:desktop?1.07:1.025,rotation:0,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.65}});
     gsap.to('.hero-copy',{y:desktop?-95:-35,scale:desktop?.965:1,transformOrigin:'0 0',ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.65}});
    }
   });
  },root);
  const refresh=()=>{lenis?.resize();ScrollTrigger.refresh()};document.fonts?.ready.then(refresh);
  return()=>{ctx.revert();gsap.ticker.remove(tick);lenis?.destroy();smooth.current=null};
 },[enabled,root]);
 useEffect(()=>{if(paused)smooth.current?.stop();else smooth.current?.start()},[paused,enabled]);
}
