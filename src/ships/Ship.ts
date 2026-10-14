import * as THREE from 'three';
export class Ship {
 group=new THREE.Group();speed=0;heading=0;private hull=new THREE.Group();private muzzle:THREE.Mesh;
 constructor(color=0x70432c){
 const wood=new THREE.MeshStandardMaterial({color,roughness:.83}),dark=new THREE.MeshStandardMaterial({color:0x382d2b}),gold=new THREE.MeshStandardMaterial({color:0xd9a453,metalness:.35,roughness:.48}),sail=new THREE.MeshStandardMaterial({color:0xf3e5bd,side:THREE.DoubleSide,roughness:1}),iron=new THREE.MeshStandardMaterial({color:0x252d36,metalness:.55,roughness:.5});
 const shape=new THREE.Shape();shape.moveTo(-2.9,-7);shape.lineTo(-3.5,3);shape.quadraticCurveTo(-3.4,7,-1.7,9);shape.lineTo(0,11);shape.lineTo(1.7,9);shape.quadraticCurveTo(3.4,7,3.5,3);shape.lineTo(2.9,-7);shape.quadraticCurveTo(0,-9,-2.9,-7);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:2.5,bevelEnabled:true,bevelThickness:.5,bevelSize:.4,bevelSegments:1,steps:1});geometry.rotateX(-Math.PI/2);geometry.translate(0,3,0);const body=new THREE.Mesh(geometry,wood);this.hull.add(body);
 const deck=new THREE.Mesh(new THREE.BoxGeometry(5.3,.45,15),gold);deck.position.set(0,3.6,0);this.hull.add(deck);
 for(const x of [-2.7,2.7]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.25,1.3,15),gold);rail.position.set(x,4.3,0);this.hull.add(rail);}
 for(const z of [-4.2,3.5]){const mast=new THREE.Mesh(new THREE.CylinderGeometry(.16,.24,16,8),dark);mast.position.set(0,11,z);this.hull.add(mast);for(const y of [10,15]){const yard=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,8,6),dark);yard.rotation.z=Math.PI/2;yard.position.set(0,y,z);this.hull.add(yard);}const cloth=new THREE.Mesh(new THREE.PlaneGeometry(7.5,7.7),sail);cloth.position.set(0,12.4,z);this.hull.add(cloth);}
 for(const side of [-1,1])for(const z of [-4,0,4]){const cannon=new THREE.Mesh(new THREE.CylinderGeometry(.32,.42,1.8,9),iron);cannon.rotation.z=Math.PI/2;cannon.position.set(side*3,4.1,z);this.hull.add(cannon);}
 const stern=new THREE.Mesh(new THREE.BoxGeometry(5.7,2,3.5),wood);stern.position.set(0,5,-6);this.hull.add(stern);
 this.muzzle=new THREE.Mesh(new THREE.SphereGeometry(1.5,8,6),new THREE.MeshBasicMaterial({color:0xffc86a,transparent:true,opacity:0}));this.muzzle.position.set(4,4,0);this.hull.add(this.muzzle);this.group.add(this.hull);
 }
 update(dt:number,throttle:number,steer:number,time:number){this.speed+=(throttle*17-this.speed)*(1-Math.exp(-1.3*dt));this.heading+=steer*dt*(.25+Math.min(Math.abs(this.speed)/12,1)*.65);this.group.rotation.y=this.heading;this.group.position.x-=Math.sin(this.heading)*this.speed*dt;this.group.position.z-=Math.cos(this.heading)*this.speed*dt;this.hull.rotation.z=Math.sin(time*1.25)*.025;this.hull.rotation.x=Math.sin(time*.9)*.018;this.hull.position.y=Math.sin(time*1.5)*.12;const mat=this.muzzle.material as THREE.MeshBasicMaterial;mat.opacity=Math.max(0,mat.opacity-dt*4);}
 flash(){(this.muzzle.material as THREE.MeshBasicMaterial).opacity=1;}
}