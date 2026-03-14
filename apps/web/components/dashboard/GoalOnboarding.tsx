"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Heart, Dumbbell, ArrowRight } from 'lucide-react';
import { useAppStore, UserGoal } from '@/stores/appStore';
import { Button } from '../ui/Button';

export function GoalOnboarding() {
  const { userGoal, setUserGoal, isGuest } = useAppStore();
  const [show, setShow] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);

  const STORAGE_KEY = 'fitcore_user_goal';

  useEffect(() => {
    // Check localStorage for guests or cached goal
    const savedGoal = localStorage.getItem(STORAGE_KEY) as UserGoal | null;
    if (savedGoal) {
      setUserGoal(savedGoal);
    } else if (!userGoal) {
      setShow(true);
    }
  }, [userGoal, setUserGoal]);

  const goals: { id: UserGoal; title: string; desc: string; icon: any; color: string }[] = [
    { 
      id: 'diet', 
      title: '다이어트', 
      desc: '체지방 감소와 효율적인 칼로리 소모', 
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'health', 
      title: '건강 관리', 
      desc: '체력 증진과 올바른 신체 밸런스 유지', 
      icon: Heart,
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      id: 'muscle', 
      title: '근력 보강', 
      desc: '근육량 증가와 파워풀한 근력 강화', 
      icon: Dumbbell,
      color: 'from-fitcore-green to-emerald-600'
    },
  ];

  const handleConfirm = () => {
    if (selectedGoal) {
      setUserGoal(selectedGoal);
      localStorage.setItem(STORAGE_KEY, selectedGoal);
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0F0F1A] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(57,255,20,0.15)]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-fitcore-green/10 rounded-2xl border border-fitcore-green/30 mb-4">
            <Target className="w-8 h-8 text-fitcore-green" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">당신의 목표는 무엇인가요?</h2>
          <p className="text-gray-400">대표님께 딱 맞는 맞춤형 운동과 식단 가이드를 제공해 드릴게요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                selectedGoal === goal.id 
                  ? 'border-fitcore-green bg-fitcore-green/5' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className={`p-4 rounded-xl bg-gradient-to-br ${goal.color} mb-4 shadow-lg`}>
                <goal.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">{goal.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{goal.desc}</p>
              
              {selectedGoal === goal.id && (
                <motion.div 
                  layoutId="active-check"
                  className="absolute -top-2 -right-2 w-6 h-6 bg-fitcore-green rounded-full flex items-center justify-center shadow-lg"
                >
                  <ArrowRight className="w-4 h-4 text-black" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <Button 
          fullWidth 
          disabled={!selectedGoal}
          onClick={handleConfirm}
          className="bg-fitcore-green text-black hover:bg-fitcore-green/80 font-bold py-4 rounded-2xl shadow-[0_10px_20px_rgba(57,255,20,0.2)]"
        >
          {selectedGoal ? `${goals.find(g => g.id === selectedGoal)?.title} 시작하기` : '목표를 선택해주세요'}
        </Button>
      </motion.div>
    </div>
  );
}
