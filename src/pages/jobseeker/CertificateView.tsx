import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertificate } from "@/hooks/useCertificate";
import { FileText, Download, Share2, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Certificate {
  id: string;
  assessment_name: string;
  candidate_name: string;
  score: number;
  proficiency_level: string;
  assessment_date: string;
  valid_until: string;
  certificate_number: string;
}

export default function CertificateView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { verifyCertificate } = useCertificate();

  useEffect(() => {
    if (!id) return;
    const loadCertificate = async () => {
      try {
        setLoading(true);
        
        // Mock for demo - replace with real API
        await new Promise(resolve => setTimeout(resolve, 800));
        setCertificate({
          id,
          assessment_name: "AWS Certified Cloud Practitioner",
          candidate_name: "Demo Job Seeker",
          score: 92,
          proficiency_level: "Advanced",
          assessment_date: new Date(Date.now() - 86400000).toISOString(),
          valid_until: new Date(Date.now() + 31536000000).toISOString(),
          certificate_number: `CERT-${id.slice(-6)}`
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto mb-4 text-destructive opacity-75" />
        <h3 className="text-lg font-medium mb-2">Certificate Not Found</h3>
        <p className="text-muted-foreground mb-6">{error || "No certificate data available"}</p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const handleDownload = () => {
    // Integrate with backend/certificate-server or html2canvas
    const link = document.createElement('a');
    link.href = `/api/certificates/${certificate.id}/pdf`;
    link.download = `${certificate.assessment_name.replace(/\\s+/g, '_')}_${certificate.candidate_name}.pdf`;
    link.click();
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/certificates/${certificate.id}`;
    if (navigator.share) {
      await navigator.share({
        title: `Certificate - ${certificate.assessment_name}`,
        text: `Completed ${certificate.assessment_name} with ${certificate.score}% score`,
        url: shareUrl
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Certificate link copied!");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 -ml-1">
        <ArrowLeft className="w-4 h-4 mr-2 h-4 w-4" />
        Back to Assessments
      </Button>
      
      <Card className="overflow-hidden shadow-2xl border-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center border-b">
          <div className="inline-flex items-center bg-primary/10 p-4 rounded-2xl mb-6">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent mb-4">
            Certificate of Completion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This certifies that
          </p>
        </div>
        
        <CardContent className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text">
              {certificate.candidate_name}
            </h2>
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent text-2xl font-semibold mb-8">
              has successfully completed
            </div>
            <div className="bg-primary/5 border-4 border-primary/20 rounded-3xl p-8">
              <p className="text-2xl md:text-3xl font-black text-primary">
                {certificate.assessment_name}
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <div className="flex items-center bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">Verified & Authentic</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Final Score</p>
              <div className="text-4xl font-black text-primary">{certificate.score}%</div>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Proficiency</p>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {certificate.proficiency_level}
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Completed</p>
              <div className="text-2xl font-bold">{new Date(certificate.assessment_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Valid Until</p>
              <div className="text-2xl font-bold text-destructive">{new Date(certificate.valid_until).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </Card>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
              Certificate ID: <span className="font-bold">{certificate.certificate_number}</span>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleDownload} size="lg" className="shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleShare} variant="outline" size="lg" className="shadow-lg">
                <Share2 className="w-4 h-4 mr-2" />
                Share Certificate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

