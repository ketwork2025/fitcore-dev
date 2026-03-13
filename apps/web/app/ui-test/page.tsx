"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { InBodyInput } from '@/components/dashboard/InBodyInput';
import { WorkoutLogger } from '@/components/dashboard/WorkoutLogger';
import { NutritionLogger } from '@/components/dashboard/NutritionLogger';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function UITestPage() {
  const { user, setUser, setLoading, isLoading } = useAppStore();

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
        setUser(null);
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
                 onClick={() => setUser(user ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } : null)}
                 title="Toggle Admin Mode"
              >
                 <div className={`w-2 h-2 rounded-full animate-pulse ${user?.role === 'admin' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-fitcore-green shadow-[0_0_8px_#39ff14]'}`} />
              </Button>
              
              {!user && (
                <div className="flex items-center">
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </div>
              )}
            </div>

            {user ? (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10"
               >
                  <div className="text-right hidden md:block">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">Welcome back,</p>
                     <p className="text-xs font-black text-white italic truncate max-w-[120px]">{user?.email?.split('@')[0]}</p>
                  </div>
                  
                  <div className="relative group cursor-pointer">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-all group-hover:scale-105 ${
                      user?.role === 'admin' 
                        ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                        : 'bg-fitcore-green/10 border-fitcore-green/50 text-fitcore-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                    }`}>
                      {user?.email?.[0]?.toUpperCase()}
                    </div>
                    {/* Role Badge */}
                    <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                      user?.role === 'admin' 
                        ? 'bg-red-500 text-white border-red-600' 
                        : 'bg-fitcore-green text-black border-fitcore-green'
                    }`}>
                      {user?.role || 'USER'}
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
          
          {user ? (
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
