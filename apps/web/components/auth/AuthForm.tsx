"use client";

import { motion } from 'framer-motion';
import { Dumbbell, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  
  const setUser = useAppStore((state) => state.setUser);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email! });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('회원가입 확인 메일이 발송되었습니다. 메일함을 확인해주세요!');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already registered')) {
        setError('이미 가입된 계정입니다. 로그인 모드로 전환합니다.');
        setMode('signin');
      } else {
        setError(msg || '인증에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({ id: '00000000-0000-0000-0000-000000000000', email: 'demo@fitcore.ai' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-2xl border-gray-700/80 bg-fitcore-navy/80 backdrop-blur-xl">
        <CardContent className="pt-8 pb-10 px-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-fitcore-green/10 flex items-center justify-center mb-4 border border-fitcore-green/30">
              <Dumbbell className="w-8 h-8 text-fitcore-green" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {mode === 'signin' ? 'FITCORE 시작하기' : '새로운 시작, FITCORE'}
            </h2>
            <p className="text-gray-400 mt-2 text-sm text-center">
              당신만의 데이터-드리븐 AI 헬스코치를 만나보세요
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            <Input 
              label="이메일" 
              type="email" 
              placeholder="fitcore@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="비밀번호" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="pt-2 flex flex-col gap-3">
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === 'signin' ? '로그인' : '회원가입')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={handleDemoLogin}
                className="border-fitcore-green/30 text-fitcore-green hover:bg-fitcore-green/10 italic font-black"
              >
                데모 계정으로 바로 체험하기
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-gray-400 hover:text-fitcore-green transition-colors"
            >
              {mode === 'signin' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700/50"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-fitcore-navy px-2 text-gray-400">간편 로그인</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" fullWidth className="h-[48px]">
              Google
            </Button>
            <Button variant="secondary" fullWidth className="h-[48px]">
              Apple
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
