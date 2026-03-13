"use client";

import { useState } from 'react';
import { Download, Loader2, Share2, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import html2canvas from 'html2canvas';

export function ReportShareButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadReport = async () => {
    const element = document.getElementById('dashboard-overview');
    if (!element) return;

    setIsExporting(true);
    try {
      // Small delay to ensure all animations are settled
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        backgroundColor: '#050510', // Match navy theme
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('dashboard-overview');
          if (el) {
            el.style.padding = '40px';
            el.style.borderRadius = '0px';
          }
        }
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `FITCORE_Daily_Report_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export report:', err);
      alert('Report generation failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={handleDownloadReport} 
        disabled={isExporting}
        className="h-10 border-fitcore-green/30 text-fitcore-green hover:bg-fitcore-green/10 flex items-center gap-2 font-bold px-4"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        <span className="hidden sm:inline">분석 리포트 다운로드</span>
        <span className="sm:hidden">다운로드</span>
      </Button>
      
      <Button 
        variant="ghost" 
        className="h-10 w-10 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
        title="Share with AI Coach"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
