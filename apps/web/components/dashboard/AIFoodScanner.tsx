"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Loader2, Check, RefreshCw, Sparkles, Scan } from 'lucide-react';

export function AIFoodScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        simulateScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    setResult(null);
    
    // Simulate AI Processing time
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        name: "Grilled Chicken Breast & Salad",
        calories: 385,
        carbs: 12,
        protein: 42,
        fat: 18,
        confidence: 98
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video bg-black/40 border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-fitcore-green/50 hover:bg-black/60 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Camera className="w-8 h-8 text-gray-500 group-hover:text-fitcore-green" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white uppercase italic tracking-tighter">AI Food Scanner</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Click to upload photo or take picture</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10">
            <img src={preview} alt="Food" className="w-full h-full object-cover" />
            
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                   initial={{ top: -20 }}
                   animate={{ top: '100%' }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 right-0 h-1 bg-fitcore-green shadow-[0_0_20px_#39ff14] z-20"
                />
              )}
            </AnimatePresence>

            {isScanning && (
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                     <Loader2 className="w-10 h-10 text-fitcore-green animate-spin" />
                     <p className="text-xs font-black text-fitcore-green uppercase italic drop-shadow-md">Analyzing with Gemini AI...</p>
                  </div>
               </div>
            )}

            {!isScanning && result && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute inset-x-4 bottom-4 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl z-30"
               >
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <p className="text-[10px] text-fitcore-green font-black uppercase tracking-widest flex items-center gap-1">
                           <Sparkles className="w-3 h-3" /> Analysis Success
                        </p>
                        <h4 className="text-sm font-black text-white italic">{result.name}</h4>
                     </div>
                     <div className="bg-fitcore-green/20 px-2 py-0.5 rounded border border-fitcore-green/30">
                        <span className="text-[10px] font-black text-fitcore-green">{result.confidence}% Match</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                     <ResultValue label="CAL" value={result.calories} unit="kcal" />
                     <ResultValue label="CARB" value={result.carbs} unit="g" />
                     <ResultValue label="PROT" value={result.protein} unit="g" />
                     <ResultValue label="FAT" value={result.fat} unit="g" />
                  </div>

                  <div className="mt-3 flex gap-2">
                     <button 
                       className="flex-1 bg-fitcore-green py-2 rounded-xl text-black text-xs font-black uppercase shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:scale-105 transition-all"
                       onClick={() => {
                          setPreview(null);
                          setResult(null);
                       }}
                     >
                        Apply To Log
                     </button>
                     <button 
                       className="p-2 bg-white/10 rounded-xl hover:bg-white/20"
                       onClick={() => setPreview(null)}
                     >
                        <RefreshCw className="w-4 h-4 text-white" />
                     </button>
                  </div>
               </motion.div>
            )}
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}

function ResultValue({ label, value, unit }: any) {
  return (
    <div className="bg-white/5 border border-white/5 p-1.5 rounded-lg text-center">
       <p className="text-[8px] text-gray-400 font-bold">{label}</p>
       <p className="text-xs font-black text-white">{value}<span className="text-[8px] font-normal text-gray-500 ml-0.5">{unit}</span></p>
    </div>
  );
}
