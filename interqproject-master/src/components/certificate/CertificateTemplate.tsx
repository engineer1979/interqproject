import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

interface CertificateProps {
  id: string;
  userName: string;
  courseName: string;
  date: string;
  type: "Assessment" | "Coding Challenge" | "Live Interview";
  score?: number;
  onClose?: () => void;
}

export const CertificateTemplate = ({ id, userName, courseName, date, type, score, onClose }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff"
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`InterQ_Certificate_${userName.replace(/\s+/g, "_")}.pdf`);
  };

  const shareCertificate = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My InterQ Certificate",
          text: `I just earned an ${type} certificate from InterQ!`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 max-w-5xl mx-auto">
      {/* Certificate Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        ref={certificateRef}
        className="relative w-full min-h-[700px] bg-white border-[14px] border-double border-slate-900 shadow-2xl p-1"
      >
        {/* Decorative Corner Borders */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[8px] border-l-[8px] border-amber-400/30" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-[8px] border-r-[8px] border-amber-400/30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[8px] border-l-[8px] border-amber-400/30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[8px] border-r-[8px] border-amber-400/30" />

        {/* Inner Border */}
        <div className="w-full border border-amber-200/40 flex flex-col items-start p-10 pb-12 relative bg-gradient-to-br from-white via-slate-50/60 to-white">
          
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden">
            <Award className="w-[500px] h-[500px] -rotate-12" />
          </div>

          {/* Top Row: Logo left + Award icon right */}
          <div className="w-full flex items-center justify-between mb-10 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <img src="/interq-logo.png" alt="InterQ Logo" className="h-12 w-auto object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                InterQ
              </span>
            </div>
            <div className="opacity-15">
              <Award className="w-14 h-14 text-amber-500" />
            </div>
          </div>

          {/* Header — centred block */}
          <div className="text-center w-full mb-8 z-10 relative">
            <div className="inline-block bg-slate-900 text-white px-5 py-1 rounded-full text-[10px] font-black tracking-[0.35em] uppercase mb-5 shadow-lg">
              Official Technical Credential
            </div>
            <h1 className="font-black tracking-tighter text-slate-900 leading-tight">
              <span className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 animate-shine block">
                CERTIFICATE
              </span>
              <span className="text-3xl text-slate-400 tracking-[0.12em] font-light italic font-serif block mt-1">
                OF ACHIEVEMENT
              </span>
            </h1>
            <div className="h-0.5 w-28 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-5" />
          </div>

          {/* Content */}
          <div className="text-center w-full z-10 space-y-6 relative">
            <div className="space-y-2">
              <p className="text-base text-slate-400 font-medium uppercase tracking-[0.2em] italic">This certifies that</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                {userName}
              </h2>
            </div>

            <div className="space-y-3">
              <p className="text-base text-slate-500 font-serif leading-relaxed max-w-xl mx-auto italic">
                has demonstrated exceptional technical mastery and successfully completed all requirements for
              </p>
              <div className="inline-block px-7 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="font-black text-slate-900 text-2xl uppercase tracking-tight">{courseName}</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 font-bold tracking-widest uppercase">
              {type} Track • Verified Achievement
              {score !== undefined && (
                <span className="text-emerald-600 ml-3 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  {score}% Score
                </span>
              )}
            </p>
          </div>

          {/* Footer - Signatures/Verification */}
          <div className="w-full grid grid-cols-3 items-end mt-10 z-10 relative">
            <div className="text-left space-y-2">
              <div className="h-0.5 bg-gradient-to-r from-slate-300 to-transparent w-full mb-2" />
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verification ID</p>
              <p className="text-[10px] text-slate-400 font-mono font-bold break-all">{id}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
                <div className="w-20 h-20 bg-white border-4 border-double border-amber-400 rounded-full flex items-center justify-center relative z-10 shadow-xl">
                  <div className="w-14 h-14 border border-dashed border-amber-200 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">{date}</p>
            </div>

            <div className="text-right space-y-2">
              <div className="h-0.5 bg-gradient-to-l from-slate-300 to-transparent w-full mb-2" />
              <div className="flex flex-col items-end gap-1">
                <img src="/interq-logo.png" alt="Signature" className="h-8 w-auto opacity-60 grayscale" />
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">InterQ Certification Board</p>
                <p className="text-[9px] text-slate-400 font-bold italic">Authority Verified</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4 w-full">
        <Button onClick={downloadPDF} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 gap-2 shadow-lg">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <Button onClick={shareCertificate} variant="outline" className="flex-1 font-bold h-12 gap-2 border-2">
          <Share2 className="w-4 h-4" /> Share Achievement
        </Button>
        {onClose && (
           <Button onClick={onClose} variant="ghost" className="px-8 font-bold text-slate-500">
             Close
           </Button>
        )}
      </div>
    </div>
  );
};
