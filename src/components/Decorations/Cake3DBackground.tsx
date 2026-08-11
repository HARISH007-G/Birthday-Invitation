import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
} from "@react-three/drei";

const modelUrl = `${import.meta.env.BASE_URL}cake.glb`;

function CakeModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  console.log("GLB successfully loaded:", scene);

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
    <Html center>
      <div className="cake-loading">Loading cake...</div>
    </Html>
  );
}

export function Cake3DBackground({ modelPath }: { modelPath?: string }) {
  const url = modelPath ? `${import.meta.env.BASE_URL}${modelPath.replace(/^\//, '')}` : modelUrl;
  console.log("Cake3DBackground rendered");
  console.log("Loading GLB from:", url);

  return (
    <div className="cake-3d-container">
      <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
        <color attach="background" args={["#ffd6e7"]} />

        <ambientLight intensity={2} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={4}
        />

        <Suspense fallback={<LoadingFallback />}>
          <CakeModel url={url} />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}

export default Cake3DBackground;
