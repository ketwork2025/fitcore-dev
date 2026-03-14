"use client";

import { useAppStore } from '@/stores/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, Dumbbell, Lightbulb, ChefHat } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export function AIAdvisor() {
  const { userGoal } = useAppStore();

  if (!userGoal) return null;

  const getAdvice = () => {
    switch (userGoal) {
      case 'diet':
        return {
          title: '다이어트 마스터 모드',
          workout: '버피 테스트 15회 x 3세트 + 유산소 20분',
          food: '구운 닭가슴살 샐러드 & 드레싱 없이 발사믹',
          proTip: '공복 유산소는 체지방 연소 효율을 20% 높여줍니다!',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30'
        };
      case 'health':
        return {
          title: '신체 밸런스 케어 모드',
          workout: '전신 스트레칭 10분 + 코어 플랭크 1분 x 3세트',
          food: '연어 스테이크 & 아보카도 (좋은 지방 섭취)',
          proTip: '충분한 수분 섭취는 신진대사 회복의 핵심입니다.',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30'
        };
      case 'muscle':
        return {
          title: '근력 강화 벌크업 모드',
          workout: '스쿼트 10회 x 5세트 (점진적 과부하 집중)',
          food: '소고기 안심 & 고구마 150g (복합 탄수화물)',
          proTip: '세트 사이 휴식 시간을 90초 이내로 유지해 펌핑감을 높이세요!',
          color: 'text-fitcore-green',
          bg: 'bg-fitcore-green/10',
          border: 'border-fitcore-green/30'
        };
      default:
        return null;
    }
  };

  const advice = getAdvice();
  if (!advice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-3xl border ${advice.border} ${advice.bg} backdrop-blur-md mb-8`}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-fitcore-green/5 blur-3xl rounded-full" />
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className={`w-5 h-5 ${advice.color}`} />
          <h3 className={`text-lg font-black italic uppercase tracking-tighter ${advice.color}`}>
            AI Personal Advice: {advice.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Dumbbell className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Recommended Workout</span>
            </div>
            <p className="text-sm font-bold text-white">{advice.workout}</p>
          </div>

          <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <Utensils className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Recommended Food</span>
            </div>
            <p className="text-sm font-bold text-white">{advice.food}</p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
          <Lightbulb className={`w-5 h-5 ${advice.color} shrink-0`} />
          <div>
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Pro Tip for you</span>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">{advice.proTip}</p>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
}
