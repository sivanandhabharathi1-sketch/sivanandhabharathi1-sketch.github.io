import React,{useState,useEffect,useRef} from 'react';

import {createRoot} from 'react-dom/client';

import gsap from 'gsap';

import {ScrollTrigger} from 'gsap/ScrollTrigger';

import {projects} from './projects';

import './style.css';



import LoadingIntro from './LoadingIntro';

import TargetCursor from './TargetCursor';



import ToolPreviews from './ToolPreviews';

import Disciplines from './Disciplines';

import './spacing.css';
import ProjectStage from './ProjectStage';
import './readable-gallery.css';
import './project-variants.css';
import {ThemeToggle,SiteBackground} from './ThemeControls';
import './reference-palette.css';
import SiteHeader from './SiteHeader';
import './pages.css';
import Experience,{SkillSummary} from './Experience';
import SkillWords from './SkillWords';
import {RevealTitle,usePortfolioMotion} from './PortfolioMotion';
import HeroHome from './HeroHome';
import './monochrome-nav.css';
import ChapterFlow from './ChapterFlow';
import './mosaic-style.css';
import './mobile-refinements.css';
import './dynamic-details.css';
import './folder-readable.css';
import './nav-glass.css';
import './mobile-pixel-menu.css';

gsap.registerPlugin(ScrollTrigger);



const Arrow=({diagonal=false})=><svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal?'M5 19 19 5M5 5h14v14':'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5"/></svg>;



function Modal({project,onClose}){

 const ref=useRef();

 useEffect(()=>{const dialog=ref.current;const previous=document.activeElement;dialog.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;previous?.focus()}},[]);

 return <dialog ref={ref} className="project-dialog" aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===ref.current)onClose()}}><div className="dialog-inner"><button className="close-button" onClick={onClose} aria-label="Close project">×</button><p className="eyebrow">{project.category}</p><h2 id="dialog-title">{project.title}</h2>{project.image&&<img src={project.image} alt={`${project.title} project artwork`}/>}<p className="dialog-intro">{project.description}</p><dl className="project-details"><div><dt>Discipline</dt><dd>{project.category}</dd></div><div><dt>My role</dt><dd>{project.category==='Graphic Design'?'Graphic designer.':'UI/UX designer.'}</dd></div><div><dt>Project</dt><dd>{project.type}</dd></div></dl>{project.url&&<a className="button primary" href={project.url} target="_blank" rel="noreferrer">View original project <Arrow diagonal/></a>}<a className="text-link" href="mailto:sivanandhabharathi1@gmail.com">Ask me about my work <Arrow diagonal/></a></div></dialog>

}

function ProjectCard({project,index,onOpen}){

 return <article className={`project-card ${project.coverGenerated?'generated-cover':''}`}><button className="project-open" onClick={()=>onOpen(project)} aria-label={`Open ${project.title}`}><div className="project-image"><ProjectStage project={project} index={index}/><span className="project-index">{String(index+1).padStart(2,'0')} / {project.year}</span><span className="project-arrow"><Arrow diagonal/></span></div><div className="project-caption"><h3>{project.title}</h3><span>{project.type}</span></div><p className="project-meta">{project.category}</p></button></article>

}

function App(){
 const page=['work','about','contact'].includes(location.pathname.split('/')[1])?location.pathname.split('/')[1]:'home';
 const Heading=page==='home'?'h2':'h1';
 useEffect(()=>{document.title=page==='home'?'Siva | UI/UX & Visual Designer':`${page[0].toUpperCase()+page.slice(1)} | Siva`;},[page]);

 const [filter,setFilter]=useState('All'),[selected,setSelected]=useState(null),[introPhase,setIntroPhase]=useState(()=>page==='home'?'loading':'done');const root=useRef(),scroll=useRef(0);

 const mode='full';

 const reduced=mode!=='full';

 const introBlocking=introPhase==='loading';
 usePortfolioMotion(root,!introBlocking,!!selected);

 useEffect(()=>{

  if(introPhase!=='done')return;

  // Reload starts at home; normal visits still honor direct section links.

  document.getElementById('main')?.focus({preventScroll:true});

  if(performance.getEntriesByType('navigation')[0]?.type==='reload'){

   window.scrollTo({top:0,left:0,behavior:'instant'});

   history.scrollRestoration='auto';

   return;

  }

  const anchor=location.hash.slice(1);

  if(!anchor)return;

  const id=requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView({behavior:'instant'}));

  return()=>cancelAnimationFrame(id);

 },[introPhase]);



 useEffect(()=>{if(introBlocking)return;const ctx=gsap.context(()=>{if(reduced){gsap.set('[data-enter], .hero-copy > *, .hero-art',{clearProps:'all'});return}if(page==='home')gsap.timeline({defaults:{ease:'power2.out'}}).from('.hero-art',{opacity:0,duration:.7}).from('.hero-copy > *',{y:20,opacity:0,duration:.6,stagger:.07},.15);gsap.utils.toArray('[data-enter]:not(.chapter > section)').forEach(el=>gsap.from(el,{y:20,opacity:0,duration:.6,scrollTrigger:{trigger:el,start:'top 94%',once:true}}));if(page==='home')ScrollTrigger.create({trigger:'.hero',start:'top top',end:'bottom top',onUpdate:self=>{scroll.current=self.progress}})},root);return()=>ctx.revert()},[reduced,introBlocking]);

 useEffect(()=>{const id=requestAnimationFrame(()=>ScrollTrigger.refresh());return()=>cancelAnimationFrame(id)},[filter]);

 useEffect(()=>{

  if(mode==='off'||introBlocking)return;

  const gentle=mode==='gentle';

  const mm=gsap.matchMedia();

  mm.add({desktop:'(min-width: 701px)',mobile:'(max-width: 700px)'},context=>{

   const desktop=context.conditions.desktop;

   const cards=gsap.utils.toArray('.project-card');

   cards.forEach((card,index)=>{

    const frame=card.querySelector('.project-image'),image=frame.querySelector('img'),caption=card.querySelector('.project-caption'),tools=card.querySelector('.tools-pending');

    if(!desktop){
     if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
     gsap.fromTo(card,{y:24,opacity:.8},{y:0,opacity:1,duration:.55,ease:'power2.out',scrollTrigger:{trigger:card,start:'top 97%',once:true}});
     const presentation=frame.querySelector('.stage-tilt');
     if(presentation)gsap.fromTo(presentation,
      {y:24,x:index%2?10:-10,rotation:index%2?1.4:-1.4},
      {y:-18,x:index%2?-6:6,rotation:0,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:.3,invalidateOnRefresh:true}});
     return;
    }

    const left=index%2===0;

    const tl=gsap.timeline({scrollTrigger:{trigger:card,start:'top 98%',end:'top 18%',scrub:gentle?true:.25,invalidateOnRefresh:true}});

    if(gentle){

     // Preserve a visible scroll reveal without spatial movement or zoom.

     tl.fromTo(frame,{opacity:.35},{opacity:1,ease:'none',duration:1},0);

     tl.fromTo([caption,tools],{opacity:.5},{opacity:1,ease:'none',duration:.45},.45);

    }else{

     tl.fromTo(frame,{y:desktop?60:28,rotationX:desktop?4:0,rotationY:desktop?(left?-3:3):0,scale:desktop?.93:.97,clipPath:'inset(3% 3% 3% 3% round 12px)'},{y:0,rotationX:0,rotationY:0,scale:1,clipPath:'inset(0% 0% 0% 0% round 12px)',ease:'none',duration:1},0);

     if(image&&!frame.querySelector('.project-stage'))tl.fromTo(image,{scale:1.22,yPercent:7},{scale:1,yPercent:0,ease:'none',duration:1},0);
     const screen=frame.querySelector('.stage-screen img');
     if(desktop&&screen&&!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo(screen,{scale:1.16,yPercent:desktop?8:4},{scale:1.1,yPercent:desktop?-8:-4,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:.5}});

     tl.fromTo([caption,tools],{y:28,opacity:.35},{y:0,opacity:1,stagger:.08,ease:'none',duration:.45},.45);

    }

   });

  },root);

  let disposed=false;

  const refresh=()=>{if(!disposed)ScrollTrigger.refresh()};

  const raf=requestAnimationFrame(refresh);

  document.fonts?.ready.then(refresh);

  window.addEventListener('pageshow',refresh);

  return()=>{disposed=true;cancelAnimationFrame(raf);window.removeEventListener('pageshow',refresh);mm.revert()};

 },[filter,mode,introBlocking]);

 const filtered=page==='home'?projects.slice(0,3):filter==='All'?projects:projects.filter(p=>p.category===filter);

 return <><SiteBackground/><TargetCursor/>{page==='home'&&introPhase!=='done'&&<LoadingIntro mode={mode} onReveal={()=>setIntroPhase('revealing')} onComplete={()=>setIntroPhase('done')}/>}<div ref={root} data-motion={mode} data-page={page} inert={introPhase!=='done'?true:undefined}><a className="skip-link" href="#main">Skip to content</a><SiteHeader page={page}/><main id="main" tabIndex={-1}><ChapterFlow>{page==='home'&&<><div className="home-intro-group"><HeroHome enabled={introPhase==='done'} scroll={scroll}/><SkillWords enabled={introPhase==='done'}/></div><Experience/></>}{(page==='home'||page==='work')&&<><section id="work" className="work section wrap"><div className="section-heading" data-enter><div><p className="eyebrow">02 / SELECTED WORK</p><RevealTitle as={Heading}>{page==='work'?'Selected work.':<>A few things<br/><span className="muted">I’ve made.</span></>}</RevealTitle></div><p>Interfaces, design systems,<br/>and visual identities.</p></div>{page==='work'&&<div className="work-filter-bar"><div className="filter-row" aria-label="Filter selected work">{['All','UI/UX Design','Graphic Design'].map(f=><button key={f} className={filter===f?'filter active':'filter'} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}{f==='All'&&<sup>{String(projects.length).padStart(2,'0')}</sup>}</button>)}</div></div>}<div className={`project-grid ${filter==='All'?'editorial-projects':''}`} aria-live="polite" aria-label={`${filter} projects`}>{filtered.map((p)=><ProjectCard key={p.id} project={p} index={projects.indexOf(p)} onOpen={setSelected} reduced={reduced}/>)}</div>{page==='home'&&<a className="text-link all-projects-link" href="/work/">View all five projects <Arrow diagonal/></a>}<p className="work-note">Selected UI/UX and graphic design projects. My time at Arijentek also includes 3D animation and 2D animation work.</p></section></>}{page==='about'&&<><section id="about" className="about section wrap" data-enter><div className="about-label"><p className="eyebrow">03 / BEHIND THE WORK</p><div className="monogram" aria-hidden="true">s<span>↗</span></div><span className="tiny-label">SIVA<br/>UI/UX · GRAPHIC DESIGN · MOTION</span></div><div className="about-copy"><RevealTitle as={Heading}>Design that works.<br/><span className="muted">Motion that connects.</span></RevealTitle><p>I have over one year of experience at Arijentek, working across UI/UX design, graphic design, 3D animation, and 2D animation. I turn ideas into clear interfaces, considered visuals, and animation that supports the story.</p><p className="about-small">I create 3D animation with Blender geometry nodes and 2D animation in After Effects. My company work includes custom animation for 3D websites and motion graphics for SaaS explainers, with arrangement and color grading in DaVinci Resolve.</p><a className="text-link" href="/contact/">Tell me what you have in mind <Arrow diagonal/></a></div></section><Experience/><section id="showreel" className="showreel section wrap" data-enter><div className="section-label"><span>01 / DESIGN & MOTION</span><span>MY PRACTICE</span></div><div className="practice-intro"><RevealTitle>UI/UX at the core.<br/><span className="muted">Motion in the details.</span></RevealTitle><div><p>My selected projects focus on UI/UX and graphic design. During my time at Arijentek, my work also included 3D animation, procedural motion, and 2D animation for SaaS explainers.</p><div className="practice-credits"><span>UI/UX & GRAPHIC DESIGN</span><span>3D & 2D MOTION</span></div><a className="text-link" href="/work/">Explore selected work <Arrow diagonal/></a></div></div><div className="company-experience"><div className="company-experience-label"><span>COMPANY EXPERIENCE</span><p>Company work across custom 3D websites and 2D motion graphics.</p></div><article><span>01 / 3D FOR THE WEB</span><h3>Custom 3D Websites</h3><p>Built custom 3D animation from scratch for company websites, using Blender and geometry nodes to create procedural motion.</p><small>BLENDER · GEOMETRY NODES</small></article><article><span>02 / 2D MOTION & EDITING</span><h3>2D Motion Graphics</h3><p>Created 2D motion graphics and SaaS explainer edits in After Effects, with arrangement and color grading in DaVinci Resolve.</p><small>AFTER EFFECTS · DAVINCI RESOLVE</small></article></div></section><section className="skills section wrap" data-enter><div className="section-label"><span>04 / THE CREATIVE TOOLKIT</span><span>IDEA → DESIGN → MOTION</span></div><Disciplines/><p className="tools-context">Figma for interface design. Illustrator and Photoshop for visuals. Blender for procedural 3D. After Effects for motion, with DaVinci Resolve for arrangement and color grading.</p><ToolPreviews/></section></>}{page==='contact'&&<><section id="contact" className="contact section wrap" data-enter><p className="eyebrow"><span className="accent-dot"/> HAVE SOMETHING IN MIND?</p><div className="contact-heading"><RevealTitle as={Heading}>Have an idea?<br/>Let’s <span>make it.</span></RevealTitle><a className="contact-arrow" href="mailto:sivanandhabharathi1@gmail.com" aria-label="Email Siva"><Arrow diagonal/></a></div><SkillSummary/><div className="contact-links"><a className="email" href="mailto:sivanandhabharathi1@gmail.com">sivanandhabharathi1@gmail.com <Arrow diagonal/></a><div className="socials"><a href="https://www.behance.net/sivananbharathi" target="_blank" rel="noreferrer">Behance <Arrow diagonal/></a><a href="https://www.linkedin.com/in/sivanandha-bharathi-m-161973364/" target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal/></a><a href="https://www.instagram.com/s_i._va__/" target="_blank" rel="noreferrer">Instagram <Arrow diagonal/></a></div></div></section></>}{page!=='contact'&&<React.Fragment><section className="page-next wrap"><RevealTitle as="p" className="next-statement">Good ideas deserve<br/>good design.</RevealTitle><a className="text-link" href="/contact/">Tell me what you have in mind <Arrow diagonal/></a></section></React.Fragment>}</ChapterFlow></main><footer className="footer wrap"><a className="wordmark" href="/">siva<i/></a><span>© {new Date().getFullYear()} Siva. Made with intention.</span><a href="#main">BACK TO TOP ↑</a></footer>{selected&&<Modal project={selected} onClose={()=>setSelected(null)}/>}</div></>

}

createRoot(document.getElementById('root')).render(<App/>);

