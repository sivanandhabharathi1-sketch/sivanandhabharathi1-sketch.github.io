import React from 'react';
import {RevealTitle} from './PortfolioMotion';
import './simple-studio.css';

export default function Landing(){
 return <>
  <section id="top" className="hero landing-hero">
   <div className="hero-art landing-media"><img src="/images/case-study.jpg" alt="Raysol solar energy app interface designed by Siva" width="1024" height="825" fetchPriority="high"/></div>
   <div className="landing-shade" aria-hidden="true"/>
   <div className="hero-copy landing-copy">
    <p className="eyebrow">SIVA / DESIGN & ANIMATION</p>
    <RevealTitle as="h1" className="landing-title">Interfaces.<br/>Identity.<br/><span>Motion.</span></RevealTitle>
    <p className="landing-description">I design clear digital experiences and bring ideas to life through 2D and 3D animation.</p>
    <a className="landing-work-link" href="/work/">Explore my work <span aria-hidden="true">↗</span></a>
   </div>
   <div className="landing-bottom"><span>UI/UX · GRAPHIC DESIGN · ANIMATION</span><a href="#studio-intro">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a><a href="/work/">RAYSOL / UI/UX CASE STUDY ↗</a></div>
  </section>
  <section id="studio-intro" className="studio-intro section wrap">
   <p className="eyebrow">A CLEAR IDEA. A CAREFUL FINISH.</p>
   <h2 className="scroll-statement">{'From the first screen to the final frame, every detail has a purpose.'.split(' ').map((word,i)=><React.Fragment key={i}><span>{word}</span>{' '}</React.Fragment>)}</h2>
   <p className="studio-intro-copy">UI/UX design is at the heart of my work. Graphic design, 3D animation, and 2D animation help me carry the same idea across every touchpoint.</p>
   <a className="text-link" href="/about/">A little about me <span aria-hidden="true">↗</span></a>
  </section>
 </>;
}
