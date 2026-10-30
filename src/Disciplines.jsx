import React from 'react';
import './profile-content.css';
const disciplines=[
 ['01','UI/UX Design','Interfaces, user flows, and design systems.'],
 ['02','Graphic Design','Visual identity, typography, and composition.'],
 ['03','3D Animation','Procedural animation built in Blender.'],
 ['04','2D Animation','Explainer edits and motion in After Effects.']
];
export default function Disciplines(){return <div className="profile-disciplines">{disciplines.map(([number,title,description])=><div key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><span aria-hidden="true">↗</span></div>)}</div>}
