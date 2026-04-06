import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award, CheckCircle } from "lucide-react";
import type { Certificate } from "@/hooks/useCertificate";

interface CertificateTemplateProps {
  certificate: Certificate;
  onDownload?: () => void;
  onShare?: () => void;
  compact?: boolean;
}

export default function CertificateTemplate({
  certificate,
  onDownload,
  onShare,
  compact = false,
}: CertificateTemplateProps) {
  const getProficiencyColor = (level?: string) => {
    switch (level) {
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Proficient":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (compact) {
    return (
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {certificate.type === "assessment"
                  ? certificate.assessment_name
                  : certificate.interview_title}
              </p>
              <p className="text-xs text-muted-foreground">
                {certificate.candidate_name}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              className={getProficiencyColor(certificate.proficiency_level)}
            >
              {certificate.proficiency_level || "Certified"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {certificate.score}%
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg border-0">
      <div
        className="relative bg-gradient-to-br from-primary/5 via-white to-primary/10 p-8"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            linear-gradient(225deg, rgba(99, 102, 241, 0.05) 0%, transparent 50%)
          `,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)]" />

        <div className="relative">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/interq-logo.png"
              alt="InterQ"
              className="h-16 w-auto mb-4"
            />
            <div className="text-center">
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">
                InterQ Certification
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                Certificate of Completion
              </h1>
            </div>
          </div>

          <div className="border-t border-b border-dashed border-primary/20 py-6 my-4">
            <p className="text-center text-sm text-muted-foreground mb-2">
              This is to certify that
            </p>
            <p className="text-center text-2xl font-bold text-primary mb-4">
              {certificate.candidate_name}
            </p>
            <p className="text-center text-sm text-muted-foreground mb-2">
              has successfully completed
            </p>
            <p className="text-center text-xl font-semibold">
              {certificate.type === "assessment"
                ? certificate.assessment_name
                : certificate.interview_title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Score Achieved
              </p>
              <p className="text-3xl font-bold text-primary">
                {certificate.score}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Proficiency Level
              </p>
              <Badge
                className={`text-sm px-3 py-1 ${getProficiencyColor(
                  certificate.proficiency_level
                )}`}
              >
                {certificate.proficiency_level || "Certified"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-dashed border-primary/20 pt-4">
            <div>
              <p>
                Certificate No:{" "}
                <span className="font-mono font-semibold text-foreground">
                  {certificate.certificate_number || "N/A"}
                </span>
              </p>
              <p>
                Issued:{" "}
                <span className="font-semibold text-foreground">
                  {formatDate(certificate.assessment_date)}
                </span>
              </p>
            </div>
            <div className="text-right">
              {certificate.valid_until && (
                <p>
                  Valid Until:{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(certificate.valid_until)}
                  </span>
                </p>
              )}
              <p className="flex items-center gap-1 justify-end">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Verified
              </p>
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <CardContent className="bg-muted/30 p-4">
          <div className="flex gap-2">
            <Button onClick={onDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={onShare} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
