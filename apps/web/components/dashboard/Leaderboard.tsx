"use client";

import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, TrendingUp, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const leaderboardData = [
  { id: 1, name: "Kim Fit", volume: 12500, avatar: "KF", trend: "up" },
  { id: 2, name: "Lee Power", volume: 11200, avatar: "LP", trend: "down" },
  { id: 3, name: "Park Gym", volume: 9800, avatar: "PG", trend: "up" },
  { id: 4, name: "Choi Muscle", volume: 8500, avatar: "CM", trend: "stable" },
  { id: 5, name: "Jung Health", volume: 7200, avatar: "JH", trend: "up" },
];

export function Leaderboard() {
  const { t } = useTranslation();

  return (
    <Card className="bg-fitcore-navyLight/50 border-white/5 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-white/5">
        <div className="flex justify-between items-center">
           <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
             <Trophy className="w-4 h-4 text-yellow-500" />
             FITCORE RANKING
           </CardTitle>
           <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
              <Flame className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] text-yellow-500 font-bold uppercase">Weekly Hot</span>
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {leaderboardData.map((user, index) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-4 hover:bg-white/5 transition-colors group"
            >
              {/* Rank */}
              <div className="w-8 flex justify-center items-center">
                 {index === 0 ? (
                   <Medal className="w-6 h-6 text-yellow-400" />
                 ) : index === 1 ? (
                   <Medal className="w-6 h-6 text-gray-400" />
                 ) : index === 2 ? (
                   <Medal className="w-6 h-6 text-amber-600" />
                 ) : (
                   <span className="text-lg font-black text-white/20 italic">#{index + 1}</span>
                 )}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fitcore-green/20 to-blue-500/20 border border-white/10 flex items-center justify-center mx-3 group-hover:scale-110 transition-transform">
                 <span className="text-xs font-black text-white">{user.avatar}</span>
              </div>

              {/* Name & Volume */}
              <div className="flex-1">
                 <p className="text-sm font-bold text-white mb-0.5">{user.name}</p>
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-fitcore-green" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                      Weekly Volume: <span className="text-white">{user.volume.toLocaleString()} kg</span>
                    </span>
                 </div>
              </div>

              {/* Weekly Status Indicator */}
              <div className="flex flex-col items-end">
                 <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    user.trend === 'up' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 
                    user.trend === 'down' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 
                    'text-gray-400 bg-gray-400/10 border-gray-400/20'
                 }`}>
                    {user.trend.toUpperCase()}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Your Status Bar */}
        <div className="p-4 bg-fitcore-green/10 border-t border-fitcore-green/20">
           <div className="flex items-center">
              <div className="w-8 flex justify-center text-xs font-black text-fitcore-green italic"># 42</div>
              <div className="w-10 h-10 rounded-full bg-fitcore-green border border-black/20 flex items-center justify-center mx-3">
                 <User className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-white">Representative (You)</p>
                 <p className="text-[10px] text-fitcore-green font-bold">TOP 15% OF ALL USERS</p>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
