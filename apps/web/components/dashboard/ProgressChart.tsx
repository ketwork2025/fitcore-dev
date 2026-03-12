"use client";

import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp, Calendar } from 'lucide-react';

const data = [
  { name: 'Mon', weight: 76.5, muscle: 34.8 },
  { name: 'Tue', weight: 76.2, muscle: 34.9 },
  { name: 'Wed', weight: 75.8, muscle: 35.1 },
  { name: 'Thu', weight: 75.9, muscle: 35.0 },
  { name: 'Fri', weight: 75.5, muscle: 35.2 },
  { name: 'Sat', weight: 75.2, muscle: 35.4 },
  { name: 'Sun', weight: 75.0, muscle: 35.5 },
];

export function ProgressChart() {
  const { t } = useTranslation();

  return (
    <Card className="bg-fitcore-navyLight/50 border-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-fitcore-green" />
            주간 변화 추이
          </CardTitle>
          <p className="text-2xl font-black text-white italic tracking-tighter">BODY PROGRESS</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 px-2 rounded-md border border-white/10">
           <Calendar className="w-3.5 h-3.5 text-gray-500" />
           <span className="text-[10px] text-gray-500 font-bold uppercase">Last 7 Days</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#666" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                hide 
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111', 
                  border: '1px solid #333',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#39FF14' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#39FF14" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="muscle" 
                stroke="#60a5fa" 
                strokeWidth={2}
                fill="none"
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex gap-4 mt-4 px-2">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fitcore-green" />
              <span className="text-[10px] text-gray-400 font-bold">Weight (kg)</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[10px] text-gray-400 font-bold">Muscle (kg)</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
