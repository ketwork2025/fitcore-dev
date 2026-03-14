"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Camera, Plus, Check, Loader2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/appStore';
import { useQueryClient } from '@tanstack/react-query';
import { AIFoodScanner } from './AIFoodScanner';

export function NutritionLogger() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();

  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  
  const userGoal = useAppStore((state) => state.userGoal);

  const getNutritionTargets = () => {
    switch (userGoal) {
      case 'diet': return { cal: '1800-2000', pro: '120g+', desc: '저탄수 고단백 추천' };
      case 'muscle': return { cal: '2500-3000', pro: '160g+', desc: '벌크업 탄수화물 증량' };
      case 'health': return { cal: '2200-2400', pro: '100g+', desc: '영양 균형 집중' };
      default: return null;
    }
  };

  const targets = getNutritionTargets();

  const handleAIAnalysis = (data: any) => {
    setFoodName(data.name);
    setCalories(data.calories.toString());
    setProtein(data.protein.toString());
    setCarbs(data.carbs.toString());
    setFat(data.fat.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('nutrition_logs').insert({
        user_id: user.id,
        meal_type: mealType,
        food_name: foodName,
        calories: parseFloat(calories),
        protein_g: parseFloat(protein),
        carbs_g: parseFloat(carbs),
        fat_g: parseFloat(fat),
        logged_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['nutrition'] });

      setTimeout(() => {
        setSuccess(false);
        setFoodName('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl shadow-[0_0_20px_rgba(57,255,20,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-fitcore-green/10 rounded-lg border border-fitcore-green/30">
            <Utensils className="w-5 h-5 text-fitcore-green" />
          </div>
          <CardTitle>{t('nutrition.title')}</CardTitle>
        </div>
        <Button 
          variant={showScanner ? "primary" : "outline"} 
          className="text-xs h-8 px-3 gap-2 border-fitcore-green/30 text-fitcore-green"
          onClick={() => setShowScanner(!showScanner)}
        >
          <Camera className="w-3.5 h-3.5" />
          {showScanner ? "Close Scanner" : t('nutrition.ai_scan')}
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        <AnimatePresence>
          {showScanner && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <AIFoodScanner 
                onAnalysisComplete={handleAIAnalysis} 
                onClose={() => setShowScanner(false)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">식사 분류</label>
                <div className="flex gap-2">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealType(type)}
                      className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                        mealType === type
                          ? 'bg-fitcore-green text-black border-fitcore-green font-bold'
                          : 'bg-black/5 dark:bg-black/20 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      {t(`nutrition.meal_types.${type}`)}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label={t('nutrition.food_name')}
                placeholder={t('nutrition.food_placeholder')}
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <Input
                label={`${t('nutrition.calories')} (kcal)`}
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
              />
              <Input
                label={`${t('nutrition.protein')} (g)`}
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
              />
              <Input
                label={`${t('nutrition.carbs')} (g)`}
                type="number"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                required
              />
              <Input
                label={`${t('nutrition.fat')} (g)`}
                type="number"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                required
              />
            </div>
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
                  <motion.span key="default">{t('nutrition.save_btn')}</motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </form>
        
        {targets && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-fitcore-navyLight to-transparent border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Target Guide ({t(`nutrition.goal_${userGoal}` as any) || userGoal})</p>
              <p className="text-xs text-gray-300 font-bold">{targets.desc}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-fitcore-green">{targets.cal} kcal</span>
              <span className="mx-2 text-gray-700">|</span>
              <span className="text-sm font-black text-blue-400">Protein {targets.pro}</span>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-fitcore-green/10 border border-fitcore-green/20 rounded-xl flex gap-3 items-start">
          <Info className="w-5 h-5 text-fitcore-green mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            <span className="text-fitcore-green font-bold">New:</span> 이제 사진 한 장으로 식단을 기록할 수 있습니다. 
            상단의 <span className="text-fitcore-green font-black">AI Scan</span> 버튼을 클릭하여 <span className="text-white font-bold">Gemini AI</span>의 분석을 경험해보세요!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
