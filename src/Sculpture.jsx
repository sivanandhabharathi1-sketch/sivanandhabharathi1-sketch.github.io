import React,{useMemo,useRef,useEffect,useState} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import DesignTools from './DesignTools';
function Grid({simple}){
 const geometry=useMemo(()=>{const pts=[],span=7;for(let i=-span;i<=span;i++)pts.push(-span,i,-2.6,span,i,-2.6,i,-span,-2.6,i,span,-2.6);for(let x=-4;x<=4;x+=2)for(let y=-4;y<=4;y+=2)pts.push(x-.075,y,-2.58,x+.075,y,-2.58,x,y-.075,-2.58,x,y+.075,-2.58);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));return g},[]);
 const particles=useMemo(()=>{const p=[];for(let i=0;i<(simple?16:30);i++)p.push(Math.sin(i*17.31)*5,Math.cos(i*9.17)*4,-1-(i%6));const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));return g},[simple]);
 useEffect(()=>()=>{geometry.dispose();particles.dispose()},[geometry,particles]);
 return <><group rotation={[.05,.25,-.27]}><lineSegments geometry={geometry}><lineBasicMaterial color="#0b92f2" transparent opacity={.1}/></lineSegments></group><points geometry={particles}><pointsMaterial size={.018} color="#0b92f2" transparent opacity={.6} sizeAttenuation/></points></>;
}
function World({simple,active,input,scroll}){
 const stage=useRef(),time=useRef(0),{invalidate,camera}=useThree();
 useEffect(()=>{invalidate()},[active,invalidate]);
 useFrame((_,delta)=>{
  const dt=Math.min(delta,1/30);if(active)time.current+=dt;
  const yaw=input.current.x*.2+scroll.current*.08,pitch=-.04+input.current.y*.12;
  if(stage.current){stage.current.rotation.y=THREE.MathUtils.damp(stage.current.rotation.y,yaw,3,dt);stage.current.rotation.x=THREE.MathUtils.damp(stage.current.rotation.x,pitch,3,dt)}
  camera.position.x=THREE.MathUtils.damp(camera.position.x,-input.current.x*.14,3,dt);camera.lookAt(0,0,0);
  if(active)invalidate();
 });
 return <><fog attach="fog" args={['#0e1b25',7,17]}/><ambientLight intensity={1.5}/><directionalLight position={[-3,4,5]} intensity={3} color="#dcf0ff"/><directionalLight position={[4,-1,4]} intensity={1.5} color="#d9d6ff"/><pointLight position={[1.5,2,3]} intensity={12} color="#dcf0ff"/><group ref={stage}><DesignTools time={time} input={input}/></group></>;
}
export default function Sculpture({enabled,scroll,onReady}){
 const host=useRef(),input=useRef({x:0,y:0});
 const [active,setActive]=useState(false),[visible,setVisible]=useState(!document.hidden),[simple,setSimple]=useState(()=>matchMedia('(max-width:700px)').matches);
 useEffect(()=>{
  const io=new IntersectionObserver(([e])=>setActive(e.isIntersecting),{rootMargin:'40px'});io.observe(host.current);
  const ro=new ResizeObserver(()=>setSimple(host.current.clientWidth<500));ro.observe(host.current);
  const visibility=()=>setVisible(!document.hidden);
  const reset=()=>{input.current.x=0;input.current.y=0};
  const move=event=>{
   if(event.pointerType==='touch')return;
   input.current.x=THREE.MathUtils.clamp(event.clientX/window.innerWidth*2-1,-1,1);
   input.current.y=THREE.MathUtils.clamp(event.clientY/window.innerHeight*2-1,-1,1);
  };
  const leave=event=>{if(!event.relatedTarget)reset()};
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pointermove',move,{passive:true});
  window.addEventListener('pointerout',leave);window.addEventListener('blur',reset);
  return()=>{io.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointermove',move);window.removeEventListener('pointerout',leave);window.removeEventListener('blur',reset)};
 },[]);
 return <div ref={host} className="sculpture-canvas interactive-world" aria-hidden="true"><div className="world-canvas"><Canvas dpr={[1,simple?1.25:1.5]} frameloop="demand" camera={{position:[0,0,7.8],fov:42}} gl={{alpha:true,antialias:!simple,powerPreference:'low-power'}} onCreated={({gl})=>{gl.setClearColor('#101113',0);onReady()}}><World simple={simple} active={active&&visible&&enabled} input={input} scroll={scroll}/></Canvas></div></div>;
}
