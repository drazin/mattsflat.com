import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LiquidMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#FFF8F0') },
      uColor2: { value: new THREE.Color('#FF6B6B') },
      uColor3: { value: new THREE.Color('#F5E6C8') },
    }),
    []
  );

  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;
      float elevation = sin(pos.x * 3.0 + uTime * 0.5) * 0.15
                      + sin(pos.y * 2.0 + uTime * 0.3) * 0.1
                      + sin((pos.x + pos.y) * 2.5 + uTime * 0.7) * 0.08;
      pos.z += elevation;
      vElevation = elevation;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uTime;

    void main() {
      float mixStrength = (vElevation + 0.2) * 2.5;
      vec3 color = mix(uColor1, uColor2, vUv.y);
      color = mix(color, uColor3, mixStrength);
      float alpha = smoothstep(0.0, 0.3, vUv.y) * 0.6;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 6, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function LiquidHero() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <LiquidMesh />
      </Canvas>
    </div>
  );
}
