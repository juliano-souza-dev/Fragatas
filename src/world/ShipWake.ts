import * as THREE from 'three';
export class ShipWake {
 private mesh:THREE.Mesh;
 private points:{x:number,z:number,age:number,heading:number}[]=[];
 private distance=0;
 constructor(scene:THREE.Scene){
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(48*18),3));
  geometry.setAttribute('alpha',new THREE.BufferAttribute(new Float32Array(48*6),1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:'attribute float alpha; varying float vAlpha; void main(){vAlpha=alpha;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying float vAlpha;void main(){gl_FragColor=vec4(.7,.94,.97,vAlpha);}'});
  this.mesh=new THREE.Mesh(geometry,material);this.mesh.frustumCulled=false;scene.add(this.mesh);
 }
 update(dt:number,position:THREE.Vector3,heading:number,speed:number){
  const magnitude=Math.abs(speed);this.distance+=magnitude*dt;
  for(const p of this.points)p.age+=dt;
  if(magnitude>1.5&&this.distance>1.2){this.distance=0;this.points.unshift({x:position.x+Math.sin(heading)*9,z:position.z+Math.cos(heading)*9,age:0,heading});}
  this.points=this.points.filter(p=>p.age<4).slice(0,48);
  const geometry=this.mesh.geometry,pos=geometry.getAttribute('position') as THREE.BufferAttribute,alpha=geometry.getAttribute('alpha') as THREE.BufferAttribute;
  let vertex=0;
  for(let i=0;i<this.points.length-1;i++){
   const a=this.points[i],b=this.points[i+1],width=2+a.age*2,opacity=Math.max(0,1-a.age/4)*Math.min(1,magnitude/10)*.45;
   const rx=Math.cos(a.heading)*width,rz=-Math.sin(a.heading)*width;
   const verts=[[a.x-rx,a.z-rz],[a.x+rx,a.z+rz],[b.x-rx,b.z-rz],[b.x-rx,b.z-rz],[a.x+rx,a.z+rz],[b.x+rx,b.z+rz]];
   for(const v of verts){pos.setXYZ(vertex,v[0],.28,v[1]);alpha.setX(vertex,opacity);vertex++;}
  }
  geometry.setDrawRange(0,vertex);pos.needsUpdate=true;alpha.needsUpdate=true;
 }
}