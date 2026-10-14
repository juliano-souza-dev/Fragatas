import * as THREE from 'three';
const order=[4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3];
const sheet=import.meta.env.BASE_URL+'assets/ships/starter-galleon.png';
const base=new THREE.TextureLoader().load(sheet);
base.colorSpace=THREE.SRGBColorSpace;
export class SpriteVisual{
 readonly sprite:THREE.Sprite;
 private texture:THREE.Texture;
 constructor(group:THREE.Group){
 this.texture=base.clone();this.texture.needsUpdate=true;this.texture.repeat.set(.25,.25);
 this.sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:this.texture,transparent:true,depthWrite:false,alphaTest:.04}));
 this.sprite.position.set(0,9,0);this.sprite.scale.set(21,21,1);group.add(this.sprite);
 // Retain movement/collision in Ship, replace only its procedural visual.
 if(group.children.length>1)group.children[0].visible=false;
 }
 update(heading:number,cameraYaw:number){
 const relative=((heading-cameraYaw)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
 const sector=Math.round(relative/(Math.PI*2)*16)%16;
 const frame=order[sector];this.texture.offset.set((frame%4)/4,1-(Math.floor(frame/4)+1)/4);
 }
}
