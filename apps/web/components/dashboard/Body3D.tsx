"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, MeshDistortMaterial, Float, Sphere, Text, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useState, useEffect } from 'react';

function AvatarModel({ muscle = 35, fat = 20, weight = 75 }) {
  // Normalize values for scaling
  const muscleScale = 1 + (muscle - 30) / 50; 
  const fatScale = 1 + (fat - 15) / 50;
  const heightScale = 1 + (weight - 70) / 200;

  return (
    <group scale={[1, heightScale, 1]}>
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

      {/* Torso (Scales with Muscle/Fat) */}
      <mesh position={[0, 1, 0]} scale={[muscleScale * fatScale, 1, fatScale]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          emissive="#39ff14"
          emissiveIntensity={0.1}
          wireframe 
        />
      </mesh>

      {/* Arms (Scale with Muscle) */}
      <mesh position={[0.35, 1.2, 0]} rotation={[0, 0, -0.2]} scale={[muscleScale, 1, muscleScale]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>
      <mesh position={[-0.35, 1.2, 0]} rotation={[0, 0, 0.2]} scale={[muscleScale, 1, muscleScale]}>
        <capsuleGeometry args={[0.06, 0.5, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>

      {/* Legs */}
      <mesh position={[0.12, 0.3, 0]} scale={[1, 1, 1]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>
      <mesh position={[-0.12, 0.3, 0]} scale={[1, 1, 1]}>
        <capsuleGeometry args={[0.08, 0.6, 4, 16]} />
        <meshStandardMaterial color="#39ff14" wireframe />
      </mesh>
    </group>
  );
}

function Grid() {
  return (
    <gridHelper args={[10, 20, '#39ff14', '#1a1a1a']} position={[0, 0, 0]} />
  );
}

export function Body3D() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ weight: 75, muscle: 35, fat: 18 });
  const [isComparing, setIsComparing] = useState(false);

  // Simulation: Toggle between "Current" and "Target"
  const targetStats = { weight: 72, muscle: 38, fat: 12 };

  const currentView = isComparing ? targetStats : stats;

  return (
    <Card className="h-[450px] relative overflow-hidden bg-black/40 border-fitcore-green/20">
      <CardHeader className="absolute top-0 left-0 z-10 w-full p-4 pointer-events-none">
        <div className="flex justify-between items-start w-full">
           <div className="flex flex-col gap-1">
              <CardTitle className="text-fitcore-green italic uppercase tracking-tighter text-sm">
                3D Digital Twin Analysis
              </CardTitle>
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                {isComparing ? 'Preview: Target Physique' : 'Current: Real-time Scan'}
              </p>
           </div>
           <button 
             onClick={() => setIsComparing(!isComparing)}
             className="pointer-events-auto bg-fitcore-green/10 border border-fitcore-green/30 px-3 py-1.5 rounded-xl text-[10px] font-black text-fitcore-green hover:bg-fitcore-green hover:text-black transition-all uppercase italic"
           >
             {isComparing ? 'Back to Reality' : 'View Target Body'}
           </button>
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
            autoRotate={!isComparing}
            autoRotateSpeed={1}
          />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#39ff14" intensity={1} />
          
          <AvatarModel 
            weight={currentView.weight}
            muscle={currentView.muscle}
            fat={currentView.fat}
          />
          <Grid />
          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={5} blur={24} far={1} color="#39ff14" />
          
          <fog attach="fog" args={['#000', 5, 15]} />
        </Canvas>

        {/* Floating Stats UI */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
           <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-fitcore-green/20 text-[10px] space-y-1">
              <div className="flex justify-between gap-4">
                 <span className="text-gray-400 uppercase">Weight</span>
                 <span className="text-white font-black">{currentView.weight}kg</span>
              </div>
              <div className="flex justify-between gap-4">
                 <span className="text-gray-400 uppercase">Muscle</span>
                 <span className="text-fitcore-green font-black">{currentView.muscle}kg</span>
              </div>
              <div className="flex justify-between gap-4">
                 <span className="text-gray-400 uppercase">Body Fat</span>
                 <span className="text-white font-black">{currentView.fat}%</span>
              </div>
           </div>

           <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-fitcore-green/20 text-[10px] space-y-1">
              <div className="flex justify-between gap-4">
                 <span className="text-gray-400">STATUS</span>
                 <span className={`font-black ${isComparing ? 'text-amber-400' : 'text-fitcore-green'}`}>
                    {isComparing ? 'SIMULATED' : 'LIVE_SYNC'}
                 </span>
              </div>
              <div className="flex justify-between gap-4">
                 <span className="text-gray-400">ACCURACY</span>
                 <span className="text-white">99.1%</span>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
