"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Check, Play, Loader2, Trash2, X, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { useQueryClient } from '@tanstack/react-query';
import workoutsData from '../../data/workouts.json';

interface SetRecord {
  id?: string;
  weight: string;
  reps: string;
  completed: boolean;
}

export function WorkoutLogger() {
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();

  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState<SetRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isGuest = useAppStore((state) => state.isGuest);
  const STORAGE_KEY = 'fitcore_guest_workout';

  useEffect(() => {
    setMounted(true);
  }, []);

  // [Strategy - Beomsu] Zero-Friction Persistence for Guests
  useEffect(() => {
    if (mounted && isGuest) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveSession(parsed.id);
          setExerciseName(parsed.exerciseName);
          setSets(parsed.sets);
        } catch (e) {
          console.error('Failed to parse saved workout', e);
        }
      }
    }
  }, [mounted, isGuest]);

  useEffect(() => {
    if (mounted && isGuest && activeSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        id: activeSession,
        exerciseName,
        sets
      }));
    } else if (mounted && isGuest && !activeSession) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [mounted, isGuest, activeSession, sets, exerciseName]);

  const filteredWorkouts = workoutsData
    .filter(w => {
      const isJunk = ['#', '(', '0', '1', '5', 'False', 'MAX', 'lb', 'ⓒ', '날짜', '간식', '단백질', '탄수화물', '지방', '수분', '숙면', '컨디션', '피드백', '한줄평'].some(ex => w.includes(ex));
      return w.length >= 2 && !isJunk;
    })
    .filter(w => exerciseName && w.toLowerCase().includes(exerciseName.toLowerCase()))
    .sort((a, b) => {
      const search = exerciseName.toLowerCase();
      const aStarts = a.toLowerCase().startsWith(search);
      const bStarts = b.toLowerCase().startsWith(search);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    })
    .slice(0, 8);

  // 운동 시작 (세션 생성)
  const startWorkout = async () => {
    if (!exerciseName) return;
    
    if (isGuest) {
      setActiveSession('guest-' + Date.now());
      setSets([{ weight: '', reps: '', completed: false }]);
      return;
    }

    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          exercise_name: exerciseName,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setActiveSession(data.id);
      setSets([{ weight: '', reps: '', completed: false }]);
      queryClient.invalidateQueries({ queryKey: ['workout'] });
    } catch (err) {
      console.error(err);
      alert('운동 시작 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 세트 추가
  const addSet = () => {
    setSets([...sets, { weight: sets[sets.length - 1]?.weight || '', reps: sets[sets.length - 1]?.reps || '', completed: false }]);
  };

  // 세트 삭제
  const removeSet = (index: number) => {
    if (sets.length <= 1) return;
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  // 운동 취소 (전체 삭제)
  const cancelWorkout = () => {
    if (window.confirm('기록 중인 운동을 정말 취소하시겠습니까? 데이터가 저장되지 않습니다.')) {
      setActiveSession(null);
      setExerciseName('');
      setSets([]);
    }
  };

  // 세트 기록 저장
  const toggleSetComplete = async (index: number) => {
    if (!activeSession) return;
    const currentSet = sets[index];
    if (!currentSet) return;
    
    if (currentSet.completed) return;

    if (isGuest) {
      const newSets = [...sets];
      if (newSets[index]) {
        newSets[index]!.completed = true;
      }
      setSets(newSets);
      return;
    }

    try {
      const { error } = await supabase.from('workout_sets').insert({
        workout_log_id: activeSession,
        set_number: index + 1,
        weight_kg: parseFloat(currentSet.weight),
        reps: parseInt(currentSet.reps),
        is_completed: true,
      });

      if (error) throw error;

      const newSets = [...sets];
      if (newSets[index]) {
        newSets[index]!.completed = true;
      }
      setSets(newSets);
      queryClient.invalidateQueries({ queryKey: ['workout'] });
    } catch (err) {
      console.error(err);
      alert('세트 저장 중 오류가 발생했습니다.');
    }
  };

  // 운동 종료
  const finishWorkout = async () => {
    if (!activeSession) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('workout_logs')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', activeSession);

      if (error) throw error;
      
      setActiveSession(null);
      setExerciseName('');
      setSets([]);
      queryClient.invalidateQueries({ queryKey: ['workout'] });
      alert('오늘도 고생하셨습니다! 오운완! 🔥');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Card className="backdrop-blur-xl shadow-[0_0_20px_rgba(57,255,20,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-fitcore-green/10 rounded-lg border border-fitcore-green/30">
            <Dumbbell className="w-5 h-5 text-fitcore-green" />
          </div>
          <CardTitle>{activeSession ? '실시간 운동 기록' : '새로운 운동 시작'}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!activeSession ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="운동 종목"
                placeholder="예: 벤치프레스, 스쿼트"
                value={exerciseName}
                onChange={(e) => {
                  setExerciseName(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <AnimatePresence>
                {showSuggestions && exerciseName.length > 0 && filteredWorkouts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border-2 border-fitcore-green/50 rounded-xl overflow-hidden z-[200] shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                  >
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredWorkouts.map((w, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-4 py-4 text-sm text-gray-200 hover:bg-fitcore-green hover:text-black font-bold transition-all border-b border-white/5 last:border-0 flex items-center gap-2"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent onBlur from hiding suggestions before click
                            setExerciseName(w);
                            setShowSuggestions(false);
                          }}
                        >
                          <Plus className="w-3 h-3 opacity-50" />
                          {w}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button fullWidth onClick={startWorkout} disabled={!exerciseName || loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
              운동 시작하기
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold text-fitcore-green">{exerciseName}</h4>
              <span className="text-xs text-gray-400">진행 중...</span>
            </div>

            <div className="space-y-3">
              {sets.map((set, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${set.completed ? 'bg-fitcore-green/5 border-fitcore-green/30' : 'bg-black/20 border-gray-800'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="kg"
                        value={set.weight}
                        onChange={(e) => {
                          const n = [...sets];
                          if (n[idx]) n[idx]!.weight = e.target.value;
                          setSets(n);
                        }}
                        disabled={set.completed}
                        className="w-full bg-transparent border-b border-gray-700 focus:border-fitcore-green outline-none text-center py-1 text-white text-sm"
                      />
                      <span className="absolute right-0 bottom-1 text-[10px] text-gray-600 font-bold">KG</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="reps"
                        value={set.reps}
                        onChange={(e) => {
                          const n = [...sets];
                          if (n[idx]) n[idx]!.reps = e.target.value;
                          setSets(n);
                        }}
                        disabled={set.completed}
                        className="w-full bg-transparent border-b border-gray-700 focus:border-fitcore-green outline-none text-center py-1 text-white text-sm"
                      />
                      <span className="absolute right-0 bottom-1 text-[10px] text-gray-600 font-bold">REPS</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {!set.completed && sets.length > 1 && (
                      <button
                        onClick={() => removeSet(idx)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-red-500/50 hover:text-white hover:bg-red-500 transition-all border border-red-500/20"
                        title="세트 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleSetComplete(idx)}
                      disabled={set.completed || !set.weight || !set.reps}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        set.completed 
                          ? 'bg-fitcore-green text-black' 
                          : 'bg-gray-800 text-gray-400 hover:bg-fitcore-green/20 hover:text-fitcore-green'
                      }`}
                    >
                      {set.completed ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={addSet} className="bg-white/5 border-white/10 hover:bg-white/10">
                  <Plus className="w-4 h-4 mr-2" /> 세트 추가
                </Button>
                <Button fullWidth onClick={finishWorkout} className="bg-fitcore-green text-black hover:bg-fitcore-green/80 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                  <Check className="w-4 h-4 mr-2" /> 운동 완료 (종료)
                </Button>
              </div>
              <button 
                onClick={cancelWorkout}
                className="text-[10px] text-gray-500 hover:text-red-400 font-bold flex items-center justify-center gap-1.5 py-3 transition-colors border-t border-white/5 mt-2"
              >
                <RotateCcw className="w-3 h-3" /> 이 운동 기록 전체 취소 및 삭제하기
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
