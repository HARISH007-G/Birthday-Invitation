import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Vite build-time asset URL resolution for public/cake.glb
const defaultModelUrl = new URL('../../../public/cake.glb', import.meta.url).href;

function CakeModel({ url }: { url: string }) {
  console.log("CakeModel loading GLB from:", url);
  const { scene } = useGLTF(url);

  useEffect(() => {
    console.log("GLB loaded successfully:", scene);
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

export function Cake3DBackground({ modelPath }: { modelPath?: string }) {
  const url = modelPath ? modelPath : defaultModelUrl;
  console.log("Cake3DBackground rendered. GLB URL:", url);

  return (
    <div className="cake-3d-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#ffb6d5"]} />

        <ambientLight intensity={3} />
        <directionalLight position={[5, 5, 5]} intensity={5} />

        <Suspense fallback={null}>
          <CakeModel url={url} />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Cake3DBackground;
