import React,{useMemo,useRef,useState,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export const DESIGN_TOOLS=[
 {kind:'slider',position:[-.15,1.65,-.65],angle:.22,scale:1},
 {kind:'cursor',position:[-1.25,.35,.65],angle:.2,scale:.8064},
 {kind:'pen',position:[.85,.2,.6],angle:-.43,scale:1.05},
 {kind:'bezier',position:[1.4,-1.25,-.65],angle:-.15,scale:1},
 {kind:'toolbar',position:[-.65,-1.65,-1],angle:.12,scale:1}
];
const CURSOR=[[-.37,.55],[-.21,-.5],[.02,-.18],[.44,-.12]];
const NIB=[[0,-.7],[-.47,-.04],[-.34,.52],[.34,.52],[.47,-.04]];
const TYPE=[[-.56,.63],[.56,.63],[.56,.38],[.17,.38],[.17,-.65],[-.17,-.65],[-.17,.38],[-.56,.38]];
// Offset every edge inward by the same distance, including the cursor's concave neck.
function insetPolygon(points,distance){
 const area=points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1]},0);
 const side=Math.sign(area);
 const edges=points.map((p,i)=>{const q=points[(i+1)%points.length],dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy);return {p:[p[0]-dy/length*distance*side,p[1]+dx/length*distance*side],v:[dx,dy]}});
 return edges.map((next,i)=>{const prev=edges[(i+edges.length-1)%edges.length],cross=prev.v[0]*next.v[1]-prev.v[1]*next.v[0];if(Math.abs(cross)<1e-8)return next.p;const dx=next.p[0]-prev.p[0],dy=next.p[1]-prev.p[1],t=(dx*next.v[1]-dy*next.v[0])/cross;return [prev.p[0]+t*prev.v[0],prev.p[1]+t*prev.v[1]]});
}
function cursorBorder(){
 const shape=new THREE.Shape(CURSOR.map(([x,y])=>new THREE.Vector2(x,y)));
 shape.closePath();
 const inner=new THREE.Path(insetPolygon(CURSOR,.044).map(([x,y])=>new THREE.Vector2(x,y)));
 inner.closePath();shape.holes.push(inner);
 return new THREE.ShapeGeometry(shape);
}
function polygon(points,depth=.11,hole=false){
 const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 if(hole){const path=new THREE.Path();path.absarc(0,.03,.09,0,Math.PI*2,true);shape.holes.push(path)}
 return new THREE.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelThickness:.022,bevelSize:.022,bevelSegments:3,curveSegments:16});
}
function pill(w,h,r,depth=.09){
 const shape=new THREE.Shape(),x=-w/2,y=-h/2;
 shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
 return new THREE.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelThickness:.014,bevelSize:.014,bevelSegments:3,curveSegments:12});
}
function model(kind){
 const parts=[];
 const add=(geometry,material='yellow',position=[0,0,0],rotation=[0,0,0])=>parts.push({geometry,material,position,rotation});
 const line=(points,material='ink',radius=.018)=>{
  const curve=new THREE.CurvePath();points.slice(1).forEach((p,i)=>curve.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]),new THREE.Vector3(...p))));
  add(new THREE.TubeGeometry(curve,Math.max(2,points.length*3),radius,6,false),material);
 };
 const circle=(x,y,r,material='yellow',z=.14)=>add(new THREE.CylinderGeometry(r,r,.07,24),material,[x,y,z],[Math.PI/2,0,0]);
 if(kind==='cursor'){
  add(polygon(CURSOR),'yellow');
  add(cursorBorder(),'paper',[0,0,.138]);
  add(pill(1.08,.44,.075,.09),'yellow',[.62,-.5,.04]);
  add(new THREE.PlaneGeometry(.91,.34),'nameTag',[.62,-.5,.155]);
 }else if(kind==='pen'){
  add(polygon(NIB,.12,true));
  add(pill(.59,.3,.04,.15),'dark',[0,.72,-.015]);
  add(pill(.53,.055,.02,.02),'yellow',[0,.85,.16]);
  line([[0,-.61,.16],[0,-.07,.16]],'ink',.019);
  line([[-.31,.43,.16],[-.39,-.01,.16],[0,-.59,.16],[.39,-.01,.16],[.31,.43,.16]],'ink',.012);
 }else if(kind==='slider'){
  add(pill(3.15,.2,.1),'dark');
  add(pill(2.15,.13,.065,.045),'yellow',[-.45,0,.11]);
  circle(.6,0,.205,'paper',.16);circle(.6,0,.105,'yellow',.215);
  for(let i=0;i<6;i++)line([[-1.35+i*.5,-.25,.08],[-1.35+i*.5,-.32,.08]],'dim',.009);
 }else if(kind==='bezier'){
  const curve=new THREE.CubicBezierCurve3(new THREE.Vector3(-.72,-.35,.14),new THREE.Vector3(-.48,1,.14),new THREE.Vector3(.48,-1,.14),new THREE.Vector3(.72,.35,.14));
  add(new THREE.TubeGeometry(curve,40,.035,8,false),'yellow');
  line([[-.72,-.35,.08],[-.48,.88,.08]],'dim',.013);line([[.72,.35,.08],[.48,-.88,.08]],'dim',.013);
  for(const [x,y] of [[-.72,-.35],[.72,.35]]){
   add(pill(.17,.17,.01,.05),'yellow',[x,y,.12]);add(pill(.09,.09,.003,.03),'ink',[x,y,.18]);
  }
  circle(-.48,.88,.065,'paper');circle(.48,-.88,.065,'paper');
 }else if(kind==='toolbar'){
  add(pill(2.85,.59,.15,.1),'dark');
  add(pill(.43,.43,.085,.04),'yellow',[-1.02,0,.12]);
  add(polygon(CURSOR.map(([x,y])=>[x*.23,y*.23]),.025),'ink',[-1.02,.005,.18]);
  for(const x of [-.54,-.35])line([[x,-.15,.16],[x,.15,.16]],'paper',.012);
  for(const y of [-.07,.07])line([[-.59,y,.16],[-.3,y,.16]],'paper',.012);
  add(polygon(NIB.map(([x,y])=>[x*.26,y*.26]),.035,true),'paper',[.15,0,.12]);
  add(polygon(TYPE.map(([x,y])=>[x*.23,y*.23]),.03),'paper',[.74,0,.13]);
  line([[1.12,-.17,.14],[1.12,.17,.14]],'dim',.008);
 }
 return parts;
}
function FloatingTool({tool,index,parts,materials,time,input}){
 const ref=useRef(),dragging=useRef(false),[hover,setHover]=useState(false),[slider,setSlider]=useState(.7);
 const drag=e=>{
  if(tool.kind!=='slider')return;
  const g=ref.current,normal=new THREE.Vector3(0,0,1).applyQuaternion(g.getWorldQuaternion(new THREE.Quaternion()));
  const plane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,g.getWorldPosition(new THREE.Vector3()));
  const hit=e.ray.intersectPlane(plane,new THREE.Vector3());
  if(hit){g.worldToLocal(hit);setSlider(THREE.MathUtils.clamp((hit.x+1.45)/2.9,0,1))}
 };
 const down=e=>{if(tool.kind!=='slider')return;e.stopPropagation();dragging.current=true;e.target.setPointerCapture(e.pointerId);drag(e)};
 const up=e=>{if(!dragging.current)return;e.stopPropagation();dragging.current=false;e.target.releasePointerCapture(e.pointerId)};
 useFrame((_,delta)=>{
  const g=ref.current;if(!g)return;const dt=Math.min(delta,1/30),p=tool.position;
  g.position.y=THREE.MathUtils.damp(g.position.y,p[1]+Math.sin(time.current*.65+index*1.7)*.07+(hover?.1:0),4,dt);
  g.position.z=THREE.MathUtils.damp(g.position.z,p[2]+(hover?.2:0),4,dt);
  g.rotation.x=THREE.MathUtils.damp(g.rotation.x,-.08+input.current.y*.09,4,dt);
  g.rotation.y=THREE.MathUtils.damp(g.rotation.y,(index%2?.12:-.12)+input.current.x*.12,4,dt);
  g.rotation.z=THREE.MathUtils.damp(g.rotation.z,tool.angle+Math.sin(time.current*.35+index)*.025,4,dt);
 });
 return <group ref={ref} name={`design-tool-${tool.kind}`} position={tool.position} scale={tool.scale*.85} rotation={[-.08,0,tool.angle]} onPointerDown={down} onPointerMove={e=>{if(dragging.current){e.stopPropagation();drag(e)}}} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={()=>{dragging.current=false}} onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)}>
  {parts.map((p,i)=>{
   const isSlider=tool.kind==='slider',x=-1.45+slider*2.9;
   const position=isSlider&&i===1?[-1.45+slider*1.45,0,.11]:isSlider&&(i===2||i===3)?[x,p.position[1],p.position[2]]:p.position;
   return <mesh key={i} geometry={p.geometry} material={materials[p.material]} position={position} rotation={p.rotation} scale={isSlider&&i===1?[Math.max(.001,slider*2.9/2.15),1,1]:[1,1,1]}/>;
  })}
 </group>;
}
export default function DesignTools({time,input}){
 const parts=useMemo(()=>DESIGN_TOOLS.map(t=>model(t.kind)),[]);
 const nameTexture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#101820';ctx.font='600 112px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Siva',256,104);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture},[]);
 const materials=useMemo(()=>({
  nameTag:new THREE.MeshBasicMaterial({map:nameTexture,transparent:true,toneMapped:false}),
  yellow:new THREE.MeshPhysicalMaterial({color:'#0b92f2',metalness:0,roughness:.75,clearcoat:.05,emissive:'#003b65',emissiveIntensity:.12}),
  dark:new THREE.MeshStandardMaterial({color:'#24282b',metalness:.1,roughness:.7}),
  ink:new THREE.MeshBasicMaterial({color:'#151713',toneMapped:false}),
  paper:new THREE.MeshStandardMaterial({color:'#f3f2dc',metalness:.2,roughness:.25}),
  dim:new THREE.MeshBasicMaterial({color:'#4780a8',transparent:true,opacity:.65,toneMapped:false})
 }),[nameTexture]);
 useEffect(()=>()=>{nameTexture.dispose();parts.flat().forEach(p=>p.geometry.dispose());Object.values(materials).forEach(m=>m.dispose())},[parts,materials,nameTexture]);
 return <group name="floating-design-tools">{DESIGN_TOOLS.map((tool,i)=><FloatingTool key={tool.kind} tool={tool} index={i} parts={parts[i]} materials={materials} time={time} input={input}/>)}</group>;
}
