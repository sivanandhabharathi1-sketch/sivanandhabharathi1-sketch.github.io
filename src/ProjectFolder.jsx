import React from 'react';
import {projects} from './projects';
import './project-folder.css';
import './glass-folder.css';

export default function ProjectFolder(){
 const work=projects.filter(project=>!project.placeholder);
 return <a className="glass-folder-link" href="/work/" aria-label={`Explore my work \u2014 view ${work.length} projects`}>
  <span className="glass-folder-scene" aria-hidden="true">
   <span className="glass-folder-ground"/>
   <span className="glass-folder-object">
    <span className="glass-folder-back"/>
    <span className="glass-folder-documents">
     {work.slice(0,3).map((project,index)=><span className={`glass-document document-${index}`} key={project.id}>
      <span className="document-heading"/><span className="document-rule"/><span className="document-rule short"/>
      <img src={project.thumbnail||project.image} alt="" width="100" height="60" decoding="async"/>
      <span className="document-rule"/><span className="document-rule short"/>
     </span>)}
    </span>
    <span className="glass-folder-front"><span className="glass-folder-reflection"/></span>
   </span>
  </span>
  <span className="glass-folder-caption">Explore my work <span className="glass-folder-total">{String(work.length).padStart(2,'0')} projects</span><svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5"/></svg></span>
 </a>;
}
