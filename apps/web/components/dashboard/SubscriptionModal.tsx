"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, ShieldCheck, CreditCard, Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const plans = {
    monthly: { price: "$12.99", period: "/month", desc: "Pay as you go" },
    annual: { price: "$99.99", period: "/year", desc: "Save 35%", popular: true }
  };

  const features = [
    { text: "Unlimited AI Food Scanning", icon: <Sparkles className="w-4 h-4 text-fitcore-green" /> },
    { text: "Advanced AI Personal Coaching", icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { text: "Exclusive Expert Workout Routines", icon: <Star className="w-4 h-4 text-blue-400" /> },
    { text: "Detailed Body Progress Analytics", icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
    { text: "Ad-free Experience & VIP Support", icon: <Check className="w-4 h-4 text-fitcore-green" /> },
  ];

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (typeof window === 'undefined') return;
    
    setIsProcessing(true);
    
    // PortOne (imp.js) initialization
    const { IMP } = window as any;
    if (!IMP) {
      alert("Payment module not loaded. Please try again later.");
      setIsProcessing(false);
      return;
    }

    IMP.init("imp00000000"); // Test Merchant ID

    const amount = selectedPlan === 'monthly' ? 12.99 : 99.99;
    const name = `FITCORE PRO ${selectedPlan === 'monthly' ? 'Monthly' : 'Annual'} Plan`;

    IMP.request_pay({
      pg: "kakaopay.TC0ONETIME", // Test KakaoPay
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      name: name,
      amount: amount,
      buyer_email: "test@fitcore.ai",
      buyer_name: "Test User",
    }, (rsp: any) => {
      if (rsp.success) {
        alert("Payment Successful! Welcome to FITCORE PRO.");
        onClose();
      } else {
        alert(`Payment Failed: ${rsp.error_msg}`);
      }
      setIsProcessing(false);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-fitcore-navyLight border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(57,255,20,0.15)] overflow-hidden"
      >
        {/* Header Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-fitcore-green/10 blur-[60px]" />

        <div className="relative p-8 md:p-10">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitcore-green/10 border border-fitcore-green/30 text-fitcore-green text-[10px] font-black uppercase tracking-widest mb-4">
               <Zap className="w-3 h-3 fill-current" /> Upgrade to Pro
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Unleash Your <br /> <span className="text-fitcore-green">Full Potential</span></h2>
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {(['monthly', 'annual'] as const).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedPlan(id)}
                className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 ${
                  selectedPlan === id 
                  ? 'border-fitcore-green bg-fitcore-green/5' 
                  : 'border-white/5 bg-black/20 hover:border-white/10'
                }`}
              >
                {'popular' in plans[id] && (
                  <div className="absolute -top-3 px-3 py-0.5 bg-fitcore-green text-black text-[9px] font-black rounded-full uppercase italic">Best Value</div>
                )}
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{id}</span>
                <span className="text-2xl font-black text-white">{plans[id].price}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{plans[id].period}</span>
                <span className="text-[9px] font-black text-fitcore-green italic">{plans[id].desc}</span>
              </button>
            ))}
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-10">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 group"
              >
                 <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-fitcore-green/30 transition-colors">
                    {feature.icon}
                 </div>
                 <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Checkout Button */}
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-14 bg-fitcore-green hover:bg-fitcore-green/90 text-black font-black text-lg italic uppercase rounded-2xl shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <>
                  <CreditCard className="w-5 h-5 fill-current" />
                  Start Growing Now
               </>
            )}
          </Button>

          <p className="mt-4 text-[9px] text-center text-gray-500 font-bold uppercase tracking-widest">
            Secure checkout by FITCORE. Cancel anytime.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
