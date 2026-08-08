"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { store } from "@/lib/store";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The mindshift, as particles: a loose drift of dots (thoughts) that quietly
 * reorganizes into a clean halftone grid as you scroll — disorder becoming
 * clarity, finished exactly when the SHIFT completes. Calm by design: slow
 * drift, soft dots, low opacity, the gentlest parallax.
 */

const OFFWHITE = new THREE.Color("#f4f9e1");

const VERT = /* glsl */ `
  uniform float uP;
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uParallax;
  attribute vec3 aGrid;
  attribute float aSeed;
  attribute float aAlpha;
  varying float vA;

  void main() {
    float k = smoothstep(0.0, 1.0, clamp(uP * 1.3 - aSeed * 0.3, 0.0, 1.0));
    vec3 drift = vec3(
      sin(uTime * 0.22 + aSeed * 39.0) * 0.07,
      cos(uTime * 0.19 + aSeed * 27.0) * 0.06,
      0.0
    ) * (1.0 - k * 0.85);
    vec3 breath = vec3(
      sin(uTime * 0.12 + aGrid.x * 1.7),
      cos(uTime * 0.11 + aGrid.y * 1.9),
      0.0
    ) * 0.006 * k;
    vec3 p = mix(position + drift, aGrid + breath, k);
    p.xy += uParallax * (0.35 + aSeed * 0.65);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.7 + aSeed * 0.6);
    vA = aAlpha * (0.8 + 0.2 * k);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vA;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.28, length(uv)) * vA;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Field({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const pRef = useRef(reduced ? 1 : 0);
  const { size, gl } = useThree();

  const aspect = size.width / size.height;
  const mobile = size.width < 768;
  const cols = mobile ? 22 : 40;
  const rows = mobile ? 16 : 25;
  const count = cols * rows;

  const { start, grid, seed, alpha } = useMemo(() => {
    const start = new Float32Array(count * 3);
    const grid = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const alpha = new Float32Array(count);

    // camera: z 6, fov 35 → half-height ≈ 1.89 at z 0
    const gx = 1.89 * aspect * 1.02;
    const gy = 1.86;

    // shuffled mapping: chaos points travel across each other into their cells
    const cells = Array.from({ length: count }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const ax = Math.min(1.6, aspect);
    const clusters = [
      [-1.5 * ax, 1.0],
      [1.55 * ax, 0.15],
      [-0.45 * ax, -1.25],
      [1.0 * ax, 1.25],
    ];

    for (let i = 0; i < count; i++) {
      const cell = cells[i];
      const cx = cell % cols;
      const cy = Math.floor(cell / cols);
      grid[i * 3] = -gx + (cx / (cols - 1)) * gx * 2;
      grid[i * 3 + 1] = -gy + (cy / (rows - 1)) * gy * 2;
      grid[i * 3 + 2] = 0;

      let sx: number;
      let sy: number;
      if (Math.random() < 0.72) {
        const cl = clusters[Math.floor(Math.random() * clusters.length)];
        sx = cl[0] + (Math.random() + Math.random() + Math.random() - 1.5) * 0.85;
        sy = cl[1] + (Math.random() + Math.random() + Math.random() - 1.5) * 0.75;
      } else {
        sx = (Math.random() * 2 - 1) * 1.95 * aspect;
        sy = (Math.random() * 2 - 1) * 1.9;
      }
      start[i * 3] = sx;
      start[i * 3 + 1] = sy;
      start[i * 3 + 2] = (Math.random() * 2 - 1) * 0.4;

      seed[i] = Math.random();
      alpha[i] = 0.2 + Math.random() * 0.32;
    }
    return { start, grid, seed, alpha };
  }, [count, cols, rows, aspect]);

  const uniforms = useMemo(
    () => ({
      uP: { value: reduced ? 1 : 0 },
      uTime: { value: 0 },
      uSize: {
        value:
          (mobile ? 2.1 : 2.6) *
          Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1),
      },
      uColor: { value: OFFWHITE },
      uParallax: { value: new THREE.Vector2() },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mobile, reduced]
  );

  useFrame((_, delta) => {
    const m = mat.current;
    if (!m) return;
    const target = reduced ? 1 : store.p;
    pRef.current += (target - pRef.current) * Math.min(1, delta * 3.2);
    m.uniforms.uP.value = pRef.current;
    if (!reduced) m.uniforms.uTime.value += Math.min(delta, 0.05);
    const par = m.uniforms.uParallax.value as THREE.Vector2;
    const tx = reduced ? 0 : store.px * 0.05;
    const ty = reduced ? 0 : -store.py * 0.04;
    par.x += (tx - par.x) * 0.04;
    par.y += (ty - par.y) * 0.04;
    // the dots belong to the blue journey — they bow out on the dark page
    gl.domElement.style.opacity = String(
      1 - Math.min(1, store.sections.rsvp) * 0.9
    );
  });

  return (
    <points key={`${count}-${Math.round(aspect * 40)}`}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[start, 3]} />
        <bufferAttribute attach="attributes-aGrid" args={[grid, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alpha, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleCanvas() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="canvas-wrap" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Field reduced={reduced} />
      </Canvas>
    </div>
  );
}
