import * as THREE from 'three';
export class Islands {
 group=new THREE.Group();
 positions=[new THREE.Vector3(-95,0,-180),new THREE.Vector3(145,0,-290),new THREE.Vector3(-220,0,-430),new THREE.Vector3(300,0,-570)];
 constructor(){
 const sand=new THREE.MeshStandardMaterial({color:0xf2d08b,roughness:1}),grass=new THREE.MeshStandardMaterial({color:0x5d9c54,roughness:1}),rock=new THREE.MeshStandardMaterial({color:0x718b7a,roughness:1}),trunk=new THREE.MeshStandardMaterial({color:0x83532e}),leaf=new THREE.MeshStandardMaterial({color:0x2f9857});
 for(let i=0;i<this.positions.length;i++){const island=new THREE.Group();island.position.copy(this.positions[i]);const radius=26+i*5;const base=new THREE.Mesh(new THREE.CylinderGeometry(radius*.85,radius,8,9),sand);base.position.y=1;island.add(base);const top=new THREE.Mesh(new THREE.CylinderGeometry(radius*.72,radius*.83,5,9),grass);top.position.y=7;island.add(top);
 for(let j=0;j<9;j++){const a=j*2.399,r=5+(j%3)*6,x=Math.cos(a)*r,z=Math.sin(a)*r;const stem=new THREE.Mesh(new THREE.CylinderGeometry(.55,.85,8,5),trunk);stem.position.set(x,13,z);island.add(stem);const crown=new THREE.Mesh(new THREE.ConeGeometry(4,11,6),leaf);crown.position.set(x,21,z);island.add(crown);}
 for(let j=0;j<5;j++){const a=j*1.28;const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(3+j%2),rock);stone.position.set(Math.cos(a)*radius*.8,6,Math.sin(a)*radius*.8);island.add(stone);}this.group.add(island);}
 }
}