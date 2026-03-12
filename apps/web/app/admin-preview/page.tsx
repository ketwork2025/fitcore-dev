"use client";

import { AdminDashboardView } from '@/components/dashboard/AdminDashboardView';
import { AIFoodScanner } from '@/components/dashboard/AIFoodScanner';

export default function AdminPreviewPage() {
  return (
    <main className="min-h-screen bg-fitcore-navy p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b border-gray-800 pb-6">
           <h1 className="text-3xl font-black text-fitcore-green italic tracking-tighter uppercase">Admin & AI Feature Preview</h1>
           <p className="text-gray-400 mt-2">Direct visualization of new enterprise features</p>
        </header>

        <section className="space-y-6">
           <h2 className="text-sm font-black text-white uppercase tracking-widest bg-white/5 inline-block px-3 py-1 rounded border border-white/10 italic">Feature A: AI Diet Analysis</h2>
           <div className="max-w-2xl">
              <AIFoodScanner />
           </div>
        </section>

        <section className="space-y-6 pt-12 border-t border-gray-800">
           <h2 className="text-sm font-black text-white uppercase tracking-widest bg-white/5 inline-block px-3 py-1 rounded border border-white/10 italic">Feature C: Revenue & User Dashboard</h2>
           <AdminDashboardView />
        </section>
      </div>
    </main>
  );
}
