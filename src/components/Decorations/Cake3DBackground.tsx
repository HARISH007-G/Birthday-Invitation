import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sparkles, Eye, EyeOff, RefreshCw, Upload } from 'lucide-react';

interface Cake3DBackgroundProps {
  modelPath?: string;
  opacity?: number;
  enableMouseInteraction?: boolean;
}

export const Cake3DBackground: React.FC<Cake3DBackgroundProps> = ({
  modelPath = '/cake.glb',
  opacity = 0.85,
  enableMouseInteraction = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentModelPath, setCurrentModelPath] = useState(modelPath);
  const [isLoading, setIsLoading] = useState(true);
  const [isGlbLoaded, setIsGlbLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [modelOpacity, setModelOpacity] = useState(opacity);
  const [customPathInput, setCustomPathInput] = useState(modelPath);
  const [showControls, setShowControls] = useState(false);

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    let animationFrameId: number;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 4. Lighting setup (warm party illumination)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffecd1, 2.0);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffc0cb, 1.0);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    // Candle warm point light (flickering glow)
    const candleLight = new THREE.PointLight(0xffaa44, 3, 10);
    candleLight.position.set(0, 1.8, 0);
    scene.add(candleLight);

    // 5. Sparkle Particle Field Background
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xffd700), // Gold
      new THREE.Color(0xffb6c1), // Pink
      new THREE.Color(0x87cefa), // Light Blue
      new THREE.Color(0xffffff), // White
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Cake Model Container Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    let loadedMesh: THREE.Object3D | null = null;
    let proceduralMesh: THREE.Group | null = null;

    // Helper: Build Procedural 3D Cake Fallback if GLB isn't present
    const createProceduralCake = () => {
      const group = new THREE.Group();

      // Tier Materials
      const tier1Mat = new THREE.MeshStandardMaterial({
        color: 0xfff0f5,
        roughness: 0.3,
        metalness: 0.1,
      });
      const tier2Mat = new THREE.MeshStandardMaterial({
        color: 0xffb6c1,
        roughness: 0.3,
        metalness: 0.1,
      });
      const tier3Mat = new THREE.MeshStandardMaterial({
        color: 0xffdab9,
        roughness: 0.3,
        metalness: 0.1,
      });
      const frostingMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
      });
      const candleMat = new THREE.MeshStandardMaterial({
        color: 0xff69b4,
        roughness: 0.4,
      });
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
      });

      // Bottom Tier
      const bottom = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 0.7, 32),
        tier1Mat
      );
      bottom.position.y = -0.65;
      group.add(bottom);

      // Middle Tier
      const middle = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.6, 32),
        tier2Mat
      );
      middle.position.y = 0;
      group.add(middle);

      // Top Tier
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32),
        tier3Mat
      );
      top.position.y = 0.55;
      group.add(top);

      // Decorative Frosting Pearls around tiers
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const pearl = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          frostingMat
        );
        pearl.position.set(Math.cos(angle) * 1.22, 0.3, Math.sin(angle) * 1.22);
        group.add(pearl);
      }

      // Center Candle
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16),
        candleMat
      );
      candle.position.y = 1.0;
      group.add(candle);

      // Candle Flame
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.18, 16),
        flameMat
      );
      flame.position.y = 1.28;
      group.add(flame);

      group.scale.set(1.1, 1.1, 1.1);
      return group;
    };

    // Load GLB file using GLTFLoader
    const loader = new GLTFLoader();
    setIsLoading(true);
    setErrorMessage(null);

    loader.load(
      currentModelPath,
      (gltf) => {
        setIsLoading(false);
        setIsGlbLoaded(true);
        setErrorMessage(null);

        loadedMesh = gltf.scene;

        // Auto-center and normalize scale of custom GLB model
        const box = new THREE.Box3().setFromObject(loadedMesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.4 / (maxDim || 1);

        loadedMesh.position.sub(center); // Center pivot
        loadedMesh.scale.setScalar(targetScale);

        // Enhance materials translucency/shadows
        loadedMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              (mesh.material as THREE.Material).needsUpdate = true;
            }
          }
        });

        cakeGroup.add(loadedMesh);
      },
      undefined,
      (_err) => {
        // Fallback gracefully if GLB file is not found at path
        setIsLoading(false);
        setIsGlbLoaded(false);
        setErrorMessage(
          `Could not find GLB model at "${currentModelPath}". Using fallback 3D cake model. Place your cake.glb file in the public/ folder!`
        );

        proceduralMesh = createProceduralCake();
        cakeGroup.add(proceduralMesh);
      }
    );

    // Mouse movement listener
    const handleMouseMove = (event: MouseEvent) => {
      if (!enableMouseInteraction) return;
      mouseRef.current.targetX = (event.clientX / window.innerWidth - 0.5) * 0.8;
      mouseRef.current.targetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window Resize listener
    const handleResize = () => {
      if (!canvas || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotate and float cake
      if (cakeGroup) {
        if (isRotating) {
          cakeGroup.rotation.y += 0.008;
        }

        // Floating motion
        cakeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

        // Interactive mouse tilt
        cakeGroup.rotation.x = mouseRef.current.y * 0.4;
        cakeGroup.rotation.z = -mouseRef.current.x * 0.2;
      }

      // Candle light subtle flicker
      candleLight.intensity = 2.5 + Math.sin(elapsedTime * 10) * 0.5 + Math.cos(elapsedTime * 23) * 0.3;

      // Animate background particles
      if (particleSystem) {
        particleSystem.rotation.y = elapsedTime * 0.03;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      scene.clear();
    };
  }, [currentModelPath, isRotating, enableMouseInteraction]);

  const handleApplyCustomPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPathInput.trim()) {
      setCurrentModelPath(customPathInput.trim());
    }
  };

  return (
    <>
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          zIndex: 0,
          opacity: isVisible ? modelOpacity : 0,
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Floating 3D Cake Background Controls & Status Badge */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-auto">
        {/* Toggle Widget Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-amber-200 hover:border-amber-400 text-xs font-semibold text-amber-900 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>3D Cake Background</span>
          <span
            className={`w-2 h-2 rounded-full ${
              isGlbLoaded ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
          />
        </button>

        {/* Extended Settings Modal Popover */}
        {showControls && (
          <div className="w-80 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-amber-200 text-amber-950 text-xs flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                3D Cake Background Setup
              </div>
              <button
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Model Status */}
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex flex-col gap-1">
              <div className="flex items-center justify-between font-medium text-amber-900">
                <span>Model Status:</span>
                {isLoading ? (
                  <span className="text-amber-600 font-semibold animate-pulse">
                    Loading GLB...
                  </span>
                ) : isGlbLoaded ? (
                  <span className="text-emerald-600 font-bold">
                    ✓ Custom .GLB Active
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold">
                    ★ 3D Procedural Active
                  </span>
                )}
              </div>
              {errorMessage && (
                <p className="text-[10px] text-amber-800 leading-tight mt-1">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Path Form */}
            <form onSubmit={handleApplyCustomPath} className="flex flex-col gap-1.5">
              <label className="font-semibold text-amber-900 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                GLB Model File Path:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customPathInput}
                  onChange={(e) => setCustomPathInput(e.target.value)}
                  placeholder="/cake.glb"
                  className="flex-1 bg-amber-50/50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Load
                </button>
              </div>
              <p className="text-[10px] text-amber-700 italic">
                Put your <code className="bg-amber-100 px-1 rounded">cake.glb</code> file inside the <code className="bg-amber-100 px-1 rounded">public/</code> directory!
              </p>
            </form>

            {/* Quick Controls */}
            <div className="flex flex-col gap-2 pt-1 border-t border-amber-100">
              <div className="flex items-center justify-between">
                <span className="font-medium text-amber-900">Visibility:</span>
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                >
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-amber-900">Auto Rotation:</span>
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    isRotating
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {isRotating ? 'Rotating On' : 'Paused'}
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-amber-900 font-medium">
                  <span>Background Opacity:</span>
                  <span>{Math.round(modelOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={modelOpacity}
                  onChange={(e) => setModelOpacity(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
