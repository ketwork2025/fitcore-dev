"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, MeshDistortMaterial, Float, Sphere, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

function AvatarModel() {
  return (
    <group>
      {/* Head */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <MeshDistortMaterial
            color="#39ff14"
            speed={3}
            distort={0.4}
            radius={1}
            emissive="#39ff14"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive="#39ff14"
          emissiveIntensity={0.1}
          wireframe 
        />
      </mesh>

      {/* Arms */}
      <mesh position={[0.35, 1.2, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>
      <mesh position={[-0.35, 1.2, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>

      {/* Legs */}
      <mesh position={[0.12, 0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>
      <mesh position={[-0.12, 0.3, 0]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe wireframeLinewidth={2} />
      </mesh>
    </group>
  );
}

function Grid() {
  return (
    <gridHelper args={[10, 20, '#39ff14', '#1a1a1a']} position={[0, -0.1, 0]} />
  );
}

export function Body3D() {
  const { t } = useTranslation();

  return (
    <Card className="h-[400px] relative overflow-hidden bg-black/40 border-fitcore-green/20">
      <CardHeader className="absolute top-0 left-0 z-10 w-full p-4 pointer-events-none">
        <div className="flex flex-col gap-1">
           <CardTitle className="text-fitcore-green italic uppercase tracking-tighter text-sm">
             3D Body Visualization (Alpha)
           </CardTitle>
           <p className="text-[10px] text-gray-500 font-bold uppercase">Digital Twin Modeling</p>
        </div>
      </CardHeader>
      
      <CardContent className="h-full p-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={50} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#39ff14" intensity={1} />
          
          <AvatarModel />
          <Grid />
          
          <fog attach="fog" args={['#000', 5, 15]} />
        </Canvas>

        {/* Floating Stats UI in 3D Space (Overlay) */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-fitcore-green/20 text-[10px] space-y-1">
           <div className="flex justify-between gap-4">
              <span className="text-gray-400">STATUS</span>
              <span className="text-fitcore-green font-black">SYNCED</span>
           </div>
           <div className="flex justify-between gap-4">
              <span className="text-gray-400">ACCURACY</span>
              <span className="text-white">98.4%</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
