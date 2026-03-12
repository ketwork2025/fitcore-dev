"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle2, Plus, ArrowRight, X, Dumbbell, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppStore } from '@/stores/appStore';
import { supabase } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface SetRecord {
  id?: string;
  weight: string;
  reps: string;
  completed: boolean;
}

export function WorkoutTracker({ workoutId, exerciseName, onFinish }: { workoutId: string, exerciseName: string, onFinish: () => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [sets, setSets] = useState<SetRecord[]>([
    { weight: '', reps: '', completed: false }
  ]);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [restTime, setRestTime] = useState(60);
  const [isResting, setIsResting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Timer logic for rest
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      timer = setInterval(() => setRestTime((prev) => prev - 1), 1000);
    } else if (restTime === 0) {
      setIsResting(false);
      setRestTime(60);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime]);

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([...sets, { 
      weight: lastSet?.weight || '', 
      reps: lastSet?.reps || '', 
      completed: false 
    }]);
  };

  const toggleSetCompletion = async (index: number) => {
    const newSets = [...sets];
    newSets[index].completed = !newSets[index].completed;
    setSets(newSets);

    if (newSets[index].completed) {
      setIsResting(true);
      setRestTime(60);
      // Automatically focus next set if available
      if (index + 1 < sets.length) {
        setActiveSetIndex(index + 1);
      }
    }
  };

  const updateSet = (index: number, field: keyof SetRecord, value: string) => {
    const newSets = [...sets];
    (newSets[index] as any)[field] = value;
    setSets(newSets);
  };

  const finishWorkout = async () => {
    setIsFinishing(true);
    try {
      // 1. Save all sets to Supabase
      const completedSets = sets.filter(s => s.completed && s.weight && s.reps);
      
      for (let i = 0; i < completedSets.length; i++) {
        await supabase.from('workout_sets').insert({
          workout_log_id: workoutId,
          set_number: i + 1,
          weight_kg: parseFloat(completedSets[i].weight),
          reps: parseInt(completedSets[i].reps),
          is_completed: true
        });
      }

      // 2. Mark workout as completed
      await supabase.from('workout_logs')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', workoutId);

      queryClient.invalidateQueries({ queryKey: ['workout'] });
      
      // Delay for success animation
      setTimeout(() => {
        onFinish();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('운동 기록 저장 중 오류가 발생했습니다.');
      setIsFinishing(false);
    }
  };

  if (isFinishing) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 bg-fitcore-navy flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="w-24 h-24 bg-fitcore-green/20 rounded-full flex items-center justify-center mb-6 border-2 border-fitcore-green shadow-[0_0_50px_rgba(57,255,20,0.3)]">
          <Trophy className="w-12 h-12 text-fitcore-green" />
        </div>
        <h2 className="text-3xl font-black text-white italic mb-2 tracking-tighter">WORKOUT COMPLETE!</h2>
        <p className="text-gray-400 mb-8">오늘도 한 걸음 더 성장하셨습니다.</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Sets</p>
              <p className="text-2xl font-black text-fitcore-green">{sets.filter(s => s.completed).length}</p>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Volume</p>
              <p className="text-2xl font-black text-blue-400">
                {sets.reduce((acc, s) => {
                  const w = parseFloat(s.weight || '0');
                  const r = parseInt(s.reps || '0');
                  return acc + (s.completed ? w * r : 0);
                }, 0)} <span className="text-xs">kg</span>
              </p>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-fitcore-navy overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-fitcore-green/10 rounded-lg border border-fitcore-green/30">
               <Dumbbell className="w-6 h-6 text-fitcore-green" />
             </div>
             <div>
               <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">{exerciseName}</h1>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-fitcore-green animate-pulse" />
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Session In Progress</span>
               </div>
             </div>
          </div>
          <button onClick={() => onFinish()} className="p-2 hover:bg-white/10 rounded-full text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Rest Timer Card */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card className="bg-fitcore-green/10 border-fitcore-green/30 backdrop-blur-md">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-fitcore-green flex items-center justify-center">
                       <Timer className="w-6 h-6 text-fitcore-green" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-fitcore-green uppercase tracking-widest">Rest Timer</p>
                      <p className="text-2xl font-black text-white italic">SET {sets.filter(s => s.completed).length} FINISHED</p>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-fitcore-green italic">
                    {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, '0')}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sets Tracking Section */}
        <div className="space-y-4">
          {sets.map((set, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`transition-all border-2 ${set.completed ? 'bg-fitcore-green/5 border-fitcore-green/20 opacity-60' : 'bg-white/5 border-white/5 shadow-xl'}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-white italic"># {index + 1}</span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="relative">
                       <input 
                         type="number" 
                         value={set.weight}
                         onChange={(e) => updateSet(index, 'weight', e.target.value)}
                         className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl font-bold text-white focus:outline-none focus:border-fitcore-green transition-colors pl-2"
                         placeholder="0"
                       />
                       <span className="absolute right-0 bottom-2 text-[10px] text-gray-500 font-bold uppercase">kg</span>
                    </div>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={set.reps}
                         onChange={(e) => updateSet(index, 'reps', e.target.value)}
                         className="w-full bg-transparent border-b-2 border-white/10 py-2 text-xl font-bold text-white focus:outline-none focus:border-fitcore-green transition-colors pl-2"
                         placeholder="0"
                       />
                       <span className="absolute right-0 bottom-2 text-[10px] text-gray-500 font-bold uppercase">reps</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleSetCompletion(index)}
                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-fitcore-green text-black' : 'bg-white/5 text-gray-700 hover:text-white hover:bg-white/10 border border-white/10'}`}
                  >
                    <CheckCircle2 className="w-7 h-7" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4">
           <Button variant="secondary" onClick={addSet} fullWidth className="h-14 border-fitcore-green/20 bg-fitcore-green/5 text-fitcore-green hover:bg-fitcore-green/10 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              ADD NEXT SET
           </Button>
           
           <Button onClick={finishWorkout} fullWidth className="h-16 text-lg tracking-tighter font-black italic shadow-[0_10px_30px_rgba(57,255,20,0.2)]">
              FINISH & SAVE WORKOUT
              <ArrowRight className="w-6 h-6" />
           </Button>
        </div>
      </div>
    </div>
  );
}
