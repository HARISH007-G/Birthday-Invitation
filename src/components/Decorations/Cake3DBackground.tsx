import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Cake3DBackgroundProps {
  modelPath?: string;
}

export const Cake3DBackground: React.FC<Cake3DBackgroundProps> = ({
  modelPath = '/cake.glb',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    let animationFrameId: number;

    // Resolve base path for Vite / GitHub Pages deployment
    const basePath = import.meta.env.BASE_URL || '/';
    const finalModelPath = modelPath.startsWith('/')
      ? `${basePath.replace(/\/$/, '')}${modelPath}`
      : modelPath;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - Positioned to view the cake clearly
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, isMobile ? 5.2 : 4.5);
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
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 4. Studio Environment Lighting (PBR Reflection mapping)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envRoom = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(envRoom, 0.04).texture;
    scene.environment = envTexture;

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaed, 3.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffe4e1, 2.5);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffd700, 1.8);
    backLight.position.set(0, -4, -4);
    scene.add(backLight);

    // Candle warm point light (flickering glow)
    const candleLight = new THREE.PointLight(0xffaa44, 4.5, 12);
    candleLight.position.set(0, 2.0, 0);
    scene.add(candleLight);

    // 5. Gold & Pink Floating Particle Field
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xffd700), // Gold
      new THREE.Color(0xffb6c1), // Pink
      new THREE.Color(0xffffff), // White
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Cake Model Container Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Load GLB file using GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      finalModelPath,
      (gltf) => {
        const modelScene = gltf.scene;

        // Detach Blender studio background planes (Plane, Plane.001, etc.)
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

        // Compute Bounding Box strictly on the isolated Cake mesh
        const box = new THREE.Box3().setFromObject(modelScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        // Scale cake to 2.4 units in 3D space
        const targetScale = 2.4 / (maxDim || 1);

        modelScene.position.sub(center);
        modelScene.scale.setScalar(targetScale);

        cakeGroup.add(modelScene);
      },
      undefined,
      (err) => {
        console.warn('Could not load cake GLB model at path:', finalModelPath, err);
      }
    );

    // Mouse movement listener
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth - 0.5) * 0.6;
      mouseRef.current.targetY = (event.clientY / window.innerHeight - 0.5) * 0.4;
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

      // Position cake offset so it is NOT covered behind centered text/photo cards!
      // On desktop (>768px), position on right side (x: 1.6). On mobile, position slightly higher (y: 0.8).
      const currentIsMobile = window.innerWidth < 768;
      const targetX = currentIsMobile ? 0 : 1.65;
      const targetY = currentIsMobile ? 0.8 : 0.1;

      if (cakeGroup) {
        cakeGroup.position.x = targetX;
        cakeGroup.position.y = targetY + Math.sin(elapsedTime * 1.4) * 0.12;
        cakeGroup.rotation.y += 0.007;
        cakeGroup.rotation.x = mouseRef.current.y * 0.3;
        cakeGroup.rotation.z = -mouseRef.current.x * 0.15;
      }

      // Candle light subtle flicker
      candleLight.position.x = targetX;
      candleLight.position.y = targetY + 2.0;
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-full block opacity-95" />
    </div>
  );
};
