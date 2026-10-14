import * as THREE from 'three';
import {Ship} from '../ships/Ship';
type Ball={mesh:THREE.Mesh;velocity:THREE.Vector3;life:number};
export class Combat {
 private balls:Ball[]=[];private targets:{ship:Ship;health:number;alive:boolean}[]=[];
 kills=0;
 constructor(private scene:THREE.Scene,private onKill:()=>void){}
 addTarget(ship:Ship){this.targets.push({ship,health:100,alive:true});}
 fire(ship:Ship){const direction=new THREE.Vector3(-Math.sin(ship.heading),0,-Math.cos(ship.heading));const right=new THREE.Vector3(Math.cos(ship.heading),0,-Math.sin(ship.heading));for(const side of [-1,1]){const start=ship.group.position.clone().addScaledVector(right,side*4);start.y=3;const ball=new THREE.Mesh(new THREE.SphereGeometry(.65,8,6),new THREE.MeshStandardMaterial({color:0x24272e,metalness:.5}));ball.position.copy(start);this.scene.add(ball);const velocity=right.clone().multiplyScalar(side*40).addScaledVector(direction,ship.speed*.65);velocity.y=8;this.balls.push({mesh:ball,velocity,life:3});}ship.flash();}
 update(dt:number){for(let i=this.balls.length-1;i>=0;i--){const b=this.balls[i];b.velocity.y-=17*dt;b.mesh.position.addScaledVector(b.velocity,dt);b.life-=dt;let hit=false;for(const target of this.targets){if(!target.alive)continue;if(b.mesh.position.distanceTo(target.ship.group.position.clone().add(new THREE.Vector3(0,3,0)))<8){target.health-=25;hit=true;if(target.health<=0){target.alive=false;target.ship.group.visible=false;this.kills++;this.onKill();}break;}}if(hit||b.life<=0||b.mesh.position.y<0){this.scene.remove(b.mesh);b.mesh.geometry.dispose();(b.mesh.material as THREE.Material).dispose();this.balls.splice(i,1);}}}
}