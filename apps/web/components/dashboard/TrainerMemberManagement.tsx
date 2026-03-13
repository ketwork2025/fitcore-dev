"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, ChevronRight, Activity, Plus, History, User, ExternalLink, Calendar, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { InBodyInput } from './InBodyInput';

const mockMembers = [
  { id: '1', name: '김철수', email: 'chulsoo@example.com', phone: '010-1234-5678', lastScan: '2024-03-10', status: 'Active', plan: 'Premium' },
  { id: '2', name: '이영희', email: 'younghee@example.com', phone: '010-9876-5432', lastScan: '2024-03-12', status: 'Active', plan: 'Basic' },
  { id: '3', name: '박민수', email: 'minsu@example.com', phone: '010-5555-4444', lastScan: '2024-02-28', status: 'Inactive', plan: 'Premium' },
  { id: '4', name: '정지원', email: 'jiwon@example.com', phone: '010-1111-2222', lastScan: '2024-03-13', status: 'Active', plan: 'PRO' },
];

export function TrainerMemberManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showInput, setShowInput] = useState(false);

  const filteredMembers = mockMembers.filter(m => 
    m.name.includes(searchTerm) || m.email.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
            <Users className="w-6 h-6 text-fitcore-green" />
            Member Management
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gym Trainer Dashboard • Active Members: {mockMembers.length}</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
           <input 
              type="text" 
              placeholder="Search members..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-white focus:border-fitcore-green/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Member List */}
        <Card className="lg:col-span-1 bg-fitcore-navyLight/50 border-white/5 h-fit">
          <CardHeader className="pb-2">
             <CardTitle className="text-xs font-black text-gray-400 uppercase">Members Panel</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
             <div className="space-y-1">
                {filteredMembers.map((member) => (
                   <button
                      key={member.id}
                      onClick={() => {
                        setSelectedMember(member);
                        setShowInput(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                        selectedMember?.id === member.id 
                        ? 'bg-fitcore-green/10 border border-fitcore-green/30' 
                        : 'hover:bg-white/5 border border-transparent'
                      }`}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border ${
                            selectedMember?.id === member.id ? 'bg-fitcore-green/20 border-fitcore-green/50 text-fitcore-green' : 'bg-white/5 border-white/10 text-gray-400'
                         }`}>
                            {member.name[0]}
                         </div>
                         <div>
                            <p className={`text-sm font-bold ${selectedMember?.id === member.id ? 'text-fitcore-green' : 'text-white'}`}>{member.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">{member.plan}</p>
                         </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedMember?.id === member.id ? 'translate-x-1 text-fitcore-green' : 'text-gray-600'}`} />
                   </button>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Member Details & InBody Input */}
        <div className="lg:col-span-2 space-y-6">
           <AnimatePresence mode="wait">
              {selectedMember ? (
                 <motion.div
                    key={selectedMember.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                 >
                    <Card className="bg-fitcore-navyLight/50 border-white/5 overflow-hidden">
                       <div className="h-24 bg-gradient-to-r from-fitcore-green/20 to-fitcore-navy relative">
                          <div className="absolute -bottom-10 left-6">
                             <div className="w-20 h-20 rounded-3xl bg-fitcore-navy border-4 border-fitcore-navy flex items-center justify-center shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-fitcore-green opacity-10 animate-pulse" />
                                <User className="w-10 h-10 text-fitcore-green relative z-10" />
                             </div>
                          </div>
                          <div className="absolute bottom-2 right-4 flex gap-2">
                             <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black italic text-fitcore-green border border-fitcore-green/30 uppercase">
                                {selectedMember.status}
                             </span>
                          </div>
                       </div>
                       <CardContent className="pt-12 pb-6 px-6">
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-2xl font-black text-white italic truncate tracking-tighter uppercase">{selectedMember.name}</h3>
                                <p className="text-xs text-gray-500 font-bold">{selectedMember.email}</p>
                             </div>
                             <div className="flex gap-2">
                                <Button variant="outline" className="h-10 px-4 text-[10px] border-white/10 text-gray-300">
                                   <History className="w-3 h-3 mr-2" /> History
                                </Button>
                                <Button onClick={() => setShowInput(!showInput)} className="h-10 px-4 text-[10px]">
                                   <Plus className="w-3 h-3 mr-2" /> Log InBody
                                </Button>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                             <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                                   <Calendar className="w-3 h-3" /> Last Scan
                                </p>
                                <p className="text-sm font-black text-white italic">{selectedMember.lastScan}</p>
                             </div>
                             <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                                   <Phone className="w-3 h-3" /> Phone
                                </p>
                                <p className="text-sm font-black text-white italic">{selectedMember.phone}</p>
                             </div>
                             <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1">
                                   <MapPin className="w-3 h-3" /> Assigned Gym
                                </p>
                                <p className="text-sm font-black text-white italic truncate">FITCORE Gangnam</p>
                             </div>
                          </div>
                       </CardContent>
                    </Card>

                    {showInput ? (
                       <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="overflow-hidden"
                       >
                          <InBodyInput onSuccess={() => setShowInput(false)} />
                       </motion.div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="bg-fitcore-navyLight/50 border-white/5 p-6 space-y-4">
                             <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                                   <Activity className="w-3 h-3 text-fitcore-green" /> Weight Trend
                                </h4>
                                <span className="text-[10px] text-green-400 font-black italic">-2.4kg vs last month</span>
                             </div>
                             <div className="h-32 bg-black/20 rounded-xl flex items-end justify-between p-4 gap-2">
                                {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                                   <div key={i} className="w-full bg-fitcore-green/20 rounded-t-sm relative transition-all hover:bg-fitcore-green/40 group cursor-default" style={{ height: `${h}%` }}>
                                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[8px] text-fitcore-green px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">7{i}kg</div>
                                   </div>
                                ))}
                             </div>
                          </Card>
                          <Card className="bg-fitcore-navyLight/50 border-white/5 p-6 flex items-center justify-center text-center space-y-4">
                             <div>
                                <Activity className="w-8 h-8 text-fitcore-green mx-auto mb-2 opacity-20" />
                                <p className="text-xs text-gray-500 font-medium">Click on log to see detailed<br/>physiological analysis</p>
                                <button className="mt-4 text-[10px] font-black text-white border-b border-white/20 pb-1 hover:border-fitcore-green transition-all uppercase tracking-widest flex items-center gap-1 mx-auto">
                                   Analyze Now <ExternalLink className="w-2 h-2" />
                                </button>
                             </div>
                          </Card>
                       </div>
                    )}
                 </motion.div>
              ) : (
                 <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600 bg-white/1">
                    <User className="w-12 h-12 mb-4 opacity-10" />
                    <p className="text-sm font-black uppercase tracking-tighter italic">Select a member to view details</p>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
