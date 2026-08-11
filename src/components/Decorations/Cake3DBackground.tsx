import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const getModelUrl = (overridePath?: string) => {
  if (overridePath) {
    const clean = overridePath.startsWith('/') ? overridePath.slice(1) : overridePath;
    return `${import.meta.env.BASE_URL}${clean}`;
  }
  return `${import.meta.env.BASE_URL}cake.glb`;
};

function CakeModel({ url }: { url: string }) {
  console.log("CakeModel loading GLB from:", url);
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

export function Cake3DBackground({ modelPath }: { modelPath?: string }) {
  const url = getModelUrl(modelPath);
  console.log("Cake3DBackground rendered");
  console.log("Loading GLB from:", url);

  return (
    <div className="cake-3d-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
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
