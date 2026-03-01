import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BoyCharacterProps {
  isFlapping: boolean;
  tilt: number;
}

export default function BoyCharacter({ isFlapping, tilt }: BoyCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  const flapTimeRef = useRef(0);
  const wasFlappingRef = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Apply tilt from velocity
    groupRef.current.rotation.z = -tilt;

    // Flap animation trigger
    if (isFlapping && !wasFlappingRef.current) {
      flapTimeRef.current = 0.35; // seconds of flap animation
    }
    wasFlappingRef.current = isFlapping;

    if (flapTimeRef.current > 0) {
      flapTimeRef.current -= delta;
      const t = Math.max(0, flapTimeRef.current / 0.35);
      const armAngle = Math.sin(t * Math.PI) * 1.2;
      if (leftArmRef.current) leftArmRef.current.rotation.z = armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.z = -armAngle;
      // Body bounce
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.sin(t * Math.PI) * 0.05;
      }
    } else {
      // Return arms to rest
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.z, 0.3, 0.15
        );
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z, -0.3, 0.15
        );
      }
      if (bodyRef.current) {
        bodyRef.current.position.y = THREE.MathUtils.lerp(
          bodyRef.current.position.y, 0, 0.15
        );
      }
    }
  });

  // Dark skin tone materials
  const skinMat = new THREE.MeshLambertMaterial({ color: '#8B5E3C' });
  const darkSkinMat = new THREE.MeshLambertMaterial({ color: '#6B3F1F' });
  const shirtMat = new THREE.MeshLambertMaterial({ color: '#E63946' });
  const pantsMat = new THREE.MeshLambertMaterial({ color: '#1D3557' });
  const shoesMat = new THREE.MeshLambertMaterial({ color: '#2B2B2B' });
  const eyeWhiteMat = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
  const eyePupilMat = new THREE.MeshLambertMaterial({ color: '#1a1a1a' });
  const hairMat = new THREE.MeshLambertMaterial({ color: '#1a0a00' });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* Head */}
        <mesh position={[0, 0.38, 0]} material={skinMat}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.52, 0]} material={hairMat}>
          <sphereGeometry args={[0.16, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>

        {/* Right eye white */}
        <mesh position={[0.07, 0.41, 0.16]} material={eyeWhiteMat}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        {/* Right eye pupil */}
        <mesh position={[0.09, 0.41, 0.19]} material={eyePupilMat}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>

        {/* Left eye white */}
        <mesh position={[-0.07, 0.41, 0.16]} material={eyeWhiteMat}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        {/* Left eye pupil */}
        <mesh position={[-0.09, 0.41, 0.19]} material={eyePupilMat}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0.36, 0.18]} material={darkSkinMat}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.22, 0]} material={skinMat}>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 8]} />
        </mesh>

        {/* Torso / shirt */}
        <mesh position={[0, 0.05, 0]} material={shirtMat}>
          <boxGeometry args={[0.28, 0.28, 0.18]} />
        </mesh>

        {/* Left arm */}
        <group position={[-0.19, 0.1, 0]}>
          <mesh ref={leftArmRef} position={[0, -0.1, 0]} rotation={[0, 0, 0.3]} material={skinMat}>
            <capsuleGeometry args={[0.045, 0.18, 4, 8]} />
          </mesh>
        </group>

        {/* Right arm */}
        <group position={[0.19, 0.1, 0]}>
          <mesh ref={rightArmRef} position={[0, -0.1, 0]} rotation={[0, 0, -0.3]} material={skinMat}>
            <capsuleGeometry args={[0.045, 0.18, 4, 8]} />
          </mesh>
        </group>

        {/* Pants - left leg */}
        <mesh position={[-0.07, -0.2, 0]} material={pantsMat}>
          <boxGeometry args={[0.11, 0.22, 0.14]} />
        </mesh>

        {/* Pants - right leg */}
        <mesh position={[0.07, -0.2, 0]} material={pantsMat}>
          <boxGeometry args={[0.11, 0.22, 0.14]} />
        </mesh>

        {/* Left shoe */}
        <mesh position={[-0.07, -0.33, 0.02]} material={shoesMat}>
          <boxGeometry args={[0.1, 0.07, 0.16]} />
        </mesh>

        {/* Right shoe */}
        <mesh position={[0.07, -0.33, 0.02]} material={shoesMat}>
          <boxGeometry args={[0.1, 0.07, 0.16]} />
        </mesh>
      </group>
    </group>
  );
}
