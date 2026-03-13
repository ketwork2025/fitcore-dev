"use client";

import { motion } from 'framer-motion';
import { Ruler, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const measurements = [
  { label: 'Chest', current: 104, prev: 106, unit: 'cm', color: 'text-blue-400' },
  { label: 'Waist', current: 82, prev: 85, unit: 'cm', color: 'text-fitcore-green' },
  { label: 'Hips', current: 98, prev: 99, unit: 'cm', color: 'text-purple-400' },
  { label: 'Arm (R)', current: 36, prev: 35.5, unit: 'cm', color: 'text-amber-400' },
];

export function BodyMeasurementGrid() {
  return (
    <Card className="bg-fitcore-navyLight/50 border-white/5 h-full">
      <CardHeader className="pb-2">
         <CardTitle className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Ruler className="w-4 h-4 text-fitcore-green" />
            Physical Dimension Logs
         </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 gap-4">
        {measurements.map((m, i) => {
          const diff = m.current - m.prev;
          const isNegative = diff < 0;
          
          return (
            <motion.div 
               key={m.label}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-black/30 p-4 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-fitcore-green/30 transition-all"
            >
               <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent -rotate-45 translate-x-8 -translate-y-8" />
               <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">{m.label}</p>
               <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black italic tracking-tighter ${m.color}`}>{m.current}</span>
                  <span className="text-[8px] font-bold text-gray-600 uppercase">{m.unit}</span>
               </div>
               
               <div className="mt-2 flex items-center gap-1">
                  {diff === 0 ? (
                    <Minus className="w-3 h-3 text-gray-600" />
                  ) : isNegative ? (
                    <ArrowDown className="w-3 h-3 text-fitcore-green" />
                  ) : (
                    <ArrowUp className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-[10px] font-black ${diff === 0 ? 'text-gray-600' : isNegative ? 'text-fitcore-green' : 'text-red-500'}`}>
                     {diff > 0 ? `+${diff}` : diff}{m.unit}
                  </span>
               </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
