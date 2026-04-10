import React, { useState } from "react";
import { useJobSeekerDashboard } from "@/contexts/JobSeekerDashboardContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Share2, 
  Plus, 
  ShieldCheck,
  SearchX,
  FileText,
  Code2,
  Video
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CertificateTemplate } from "@/components/certificate/CertificateTemplate";
import { motion, AnimatePresence } from "framer-motion";

export default function JobSeekerCertificates() {
  const { data, addCertificate, getCertificateEligibility } = useJobSeekerDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const certificates = data?.certificates || [];
  const eligibility = getCertificateEligibility ? getCertificateEligibility() : [];

  const filteredCerts = certificates.filter(cert => 
    cert.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = async (item: any) => {
    setGeneratingId(item.assessmentId);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCert = {
      id: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      title: item.title,
      assessment_id: item.assessmentId,
      status: "issued",
      issued_at: new Date().toISOString()
    };
    
    await addCertificate(newCert);
    setGeneratingId(null);
    setSelectedCert(newCert);
  };

  const getTypeIcon = (title: string) => {
    if (title.toLowerCase().includes('coding')) return <Code2 className="w-5 h-5 text-purple-500" />;
    if (title.toLowerCase().includes('interview')) return <Video className="w-5 h-5 text-emerald-500" />;
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const getCertType = (title: string): "Assessment" | "Coding Challenge" | "Live Interview" => {
    if (title.toLowerCase().includes('coding')) return "Coding Challenge";
    if (title.toLowerCase().includes('interview')) return "Live Interview";
    return "Assessment";
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Certificates <Award className="w-10 h-10 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Manage your earned credentials and share your professional achievements.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search certificates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* 1. Unclaimed Certificates (Eligibility) */}
      {eligibility.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-black text-slate-900">Available to Claim</h2>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none ml-2">
              Action Required
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibility.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-2 border-dashed border-amber-200 bg-amber-50/30 hover:bg-amber-50/50 transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {getTypeIcon(item.title || "")}
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none shadow-sm">
                        Passed: {item.score}%
                      </Badge>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-widest">
                      Completed on {new Date(item.completedAt || "").toLocaleDateString()}
                    </p>
                    <Button 
                      onClick={() => handleGenerate(item)}
                      disabled={generatingId === item.assessmentId}
                      className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 rounded-xl group-hover:shadow-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      {generatingId === item.assessmentId ? "Generating Certificate..." : "Generate Certificate"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Earned Certificates */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Award className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black text-slate-900">Your Credentials</h2>
          <Badge variant="outline" className="ml-2 font-bold">{filteredCerts.length} Verified</Badge>
        </div>

        {filteredCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
            {filteredCerts.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-slate-900 border-none overflow-hidden relative group cursor-pointer hover:ring-4 hover:ring-primary/20 transition-all shadow-2xl">
                  {/* Decorative Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                  
                  <CardContent className="p-8 relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-white/5 group-hover:scale-110 transition-transform">
                      <Award className="w-10 h-10 text-primary" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-center mb-2 leading-tight">{cert.title}</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-8">
                       ID: {cert.id}
                    </p>
                    
                    <div className="flex flex-col gap-3 w-full">
                      <Button 
                        onClick={() => setSelectedCert(cert)}
                        className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black h-12 rounded-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Full
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 text-white font-bold rounded-xl">
                          <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 text-white font-bold rounded-xl">
                          <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <SearchX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No certificates found</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">
              Complete your assessments with a score of 70% or higher to earn credentials.
            </p>
          </div>
        )}
      </section>

      {/* Certificate View Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-100">
          <DialogHeader className="p-6 bg-white border-b flex flex-row items-center justify-between space-y-0">
             <div>
               <DialogTitle className="text-2xl font-black">Official Achievement Certificate</DialogTitle>
               <p className="text-slate-500 font-medium">Verified by InterQ Smart Assessment Engine</p>
             </div>
          </DialogHeader>
          <div className="p-8 max-h-[80vh] overflow-y-auto">
            {selectedCert && (
              <CertificateTemplate 
                id={selectedCert.id || ""}
                userName={data?.profile?.full_name || "Valued Candidate"}
                courseName={selectedCert.title || ""}
                date={new Date(selectedCert.issued_at || "").toLocaleDateString()}
                type={getCertType(selectedCert.title || "")}
                onClose={() => setSelectedCert(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}