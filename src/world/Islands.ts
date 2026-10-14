import * as THREE from 'three';
const paths=['ilha_estaleiro.webp','ilha_missoes.webp','ilha_fundo_transparente.png','ilha_estaleiro.webp'];
export class Islands {
 group=new THREE.Group();
 positions=[new THREE.Vector3(-85,0,-105),new THREE.Vector3(125,0,-200),new THREE.Vector3(-210,0,-360),new THREE.Vector3(290,0,-520)];
 constructor(){
  const loader=new THREE.TextureLoader();
  this.positions.forEach((position,i)=>{
   const anchor=new THREE.Group();anchor.position.copy(position);
   const texture=loader.load('/Fragatas/assets/islands/'+paths[i]);texture.colorSpace=THREE.SRGBColorSpace;
   const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,alphaTest:.04}));
   sprite.scale.set(95,95,1);sprite.position.y=33;anchor.add(sprite);this.group.add(anchor);
  });
 }
}