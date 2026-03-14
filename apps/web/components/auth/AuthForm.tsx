"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Loader2, Mail, ArrowRight, CheckCircle2, Chrome, Apple } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';

/**
 * [Strategy - Beomsu] Global Trend Authentication
 * - Passwordless (Magic Link / OTP)
 * - Social-First (Google / Apple)
 * - Zero Friction UX
 */
export function AuthForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setGuest } = useAppStore();

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      /**
       * [Jaewoong's Tip] 
       * Representing "Passwordless" - User enters email, gets a link. 100% Secure.
       */
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/ui-test`,
        }
      });
      
      if (error) throw error;
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || '인증 메일 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/ui-test`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google 로그인에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-3xl border-white/5 bg-[#0F0F1A]/80 backdrop-blur-2xl overflow-hidden relative">
        {/* Premium Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-fitcore-green/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[100px]" />

        <CardContent className="pt-10 pb-12 px-8 relative z-10">
          <AnimatePresence mode="wait">
            {!emailSent ? (
              <motion.div
                key="auth-input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-fitcore-green/10 border border-fitcore-green/20 mb-2">
                    <Dumbbell className="w-6 h-6 text-fitcore-green" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">FITCORE</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest px-4">
                    The Future of Data-Driven AI Coaching
                  </p>
                </div>

                {/* Social Actions - Prominent */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-white text-black h-[56px] rounded-2xl font-black text-sm transition-all hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Chrome className="w-5 h-5" />
                    CONTINUE WITH GOOGLE
                  </button>
                  <button
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-white/5 text-white h-[56px] rounded-2xl font-black text-sm border border-white/10 transition-all hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Apple className="w-5 h-5 fill-current" />
                    CONTINUE WITH APPLE
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="bg-[#0F0F1A] px-4 text-gray-600 italic">or magic link</span>
                  </div>
                </div>

                {/* Email OTP Form */}
                <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-fitcore-green transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full h-[56px] bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-fitcore-green/50 placeholder:text-gray-600 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-[10px] font-black uppercase text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                      {error}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    fullWidth 
                    disabled={loading}
                    className="group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <span className="flex items-center gap-2 italic font-black">
                        SEND MAGIC LINK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <button 
                    onClick={() => setGuest(true)}
                    className="text-[10px] font-black text-gray-600 hover:text-fitcore-green transition-colors uppercase tracking-widest"
                  >
                    Continue as Guest Explorer →
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="auth-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="inline-flex p-4 rounded-full bg-fitcore-green/20 border border-fitcore-green/30 text-fitcore-green mb-2">
                  <CheckCircle2 className="w-12 h-12 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white italic uppercase">Check your email!</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] mx-auto">
                    We just sent a login link to <br/>
                    <span className="text-white font-bold">{email}</span>
                  </p>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => setEmailSent(false)}
                    className="text-xs font-black text-fitcore-green hover:underline uppercase tracking-widest"
                  >
                    Wrong email? Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Dev Note - Beomsu Style */}
      <p className="text-[9px] text-center text-gray-700 font-bold uppercase tracking-tighter mt-6">
        Protected by FITCORE Cloud Infrastructure. <br/>
        Zero-Knowledge Passwordless Auth v2.1
      </p>
    </motion.div>
  );
}
