const fs = require('fs');
const file = 'src/components/recruiter/RecruiterLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

const modals = `
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
      </Dialog>
`;

// Insert modals before the very last closing tags
let lines = content.split('\n');
let index = lines.length - 1;
while (index >= 0 && !lines[index].includes('}')) {
    index--;
}
// Find the last return branch closing
let lastDivIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('</div>') && lines[i].includes(');')) {
       // This is likely the end of the return statement
    }
}

// Easier: just replace the last </div>
content = content.replace(/<\/main>\s+<\/div>\s+\);\s+\}/, modals + '\n      </main>\n    </div>\n  );\n}');

fs.writeFileSync(file, content);
console.log('Done');
