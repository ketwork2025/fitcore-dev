"use client";

import { motion } from 'framer-motion';
import { User, Settings, Shield, Award, Calendar, Heart, Zap, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAppStore } from '@/stores/appStore';

export function MyPage() {
  const { t } = useTranslation();
  const user = useAppStore((state) => state.user);

  const badges = [
    { name: "First Step", icon: <CheckCircle2 className="w-5 h-5 text-blue-400" />, date: "2026.03.01" },
    { name: "Muscle King", icon: <Award className="w-5 h-5 text-yellow-500" />, date: "2026.03.05" },
    { name: "3-Day Streak", icon: <Flame className="w-5 h-5 text-red-500" />, date: "2026.03.10" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-fitcore-navyLight to-fitcore-navy bg-fitcore-navyLight border-2 border-white/5 overflow-hidden">
        <CardContent className="p-8">
           <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                 <div className="w-24 h-24 rounded-full bg-fitcore-green p-1 group-hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all">
                    <div className="w-full h-full rounded-full bg-fitcore-navy flex items-center justify-center border-2 border-black">
                       <User className="w-12 h-12 text-fitcore-green" />
                    </div>
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-fitcore-navy p-1.5 rounded-full border border-white/10">
                    <Zap className="w-3 h-3 text-fitcore-green fill-fitcore-green" />
                 </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-1">
                 <div className="flex items-center justify-center md:justify-start gap-2">
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{user?.email?.split('@')[0]}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                       user?.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-fitcore-green/10 text-fitcore-green border-fitcore-green/30'
                    }`}>
                       {user?.role || 'USER'}
                    </span>
                 </div>
                 <p className="text-sm text-gray-500 font-medium ">{user?.email}</p>
                 <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                       <Calendar className="w-3.5 h-3.5 text-gray-500" />
                       <span className="text-xs text-gray-400">Join: 2026.03.12</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/20" />
                       <span className="text-xs text-gray-400">LV. 12</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-2">
                 <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5 text-gray-400" />
                 </button>
                 {user?.role === 'admin' && (
                    <button className="p-3 bg-red-400/10 rounded-xl border border-red-400/20 hover:bg-red-400/20 transition-colors group">
                       <Shield className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                    </button>
                 )}
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="bg-fitcore-navyLight/30 border-white/5 backdrop-blur-sm">
        <CardHeader>
           <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2 italic uppercase">
              <Award className="w-4 h-4 text-fitcore-green" />
              Achievements
           </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
           {badges.map((badge, idx) => (
             <motion.div 
               key={badge.name}
               whileHover={{ y: -5 }}
               className="bg-black/30 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center space-y-2 group cursor-pointer"
             >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1 group-hover:bg-fitcore-green/10 transition-colors">
                   {badge.icon}
                </div>
                <h4 className="text-sm font-black text-white italic">{badge.name}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{badge.date}</p>
             </motion.div>
           ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Flame({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
