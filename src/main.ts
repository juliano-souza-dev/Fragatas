import * as THREE from 'three';
import './style.css';
import { Ocean } from './world/Ocean';
import { Ship } from './ships/Ship';
import { HybridFleet } from './ships/HybridFleet';

const root = document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML = `<div id="hud"><strong>⚓ FRAGATAS</strong><span id="speed">0 nós</span><button id="quality">Qualidade: Padrão</button></div><div id="rotate">Gire o celular para paisagem ↻</div><div id="controls"><div id="stick"><div id="knob"></div></div><button id="fire">◎</button></div>`;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91c8df);
scene.fog = new THREE.FogExp2(0x91c8df,0.0025);
const camera = new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.5,1800);
const renderer = new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
root.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdaf5ff,0x34647c,2.2));
const sun = new THREE.DirectionalLight(0xffefd3,2.4);sun.position.set(-80,150,-120);scene.add(sun);
const ocean = new Ocean();scene.add(ocean.mesh);
const ship = new Ship();scene.add(ship.group);
const fleet = new HybridFleet(scene);
for(let i=0;i<26;i++){const a=i*2.39996;const r=95+Math.sqrt(i)*44;fleet.add(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r));}
let throttle=0,steer=0,fire=false,ultra=false;
const stick=document.querySelector<HTMLElement>('#stick')!,knob=document.querySelector<HTMLElement>('#knob')!;
function moveStick(e:PointerEvent){const b=stick.getBoundingClientRect();const x=(e.clientX-b.left-b.width/2)/(b.width/2);const y=(e.clientY-b.top-b.height/2)/(b.height/2);const len=Math.max(1,Math.hypot(x,y));steer=x/len;throttle=-y/len;knob.style.transform=`translate(${steer*38}px,${-throttle*38}px)`;}
stick.addEventListener('pointerdown',e=>{stick.setPointerCapture(e.pointerId);moveStick(e);});
stick.addEventListener('pointermove',e=>{if(stick.hasPointerCapture(e.pointerId))moveStick(e);});
function reset(){throttle=0;steer=0;knob.style.transform='';}
stick.addEventListener('pointerup',reset);stick.addEventListener('pointercancel',reset);
const keys=new Set<string>();
addEventListener('keydown',e=>keys.add(e.key.toLowerCase()));addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
const fireButton=document.querySelector<HTMLButtonElement>('#fire')!;
fireButton.addEventListener('pointerdown',()=>fire=true);['pointerup','pointercancel','pointerleave'].forEach(t=>fireButton.addEventListener(t,()=>fire=false));
document.querySelector('#quality')!.addEventListener('click',()=>{ultra=!ultra;renderer.setPixelRatio(Math.min(devicePixelRatio,ultra?2:1.2));ocean.setQuality(ultra);document.querySelector('#quality')!.textContent='Qualidade: '+(ultra?'Ultra':'Padrão');});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
const clock=new THREE.Clock();const desired=new THREE.Vector3();let lastShot=0;
function animate(){const dt=Math.min(clock.getDelta(),0.05);const time=clock.elapsedTime;
const t=keys.has('w')||keys.has('arrowup')?1:keys.has('s')||keys.has('arrowdown')?-1:throttle;
const s=keys.has('a')||keys.has('arrowleft')?-1:keys.has('d')||keys.has('arrowright')?1:steer;
ship.update(dt,t,s,time);ocean.update(time,ship.group.position);fleet.update(ship.group.position);
const behind=new THREE.Vector3(0,22,48).applyAxisAngle(new THREE.Vector3(0,1,0),ship.heading);
desired.copy(ship.group.position).add(behind);camera.position.lerp(desired,1-Math.exp(-3*dt));camera.lookAt(ship.group.position.x,3,ship.group.position.z);
document.querySelector('#speed')!.textContent=Math.round(Math.abs(ship.speed)*2.2)+' nós';
if(fire&&time-lastShot>0.5){lastShot=time;ship.flash();}
renderer.render(scene,camera);requestAnimationFrame(animate);}
animate();
