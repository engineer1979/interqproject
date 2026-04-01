import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CategoryType, Candidate, FinalDecision } from '@/types/candidateEvaluation';
import { useNavigate } from 'react-router-dom';

const EvaluationForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [candidate, setCandidate] = useState({ name: '', position: '' });
  const [interviewer, setInterviewer] = useState('');
  const [ratings, setRatings] = useState<Record<CategoryType, number>>({
    'Prior Work Experience': 3,
    'Technical Qualifications': 3,
    'Teambuilding / Interpersonal Skills': 3,
    'Initiative': 3,
    'Time Management': 3,
    'Customer Service': 3,
  });
  const [comments, setComments] = useState<Record<CategoryType, string>>({
    'Prior Work Experience': '',
    'Technical Qualifications': '',
    'Teambuilding / Interpersonal Skills': '',
    'Initiative': '',
    'Time Management': '',
    'Customer Service': '',
  });
  const [education, setEducation] = useState(false);
  const [recommendation, setRecommendation] = useState('Advance with Reservations');
  const [overallComments, setOverallComments] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .insert({
          name: candidate.name,
          position: candidate.position,
          interviewer: interviewer || null,
          date: date.toISOString(),
        })
        .select()
        .single();

      if (candidateError) throw candidateError;

      // Insert evaluations
      const evaluations = Object.entries(ratings).map(([category, rating]) => ({
        candidate_id: candidateData.id,
        category: category as CategoryType,
        rating,
        comments: comments[category as CategoryType] || '',
      }));

      await supabase.from('evaluations').insert(evaluations);

      // Insert final decision
      await supabase.from('final_decision').insert({
        candidate_id: candidateData.id,
        education,
        recommendation,
        overallComments,
      });

      return candidateData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      navigate('/admin/evaluation-dashboard');
    },
  });

  const averageScore = Object.values(ratings).reduce((a, b) => a + b, 0) / Object.keys(ratings).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Candidate Evaluation Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Candidate Name</Label>
              <Input 
                value={candidate.name}
                onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Position Title</Label>
              <Input 
                value={candidate.position}
                onChange={(e) => setCandidate({ ...candidate, position: e.target.value })}
              />
            </div>
            <div>
              <Label>Interviewer Name</Label>
              <Input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} />
            </div>
            <div>
              <Label>Interview Date</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue>{format(date, 'PPP')}</SelectValue>
                </SelectTrigger>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Skill Ratings</h3>
            {Object.entries(ratings).map(([category, rating]) => (
              <div key={category} className="mb-4 p-4 border rounded-lg">
                <Label className="block mb-2 font-medium">{category}</Label>
                <RadioGroup 
                  value={rating.toString()} 
                  onValueChange={(value) => setRatings({ ...ratings, [category]: parseInt(value) })}
                  className="flex gap-2"
                >
                  {[1,2,3,4,5].map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value.toString()} id={`${category}-${value}`} />
                      <Label htmlFor={`${category}-${value}`} className="font-normal">{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <Textarea 
                  placeholder="Comments..."
                  value={comments[category as CategoryType] || ''}
                  onChange={(e) => setComments({ ...comments, [category as CategoryType]: e.target.value })}
                  className="mt-2"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Switch checked={education} onCheckedChange={setEducation} />
                Educational Background Verified
              </Label>
            </div>
            <div>
              <Label>Current Average Score: {averageScore.toFixed(1)}</Label>
            </div>
          </div>

          <div>
            <Label>Recommendation</Label>
            <Select value={recommendation} onValueChange={setRecommendation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Advance">Advance</SelectItem>
                <SelectItem value="Advance with Reservations">Advance with Reservations</SelectItem>
                <SelectItem value="Do Not Advance">Do Not Advance</SelectItem>
              </SelectContent>
            </Select>
          </div>


            <div className="space-y-2">
              <Label>Overall Impression</Label>
              <Textarea 
                placeholder="Overall comments and impressions..."
                value={overallComments}
                onChange={(e) => setOverallComments(e.target.value)}
                rows={4}
              />
            </div>


          <Button 
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'Saving...' : 'Submit Evaluation'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationForm;

