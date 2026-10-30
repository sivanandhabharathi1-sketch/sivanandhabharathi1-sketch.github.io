import React,{useRef,useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function PixelTransition(){const ref=useRef();useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)return;const ctx=gsap.context(()=>{const blocks=ref.current.children;gsap.timeline({scrollTrigger:{trigger:ref.current,start:'top 98%',end:'bottom 22%',scrub:.35}}).fromTo(blocks,{yPercent:110},{yPercent:0,stagger:{each:.008,from:'random'},ease:'steps(4)',duration:.5}).to(blocks,{yPercent:150,stagger:{each:.006,from:'end'},ease:'steps(4)',duration:.5},.7)},ref);return()=>ctx.revert()},[]);return <div ref={ref} className="pixel-transition" aria-hidden="true">{Array.from({length:48},(_,i)=><i key={i} style={{'--blocks':1+((i*17+i*i*3)%4)}}/>)}</div>}
