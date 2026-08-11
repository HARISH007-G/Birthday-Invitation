import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Resolve exact model URL with import.meta.env.BASE_URL for Vite / GitHub Pages
const getModelUrl = (modelPath: string = 'cake.glb') => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = modelPath.startsWith('/') ? modelPath.slice(1) : modelPath;
  return `${cleanBase}${cleanPath}`;
};

interface Cake3DBackgroundProps {
  modelPath?: string;
}

function CakeModel({ url }: { url: string }) {
  console.log("Loading GLB from:", url);
  const { scene } = useGLTF(url);

  useEffect(() => {
    console.log("GLB loaded successfully:", scene);
    scene.traverse((object) => {
      console.log(object.type, object.name, "visible:", object.visible);
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-pink-700 bg-pink-100/80 animate-pulse">
      Loading 3D Cake...
    </div>
  );
}

export function Cake3DBackground({ modelPath = 'cake.glb' }: Cake3DBackgroundProps) {
  console.log("Cake3DBackground rendered");
  const modelUrl = getModelUrl(modelPath);

  return (
    <div className="cake-3d-container relative w-full h-[500px] md:h-[600px] z-10 pointer-events-auto my-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <color attach="background" args={["#ffb6d5"]} />

        <ambientLight intensity={3} />
        <directionalLight position={[5, 5, 5]} intensity={5} />
        <directionalLight position={[-5, -5, -5]} intensity={2} />

        <Suspense fallback={<LoadingFallback />}>
          <CakeModel url={modelUrl} />
        </Suspense>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}

export default Cake3DBackground;
