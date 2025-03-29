import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { useScroll, Environment, Float, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

export default function Scene3D() {
  const modelRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const gltf = useLoader(GLTFLoader, '/model2.glb')

  // Create a dark material
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: '#000000',
    metalness: 0.2,
    roughness: 0.9,
    emissive: '#000000',
    emissiveIntensity: 0,
    normalScale: new THREE.Vector2(0.5, 0.5),
    envMapIntensity: 0.5,
    flatShading: true,
    dithering: true,
    side: THREE.DoubleSide
  })

  useFrame((state, delta) => {
    const scrollOffset = scroll.offset
    if (modelRef.current) {
      // Smooth rotation based on scroll
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        scrollOffset * Math.PI * 2,
        0.1
      )
      // Add slight floating animation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <>
      <Environment preset="night" />
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <group ref={modelRef}>
          <primitive 
            object={gltf.scene} 
            scale={5}
            position={[0, -2, 0]}
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
      <pointLight
        position={[-10, -10, -10]}
        color="#000000"
        intensity={0.3}
      />
      <pointLight
        position={[10, -10, 10]}
        color="#000000"
        intensity={0.3}
      />

      {/* Camera animation */}
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        fov={45}
      >
        <spotLight
          position={[0, 0, 2]}
          angle={0.5}
          penumbra={0.5}
          intensity={0.5}
          castShadow
        />
      </PerspectiveCamera>
    </>
  )
} 