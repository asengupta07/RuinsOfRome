import { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function Scene3D() {
  const modelRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);

  // Initialize Draco loader with CDN path
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
  );

  const gltf = useLoader(
    GLTFLoader,
    "https://ipfs.io/ipfs/bafybeiafzwyboy3ofjfdpzmqnx24qrb735jrotnpb5hffgnjqndzr7aliu",
    (loader) => {
      (loader as GLTFLoader).setDRACOLoader(dracoLoader);
    }
  );

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

  // Create a lighter material
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: "#222222", // Lighter color instead of pure black
    metalness: 0.6, // Reduced metalness
    roughness: 0.8, // Adjusted roughness
    envMapIntensity: 2.0, // Increased environment map intensity
    emissive: "#111111", // Slight emissive glow
    emissiveIntensity: 0.1, // Low emissive intensity
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
      const targetScale = 0.7 + scrollY * 2; // Scale from 1 to 4
      modelRef.current.scale.setScalar(
        THREE.MathUtils.lerp(modelRef.current.scale.x, targetScale, 0.1)
      );

      // Move downward as we scroll
      const targetY = -2 - scrollY * 6; // Move from -2 to -12
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
            scale={2}
            position={[0, 0, 0]}
            material={darkMaterial}
          />
        </group>
      </Float>
      {/* Improved lighting setup */}
      <ambientLight intensity={0.6} /> {/* Increased ambient light */}
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} color="#444444" intensity={0.5} />{" "}
      {/* Lighter color */}
      <pointLight
        position={[10, -10, 10]}
        color="#444444"
        intensity={0.5}
      />{" "}
      {/* Lighter color */}
      {/* Camera animation */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45}>
        <spotLight
          position={[0, 0, 2]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.8}
          castShadow
        />
      </PerspectiveCamera>
    </>
  );
}