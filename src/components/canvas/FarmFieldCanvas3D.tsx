'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FarmFieldCanvas3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f291e, 0.028);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 8.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Ambient & Directional Sun Lights (Golden Hour farm feel)
    const ambientLight = new THREE.AmbientLight(0xd4e7c5, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    sunLight.position.set(6, 12, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x86efac, 1.2);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // 1. Terrain: Rolling hills (agricultural field geometry)
    const terrainGeo = new THREE.PlaneGeometry(50, 50, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    const vertex = new THREE.Vector3();
    const originalY: number[] = [];

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);
      // Create organic agricultural furrow waves and rolling contour lines
      const wave =
        Math.sin(vertex.x * 0.3) * 0.45 +
        Math.cos(vertex.z * 0.25) * 0.55 +
        Math.sin(vertex.x * 0.8 + vertex.z * 0.6) * 0.2;
      vertex.y = wave - 0.6;
      posAttr.setY(i, vertex.y);
      originalY.push(vertex.y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x14402a,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrainMesh);

    // 2. Swaying Wheat / Crop Stalks using InstancedMesh
    const stalkCount = 1400;
    const stalkGeo = new THREE.CylinderGeometry(0.015, 0.035, 1.1, 4);
    stalkGeo.translate(0, 0.55, 0);

    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Golden wheat / mustard yellow
      roughness: 0.6,
      metalness: 0.15,
    });

    const instancedStalks = new THREE.InstancedMesh(stalkGeo, stalkMat, stalkCount);
    const dummy = new THREE.Object3D();
    const stalkOrigins: { x: number; y: number; z: number; rotY: number; speed: number; phase: number }[] = [];

    // Color variation palette (young green to golden wheat)
    const stalkColors = [
      new THREE.Color(0xd97706), // Golden wheat
      new THREE.Color(0xf59e0b), // Amber gold
      new THREE.Color(0x84cc16), // Fresh lime green
      new THREE.Color(0x22c55e), // Emerald foliage
      new THREE.Color(0xeab308), // Mustard yellow
    ];

    let seed = 0;
    for (let i = 0; i < stalkCount; i++) {
      const x = (Math.sin(seed++) * 10000) % 18;
      const z = (Math.cos(seed++) * 10000) % 18 - 2;

      // Sample ground height approximately
      const y =
        Math.sin(x * 0.3) * 0.45 +
        Math.cos(z * 0.25) * 0.55 +
        Math.sin(x * 0.8 + z * 0.6) * 0.2 - 0.6;

      const rotY = Math.random() * Math.PI * 2;
      const scale = 0.75 + Math.random() * 0.65;

      dummy.position.set(x, y, z);
      dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.4), scale);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();

      instancedStalks.setMatrixAt(i, dummy.matrix);
      const color = stalkColors[Math.floor(Math.random() * stalkColors.length)];
      instancedStalks.setColorAt(i, color);

      stalkOrigins.push({
        x,
        y,
        z,
        rotY,
        speed: 1.5 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    if (instancedStalks.instanceColor) {
      instancedStalks.instanceColor.needsUpdate = true;
    }
    instancedStalks.instanceMatrix.needsUpdate = true;
    scene.add(instancedStalks);

    // 3. Floating Pollen / Golden Dust particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 22;
      particlePos[i + 1] = Math.random() * 5 + 0.2;
      particlePos[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Smooth Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 3.2;

    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normalizedX * 1.5;
      mouseY = normalizedY * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize smoothly
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera lerp towards mouse position (silky smooth)
      targetCameraX = mouseX;
      targetCameraY = 3.2 + mouseY;
      camera.position.x += (targetCameraX - camera.position.x) * 0.035;
      camera.position.y += (targetCameraY - camera.position.y) * 0.035;
      camera.lookAt(0, 1.1, -1);

      // Animate swaying stalks with wind wave
      for (let i = 0; i < stalkCount; i++) {
        const origin = stalkOrigins[i];
        const windWave =
          Math.sin(elapsed * origin.speed + origin.x * 0.4 + origin.z * 0.3 + origin.phase) *
          0.18;
        const windSwayZ =
          Math.cos(elapsed * (origin.speed * 0.8) + origin.z * 0.5) * 0.12;

        dummy.position.set(origin.x, origin.y, origin.z);
        dummy.rotation.set(windWave, origin.rotY, windSwayZ);
        dummy.updateMatrix();
        instancedStalks.setMatrixAt(i, dummy.matrix);
      }
      instancedStalks.instanceMatrix.needsUpdate = true;

      // Animate floating pollen
      const pAttr = particleGeo.attributes.position;
      const pArray = pAttr.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        pArray[i] += Math.sin(elapsed * 0.5 + i) * 0.005;
        pArray[i + 1] += Math.cos(elapsed * 0.3 + i) * 0.003;
        // wrap around if outside range
        if (pArray[i + 1] > 6) pArray[i + 1] = 0.5;
        if (pArray[i + 1] < 0.2) pArray[i + 1] = 5.5;
      }
      pAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      terrainGeo.dispose();
      terrainMat.dispose();
      stalkGeo.dispose();
      stalkMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
