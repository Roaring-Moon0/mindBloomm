'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Extended AnimatedGrowingTree.jsx
// Procedural tree with growth stages, watering mechanic, health system, and visual effects.

export default function AnimatedGrowingTree({
  growthLevel: initialGrowthLevel = 0,
  health: initialHealth = 100,
  width = 800,
  height = 600,
  backgroundDay = 0xaee1f9,
  backgroundNight = 0x0a0a2a,
  trunkColor = 0x7b4f2b,
  leafHealthy = 0x2f8f3f,
  leafUnhealthy = 0xa0522d,
  seedColor = 0xd6b370,
}) {
  const mountRef = useRef(null);
  const [growthLevel, setGrowthLevel] = useState(initialGrowthLevel);
  const [health, setHealth] = useState(initialHealth);
  const [lastWater, setLastWater] = useState(Date.now());
  const rendererRef = useRef(null);

  useEffect(() => {
    setGrowthLevel(initialGrowthLevel);
  }, [initialGrowthLevel]);

  useEffect(() => {
    setHealth(initialHealth);
  }, [initialHealth]);

  useEffect(() => {
    if (!mountRef.current) return;
    let mounted = true;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundDay);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    rendererRef.current = renderer;

    // Lights
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 10, 7);
    scene.add(dir);
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    // Tree group
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Seed
    const seedGeom = new THREE.SphereGeometry(0.25, 12, 12);
    const seedMat = new THREE.MeshStandardMaterial({ color: seedColor });
    const seed = new THREE.Mesh(seedGeom, seedMat);
    seed.position.set(0, 0.25, 0);
    

    // Materials
    const trunkMat = new THREE.MeshStandardMaterial({ color: trunkColor, flatShading: true });
    let leafMat = new THREE.MeshStandardMaterial({ color: leafHealthy, roughness: 0.7 });

    // Track branches and leaves
    const branchNodes = [];
    const leaves = [];

    function createBranch(parentPos, direction, length, radius, depth, maxDepth) {
      if (depth > maxDepth) return;
      const geom = new THREE.CylinderGeometry(radius * 0.9, radius, length, 8, 1);
      const mesh = new THREE.Mesh(geom, trunkMat);

      const pivot = new THREE.Object3D();
      pivot.position.copy(parentPos);
      mesh.position.y = length / 2;
      pivot.add(mesh);

      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
      pivot.quaternion.copy(quaternion);

      branchNodes.push({ pivot, mesh, length, depth });
      treeGroup.add(pivot);
      
      const tipLocal = new THREE.Vector3(0, length, 0);
      pivot.localToWorld(tipLocal);


      if (depth < maxDepth) {
        const childCount = Math.random() < 0.6 ? 2 : 3;
        for (let i = 0; i < childCount; i++) {
          const childLen = length * (0.55 + Math.random() * 0.2);
          const childRad = radius * (0.55 + Math.random() * 0.25);
          const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.7 + 0.3, Math.random() - 0.5).normalize();
          const angle = (Math.PI / 5) * (0.8 + Math.random() * 0.9) * (Math.random() < 0.5 ? 1 : -1);
          const childDir = direction.clone().applyAxisAngle(axis, angle).normalize();
          createBranch(tipLocal, childDir, childLen, childRad, depth + 1, maxDepth);
        }
      } else {
        const leafCount = 6 + Math.floor(Math.random() * 8);
        for (let i = 0; i < leafCount; i++) {
          const l = new THREE.Mesh(new THREE.SphereGeometry(0.14 + Math.random() * 0.12, 6, 6), leafMat);
          l.position.copy(tipLocal).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8));
          l.scale.setScalar(1);
          leaves.push(l);
          treeGroup.add(l);
        }
      }
    }

    // Helper to rebuild tree based on growthLevel
    function buildTree() {
      while (treeGroup.children.length > 0) {
        const obj = treeGroup.children[0];
        treeGroup.remove(obj);
      }
      branchNodes.length = 0;
      leaves.length = 0;
      
      if (growthLevel === 0) {
         treeGroup.add(seed);
      } else {
        treeGroup.remove(seed);
        createBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), growthLevel + 1, 0.1 + growthLevel * 0.1, 1, growthLevel);
      }
    }

    buildTree();

    // Water particles
    const waterGroup = new THREE.Group();
    scene.add(waterGroup);

    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0xdfe7e3 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    // Animation loop
    let rafId;
    function animate(now) {
      if (!mounted) return;
      rafId = requestAnimationFrame(animate);

      const cycle = (Math.sin(now * 0.00005) + 1) / 2; 
      scene.background.lerpColors(new THREE.Color(backgroundNight), new THREE.Color(backgroundDay), cycle);

      if (health > 60) {
          leafMat.color.set(leafHealthy);
      } else if (health > 30) {
          leafMat.color.set(0xffd700); // yellowish
      } else {
          leafMat.color.set(leafUnhealthy);
      }
      
      leaves.forEach((leaf, i) => {
        if (health < 30) {
           leaf.rotation.x += 0.02;
           leaf.position.y -= 0.01;
           if(leaf.position.y < 0) {
              leaf.position.y = 0;
           }
        }
      });

      renderer.render(scene, camera);
    }
    
    if(mountRef.current && !mountRef.current.contains(renderer.domElement)){
        mountRef.current.appendChild(renderer.domElement);
    }
    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
        if(mountRef.current){
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w/h;
            camera.updateProjectionMatrix();
        }
    }

    window.addEventListener('resize', handleResize);


    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      if(rendererRef.current){
          rendererRef.current.dispose();
      }
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [growthLevel]);


  return (
      <div ref={mountRef} className="w-full h-full" />
  );
}