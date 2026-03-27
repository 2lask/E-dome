"use client";

import { useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

/* ── Noise GLSL ── */
const noise = `
float random(vec2 st){return fract(sin(dot(st,vec2(12.9898,78.233)))*43758.5453);}
float noise(vec2 st){vec2 i=floor(st);vec2 f=fract(st);float a=random(i);float b=random(i+vec2(1,0));float c=random(i+vec2(0,1));float d=random(i+vec2(1,1));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}
float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod(Pi0,289.);Pi1=mod(Pi1,289.);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0/7.;vec4 gy0=fract(floor(gx0)/7.)-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1/7.;vec4 gy1=fract(floor(gx1)/7.)-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}
`;

/* ── Geometry helper ── */
function createPlanes(n: number, w: number, h: number, seg: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const verts = n * (seg + 1) * 2;
  const faces = n * seg * 2;
  const pos = new Float32Array(verts * 3);
  const idx = new Uint32Array(faces * 3);
  const uvs = new Float32Array(verts * 2);
  let vi = 0, ii = 0, ui = 0;
  const totalW = n * w;
  const base = -totalW / 2;
  for (let i = 0; i < n; i++) {
    const xo = base + i * w;
    const uo = Math.random() * 300, vo = Math.random() * 300;
    for (let j = 0; j <= seg; j++) {
      const y = h * (j / seg - 0.5);
      pos.set([xo, y, 0, xo + w, y, 0], vi * 3);
      uvs.set([uo, j / seg + vo, uo + 1, j / seg + vo], ui);
      if (j < seg) { const a = vi, b = vi + 1, c = vi + 2, d = vi + 3; idx.set([a, b, c, c, b, d], ii); ii += 6; }
      vi += 2; ui += 4;
    }
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeVertexNormals();
  return geo;
}

/* ── Mesh ── */
const Planes = forwardRef<THREE.Mesh, { mat: THREE.ShaderMaterial; w: number; n: number; h: number }>(
  ({ mat, w, n, h }, ref) => {
    const mesh = useRef<THREE.Mesh>(null!);
    useImperativeHandle(ref, () => mesh.current);
    const geo = useMemo(() => createPlanes(n, w, h, 100), [n, w, h]);
    useFrame((_, dt) => { (mesh.current.material as THREE.ShaderMaterial).uniforms.time.value += 0.1 * dt; });
    return <mesh ref={mesh} geometry={geo} material={mat} />;
  }
);
Planes.displayName = "Planes";

/* ── Material ── */
function makeBeamMaterial(speed: number, noiseI: number, scale: number) {
  const phys = THREE.ShaderLib.physical;
  const u = THREE.UniformsUtils.clone(phys.uniforms);
  u.diffuse = { value: new THREE.Color(0, 0, 0) };
  u.roughness = { value: 0.3 };
  u.metalness = { value: 0.3 };
  u.time = { value: 0 };
  u.uSpeed = { value: speed };
  u.uNoiseIntensity = { value: noiseI };
  u.uScale = { value: scale };
  u.envMapIntensity = { value: 10 };

  const header = `varying vec3 vEye;varying float vNoise;varying vec2 vUv;varying vec3 vPosition;uniform float time;uniform float uSpeed;uniform float uNoiseIntensity;uniform float uScale;\n${noise}`;
  const vHead = `float getPos(vec3 p){return cnoise(vec3(p.x*0.,p.y-uv.y,p.z+time*uSpeed*3.)*uScale);}
vec3 getCurrentPos(vec3 p){vec3 n=p;n.z+=getPos(p);return n;}
vec3 getNormal(vec3 p){vec3 c=getCurrentPos(p);vec3 nx=getCurrentPos(p+vec3(.01,0,0));vec3 nz=getCurrentPos(p+vec3(0,-.01,0));return normalize(cross(normalize(nz-c),normalize(nx-c)));}`;

  let vs = `${header}\n${vHead}\n${phys.vertexShader}`;
  vs = vs.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed.z+=getPos(transformed.xyz);");
  vs = vs.replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nobjectNormal=getNormal(position.xyz);");

  let fs = `${header}\n${phys.fragmentShader}`;
  fs = fs.replace("#include <dithering_fragment>", "#include <dithering_fragment>\nfloat rn=noise(gl_FragCoord.xy);gl_FragColor.rgb-=rn/15.*uNoiseIntensity;");

  return new THREE.ShaderMaterial({ defines: { ...(phys as any).defines }, uniforms: u, vertexShader: vs, fragmentShader: fs, lights: true, fog: false });
}

/* ── Scene ── */
function BeamsScene({ color = "#C4956A", speed = 2.5, beams = 15 }: { color?: string; speed?: number; beams?: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat = useMemo(() => makeBeamMaterial(speed, 2, 0.15), [speed]);
  const dir = useRef<THREE.DirectionalLight>(null!);
  useEffect(() => { if (dir.current) { const c = dir.current.shadow.camera as any; c.top = 24; c.bottom = -24; c.left = -24; c.right = 24; c.far = 64; } }, []);
  return (
    <Canvas dpr={[1, 2]} className="w-full h-full">
      <group rotation={[0, 0, degToRad(43)]}>
        <Planes ref={mesh} mat={mat} w={2.5} n={beams} h={18} />
        <directionalLight ref={dir} color={color} intensity={1} position={[0, 3, 10]} />
      </group>
      <ambientLight intensity={1} />
      <color attach="background" args={["#080808"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </Canvas>
  );
}

/* ── Export ── */
export function BeamsBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <BeamsScene color="#C4956A" speed={2} beams={14} />
    </div>
  );
}
