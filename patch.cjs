const fs = require('fs');
const file = 'src/components/recruiter/RecruiterLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add sonner toast import
if (!content.includes('import { toast } from "sonner";')) {
  content = content.replace(
    'import html2canvas from "html2canvas";',
    'import html2canvas from "html2canvas";\nimport { toast } from "sonner";'
  );
}

// 2. Add state
if (!content.includes('const [generatedReports,')) {
  content = content.replace(
    'const [viewModal, setViewModal] = useState(false);',
    'const [viewModal, setViewModal] = useState(false);\n  const [reportsFilter, setReportsFilter] = useState("all");\n  const [generatedReports, setGeneratedReports] = useState<DetailedCandidate[]>([]);\n  const [settingsModalOpen, setSettingsModalOpen] = useState(false);'
  );
}

// 3. Replace generatePDF
const oldPDFRegex = /const generatePDF = async \(\) => \{[\s\S]*? \n  \};\n/m;
const newPDFContent = `const generatePDF = async (candidate = selectedCandidate, isBulk = false) => {
    if (!candidate && !isBulk) return;
    toast.info(isBulk ? "Generating Bulk PDF..." : "Generating Evaluation Report PDF...");
    const element = document.getElementById(isBulk ? 'bulk-report-table' : 'report-content');
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.setFillColor(15, 23, 42); 
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.text("InterQ Technologies Inc - Evaluation Report", 10, 12);
        
        pdf.addImage(imgData, 'PNG', 0, position + 25, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position + 25, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(isBulk ? 'Bulk_Evaluation_Reports.pdf' : \`\${candidate?.name}_Evaluation_Report.pdf\`);
        toast.success("PDF Downloaded successfully!");
      } catch (err) {
        toast.error("Error generating PDF");
      }
    } else {
        const pdf = new jsPDF();
        pdf.setFillColor(15, 23, 42); 
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text("InterQ Evaluation Report", 10, 12);
        if (!isBulk && candidate) {
            pdf.setTextColor(0, 0, 0);
            pdf.text(\`Candidate: \${candidate.name}\`, 10, 30);
            pdf.text(\`Position: \${candidate.position}\`, 10, 40);
            pdf.text(\`Status: \${candidate.status}\`, 10, 50);
            pdf.text(\`Scores:\`, 10, 60);
            candidate.features.forEach((f, i) => {
                pdf.text(\`\${f.name}: \${Math.round((f.score/f.maxScore)*100)}%\`, 15, 70 + (i*10));
            });
        }
        pdf.save(isBulk ? 'Bulk_Reports.pdf' : \`\${candidate?.name}_Report.pdf\`);
        toast.success("PDF Downloaded successfully!");
    }
  };

  const handleGenerateReport = (candidate: DetailedCandidate) => {
    toast.success(\`Complete report generated for \${candidate.name}\`);
    const exists = generatedReports.find(r => r.id === candidate.id);
    if (!exists) setGeneratedReports([...generatedReports, candidate]);
    // navigate("/recruiter/evaluation-reports"); // optional navigate to not disrupt flow
  };
`;
content = content.replace(oldPDFRegex, newPDFContent);

// 4. Update CSV to PDF strings globally
content = content.replace(/Export CSV/g, 'Export PDF');

// Evaluation Tabs
content = content.replace(/<Tabs defaultValue="all" className="w-full">/g, '<Tabs defaultValue="all" className="w-full" onValueChange={setReportsFilter}>');

content = content.replace(/<Button variant="outline" size="sm" className="gap-2">[\s]*<Download className="h-4 w-4" \/> Export PDF[\s]*<\/Button>/g, '<Button variant="outline" size="sm" className="gap-2" onClick={() => generatePDF(null, true)}><Download className="h-4 w-4" /> Export PDF</Button>');

content = content.replace(/<Button size="sm" className="gap-2">[\s]*<FileText className="h-4 w-4" \/> Generate Report[\s]*<\/Button>/g, '<Button size="sm" className="gap-2" onClick={() => toast.info("Select a candidate to generate a report.")}><FileText className="h-4 w-4" /> Generate Report</Button>');

// Candidate Cards update PDF
content = content.replace(/<Button variant="outline" size="sm">\s*<Download className="h-4 w-4 mr-2" \/> Download PDF\s*<\/Button>/g, '<Button variant="outline" size="sm" onClick={() => generatePDF(candidate)}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>');

// Candidate Cards update View Full Report to also include Generate Report
content = content.replace(/<Button variant="outline" size="sm" onClick=\{\(\) => handleViewReport\(candidate\)\}>/g, '<Button variant="default" size="sm" onClick={() => handleGenerateReport(candidate)}><FileText className="h-4 w-4 mr-2" /> Generate Report</Button>\n                          <Button variant="outline" size="sm" onClick={() => handleViewReport(candidate)}>');

// Make Dashboard Cards Clickable with exact regexes to not break structure
content = content.replace(/<p className="text-sm text-muted-foreground">Active Jobs<\/p>/g, '<p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/recruiter/jobs")}>Active Jobs</p>');
content = content.replace(/<p className="text-sm text-muted-foreground">Total Candidates<\/p>/g, '<p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/recruiter/candidates")}>Total Candidates</p>');
content = content.replace(/<p className="text-sm text-muted-foreground">Scheduled Interviews<\/p>/g, '<p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/recruiter/interviews")}>Scheduled Interviews</p>');
content = content.replace(/<p className="text-sm text-muted-foreground">Offers Extended<\/p>/g, '<p className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => navigate("/recruiter/offers")}>Offers Extended</p>');

// Make parent cards clickable class
content = content.replace(/<Card className="hover:shadow-lg transition-shadow">/g, '<Card className="hover:shadow-lg transition-shadow">'); // Left unchanged, just the text is clickable now.

// Add Settings Modal below the <Dialog open={viewModal}...
const settingsModalHTML = `
      {/* Settings Modal */}
      <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Recruiter Settings</DialogTitle>
            <DialogDescription>Manage your profile, notifications, and account preferences.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Profile Name</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive daily candidate digests</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Interview Reminders</Label>
                <p className="text-sm text-muted-foreground">Get pinged 30m before interviews</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="destructive" className="mt-4" onClick={handleLogout}>Logout Account</Button>
          </div>
        </DialogContent>
      </Dialog>
`;
if (!content.includes('Recruiter Settings')) {
  content = content.replace('      {/* Candidate Full Report Modal */}', settingsModalHTML + '\n      {/* Candidate Full Report Modal */}');
}

// Connect the Settings button in Popover
content = content.replace(/<Button variant="ghost" className="w-full justify-start text-sm" onClick=\{\(\) => navigate\("\/recruiter\/settings"\)\}>/g, '<Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setSettingsModalOpen(true)}>');

fs.writeFileSync(file, content);
console.log('Patched');
