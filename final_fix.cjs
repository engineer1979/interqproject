const fs = require('fs');
const file = 'src/components/recruiter/RecruiterLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state if missing
if (!content.includes('showCreateOffer')) {
    content = content.replace(
        'const [settingsModalOpen, setSettingsModalOpen] = useState(false);',
        'const [settingsModalOpen, setSettingsModalOpen] = useState(false);\n  const [showCreateOffer, setShowCreateOffer] = useState(false);'
    );
}

// 2. Add handleCreateOffer if missing
if (!content.includes('const handleCreateOffer = () => {')) {
    content = content.replace(
        '  const handleLogout = async () => {',
        `  const handleCreateOffer = () => {
    toast.success("Offer created and sent to candidate successfully!");
    setShowCreateOffer(false);
  };

  const handleLogout = async () => {`
    );
}

// 3. Connect buttons
content = content.replace(
    'Button variant="ghost" className="w-full justify-start text-sm" onClick={() => navigate("/recruiter/settings")}',
    'Button variant="ghost" className="w-full justify-start text-sm" onClick={() => setSettingsModalOpen(true)}'
);

// 4. Add Modals at end of file if missing
const modals = \`
      {/* Create Offer Modal */}
      <Dialog open={showCreateOffer} onOpenChange={setShowCreateOffer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>Generate and send a job offer to a selected candidate.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="offer-candidate">Select Candidate</Label>
              <Select>
                <SelectTrigger id="offer-candidate">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name} - {c.position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">Annual Salary ($)</Label>
              <Input id="salary" placeholder="e.g., 120,000" type="number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start-date">Expected Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="offer-details">Additional Details</Label>
              <Textarea id="offer-details" placeholder="Include any sign-on bonuses, equity, etc." />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateOffer(false)}>Cancel</Button>
            <Button onClick={handleCreateOffer}>Send Offer</Button>
          </div>
        </DialogContent>
      </Dialog>

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
      </Dialog>\`;

if (!content.includes('Create Offer Modal')) {
    // Append before the last two closings ( </main> </div> )
    content = content.replace('      </main>\\n    </div>', modals + '\\n      </main>\\n    </div>');
}

fs.writeFileSync(file, content);
console.log('Final Fix Complete');
