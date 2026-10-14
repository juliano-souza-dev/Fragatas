import * as THREE from 'three';
import './style.css';
import {Ocean} from './world/Ocean';
import {Ship} from './ships/Ship';
import {Islands} from './world/Islands';
import {Combat} from './combat/Combat';
const root=document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML=`<div id="hud"><div class="brand">⚓ FRAGATAS <small>Águas Livres</small></div><div class="stats"><span>❤️ <b id="hp">100</b></span><span>🧭 <b id="heading">N</b></span><span>⛵ <b id="speed">0</b> nós</span><span>🎯 <b id="kills">0</b>/3</span></div><button id="quality">Padrão</button></div><div id="mission">MISSÃO 01 <b>Derrote os 3 corsários</b></div><div id="rotate">Gire o celular para paisagem ↻</div><div id="controls"><div id="stick"><div id="knob"></div></div><div class="actions"><button id="fire">💥<small>CANHÕES</small></button></div></div><div id="toast"></div>`;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8bc9e5);scene.fog=new THREE.Fog(0x8bc9e5,250,900);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.5,1500);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.3));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;root.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xd7f5ff,0x4b7894,2.5));const sun=new THREE.DirectionalLight(0xffe5b1,3);sun.position.set(-100,180,-160);scene.add(sun);
const ocean=new Ocean();scene.add(ocean.mesh);const islands=new Islands();scene.add(islands.group);
const ship=new Ship();scene.add(ship.group);ship.group.position.set(0,0,35);
const toast=document.querySelector<HTMLElement>('#toast')!;let toastTimer=0;function announce(message:string){toast.textContent=message;toast.classList.add('show');toastTimer=3;}
const combat=new Combat(scene,()=>{document.querySelector('#kills')!.textContent=String(combat.kills);announce(combat.kills===3?'🏆 Vitória! Os mares estão livres!':'🎯 Corsário derrotado!');if(combat.kills===3)document.querySelector('#mission')!.innerHTML='MISSÃO CONCLUÍDA <b>🏆 Vitória naval!</b>';});
const enemies:Ship[]=[];for(let i=0;i<3;i++){const enemy=new Ship(0x9e4542);enemy.group.position.set((i-1)*38,0,-100-i*48);enemy.heading=Math.PI*.5;scene.add(enemy.group);combat.addTarget(enemy);enemies.push(enemy);}
let throttle=0,steer=0,firing=false,ultra=false,lastShot=0;const stick=document.querySelector<HTMLElement>('#stick')!,knob=document.querySelector<HTMLElement>('#knob')!;
function moveStick(e:PointerEvent){const b=stick.getBoundingClientRect();let x=(e.clientX-b.left-b.width/2)/(b.width/2),y=(e.clientY-b.top-b.height/2)/(b.height/2);const length=Math.max(1,Math.hypot(x,y));x/=length;y/=length;steer=x;throttle=-y;knob.style.transform=`translate(${x*38}px,${y*38}px)`;}
stick.addEventListener('pointerdown',e=>{stick.setPointerCapture(e.pointerId);moveStick(e);});stick.addEventListener('pointermove',e=>{if(stick.hasPointerCapture(e.pointerId))moveStick(e);});const reset=()=>{steer=0;throttle=0;knob.style.transform='';};stick.addEventListener('pointerup',reset);stick.addEventListener('pointercancel',reset);
const keys=new Set<string>();addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(e.code==='Space')e.preventDefault();});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
const fireButton=document.querySelector<HTMLButtonElement>('#fire')!;fireButton.addEventListener('pointerdown',e=>{fireButton.setPointerCapture(e.pointerId);firing=true;});for(const event of ['pointerup','pointercancel'])fireButton.addEventListener(event,()=>firing=false);
document.querySelector('#quality')!.addEventListener('click',()=>{ultra=!ultra;renderer.setPixelRatio(Math.min(devicePixelRatio,ultra?1.8:1.2));ocean.setQuality(ultra);document.querySelector('#quality')!.textContent=ultra?'Ultra':'Padrão';});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
const clock=new THREE.Clock(),desired=new THREE.Vector3(),forward=new THREE.Vector3(),behind=new THREE.Vector3();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;
const t=keys.has('w')||keys.has('arrowup')?1:keys.has('s')||keys.has('arrowdown')?-1:throttle;
const s=keys.has('a')||keys.has('arrowleft')?-1:keys.has('d')||keys.has('arrowright')?1:steer;
ship.update(dt,t,s,time);for(let i=0;i<enemies.length;i++){const enemy=enemies[i];if(!enemy.group.visible)continue;enemy.update(dt,.22,Math.sin(time*.25+i)*.25,time+i);}
ocean.update(time,ship.group.position);combat.update(dt);
forward.set(-Math.sin(ship.heading),0,-Math.cos(ship.heading));behind.set(0,27,53).applyAxisAngle(new THREE.Vector3(0,1,0),ship.heading);desired.copy(ship.group.position).add(behind);camera.position.lerp(desired,1-Math.exp(-2.7*dt));camera.lookAt(ship.group.position.x+forward.x*25,5,ship.group.position.z+forward.z*25);
document.querySelector('#speed')!.textContent=String(Math.round(Math.abs(ship.speed)*2.2));document.querySelector('#heading')!.textContent=['N','NE','L','SE','S','SO','O','NO'][Math.round(((ship.heading%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI/4))%8];
if((firing||keys.has(' '))&&time-lastShot>.9){lastShot=time;combat.fire(ship);}
if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.classList.remove('show');}renderer.render(scene,camera);}
animate();
