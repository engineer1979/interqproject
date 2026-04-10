import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import EnhancedFooter from "@/components/EnhancedFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Users, Link2, Copy, Check, Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Platform = "google_meet" | "zoom" | "teams";

export default function LiveInterviews() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinLink, setJoinLink] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Link Copied", description: "Meeting link copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartInterview = (platform: Platform) => {
    const fakeLinks = {
      google_meet: "https://meet.google.com/new",
      zoom: "https://zoom.us/start",
      teams: "https://teams.microsoft.com/l/meetup-join/"
    };
    window.open(fakeLinks[platform], "_blank");
    toast({ title: "Starting Interview", description: `Launching ${platform.replace("_", " ")}...` });
  };

  const handleJoinInterview = () => {
    if (!joinLink) {
      toast({ title: "Error", description: "Please enter a valid link.", variant: "destructive" });
      return;
    }
    window.open(joinLink, "_blank");
    setIsJoinDialogOpen(false);
    setJoinLink("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <EnhancedNavigation />
      
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-cyan-500 text-cyan-400">Live Interview Analysis</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                Live <span className="text-cyan-400">Interviews</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Live interview will follow after selected assessments or coding tests. Connect seamlessly with your candidates using your preferred platform.
              </p>
            </div>

            {/* Integrations Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Google Meet */}
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                    <Video className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Google Meet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-center text-slate-400">Directly launch a Google Meet session for immediate interviewing.</p>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white" onClick={() => handleStartInterview("google_meet")}>
                    <Plus className="w-4 h-4 mr-2" /> Start Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Zoom */}
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                    <Video className="w-8 h-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-white">Zoom</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-center text-slate-400">Start a high-quality Zoom meeting with screen sharing capabilities.</p>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white" onClick={() => handleStartInterview("zoom")}>
                    <Plus className="w-4 h-4 mr-2" /> Start Interview
                  </Button>
                </CardContent>
              </Card>

              {/* Microsoft Teams */}
              <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                    <Video className="w-8 h-8 text-indigo-500" />
                  </div>
                  <CardTitle className="text-white">Microsoft Teams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-center text-slate-400">Connect securely via Microsoft Teams for enterprise interviews.</p>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white" onClick={() => handleStartInterview("teams")}>
                    <Plus className="w-4 h-4 mr-2" /> Start Interview
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Scheduled Interviews List & Join functionality */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <CardTitle className="text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-cyan-400" /> Scheduled Sessions</CardTitle>
                  <CardDescription className="text-slate-400">View your upcoming live interviews</CardDescription>
                </div>
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white" onClick={() => setIsJoinDialogOpen(true)}>
                  <Link2 className="w-4 h-4 mr-2" /> Join via Link
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Mock Scheduled Item */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-700">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Frontend Developer Interview</h4>
                        <p className="text-sm text-slate-400">Candidate: ID-90234 • Platform: Google Meet</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Scheduled</Badge>
                          <span className="text-xs text-slate-500">Today, 2:00 PM</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" className="bg-slate-700 hover:bg-slate-600 text-white" onClick={() => handleCopy("https://meet.google.com/xyz-abcd-efg")}>
                        {copied ? <Check className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy Link
                      </Button>
                      <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => window.open("https://meet.google.com/xyz-abcd-efg", "_blank")}>
                        Join Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </main>

      {/* Join Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Live Interview</DialogTitle>
            <DialogDescription className="text-slate-400">
              Paste the meeting link provided by the recruiter to join the session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link" className="text-slate-300">Meeting Link</Label>
              <Input
                id="link"
                placeholder="https://meet.google.com/..."
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">Cancel</Button>
            <Button onClick={handleJoinInterview} className="bg-cyan-500 hover:bg-cyan-600 text-white">Join Meeting</Button>
          </div>
        </DialogContent>
      </Dialog>

      <EnhancedFooter />
    </div>
  );
}
