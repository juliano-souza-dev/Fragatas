import * as THREE from 'three';
export class Ocean {
 readonly mesh:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;
 constructor(){
 const geometry=new THREE.PlaneGeometry(2200,2200,100,100);geometry.rotateX(-Math.PI/2);
 const material=new THREE.ShaderMaterial({
 uniforms:{uTime:{value:0},uUltra:{value:0}},
 vertexShader:`uniform float uTime;uniform float uUltra;varying vec3 vWorld;varying float vWave;void main(){vec3 p=position;float w=sin(p.x*.035+uTime*.8)*cos(p.z*.027+uTime*.65)*.75+sin(p.z*.082-uTime*1.2)*.22;p.y=w;vWave=w;vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,
 fragmentShader:`uniform float uTime;uniform float uUltra;varying vec3 vWorld;varying float vWave;void main(){float ripple=sin(vWorld.x*.11+uTime)*sin(vWorld.z*.09-uTime*.7);float foam=smoothstep(.58,.95,vWave+ripple*.12);vec3 deep=vec3(.018,.21,.32);vec3 shallow=vec3(.035,.42,.52);vec3 col=mix(deep,shallow,clamp(vWave*.45+.5,0.,1.));col+=foam*vec3(.22,.36,.35)*(uUltra>.5?1.:.35);float distanceFade=clamp(length(vWorld.xz)/1100.,0.,1.);col=mix(col,vec3(.57,.78,.87),distanceFade*.75);gl_FragColor=vec4(col,1.);}`
 });
 this.mesh=new THREE.Mesh(geometry,material);this.mesh.frustumCulled=false;
 }
 update(time:number,position:THREE.Vector3){this.mesh.material.uniforms.uTime.value=time;this.mesh.position.x=position.x;this.mesh.position.z=position.z;}
 setQuality(ultra:boolean){this.mesh.material.uniforms.uUltra.value=ultra?1:0;}
}