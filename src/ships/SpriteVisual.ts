import * as THREE from 'three';
const frames=[4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3];
const sheet='/Fragatas/assets/ships/starter-galleon.png';
let imagePromise:Promise<HTMLImageElement>|undefined;
function loadImage():Promise<HTMLImageElement>{
 if(!imagePromise)imagePromise=new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve(image);
  image.onerror=()=>reject(new Error('Não foi possível carregar o sprite do galeão'));
  image.src=sheet;
 });
 return imagePromise;
}
export class SpriteVisual{
 readonly sprite:THREE.Sprite;
 private texture:THREE.CanvasTexture;
 private canvas:HTMLCanvasElement;
 private ctx:CanvasRenderingContext2D;
 private image?:HTMLImageElement;
 private lastFrame=-1;
 constructor(group:THREE.Group){
  this.canvas=document.createElement('canvas');this.canvas.width=400;this.canvas.height=400;
  this.ctx=this.canvas.getContext('2d')!;
  this.texture=new THREE.CanvasTexture(this.canvas);this.texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.SpriteMaterial({map:this.texture,transparent:true,depthWrite:false,alphaTest:.025});
  this.sprite=new THREE.Sprite(material);this.sprite.position.set(0,10.5,0);this.sprite.scale.set(24,24,1);this.sprite.visible=false;group.add(this.sprite);
  const original=group.children.find(child=>child!==this.sprite);
  loadImage().then(image=>{this.image=image;this.lastFrame=-1;this.update(0,0);this.sprite.visible=true;if(original)original.visible=false;}).catch(error=>console.error('[Fragatas] Falha no sprite:',error));
 }
 update(heading:number,cameraYaw:number){
  if(!this.image)return;
  const relative=((heading-cameraYaw)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
  const sector=Math.round(relative/(Math.PI*2)*16)%16,frame=frames[sector];
  if(frame===this.lastFrame)return;
  this.lastFrame=frame;
  const width=this.image.naturalWidth/4,height=this.image.naturalHeight/4;
  this.ctx.clearRect(0,0,400,400);
  this.ctx.drawImage(this.image,(frame%4)*width,Math.floor(frame/4)*height,width,height,0,0,400,400);
  this.texture.needsUpdate=true;
 }
}
