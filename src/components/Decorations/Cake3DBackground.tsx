import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Cake3DBackgroundProps {
  modelPath?: string;
}

export const Cake3DBackground: React.FC<Cake3DBackgroundProps> = ({
  modelPath = 'cake.glb',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    console.log('Cake3DBackground component mounted');
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    let animationFrameId: number;

    // Resolve base URL for Vite & GitHub Pages
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = modelPath.startsWith('/') ? modelPath.slice(1) : modelPath;
    const finalModelUrl = `${cleanBase}${cleanPath}`;

    console.log('Loading 3D Cake GLB from URL:', finalModelUrl);

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, isMobile ? 5.0 : 4.0);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 4. Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envRoom = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(envRoom, 0.04).texture;
    scene.environment = envTexture;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaed, 3.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffe4e1, 2.5);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    const candleLight = new THREE.PointLight(0xffaa44, 4.5, 12);
    candleLight.position.set(0, 2.0, 0);
    scene.add(candleLight);

    // 6. Particle Field
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color(0xffd700), new THREE.Color(0xffb6c1), new THREE.Color(0xffffff)];

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

    // 7. Interactive OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // 8. GLTF Cake Model Loader
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    const loader = new GLTFLoader();
    loader.load(
      finalModelUrl,
      (gltf) => {
        console.log('Cake 3D GLB successfully loaded:', gltf.scene);
        setLoadingState('loaded');
        const modelScene = gltf.scene;

        // Detach Blender studio planes & cameras
        const toRemove: THREE.Object3D[] = [];
        modelScene.traverse((child) => {
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

        // Calculate bounding box on isolated cake geometry
        const box = new THREE.Box3().setFromObject(modelScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        console.log('Isolated cake bounds - Size:', size, 'Center:', center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.6 / (maxDim || 1);

        modelScene.position.sub(center);
        modelScene.scale.setScalar(targetScale);

        cakeGroup.add(modelScene);
      },
      undefined,
      (err) => {
        console.error('Error loading GLB model at path:', finalModelUrl, err);
        setLoadingState('error');
      }
    );

    // Resize Handler
    const handleResize = () => {
      if (!canvas || !renderer) return;
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = containerRef.current?.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      if (cakeGroup) {
        cakeGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.08;
      }

      candleLight.intensity = 3.5 + Math.sin(elapsedTime * 10) * 0.5;

      if (particleSystem) {
        particleSystem.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      pmremGenerator.dispose();
      envRoom.dispose();
      envTexture.dispose();
      renderer.dispose();
      geometry.dispose();
      particleMaterial.dispose();
      scene.clear();
    };
  }, [modelPath]);

  return (
    <div
      ref={containerRef}
      className="cake-3d-container relative w-full h-[450px] md:h-[550px] my-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-gradient-to-b from-[#fff3d1] to-[#ffe4e1] z-10 pointer-events-auto flex items-center justify-center"
    >
      {/* Loading Overlay Badge */}
      {loadingState === 'loading' && (
        <div className="absolute z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-amber-200 text-xs font-bold text-amber-900 animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          Loading 3D Chocolate Cake...
        </div>
      )}

      {/* Error Badge */}
      {loadingState === 'error' && (
        <div className="absolute z-20 px-4 py-2 rounded-xl bg-red-50/95 backdrop-blur-md shadow-lg border border-red-200 text-xs font-bold text-red-800">
          ⚠️ Could not load cake.glb file. Check console.
        </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default Cake3DBackground;
