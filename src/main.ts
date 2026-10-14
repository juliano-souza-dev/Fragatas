import * as THREE from 'three';
import './style.css';
import {Ocean} from './world/Ocean';
import {Ship} from './ships/Ship';
import {Islands} from './world/Islands';
import {Combat} from './combat/Combat';
import {SpriteVisual} from './ships/SpriteVisual';
const root=document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML=`<div id="hud"><div class="brand">⚓ FRAGATAS <small>Águas Livres</small></div><div class="stats"><span>❤️ <b id="hp">100</b></span><span>🧭 <b id="heading">N</b></span><span>⛵ <b id="speed">0</b> nós</span><span>🎯 <b id="kills">0</b>/3</span></div><button id="quality">Padrão</button></div><div id="mission">MISSÃO 01 <b>Derrote os 3 corsários</b></div><div id="rotate">Gire o celular para paisagem ↻</div><div id="controls"><div id="stick"><div id="knob"></div></div><div class="actions"><button id="fire">💥<small>CANHÕES</small></button></div></div><div id="toast"></div>`;
const entry=document.createElement('div');entry.id='entry';entry.innerHTML='<div class="entry-panel"><h1>⚓ FRAGATAS</h1><p>Experiência em tela cheia e paisagem</p><button id="play">▶ JOGAR</button><small id="entry-note">Toque para iniciar</small></div>';root.append(entry);
async function enterGame(){
 const note=document.querySelector<HTMLElement>('#entry-note')!;
 const orientation=screen.orientation as ScreenOrientation & {lock?:(orientation:string)=>Promise<void>};
 const tryLock=async()=>{try{if(orientation?.lock)await orientation.lock('landscape');}catch{note.textContent='Gire o celular para paisagem se necessário';}};
 try{
  if(!document.fullscreenElement && document.documentElement.requestFullscreen){
   const pending=document.documentElement.requestFullscreen({navigationUI:'hide'});
   void tryLock();
   await pending;
   await tryLock();
  }else await tryLock();
 }catch(error){console.warn('[Fragatas] Fullscreen indisponível:',error);await tryLock();}
 entry.remove();
}
document.querySelector('#play')!.addEventListener('click',()=>{void enterGame();});
document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement){const orientation=screen.orientation as ScreenOrientation & {lock?:(orientation:string)=>Promise<void>};void orientation?.lock?.('landscape').catch(()=>{});}});
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8bc9e5);scene.fog=new THREE.Fog(0x8bc9e5,600,1200);
const viewHeight=78;
const camera=new THREE.OrthographicCamera(-viewHeight*innerWidth/innerHeight/2,viewHeight*innerWidth/innerHeight/2,viewHeight/2,-viewHeight/2,.5,1500);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.3));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;root.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xd7f5ff,0x4b7894,2.5));const sun=new THREE.DirectionalLight(0xffe5b1,3);sun.position.set(-100,180,-160);scene.add(sun);
const ocean=new Ocean();scene.add(ocean.mesh);const islands=new Islands();scene.add(islands.group);
const ship=new Ship();scene.add(ship.group);ship.group.position.set(0,0,35);const playerVisual=new SpriteVisual(ship.group);
const toast=document.querySelector<HTMLElement>('#toast')!;let toastTimer=0;function announce(message:string){toast.textContent=message;toast.classList.add('show');toastTimer=3;}
const combat=new Combat(scene,()=>{document.querySelector('#kills')!.textContent=String(combat.kills);announce(combat.kills===3?'🏆 Vitória! Os mares estão livres!':'🎯 Corsário derrotado!');if(combat.kills===3)document.querySelector('#mission')!.innerHTML='MISSÃO CONCLUÍDA <b>🏆 Vitória naval!</b>';});
const enemies:Ship[]=[];const enemyVisuals:SpriteVisual[]=[];for(let i=0;i<3;i++){const enemy=new Ship(0x9e4542);enemy.group.position.set((i-1)*32,0,-20-i*27);enemy.heading=Math.PI*.5;scene.add(enemy.group);combat.addTarget(enemy);enemies.push(enemy);enemyVisuals.push(new SpriteVisual(enemy.group));}
const contactShadows=[ship,...enemies].map(vessel=>{
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(7,24),new THREE.MeshBasicMaterial({color:0x052635,transparent:true,opacity:.35,depthWrite:false}));
 shadow.rotation.x=-Math.PI/2;shadow.scale.set(.65,1.4,1);shadow.position.y=.25;scene.add(shadow);
 return {vessel,shadow};
});
let throttle=0,steer=0,firing=false,ultra=false,lastShot=0;const stick=document.querySelector<HTMLElement>('#stick')!,knob=document.querySelector<HTMLElement>('#knob')!;
function moveStick(e:PointerEvent){const b=stick.getBoundingClientRect();let x=(e.clientX-b.left-b.width/2)/(b.width/2),y=(e.clientY-b.top-b.height/2)/(b.height/2);const length=Math.max(1,Math.hypot(x,y));x/=length;y/=length;steer=x;throttle=-y;knob.style.transform=`translate(${x*38}px,${y*38}px)`;}
stick.addEventListener('pointerdown',e=>{stick.setPointerCapture(e.pointerId);moveStick(e);});stick.addEventListener('pointermove',e=>{if(stick.hasPointerCapture(e.pointerId))moveStick(e);});const reset=()=>{steer=0;throttle=0;knob.style.transform='';};stick.addEventListener('pointerup',reset);stick.addEventListener('pointercancel',reset);
const keys=new Set<string>();addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(e.code==='Space')e.preventDefault();});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
const fireButton=document.querySelector<HTMLButtonElement>('#fire')!;fireButton.addEventListener('pointerdown',e=>{fireButton.setPointerCapture(e.pointerId);firing=true;});for(const event of ['pointerup','pointercancel'])fireButton.addEventListener(event,()=>firing=false);
document.querySelector('#quality')!.addEventListener('click',()=>{ultra=!ultra;renderer.setPixelRatio(Math.min(devicePixelRatio,ultra?1.8:1.2));ocean.setQuality(ultra);document.querySelector('#quality')!.textContent=ultra?'Ultra':'Padrão';});
addEventListener('resize',()=>{camera.left=-viewHeight*innerWidth/innerHeight/2;camera.right=viewHeight*innerWidth/innerHeight/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
const clock=new THREE.Clock(),desired=new THREE.Vector3(),forward=new THREE.Vector3(),behind=new THREE.Vector3();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;
const t=keys.has('w')||keys.has('arrowup')?1:keys.has('s')||keys.has('arrowdown')?-1:throttle;
const s=keys.has('a')||keys.has('arrowleft')?-1:keys.has('d')||keys.has('arrowright')?1:steer;
ship.update(dt,t,s,time);for(let i=0;i<enemies.length;i++){const enemy=enemies[i];if(!enemy.group.visible)continue;enemy.update(dt,.22,Math.sin(time*.25+i)*.25,time+i);}
ocean.update(time,ship.group.position);combat.update(dt);for(const {vessel,shadow} of contactShadows){shadow.visible=vessel.group.visible;shadow.position.x=vessel.group.position.x;shadow.position.z=vessel.group.position.z;shadow.rotation.z=-vessel.heading;}
forward.set(-Math.sin(ship.heading),0,-Math.cos(ship.heading));behind.set(0,85,64).applyAxisAngle(new THREE.Vector3(0,1,0),ship.heading);desired.copy(ship.group.position).add(behind);camera.position.lerp(desired,1-Math.exp(-2.7*dt));camera.lookAt(ship.group.position.x+forward.x*8,0,ship.group.position.z+forward.z*8);
const bearing=(v:THREE.Vector3)=>Math.atan2(camera.position.x-v.x,camera.position.z-v.z);
playerVisual.update(ship.heading,bearing(ship.group.position));
for(let i=0;i<enemies.length;i++)enemyVisuals[i].update(enemies[i].heading,bearing(enemies[i].group.position));
document.querySelector('#speed')!.textContent=String(Math.round(Math.abs(ship.speed)*2.2));document.querySelector('#heading')!.textContent=['N','NE','L','SE','S','SO','O','NO'][Math.round(((ship.heading%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI/4))%8];
if((firing||keys.has(' '))&&time-lastShot>.9){lastShot=time;combat.fire(ship);}
if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.classList.remove('show');}renderer.render(scene,camera);}
animate();
