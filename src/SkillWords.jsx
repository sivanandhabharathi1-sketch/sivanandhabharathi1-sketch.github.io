import React,{useLayoutEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './skill-words.css';

const vocabulary=[
 {label:'2D MOTION DESIGN',word:'Motion'},
 {label:'3D ANIMATION',word:'Animation'},
 {label:'UI/UX DESIGN',word:'Experience'},
 {label:'VIDEO EDITING',word:'Editing'},
 {label:'GRAPHIC DESIGN',word:'Graphics'},
 {label:'BRAND IDENTITY',word:'Identity'},
 {label:'TYPE & LAYOUT',word:'Typography'},
 {label:'INTERACTION DESIGN',word:'Prototypes'}
];
function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
export default function SkillWords({enabled}){
 const ref=useRef(),[layout]=useState(()=>shuffle(vocabulary));
 useLayoutEffect(()=>{
  if(!enabled)return;
  const ctx=gsap.context(()=>{
   const mm=gsap.matchMedia();
   mm.add({desktop:'(min-width:701px)',mobile:'(max-width:700px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
    if(context.conditions.reduce)return;
    const desktop=context.conditions.desktop;
    const items=shuffle([...ref.current.querySelectorAll('.skill-word')]);
    const timeline=gsap.timeline({scrollTrigger:{trigger:ref.current,start:'top 75%',end:'bottom 115%',scrub:.45,invalidateOnRefresh:true}});
    items.forEach((item,i)=>{
     const inner=item.querySelector('.skill-word-inner'),chars=item.querySelectorAll('.skill-character');
     const direction=i%2?1:-1;
     gsap.set(inner,{autoAlpha:0,x:desktop?direction*22:0,y:desktop?20:12});
     gsap.set(chars,{autoAlpha:0,yPercent:55});
     timeline.to(inner,{autoAlpha:1,x:0,y:0,duration:.4,ease:'power2.out'},i*.18)
      .to(chars,{autoAlpha:1,yPercent:0,duration:.32,stagger:.025,ease:'power2.out'},i*.18+.06);
     gsap.fromTo(item,{y:desktop?10:4,x:0},{y:desktop?-18:-6,x:0,ease:'none',scrollTrigger:{trigger:ref.current,start:'top bottom',end:'bottom top',scrub:.5}});
    });
   });
  },ref);
  return()=>ctx.revert();
 },[enabled]);
 return <section ref={ref} id="knowledge" className="skills-cloud wrap" aria-labelledby="knowledge-title"><div className="skills-cloud-stage"><div className="section-label"><span id="knowledge-title">A FEW THINGS I KNOW</span><span>DESIGN / MOTION / FORM</span></div><ul className="skill-word-field" aria-label="Creative skills">{layout.map((skill,i)=><li className={`skill-word word-slot-${i}`} key={skill.word}><div className="skill-word-inner"><span className="skill-word-label">{skill.label}</span><strong className="skill-word-title"><span className="skill-word-accessible">{skill.word}</span><span aria-hidden="true">{[...skill.word].map((letter,index)=><span className="skill-character" key={index}>{letter}</span>)}</span></strong></div></li>)}</ul><p className="skill-cloud-note">From the first idea to the final frame.</p></div></section>
}
