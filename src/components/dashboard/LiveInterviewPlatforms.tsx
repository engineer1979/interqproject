import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Plus, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Platform = "google_meet" | "zoom" | "teams";

export const LiveInterviewPlatforms = () => {
  const { toast } = useToast();

  const handleStartInterview = (platform: Platform) => {
    const fakeLinks = {
      google_meet: "https://meet.google.com/new",
      zoom: "https://zoom.us/start",
      teams: "https://teams.microsoft.com/l/meetup-join/"
    };
    window.open(fakeLinks[platform], "_blank");
    toast({ 
      title: "Launching Session", 
      description: `Opening ${platform.replace("_", " ")} in a new tab.` 
    });
  };

  const platforms = [
    { 
      id: "google_meet", 
      name: "Google Meet", 
      icon: <Video className="w-6 h-6 text-emerald-500" />, 
      color: "bg-emerald-50",
      description: "Direct video calls via Google workspace."
    },
    { 
      id: "zoom", 
      name: "Zoom", 
      icon: <Video className="w-6 h-6 text-blue-500" />, 
      color: "bg-blue-50",
      description: "High-quality video conferencing."
    },
    { 
      id: "teams", 
      name: "MS Teams", 
      icon: <Video className="w-6 h-6 text-indigo-500" />, 
      color: "bg-indigo-50",
      description: "Enterprise collaboration tools."
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-slate-900">Platform Integrations</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow border-slate-100 overflow-hidden group">
            <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
              <div className={`p-2 rounded-xl ${p.color} group-hover:scale-110 transition-transform`}>
                {p.icon}
              </div>
              <CardTitle className="text-base font-bold">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                {p.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-9 gap-2 font-bold text-slate-600 hover:text-primary hover:border-primary/50 transition-all"
                onClick={() => handleStartInterview(p.id as Platform)}
              >
                <Plus className="w-3.5 h-3.5" /> Launch Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
