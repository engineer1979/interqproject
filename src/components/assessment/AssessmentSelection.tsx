import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock, Award, Users, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useAssessments } from '@/hooks/useAssessments';
import { globalITAssessmentSystem } from '@/data/globalITAssessmentSystem';
import { Assessment } from '@/types/assessment';

interface AssessmentSelectionProps {
  onAssessmentSelect: (assessment: Assessment) => void;
  userId: string;
}

export function AssessmentSelection({ onAssessmentSelect, userId }: AssessmentSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const { data: rawAssessments = [], isLoading, error, refetch, isRefetching } = useAssessments();

  // Enrich with master data if needed
  const assessments = rawAssessments.length > 0 
    ? rawAssessments 
    : globalITAssessmentSystem.domains.map(domain => ({
        id: domain.id,
        title: domain.name,
        description: `Professional ${domain.name} assessment`,
        duration_minutes: 60,
        passing_score: 70,
        total_questions: domain.questionCount,
        difficulty: domain.difficulty,
        category: domain.category,
        tags: domain.tags,
        is_active: true,
        created_at: new Date().toISOString(),
        domain: domain.category,
      } as Assessment));

  // Derive filters
  const categories = ['all', ...Array.from(new Set(assessments.map(a => a.category || a.domain || 'IT'))).sort()];
  const difficulties = ['all', ...Array.from(new Set(assessments.map(a => a.difficulty))).sort()];
  const commonTags = ['all', 'Cloud', 'Security', 'Frontend', 'Backend', 'Data Management', 'AI', 'System Design'];

  const filteredAssessments = assessments.filter(assessment => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      assessment.title.toLowerCase().includes(searchLower) ||
      (assessment.description || '').toLowerCase().includes(searchLower) ||
      (assessment.category || '').toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory === 'all' || (assessment.category || assessment.domain) === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || assessment.difficulty === selectedDifficulty;
    const matchesTag = selectedTag === 'all' ||
      assessment.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
      (assessment.category || '').toLowerCase().includes(selectedTag.toLowerCase());
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTag && assessment.is_active;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading assessments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Technical Interview & Assessment Hub</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Select a global standard assessment framework. These papers include adaptive testing logic and auto-grading capabilities.</p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              type="text" 
              placeholder="Search domains (Cloud, AI, DevOps...)" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <div className="flex gap-2">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background">
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Fields' : cat}</option>)}
            </select>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background">
              {difficulties.map(d => <option key={d} value={d}>{d === 'all' ? 'All Difficulties' : d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Industry Tags:</span>
          {commonTags.map(tag => (
            <Badge key={tag} variant={selectedTag === tag ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setSelectedTag(tag)}>
              {tag === 'all' ? 'All' : tag}
            </Badge>
          ))}
        </div>
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm text-destructive">Failed to fetch from database. Showing cached/mocks ({assessments.length} available).</span>
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isRefetching}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{assessment.title}</h3>
                  <Badge variant="outline" className="text-[10px]">{assessment.category || assessment.domain}</Badge>
                </div>
                <Badge className={getDifficultyColor(assessment.difficulty || '')}>{assessment.difficulty}</Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{assessment.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-4 border-t border-b py-4 border-border/50">
                <div className="text-center"><Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" /><div className="text-xs font-semibold">{assessment.duration_minutes || 60}m</div></div>
                <div className="text-center"><Award className="w-4 h-4 text-green-500 mx-auto mb-1" /><div className="text-xs font-semibold">{(assessment.passing_score || 70)}%</div></div>
                <div className="text-center"><Users className="w-4 h-4 text-purple-500 mx-auto mb-1" /><div className="text-xs font-semibold">{(assessment.total_questions || 0)} Qs</div></div>
              </div>
              <Button onClick={() => onAssessmentSelect(assessment)} className="w-full bg-primary hover:bg-primary/90" size="lg">
                Start Test Workflow <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredAssessments.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-2">No assessments match filters</h3>
          <p className="text-muted-foreground mb-4">Try clearing filters or search "Cloud", "AI", "DevOps".</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedDifficulty('all'); setSelectedTag('all'); }}>Clear All</Button>
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('Cloud')}>Cloud</Button>
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('AI')}>AI/ML</Button>
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('DevOps')}>DevOps</Button>
          </div>
        </div>
      )}
    </div>
  );
}

