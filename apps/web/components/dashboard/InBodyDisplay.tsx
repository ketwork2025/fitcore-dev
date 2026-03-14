"use client";

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';

interface InBodyDisplayProps {
  data: {
    weight_kg?: number;
    muscle_mass_kg?: number;
    body_fat_percentage?: number;
    measured_at?: string;
  } | null;
}

/**
 * [Strategy - Beomsu] C-I-D Analysis Display
 * Provides visual gauge for Weight, Muscle, and Fat with range indications.
 * This is the core of S5 Phase A: Premium Data Visualization.
 */
export function InBodyDisplay({ data }: InBodyDisplayProps) {
  const { t } = useTranslation();

  const weight = Number(data?.weight_kg) || 0;
  const muscle = Number(data?.muscle_mass_kg) || 0;
  const fat = Number(data?.body_fat_percentage) || 0;

  // Simple CID Type Logic for Strategic Feedback
  let typeLabel = "Ready to Analyze";
  let typeColor = "text-gray-500";
  let typeBorder = "border-gray-500/20";
  let typeBg = "bg-gray-500/10";

  if (weight > 0 && muscle > 0 && fat > 0) {
    if (muscle > weight * 0.45) {
      typeLabel = "Athletic (D-Type)";
      typeColor = "text-fitcore-green";
      typeBorder = "border-fitcore-green/20";
      typeBg = "bg-fitcore-green/10";
    } else if (muscle < weight * 0.35) {
      typeLabel = "Weak (C-Type)";
      typeColor = "text-amber-500";
      typeBorder = "border-amber-500/20";
      typeBg = "bg-amber-500/10";
    } else {
      typeLabel = "Balanced (I-Type)";
      typeColor = "text-blue-400";
      typeBorder = "border-blue-400/20";
      typeBg = "bg-blue-400/10";
    }
  }

  return (
    <Card className="backdrop-blur-md overflow-hidden h-full border-white/5 bg-black/20">
      <CardContent className="p-5 space-y-7">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Body Composition Analysis</p>
          <span className={`text-[9px] font-black ${typeColor} ${typeBg} px-2 py-0.5 rounded border ${typeBorder} uppercase tracking-tighter`}>
            {typeLabel}
          </span>
        </div>

        <InBodyGauge 
          label={t('inbody.weight')} 
          value={weight} 
          unit="kg" 
          currentPos={calculatePos(weight, 40, 110)}
        />
        <InBodyGauge 
          label={t('inbody.muscle')} 
          value={muscle} 
          unit="kg" 
          currentPos={calculatePos(muscle, 15, 55)}
          color="fitcore-green"
          glow
        />
        <InBodyGauge 
          label={t('inbody.fat')} 
          value={fat} 
          unit="%" 
          currentPos={calculatePos(fat, 5, 45)}
          color="blue-400"
        />

        {data?.measured_at && (
          <div className="pt-2 border-t border-white/5">
            <p className="text-[9px] text-gray-600 font-bold uppercase text-right tracking-tighter">
              Last Analysis: {new Date(data.measured_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function calculatePos(val: number, min: number, max: number) {
  if (val <= 0) return 33; 
  const pos = ((val - min) / (max - min)) * 100;
  return Math.min(Math.max(pos, 5), 95);
}

function InBodyGauge({ label, value, unit, currentPos, color = "gray-300", glow = false }: any) {
  const colorClass = color === 'fitcore-green' ? 'bg-fitcore-green' : (color === 'blue-400' ? 'bg-blue-400' : 'bg-gray-300');
  const glowClass = glow ? 'shadow-[0_0_15px_rgba(57,255,20,0.4)]' : '';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black italic tracking-tighter text-white leading-none">{value}</span>
          <span className="text-[8px] font-black text-gray-600 uppercase leading-none">{unit}</span>
        </div>
      </div>
      
      <div className="relative pt-1 pb-1">
        <div className="absolute top-0 inset-x-0 h-4 flex z-0 opacity-20 pointer-events-none">
           <div className="flex-1 border-r border-white/20" />
           <div className="flex-1 border-r border-white/20" />
           <div className="flex-1" />
        </div>

        <div className="h-1.5 w-full bg-gray-900 rounded-full relative overflow-hidden border border-white/5 shadow-inner">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${currentPos}%` }} 
            transition={{ duration: 1.5, ease: "circOut" }} 
            className={`h-full ${colorClass} rounded-full relative ${glowClass}`}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
          </motion.div>
        </div>

        <motion.div 
           initial={{ left: '0%', opacity: 0 }}
           animate={{ left: `${currentPos}%`, opacity: 1 }}
           transition={{ duration: 1.5, ease: "circOut" }}
           className="absolute top-0.5 -translate-x-1/2"
        >
           <div className={`w-2.5 h-2.5 rounded-full border border-black/50 ${colorClass === 'bg-fitcore-green' ? 'bg-fitcore-green' : 'bg-white'} shadow-lg scale-110 z-30`} />
        </motion.div>
      </div>
    </div>
  );
}
