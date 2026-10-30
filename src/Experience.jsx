import React from 'react';
import './experience.css';
import {RevealTitle} from './PortfolioMotion';

const skills=['UI/UX Design','Graphic Design','3D Animation','2D Animation'];
export function SkillSummary(){return <ul className="experience-skills" aria-label="Design and animation skills">{skills.map(skill=><li key={skill}>{skill}</li>)}</ul>}

export default function Experience(){
 return <section id="experience" className="experience-section section wrap" aria-labelledby="experience-title" data-enter>
  <div className="section-label"><span>EXPERIENCE</span><span>DESIGN & ANIMATION</span></div>
  <div className="experience-layout">
   <div className="experience-duration"><strong>1+<span>year</span></strong><p>Company experience</p></div>
   <div className="experience-copy"><p className="eyebrow">DESIGNER & ANIMATOR</p><RevealTitle id="experience-title">Arijentek</RevealTitle><p>Over one year of experience across UI/UX design, graphic design, 3D animation, and 2D animation.</p><SkillSummary/></div>
  </div>
 </section>;
}
