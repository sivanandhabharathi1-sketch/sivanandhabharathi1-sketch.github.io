import React,{useMemo,useRef,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

export default function PaperOrbit({time,scroll}){
 const ref=useRef();
 const geometry=useMemo(()=>{
  const g=new THREE.TorusGeometry(2.1,.42,3,12,Math.PI*1.65).toNonIndexed();
  const palette=['#a5a9de','#9abfe5','#afd9e8','#bfc0e5','#9dc8de'];
  const count=g.attributes.position.count,colors=new Float32Array(count*3);
  for(let i=0;i<count;i++){const color=new THREE.Color(palette[Math.floor(i/3)%palette.length]);color.toArray(colors,i*3)}
  g.setAttribute('color',new THREE.BufferAttribute(colors,3));return g;
 },[]);
 const paper=useMemo(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-.15,.08,0,.2,.16,0,-.02,-.17,.06, -.15,.08,0,-.02,-.17,.06,-.05,.01,-.05],3));g.computeVertexNormals();return g},[]);
 useEffect(()=>()=>{geometry.dispose();paper.dispose()},[geometry,paper]);
 useFrame(()=>{if(ref.current){ref.current.rotation.y=.1+Math.sin(time.current*.15)*.12+scroll.current*.35;ref.current.rotation.z=-.3+Math.sin(time.current*.12)*.06;ref.current.position.y=-.2+Math.sin(time.current*.24)*.08+scroll.current*.4}});
 return <group ref={ref} position={[.15,-.2,-2.8]} rotation={[.15,.2,-.3]}>
  <mesh geometry={geometry} rotation={[.3,.1,0]}><meshStandardMaterial vertexColors roughness={1} metalness={0} flatShading side={THREE.DoubleSide}/></mesh>
  {Array.from({length:6},(_,i)=><mesh key={i} geometry={paper} position={[Math.cos(i*1.05)*2.7,Math.sin(i*1.05)*2.5,.3+(i%2)*.3]} rotation={[.3,i*.4,i*.9]} scale={i%2?.7:1}><meshStandardMaterial color={i%2?'#d7e8f5':'#e9e7fa'} roughness={1} side={THREE.DoubleSide}/></mesh>)}
 </group>;
}
