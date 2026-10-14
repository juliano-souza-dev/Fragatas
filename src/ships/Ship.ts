import * as THREE from 'three';
export class Ship{
 group=new THREE.Group();speed=0;heading=0;
 private hull=new THREE.Group();private muzzle:THREE.Mesh;
 constructor(){
 const wood=new THREE.MeshStandardMaterial({color:0x67402b,roughness:.86});
 const trim=new THREE.MeshStandardMaterial({color:0xc89a54});
 const sail=new THREE.MeshStandardMaterial({color:0xf5e8c9,side:THREE.DoubleSide});
 const body=new THREE.Mesh(new THREE.BoxGeometry(5,2.4,15),wood);body.position.y=1.8;this.hull.add(body);
 const bow=new THREE.Mesh(new THREE.ConeGeometry(2.7,5,4),wood);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.position.set(0,1.8,-9);this.hull.add(bow);
 for(const z of [-3,3]){const mast=new THREE.Mesh(new THREE.CylinderGeometry(.19,.26,13,8),trim);mast.position.set(0,8,z);this.hull.add(mast);const canvas=new THREE.Mesh(new THREE.PlaneGeometry(8,7),sail);canvas.position.set(0,9,z);this.hull.add(canvas);}
 for(const side of [-1,1])for(const z of [-4,0,4]){const cannon=new THREE.Mesh(new THREE.CylinderGeometry(.35,.42,1.6,8),new THREE.MeshStandardMaterial({color:0x303840}));cannon.rotation.z=Math.PI/2;cannon.position.set(side*3,2.1,z);this.hull.add(cannon);}
 this.muzzle=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshBasicMaterial({color:0xffc46b,transparent:true,opacity:0}));this.muzzle.position.set(3.8,2.2,0);this.hull.add(this.muzzle);
 this.group.add(this.hull);
 }
 update(dt:number,throttle:number,steer:number,time:number){const target=throttle*17;this.speed+=(target-this.speed)*(1-Math.exp(-1.5*dt));this.heading+=steer*dt*(.35+Math.min(Math.abs(this.speed)/14,1)*.65);this.group.rotation.y=this.heading;this.group.position.x-=Math.sin(this.heading)*this.speed*dt;this.group.position.z-=Math.cos(this.heading)*this.speed*dt;this.hull.rotation.z=Math.sin(time*1.25)*.027;this.hull.rotation.x=Math.sin(time*.9)*.018;this.hull.position.y=Math.sin(time*1.6)*.16;const m=this.muzzle.material as THREE.MeshBasicMaterial;m.opacity=Math.max(0,m.opacity-dt*4);}
 flash(){(this.muzzle.material as THREE.MeshBasicMaterial).opacity=1;}
}