import React, { Suspense, Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
} from "@react-three/drei";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D Canvas Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex items-center justify-center bg-amber-50/50 rounded-2xl p-4 text-xs font-semibold text-amber-800 border border-amber-200">
            ✨ Birthday Celebration Card (3D Model preview unavailable)
          </div>
        )
      );
    }
    return this.props.children;
  }
}

const getModelUrl = (modelPath?: string) => {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const path = modelPath ? modelPath.replace(/^\//, '') : 'cake.glb';
  return `${cleanBase}${path}`;
};

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
      <div className="cake-loading font-bold text-amber-900 bg-white/90 px-3 py-1.5 rounded-full shadow border border-amber-200">
        🎂 Loading cake...
      </div>
    </Html>
  );
}

export function Cake3DBackground({ modelPath }: { modelPath?: string }) {
  const url = getModelUrl(modelPath);
  console.log("Cake3DBackground rendered, loading from:", url);

  return (
    <div className="cake-3d-container relative w-full h-[400px] md:h-[500px] my-4 rounded-3xl overflow-hidden shadow-xl border-2 border-amber-200/60 bg-gradient-to-b from-[#fff3d1]/60 to-[#ffe4e1]/60">
      <ThreeErrorBoundary>
        <Canvas camera={{ position: [0, 1, 6], fov: 45 }}>
          <color attach="background" args={["transparent"]} />

          <ambientLight intensity={2.5} />
          <directionalLight position={[5, 5, 5]} intensity={4} />

          <Suspense fallback={<LoadingFallback />}>
            <CakeModel url={url} />
            <Environment preset="studio" />
          </Suspense>

          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

export default Cake3DBackground;
