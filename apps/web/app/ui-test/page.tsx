"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { InBodyInput } from '@/components/dashboard/InBodyInput';
import { WorkoutLogger } from '@/components/dashboard/WorkoutLogger';
import { NutritionLogger } from '@/components/dashboard/NutritionLogger';
import { Body3D } from '@/components/dashboard/Body3D';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function UITestPage() {
  const { user, setUser, setLoading, isLoading, isGuest, logout } = useAppStore();

  useEffect(() => {
    // 1. 초기 세션 확인
    const checkUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setUser({ 
          id: session.user.id, 
          email: session.user.email!,
          role: profile?.role as any
        });
      }
      setLoading(false);
    };

    checkUser();

    // 2. 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({ 
          id: session.user.id, 
          email: session.user.email!,
          role: profile?.role as any
        });
      } else {
        // Only reset if not in guest mode during an explicit action
        // Actually, on logout we want to clear everything.
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fitcore-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fitcore-green"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-fitcore-navy text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/5 sticky top-0 z-[100] shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <h1 className="text-2xl font-black text-fitcore-green italic tracking-tighter leading-none">FITCORE</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 hidden sm:block">UI LAB • PHASE S4</p>
             </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dev Controls Group */}
            <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
              <Button 
                 variant="ghost" 
                 className="h-8 w-8 p-0 rounded-xl hover:bg-fitcore-green/20 text-fitcore-green transition-all"
                 onClick={() => {
                    if (user) {
                       setUser({ ...user, role: user.role === 'admin' ? 'user' : 'admin' });
                    } else if (isGuest) {
                       // If guest, we promote to a 'guest-admin' for testing
                       setUser({ id: 'guest-id', email: 'guest@fitcore.ai', role: 'admin' });
                    } else {
                       // If neither, just toggle a demo admin
                       setUser({ id: 'demo-admin', email: 'admin@fitcore.ai', role: 'admin' });
                    }
                 }}
                 title="Toggle Admin Mode"
              >
                 <div className={`w-2 h-2 rounded-full animate-pulse ${user?.role === 'admin' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-fitcore-green shadow-[0_0_8px_#39ff14]'}`} />
              </Button>
              
              {!user && !isGuest && (
                <div className="flex items-center">
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              )}
            </div>

            {(user || isGuest) ? (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10"
               >
                  <div className="text-right hidden md:block">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">
                        {isGuest ? 'Viewing as' : 'Welcome back,'}
                     </p>
                     <p className="text-xs font-black text-white italic truncate max-w-[120px]">
                        {isGuest ? 'GUEST_EXPLORER' : user?.email?.split('@')[0]}
                     </p>
                  </div>
                  
                  <div className="relative group cursor-pointer" onClick={() => logout()}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-all group-hover:scale-105 ${
                      isGuest 
                        ? 'bg-gray-500/10 border-gray-500/50 text-gray-500'
                        : user?.role === 'admin' 
                        ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                        : 'bg-fitcore-green/10 border-fitcore-green/50 text-fitcore-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                    }`}>
                      {isGuest ? 'G' : user?.email?.[0]?.toUpperCase()}
                    </div>
                    {/* Role Badge */}
                    <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                      isGuest
                        ? 'bg-gray-600 text-white border-gray-700'
                        : user?.role === 'admin' 
                        ? 'bg-red-500 text-white border-red-600' 
                        : 'bg-fitcore-green text-black border-fitcore-green'
                    }`}>
                      {isGuest ? 'GUEST' : (user?.role || 'USER')}
                    </div>
                  </div>
               </motion.div>
            ) : (
               <div className="w-10 h-10 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full" />
               </div>
            )}
          </div>
        </header>

        {isGuest && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-fitcore-green/10 border border-fitcore-green/30 p-4 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-fitcore-green rounded-full animate-ping" />
              <p className="text-sm font-bold text-fitcore-green">
                실제 데이터를 저장하려면 무료 회원가입을 해주세요! 대시보드 기능을 자유롭게 체험해보실 수 있습니다.
              </p>
            </div>
            <Button onClick={() => logout()} className="h-10 px-4 bg-fitcore-green text-black hover:bg-fitcore-green/80">
              회원가입하고 정식 시작하기
            </Button>
          </motion.div>
        )}

        {/* 1. Dashboard & Auth Integration Test */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-fitcore-green rounded-full"></div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">01. Service Integration Experience</h2>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
               <span className="text-[10px] text-gray-400 font-bold">STABLE VERSION S4.2</span>
            </div>
          </div>
          
          {(user || isGuest) ? (
            <div className="animate-in fade-in duration-700 space-y-12">
               {/* Phase S2/S4: Service Integration Components */}
               <div className="space-y-8">
                  <header className="border-l-4 border-fitcore-green pl-4">
                     <h2 className="text-xl font-black italic text-white uppercase tracking-wider">01. Service Integration (Phase S2/S4)</h2>
                     <p className="text-xs text-gray-500 font-bold uppercase">Manual Input & Logging System</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-8">
                        <WorkoutLogger />
                        <InBodyInput />
                     </div>
                     <div className="space-y-8">
                        <NutritionLogger />
                     </div>
                  </div>
               </div>

               {/* Phase S4: Premium 3D Analysis */}
               <div className="pt-16 border-t border-gray-800">
                  <header className="mb-8 border-l-4 border-fitcore-green pl-4">
                     <h2 className="text-xl font-black italic text-fitcore-green uppercase tracking-wider">02. Premium 3D Analysis (Alpha)</h2>
                     <p className="text-xs text-gray-500 font-bold uppercase">Phase 2: Digital Twin & Body Scan</p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <Body3D />
                     <div className="space-y-4">
                        <h3 className="text-lg font-black italic text-white leading-tight">
                           "더 이상 숫자에 갇히지 마세요. 당신의 몸을 3D로 마주하세요."
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                           숫자만으로는 부족한 당신의 변화를 AI가 정밀 분석하여 아바타로 시각화합니다. 
                           운동 전후의 3D 체형 비교를 통해 근육의 질과 체지방의 분포를 직관적으로 확인할 수 있습니다.
                        </p>
                        <ul className="space-y-2">
                           {['측정 수치 실시간 렌더링', '전후 비교 시뮬레이션', '근성장 부위 시각화'].map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-fitcore-green">
                                 <div className="w-1 h-1 bg-fitcore-green rounded-full shadow-[0_0_5px_#39ff14]" />
                                 {item}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>

               {/* Final Integrated Dashboard */}
               <div className="pt-16 border-t border-gray-800">
                  <header className="mb-8">
                     <h2 className="text-2xl font-black italic text-fitcore-green uppercase tracking-tighter">Final Product Layout</h2>
                     <p className="text-sm text-gray-400">Integrated Dashboard & AI Coach Profile</p>
                  </header>
                  <Dashboard />
               </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto py-12">
               <AuthForm />
            </div>
          )}
        </section>



      </div>
    </main>
  );
}
