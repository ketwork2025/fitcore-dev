"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { InBodyInput } from '@/components/dashboard/InBodyInput';
import { WorkoutLogger } from '@/components/dashboard/WorkoutLogger';
import { NutritionLogger } from '@/components/dashboard/NutritionLogger';
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
        <header className="border-b border-gray-800 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-fitcore-green italic tracking-tighter">FITCORE UI LAB</h1>
            <p className="text-gray-400 mt-2 font-medium">Design System & Full Journey Simulation</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
               variant="outline" 
               className="text-[10px] uppercase font-black tracking-widest border-fitcore-green/20 text-fitcore-green hover:bg-fitcore-green/10"
               onClick={() => setUser(user ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } : null)}
            >
               Toggle Mock Admin
            </Button>
            <LanguageSwitcher />
            <ThemeSwitcher />
            {user && (
               <div className="text-right bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Logged in as <span className="text-red-400 font-black">{user.role || 'USER'}</span></p>
                  <p className="text-sm font-black text-fitcore-green italic">{user.email}</p>
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

        {/* 2. Primitives Test */}
        <section className="space-y-8 pt-12 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-fitcore-green rounded-full"></div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">02. Design Primitives (Phase S3)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="primary" fullWidth>Primary Action</Button>
                <Button variant="secondary" fullWidth>Secondary Action</Button>
                <Button variant="outline" fullWidth>Outline Action</Button>
              </CardContent>
            </Card>

            {/* Input States */}
            <Card>
              <CardHeader>
                <CardTitle>Input States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Default State" placeholder="Type something..." />
                <Input label="Error State" placeholder="Wrong value" error="Invalid input provided" />
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </main>
  );
}
