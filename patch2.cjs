const fs = require('fs');
const file = 'src/components/recruiter/RecruiterLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// The section starts at `<h1 className="text-3xl font-bold tracking-tight">Evaluation Reports</h1>`
// Actually, it's safer to replace from `) : location.pathname === "/recruiter/evaluation-reports" ? (` to `) : location.pathname === "/recruiter/interviews" ?`

const startTag = ') : location.pathname === "/recruiter/evaluation-reports" ? (';
const endTag = ') : location.pathname === "/recruiter/interviews" ? (';

const replacement = `) : location.pathname === "/recruiter/evaluation-reports" ? (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Evaluation Reports</h1>
                  <p className="text-muted-foreground">Manage candidate assessments and reports ({mockCandidates.length})</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => generatePDF(null, true)}><Download className="h-4 w-4" /> Export PDF</Button>
                  <Button size="sm" className="gap-2" onClick={() => toast.info("Select a candidate to generate a report.")}><FileText className="h-4 w-4" /> Generate Report</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary" onClick={() => setReportsFilter('all')}>Total Reports</p>
                        <p className="text-3xl font-bold mt-1">{mockCandidates.length}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 cursor-pointer" onClick={() => setReportsFilter('advance')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Advance</p>
                        <p className="text-3xl font-bold mt-1 text-green-600">
                          {mockCandidates.filter(c => c.status === 'advance').length}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 cursor-pointer" onClick={() => setReportsFilter('advance-reserve')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Hold</p>
                        <p className="text-3xl font-bold mt-1 text-yellow-600">
                          {mockCandidates.filter(c => c.status === 'advance-reserve').length}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-yellow-500/10">
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 cursor-pointer" onClick={() => setReportsFilter('reject')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Rejected</p>
                        <p className="text-3xl font-bold mt-1 text-red-600">
                          {mockCandidates.filter(c => c.status === 'reject').length}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-red-500/10">
                        <XCircle className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {generatedReports.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Reports List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Candidate Name</TableHead>
                            <TableHead>Overall Score</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generatedReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.name}</TableCell>
                              <TableCell>{Math.round((report.overallScore / 5) * 100)}%</TableCell>
                              <TableCell>
                                <Badge className={
                                  report.status === 'advance' ? 'bg-green-100 text-green-800' :
                                  report.status === 'advance-reserve' ? 'bg-yellow-100 text-yellow-800' :
                                  report.status === 'reject' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {report.status === 'advance' ? 'Advance' :
                                  report.status === 'advance-reserve' ? 'Hold' :
                                  report.status === 'reject' ? 'Reject' : 'Pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>{report.date}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                                  <Eye className="h-4 w-4 mr-2" /> View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => generatePDF(report)}>
                                  <Download className="h-4 w-4 mr-2" /> PDF
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Candidate Evaluations</CardTitle>
                </CardHeader>
                <CardContent id="bulk-report-table">
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search candidate name..."
                          className="pl-10 bg-muted/50 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCandidates
                          .filter(c => reportsFilter === 'all' || c.status === reportsFilter)
                          .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .sort((a,b) => b.overallScore - a.overallScore)
                          .map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {candidate.name.split(' ').map(n=>n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{candidate.name}</div>
                                  <div className="text-xs text-muted-foreground">{candidate.position}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{Math.round((candidate.overallScore / 5) * 100)}%</TableCell>
                            <TableCell>
                              <Badge className={
                                candidate.status === 'advance' ? 'bg-green-100 text-green-800' :
                                candidate.status === 'advance-reserve' ? 'bg-yellow-100 text-yellow-800' :
                                candidate.status === 'reject' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {candidate.status === 'advance' ? 'Advance' :
                                candidate.status === 'advance-reserve' ? 'Hold' :
                                candidate.status === 'reject' ? 'Reject' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>{candidate.date}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="default" size="sm" onClick={() => handleGenerateReport(candidate)}><FileText className="h-4 w-4 mr-2" /> Generate Report</Button>
                                <Button variant="outline" size="sm" onClick={() => handleViewReport(candidate)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => generatePDF(candidate)}><Download className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={viewModal} onOpenChange={setViewModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  {selectedCandidate && (
                    <div id="report-content">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl">
                            {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                          <p className="text-muted-foreground">{selectedCandidate.position}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-primary/5 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round((selectedCandidate.overallScore / 5) * 100)}%
                          </div>
                          <p className="text-sm text-muted-foreground">Overall Score</p>
                        </div>
                        <div className="p-4 bg-green-500/5 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedCandidate.interviewer}
                          </div>
                          <p className="text-sm text-muted-foreground">Interviewer</p>
                        </div>
                        <div className="p-4 bg-blue-500/5 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedCandidate.date}</div>
                          <p className="text-sm text-muted-foreground">Interview Date</p>
                        </div>
                        <div className="p-4 bg-purple-500/5 rounded-lg text-center">
                          <Badge className={
                            selectedCandidate.status === 'advance' ? 'bg-green-100 text-green-800' :
                            selectedCandidate.status === 'advance-reserve' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {selectedCandidate.status === 'advance' ? 'Advance' :
                             selectedCandidate.status === 'advance-reserve' ? 'Hold' : 'Reject'}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">Recommendation</p>
                        </div>
                      </div>

                      <h3 className="font-semibold mb-3">Detailed Evaluation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {selectedCandidate.features.map((feature, idx) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{feature.name}</span>
                              <span className="font-bold text-primary">{Math.round((feature.score / feature.maxScore) * 100)}%</span>
                            </div>
                            <Progress value={(feature.score / feature.maxScore) * 100} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground">{feature.feedback}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 justify-end mt-6">
                        <Button variant="outline" onClick={() => generatePDF(selectedCandidate)}>
                          <Download className="h-4 w-4 mr-2" /> Download PDF
                        </Button>
                        <Button onClick={() => handleGenerateReport(selectedCandidate)}>
                          <FileText className="h-4 w-4 mr-2" /> Save to generated
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              {/* Candidate Full Report Modal */}
            </div>
`;

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    fs.writeFileSync(file, before + replacement + after);
    console.log('Successfully patched EvaluationReports');
} else {
    console.log('Could not find start/end tags');
}
