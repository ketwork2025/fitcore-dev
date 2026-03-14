"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { useQueryClient } from '@tanstack/react-query';

export function InBodyInput({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();
  
  const [weight, setWeight] = useState('');
  const [muscle, setMuscle] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isGuest = useAppStore((state) => state.isGuest);
  const STORAGE_KEY = 'fitcore_guest_inbody';

  useEffect(() => {
    setMounted(true);
  }, []);

  // [Strategy - Beomsu] Persist InBody for Guests
  useEffect(() => {
    if (mounted && isGuest) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setWeight(parsed.weight || '');
          setMuscle(parsed.muscle || '');
          setFat(parsed.fat || '');
        } catch (e) {
          console.error('Failed to parse saved inbody', e);
        }
      }
    }
  }, [mounted, isGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuest) {
      setLoading(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ weight, muscle, fat }));
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }, 600);
      return;
    }

    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('inbody_logs').insert({
        user_id: user.id,
        weight_kg: parseFloat(weight),
        muscle_mass_kg: parseFloat(muscle),
        body_fat_percentage: parseFloat(fat),
        measured_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['inbody'] });
      
      setTimeout(() => {
        setSuccess(false);
        setWeight('');
        setMuscle('');
        setFat('');
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (err) {
      console.error(err);
      alert(t('common.error'));
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
            <Activity className="w-5 h-5 text-fitcore-green" />
          </div>
          <CardTitle>{t('inbody.title')}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={`${t('inbody.weight')} (kg)`}
              type="number"
              step="0.1"
              placeholder="00.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <Input
              label={`${t('inbody.muscle')} (kg)`}
              type="number"
              step="0.1"
              placeholder="00.0"
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
              required
            />
            <Input
              label={`${t('inbody.fat')} (%)`}
              type="number"
              step="0.1"
              placeholder="00.0"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              fullWidth 
              disabled={loading || success}
              className={success ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </motion.div>
                ) : success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                    <Check className="w-5 h-5" /> {t('common.success')}
                  </motion.div>
                ) : (
                  <motion.span key="default">{t('inbody.record_btn')}</motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
