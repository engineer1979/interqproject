import { Download, Share2, Award, ShieldCheck, CheckCircle2, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
    
    toast.info("Preparing your certificate for download...");
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`InterQ_Certificate_${userName.replace(/\s+/g, "_")}.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const shareCertificate = async () => {
    const shareData = {
      title: "InterQ Certification",
      text: `I've successfully earned the ${courseName} certification from InterQ!`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Achievement link copied to clipboard!");
      }
    } catch (error) {
      console.error("Sharing error:", error);
      toast.error("Could not share. Link copied to clipboard instead.");
      navigator.clipboard.writeText(window.location.href);
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
        className="relative w-full bg-white border-[16px] border-double border-slate-900 shadow-2xl p-1 min-h-[700px] flex flex-col"
      >
        {/* Decorative Corner Borders */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-[8px] border-l-[8px] border-amber-400/30 z-30" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-[8px] border-r-[8px] border-amber-400/30 z-30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[8px] border-l-[8px] border-amber-400/30 z-30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[8px] border-r-[8px] border-amber-400/30 z-30" />

        {/* Inner Border */}
        <div className="flex-1 w-full border-[1px] border-amber-200/50 flex flex-col items-center justify-center p-16 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-slate-50 to-white overflow-hidden">
          
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <Award className="w-[600px] h-[600px] -rotate-12" />
          </div>

          {/* Top Left Logo & Branding */}
          <div className="absolute top-12 left-12 flex items-center gap-3 z-20">
             <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
               <img src="/interq-logo.png" alt="InterQ Logo" className="h-10 w-auto object-contain" />
             </div>
             <span className="text-xl font-black tracking-tight text-slate-800 font-jakarta">
               InterQ
             </span>
          </div>

          {/* Top Right Award Icon */}
          <div className="absolute top-12 right-12 opacity-20">
            <Award className="w-16 h-16 text-amber-500" />
          </div>

          {/* Header */}
          <div className="text-center mb-10 pt-10 relative z-10 w-full">
            <div className="inline-block bg-slate-900 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-xl">
              Official Technical Credential
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 animate-shine drop-shadow-md pb-2 inline-block">
                CERTIFICATE
              </span>
              <br />
              <span className="text-3xl text-slate-400 mt-1 block tracking-[0.1em] font-light italic font-serif">
                OF ACHIEVEMENT
              </span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
          </div>

          {/* Content */}
          <div className="text-center flex-1 z-10 space-y-6 py-4">
            <div className="space-y-4">
              <p className="text-lg text-slate-400 font-medium uppercase tracking-[0.2em] italic">This certifies that</p>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight px-12 font-jakarta">
                {userName}
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-slate-500 font-serif leading-relaxed max-w-2xl mx-auto italic">
                has demonstrated exceptional technical mastery and successfully completed all requirements for
              </p>
              <div className="inline-block px-10 py-4 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                <span className="font-black text-slate-900 text-3xl uppercase tracking-tight">{courseName}</span>
              </div>
            </div>

            <p className="text-lg text-slate-400 font-bold tracking-widest uppercase mt-8">
              {type} Track • Verified Achievement
              {score !== undefined && (
                <span className="text-emerald-600 ml-3 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100 text-sm">
                  {score}% Score
                </span>
              )}
            </p>
          </div>

          {/* Footer - Signatures/Verification */}
          <div className="w-full grid grid-cols-3 items-end mt-12 z-10 px-6">
            <div className="text-left space-y-3">
              <div className="h-0.5 bg-gradient-to-r from-slate-300 to-transparent w-full mb-3" />
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Verification ID</p>
              <p className="text-xs text-slate-400 font-mono font-bold tracking-tighter">{id}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full animate-pulse" />
                <div className="w-24 h-24 bg-white border-[6px] border-double border-amber-400 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                   <ShieldCheck className="w-10 h-10 text-amber-500" />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm">{date}</p>
            </div>

            <div className="text-right space-y-3">
              <div className="h-0.5 bg-gradient-to-l from-slate-300 to-transparent w-full mb-3" />
              <div className="flex flex-col items-end">
                <img src="/interq-logo.png" alt="Signature" className="h-8 w-auto opacity-70 grayscale mb-2" />
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">InterQ Authority</p>
                <p className="text-[10px] text-slate-400 font-bold italic">Credential Verified</p>
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
