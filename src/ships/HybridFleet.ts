import * as THREE from 'three';
import {Ship} from './Ship';
type Vessel={position:THREE.Vector3;model:Ship;sprite:THREE.Sprite;mode:'3d'|'2d'};
export class HybridFleet{
 private vessels:Vessel[]=[];private texture:THREE.CanvasTexture;
 constructor(private scene:THREE.Scene){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,128,128);ctx.fillStyle='#51382c';ctx.beginPath();ctx.moveTo(64,115);ctx.lineTo(39,85);ctx.lineTo(46,35);ctx.lineTo(82,35);ctx.lineTo(89,85);ctx.closePath();ctx.fill();ctx.fillStyle='#f2e5c6';ctx.fillRect(42,18,44,49);ctx.fillStyle='#a37a43';ctx.fillRect(62,8,4,92);this.texture=new THREE.CanvasTexture(canvas);this.texture.colorSpace=THREE.SRGBColorSpace;}
 add(position:THREE.Vector3){const model=new Ship();model.group.position.copy(position);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:this.texture,transparent:true,depthWrite:false}));sprite.position.copy(position).add(new THREE.Vector3(0,9,0));sprite.scale.set(19,19,1);this.scene.add(sprite);const vessel:Vessel={position,model,sprite,mode:'2d'};this.vessels.push(vessel);}
 update(player:THREE.Vector3){for(const v of this.vessels){const d=player.distanceTo(v.position);const near=v.mode==='3d'?d<105:d<85;if(near&&v.mode!=='3d'){this.scene.add(v.model.group);v.sprite.visible=false;v.mode='3d';}else if(!near&&v.mode!=='2d'){this.scene.remove(v.model.group);v.sprite.visible=true;v.mode='2d';}v.sprite.visible=v.mode==='2d'&&d<650;}}
}