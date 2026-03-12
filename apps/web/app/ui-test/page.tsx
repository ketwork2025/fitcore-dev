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
          <div className="py-4"></div>
          
          {user ? (
            <div className="animate-in fade-in duration-700">
               <Dashboard />
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
