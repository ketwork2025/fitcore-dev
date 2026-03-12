"use client";

import { motion } from 'framer-motion';
import { Users, CreditCard, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, UserPlus, Zap, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const adminStats = [
  { label: "Total Users", value: "12,840", trend: "+12%", color: "text-blue-400", icon: <Users className="w-5 h-5 mx-auto" /> },
  { label: "Monthly Revenue", value: "$42,500", trend: "+8.2%", color: "text-fitcore-green", icon: <DollarSign className="w-5 h-5 mx-auto" /> },
  { label: "Subscribers", value: "3,240", trend: "+14%", color: "text-purple-400", icon: <Zap className="w-5 h-5 mx-auto" /> },
  { label: "Active Sessions", value: "842", trend: "-2.4%", color: "text-amber-400", icon: <TrendingUp className="w-5 h-5 mx-auto" /> },
];

const recentSales = [
  { id: 1, user: "Kim Fit", plan: "PRO Annual", price: "$199", date: "2 mins ago" },
  { id: 2, user: "Lee Power", plan: "PRO Monthly", price: "$19", date: "15 mins ago" },
  { id: 3, user: "Park Gym", plan: "Basic", price: "$9", date: "1 hour ago" },
  { id: 4, user: "Choi Muscle", plan: "PRO Annual", price: "$199", date: "3 hours ago" },
];

export function AdminDashboardView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
         <div>
            <p className="text-[10px] text-fitcore-green font-black uppercase tracking-widest flex items-center gap-1">
               <PieChart className="w-3 h-3" /> System Intelligence
            </p>
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Admin Insights</h2>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-fitcore-green/10 border border-fitcore-green/30 text-fitcore-green text-[10px] font-black rounded-lg uppercase">Download Report</button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black rounded-lg uppercase hover:text-white transition-colors">Past 30 Days</button>
         </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => (
          <motion.div 
             key={stat.label}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: idx * 0.1 }}
          >
             <Card className="bg-fitcore-navyLight/50 border-white/5 backdrop-blur-md hover:border-fitcore-green/30 transition-all cursor-default">
               <CardContent className="p-4 text-center space-y-2">
                  <div className={`w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center mx-auto ${stat.color} border border-white/5`}>
                     {stat.icon}
                  </div>
                  <div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase">{stat.label}</p>
                     <p className="text-xl font-black text-white italic tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`flex items-center justify-center gap-1 text-[10px] font-black ${
                     stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                     {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                     {stat.trend}
                  </div>
               </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Sales Table */}
         <Card className="lg:col-span-2 bg-fitcore-navyLight/50 border-white/5">
            <CardHeader className="pb-2">
               <CardTitle className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-fitcore-green" />
                  Recent Revenue Generated
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="divide-y divide-white/5">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="py-3 flex justify-between items-center group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-fitcore-green/50 transition-colors">
                             <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-fitcore-green transition-colors" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white uppercase">{sale.user}</p>
                             <p className="text-[10px] text-gray-500 font-bold tracking-widest">{sale.plan}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-fitcore-green">{sale.price}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{sale.date}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-4 py-2 bg-white/5 text-[10px] font-black text-gray-400 uppercase rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all">View All Transactions</button>
            </CardContent>
         </Card>

         {/* Growth Area */}
         <Card className="bg-fitcore-navyLight/50 border-white/5 overflow-hidden">
            <CardHeader className="pb-2">
               <CardTitle className="text-xs font-black text-gray-400 uppercase flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  Growth Potential
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-center">
                  <p className="text-3xl font-black text-white italic mb-1">94%</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Customer Retention Rate</p>
                  <div className="mt-4 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-400 w-[94%]" />
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Top Performing Plans</h4>
                  <PlanStats label="PRO ANNUAL" percent={65} color="bg-fitcore-green" />
                  <PlanStats label="PRO MONTHLY" percent={22} color="bg-purple-400" />
                  <PlanStats label="BASIC FREE" percent={13} color="bg-gray-400" />
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function PlanStats({ label, percent, color }: any) {
  return (
    <div className="space-y-1">
       <div className="flex justify-between text-[10px] font-black uppercase italic">
          <span className="text-white">{label}</span>
          <span className="text-gray-400">{percent}%</span>
       </div>
       <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className={`h-full ${color}`} 
          />
       </div>
    </div>
  );
}
