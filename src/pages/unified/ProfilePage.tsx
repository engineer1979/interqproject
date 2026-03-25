import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Briefcase, Plus, X, Upload, Save } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 555-0100",
    location: "San Francisco, CA",
    title: "Software Engineer",
    bio: "Passionate developer with 5+ years of experience in full-stack development.",
    linkedin: "https://linkedin.com/in/example",
    website: "",
  });
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "Python"]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Profile Updated", description: "Your profile has been saved successfully." });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      {/* Avatar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {form.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{form.name}</h2>
              <p className="text-muted-foreground text-sm">{form.email}</p>
              <Badge variant="outline" className="mt-1 capitalize">{user?.role}</Badge>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => toast({ title: "Upload Photo", description: "Photo upload would open here." })}>
              <Upload className="h-3 w-3 mr-1" /> Change Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
            <div className="col-span-2"><Label>Current Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="col-span-2"><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Skills</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors"><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} className="flex-1" />
            <Button size="sm" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Links</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>LinkedIn URL</Label><Input placeholder="https://linkedin.com/in/yourprofile" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} /></div>
          <div><Label>Personal Website</Label><Input placeholder="https://yourwebsite.com" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Resume / CV</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">Drag & drop your resume here, or click to browse</p>
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Upload Resume", description: "File picker would open here. PDF, DOC, DOCX accepted." })}>
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX up to 5MB</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
