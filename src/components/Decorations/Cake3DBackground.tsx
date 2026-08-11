import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const modelUrl = `${import.meta.env.BASE_URL}cake.glb`;

function CakeModel() {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    console.log("GLB loaded:", scene);
    scene.traverse((object) => {
      console.log(
        object.type,
        object.name,
        "visible:",
        object.visible
      );
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

export function Cake3DBackground({ modelPath }: { modelPath?: string }) {
  const url = modelPath ? `${import.meta.env.BASE_URL}${modelPath.replace(/^\//, '')}` : modelUrl;
  console.log("Cake3DBackground rendered");
  console.log("Loading GLB from:", url);

  return (
    <div className="cake-3d-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#ffb6d5"]} />

        <ambientLight intensity={3} />
        <directionalLight position={[5, 5, 5]} intensity={5} />

        <Suspense fallback={null}>
          <CakeModel />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default Cake3DBackground;
