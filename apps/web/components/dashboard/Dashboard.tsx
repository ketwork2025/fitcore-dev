"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Camera, MessageSquare, Plus, Loader2, LogOut, Trophy, User, LayoutDashboard, Shield, Scan, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { AICoachCard } from './AICoachCard';
import { ProgressChart } from './ProgressChart';
import { WorkoutTracker } from './WorkoutTracker';
import { Leaderboard } from './Leaderboard';
import { MyPage } from './MyPage';
import { AIFoodScanner } from './AIFoodScanner';
import { AdminDashboardView } from './AdminDashboardView';
import { SubscriptionModal } from './SubscriptionModal';

export function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'ranking' | 'mypage' | 'admin'>('overview');
  const [showScanner, setShowScanner] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const activeWorkoutId = useAppStore((state) => state.activeWorkoutId);
  const setActiveWorkoutId = useAppStore((state) => state.setActiveWorkoutId);

  // 1. InBody 데이터 가져오기 (가장 최근 1개)
  const { data: inbody, isLoading: loadingInbody } = useQuery({
    queryKey: ['inbody', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inbody_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('measured_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows'
      return data;
    },
    enabled: !!user?.id,
  });

  // 2. 운동 기록 가져오기 (가장 최근 진행중인 것 1개)
  const { data: workout, isLoading: loadingWorkout } = useQuery({
    queryKey: ['workout', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*, workout_sets(*)')
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // 3. 오늘 먹은 총 칼로리 계산
  const { data: nutrition, isLoading: loadingNutrition } = useQuery({
    queryKey: ['nutrition', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('logged_at', today);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const totals = nutrition?.reduce((acc, curr) => ({
    cal: acc.cal + Number(curr.calories),
    carbs: acc.carbs + Number(curr.carbs_g),
    prot: acc.prot + Number(curr.protein_g),
    fat: acc.fat + Number(curr.fat_g),
  }), { cal: 0, carbs: 0, prot: 0, fat: 0 }) || { cal: 0, carbs: 0, prot: 0, fat: 0 };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loadingInbody || loadingWorkout || loadingNutrition) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-fitcore-green animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8 pb-10">
        {/* User Header & Logout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black italic tracking-tighter text-[var(--foreground)] uppercase">
                   {user?.email?.split('@')[0]}
                </h2>
                {user?.role === 'admin' ? (
                   <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      ADMIN
                   </span>
                ) : (
                   <button 
                     onClick={() => setShowSubscription(true)}
                     className="bg-gradient-to-r from-fitcore-green to-emerald-500 px-3 py-1 rounded-full text-black text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:scale-105 transition-all group flex items-center gap-1"
                   >
                      <Zap className="w-2.5 h-2.5 fill-current group-hover:animate-pulse" />
                      {t('tabs.upgrade_pro')}
                   </button>
                )}
             </div>
             <SubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} />
             <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t('tabs.mode_active', { mode: t(`tabs.${activeTab}`) })}</p>
          </div>

          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
             {[
                { id: 'overview', icon: <LayoutDashboard className="w-4 h-4" /> },
                { id: 'ranking', icon: <Trophy className="w-4 h-4" /> },
                { id: 'mypage', icon: <User className="w-4 h-4" /> },
                ...(user?.role === 'admin' ? [{ id: 'admin', icon: <Shield className="w-4 h-4" /> }] : [])
             ].map((tab) => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id 
                      ? 'bg-fitcore-green text-black shadow-[0_0_20px_rgba(57,255,20,0.3)]' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                   }`}
                >
                   {tab.icon}
                   <span className="hidden md:inline uppercase">{t(`tabs.${tab.id}`)}</span>
                </button>
             ))}
             <div className="w-px h-8 bg-white/10 mx-1" />
             <button onClick={handleLogout} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 0. AI Coach Section */}
            <section>
              <AICoachCard />
            </section>

            {/* 1. InBody Section */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 mb-8 lg:mb-0">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 italic">
                      <Activity className="w-5 h-5 text-fitcore-green" />
                      {t('common.inbody')}
                    </h3>
                  </div>
                  <Card className="backdrop-blur-md overflow-hidden h-full">
                    <CardContent className="p-5 space-y-7">
                      <InBodyRow label={t('inbody.weight')} value={inbody?.weight_kg || 0} unit="kg" progress={60} />
                      <InBodyRow label={t('inbody.muscle')} value={inbody?.muscle_mass_kg || 0} unit="kg" progress={85} color="fitcore-green" glow />
                      <InBodyRow label={t('inbody.fat')} value={inbody?.body_fat_percentage || 0} unit="%" progress={38} color="blue-400" />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-2">
                  <ProgressChart />
                </div>
              </div>
            </section>

            {/* 2. Workout Section */}
            <section>
              <div className="flex justify-between items-end mb-4 pt-4 border-t border-[var(--card-border)]">
                <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 italic">
                  <Dumbbell className="w-5 h-5 text-fitcore-green" />
                  {t('common.workout')}
                </h3>
              </div>
              
              {workout ? (
                <WorkoutCard workout={workout} />
              ) : (
                <div className="p-8 text-center bg-gray-900/50 rounded-2xl border border-dashed border-gray-700 text-gray-500">
                  현재 진행 중인 운동이 없습니다.
                </div>
              )}
            </section>

            {/* 3. Nutrition Section */}
            <section>
              <div className="flex justify-between items-end mb-4 pt-4 border-t border-[var(--card-border)]">
                <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2 italic">
                  <Camera className="w-5 h-5 text-fitcore-green" />
                  {t('common.nutrition')}
                </h3>
                <button 
                  onClick={() => setShowScanner(!showScanner)}
                  className={`text-[10px] font-black px-3 py-1.5 rounded-full border transition-all uppercase flex items-center gap-1 ${
                    showScanner ? 'bg-fitcore-green text-black' : 'bg-fitcore-green/10 text-fitcore-green border-fitcore-green/30'
                  }`}
                >
                   <Scan className="w-3 h-3" />
                   {showScanner ? 'Close Scanner' : 'AI Scan Mode'}
                </button>
              </div>
              
              <AnimatePresence>
                {showScanner && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <AIFoodScanner 
                      onAnalysisComplete={(data) => console.log('Scanned:', data)} 
                      onClose={() => setShowScanner(false)} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <NutritionCard totals={totals} />
            </section>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <Leaderboard />
          </div>
        )}

        {activeTab === 'mypage' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <MyPage />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <AdminDashboardView />
          </div>
        )}
        </div>
      </div>

      {activeWorkoutId && (
        <WorkoutTracker 
          workoutId={activeWorkoutId} 
          exerciseName="Bench Press" 
          onFinish={() => setActiveWorkoutId(null)} 
        />
      )}
    </>
  );
}

function InBodyRow({ label, value, unit, progress, color = "gray-300", glow = false }: any) {
  return (
    <div className="flex items-center">
      <div className="w-[100px] flex flex-col flex-shrink-0">
        <span className="text-gray-300 font-medium text-sm">{label}</span>
        <span className="text-xl font-extrabold text-white">{value} <span className="text-xs font-normal text-gray-500">{unit}</span></span>
      </div>
      <div className="flex-1 px-4 relative flex items-center h-full">
         <div className="absolute inset-y-0 left-[33%] w-[1px] bg-gray-700/50" />
         <div className="absolute inset-y-0 left-[66%] w-[1px] bg-gray-700/50" />
        <div className="relative h-2.5 w-full bg-gray-800 rounded-full flex z-10">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }} 
            transition={{ duration: 1, ease: "easeOut" }} 
            className={`h-full bg-${color} rounded-full ${glow ? 'shadow-[0_0_12px_rgba(57,255,20,0.6)]' : ''}`} 
          />
        </div>
      </div>
    </div>
  );
}

function WorkoutCard({ workout }: any) {
  return (
    <Card className="bg-fitcore-navyLight/80 border-gray-700/50 mb-4 overflow-hidden">
      <div className="p-4 flex gap-4 border-b border-gray-800/50 bg-black/30 items-center">
        <div className="w-[72px] h-[80px] bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center flex-shrink-0 opacity-50">
          <Dumbbell className="text-gray-500" />
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start">
              <h4 className="text-white font-bold text-lg leading-tight mb-1">{workout.exercise_name}</h4>
              <span className="text-xs text-fitcore-green bg-fitcore-green/10 px-2 py-0.5 rounded border border-fitcore-green/20">진행중</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-white">{workout.workout_sets?.length || 0} <span className="text-gray-500 font-normal">SET 완료</span></span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function NutritionCard({ totals }: any) {
  const goal = 1800;
  const progressPercent = Math.min((totals.cal / goal) * 100, 100);

  return (
    <Card className="bg-fitcore-navyLight/80 border-gray-700/50 overflow-visible">
      <CardContent className="p-5 flex flex-col gap-6">
        <div className="bg-black/30 p-5 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm text-gray-300 font-semibold tracking-wide">오늘 총 섭취 열량</span>
            <span className="text-3xl font-black text-white leading-none">{totals.cal} <span className="text-sm font-medium text-gray-500">/ {goal} kcal</span></span>
          </div>
          
          <div className="h-[22px] w-full bg-gray-900 rounded-full overflow-hidden flex shadow-inner">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1 }} className="h-full bg-fitcore-green shadow-[0_0_15px_rgba(57,255,20,0.5)] flex items-center px-4">
              <span className="text-[10px] font-black text-black">달성률 {Math.round(progressPercent)}%</span>
            </motion.div>
          </div>

          <div className="flex justify-between mt-4 px-1 text-xs">
            <NutritionLabel label="탄" value={totals.carbs} color="bg-blue-500" />
            <NutritionLabel label="단" value={totals.prot} color="bg-fitcore-green" />
            <NutritionLabel label="지" value={totals.fat} color="bg-purple-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NutritionLabel({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-2 h-2 rounded-full ${color} mb-1`} />
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-bold">{value}g</span>
    </div>
  );
}
