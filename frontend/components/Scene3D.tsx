import { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export default function Scene3D() {
  const modelRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);
  const gltf = useLoader(GLTFLoader, "/model2.glb");

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on page height
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollY(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Create a dark material
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: "#000000",
    metalness: 0.8,
    roughness: 1,
    envMapIntensity: 1.5,
    emissive: "#000000",
    emissiveIntensity: 0,
  });

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Smooth rotation based on scroll
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        scrollY * Math.PI * 2,
        0.1
      );

      // Scale up as we scroll down
      const targetScale = 1 + scrollY * 3; // Scale from 1 to 4
      modelRef.current.scale.setScalar(
        THREE.MathUtils.lerp(modelRef.current.scale.x, targetScale, 0.1)
      );

      // Move downward as we scroll
      const targetY = -2 - scrollY * 10; // Move from -2 to -12
      modelRef.current.position.y = THREE.MathUtils.lerp(
        modelRef.current.position.y,
        targetY,
        0.1
      );

      // Add slight floating animation
      modelRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.001;
    }
  });

  return (
    <>
      <Environment preset="night" />
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={modelRef}>
          <primitive
            object={gltf.scene}
            scale={5}
            position={[0, 0, 0]}
            material={darkMaterial}
          />
        </group>
      </Float>

      {/* Dark lighting setup */}
      <ambientLight intensity={0.1} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} color="#000000" intensity={0.3} />
      <pointLight position={[10, -10, 10]} color="#000000" intensity={0.3} />

      {/* Camera animation */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45}>
        <spotLight
          position={[0, 0, 2]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.5}
          castShadow
        />
      </PerspectiveCamera>
    </>
  );
}
