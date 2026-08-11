import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Cake3DBackgroundProps {
  modelPath?: string;
}

// Resolve exact model URL with import.meta.env.BASE_URL for Vite / GitHub Pages
const getModelUrl = (modelPath: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = modelPath.startsWith('/') ? modelPath.slice(1) : modelPath;
  return `${cleanBase}${cleanPath}`;
};

interface CakeModelProps {
  url: string;
}

function CakeModel({ url }: CakeModelProps) {
  const { scene } = useGLTF(url);

  // Process scene: Detach Blender studio planes & auto-normalize bounding box scale
  const processedScene = useMemo(() => {
    console.log('Cake 3D GLB successfully loaded:', scene);
    const cloned = scene.clone(true);

    const toRemove: THREE.Object3D[] = [];
    cloned.traverse((child) => {
      const name = (child.name || '').toLowerCase();
      if (name.startsWith('plane') || name.startsWith('dof')) {
        toRemove.push(child);
      } else if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.needsUpdate = true;
          if ('envMapIntensity' in mat) {
            mat.envMapIntensity = 1.6;
          }
        }
      }
    });

    toRemove.forEach((obj) => {
      if (obj.parent) {
        obj.parent.remove(obj);
      }
    });

    // Compute bounding box strictly on the isolated cake geometry
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = 2.8 / (maxDim || 1);

    cloned.position.sub(center); // Center pivot exactly on the cake
    cloned.scale.setScalar(targetScale);

    return cloned;
  }, [scene]);

  return <primitive object={processedScene} position={[0, 0, 0]} />;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-xs font-semibold text-amber-900 border border-amber-200 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        Loading 3D Cake...
      </div>
    </Html>
  );
}

export const Cake3DBackground: React.FC<Cake3DBackgroundProps> = ({
  modelPath = '/cake.glb',
}) => {
  const modelUrl = getModelUrl(modelPath);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className="cake-3d-container"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100vh',
        minHeight: '500px',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0.4, isMobile ? 5.2 : 4.2],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={['transparent']} />

        <ambientLight intensity={2.5} color="#fff8f0" />
        <directionalLight position={[5, 8, 5]} intensity={3.5} color="#fffaed" />
        <directionalLight position={[-5, 3, -2]} intensity={2.5} color="#ffe4e1" />
        <directionalLight position={[0, -4, -4]} intensity={1.5} color="#ffd700" />
        <pointLight position={[0, 2.0, 0]} intensity={4.0} color="#ffaa44" distance={12} />

        <Suspense fallback={<LoadingFallback />}>
          <group position={[isMobile ? 0 : 1.65, isMobile ? 0.8 : 0.1, 0]}>
            <CakeModel url={modelUrl} />
          </group>
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default Cake3DBackground;
