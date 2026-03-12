"use client";

import { motion } from 'framer-motion';
import { Sparkles, Play, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import Image from 'next/image';
import { useAppStore } from '@/stores/appStore';
import { supabase } from '@/lib/supabase/client';

export function AICoachCard() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);
  const setActiveWorkoutId = useAppStore((state) => state.setActiveWorkoutId);

  const handleStartWorkout = async () => {
    if (!user) return;
    
    // 1. Create a workout log in Supabase
    const { data, error } = await supabase.from('workout_logs').insert({
      user_id: user.id,
      exercise_name: 'Bench Press', // Default for now based on recommendation UI
      status: 'in_progress',
    }).select().single();

    if (error) {
      console.error(error);
      return;
    }

    // 2. Set as active workout in store
    setActiveWorkoutId(data.id);
  };

  return (
    <Card className="relative overflow-hidden border-fitcore-green/30 bg-gradient-to-br from-fitcore-navyLight to-fitcore-navy border-2 shadow-[0_0_30px_rgba(57,255,20,0.15)]">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center">
          {/* Coach Image Section */}
          <div className="relative w-full md:w-2/5 aspect-square bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-fitcore-navy to-transparent z-10" />
             <Image 
               src="/images/ai-coach.png" 
               alt="AI Coach" 
               fill
               className="object-cover opacity-80"
             />
             <motion.div 
               animate={{ opacity: [0.4, 0.7, 0.4] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-fitcore-green/5 mix-blend-overlay z-20" 
             />
          </div>

          {/* Coaching Content Section */}
          <div className="flex-1 p-6 md:p-8 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <div className="p-1 px-2 rounded-full bg-fitcore-green/10 border border-fitcore-green/30 flex items-center gap-1.5">
                   <Sparkles className="w-3.5 h-3.5 text-fitcore-green" />
                   <span className="text-[10px] font-bold text-fitcore-green uppercase tracking-wider">{t('coach.title')}</span>
                </div>
                <div className="ml-auto flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-fitcore-green animate-pulse" />
                   <div className="w-1.5 h-1.5 rounded-full bg-fitcore-green/40" />
                   <div className="w-1.5 h-1.5 rounded-full bg-fitcore-green/20" />
                </div>
             </div>

             <div className="space-y-2">
               <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tight">
                 {t('coach.recommendation')}
               </h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                 {t('coach.analysis')}
               </p>
             </div>

             <div className="bg-black/20 rounded-xl p-4 border border-fitcore-green/10 group hover:border-fitcore-green/30 transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-fitcore-green">Chest & Triceps Focus</span>
                   <span className="text-[10px] text-gray-500">Approx. 45 min</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                   {['Bench Press', 'Incline Dummy', 'Cable Fly'].map((ex) => (
                      <span key={ex} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                         {ex}
                      </span>
                   ))}
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={handleStartWorkout} className="flex-1 gap-2 h-12 text-sm">
                   <Play className="w-4 h-4 fill-current" />
                   {t('coach.start_btn')}
                </Button>
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-2 items-start sm:max-w-[200px]">
                   <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                   <span className="text-[10px] text-gray-400 leading-tight">
                     {t('coach.tip')}
                   </span>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
