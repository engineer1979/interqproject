import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssessments } from "@/hooks/useAssessments";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Assessment, AssessmentWithQuestions, FilterState, Role } from "@/types/assessment";
import { ArrowRight, Search, Filter, Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  role: Role;
  className?: string;
}

const AssessmentLibrary: React.FC<Props> = ({ role, className = "" }) => {
  const auth = useAuth();

  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({ search: '', category: 'All', difficulty: 'All' });

  const { data: rawAssessments = [], isLoading: queryLoading, error, refetch, isRefetching } = useAssessments();

  const assessments: AssessmentWithQuestions[] = rawAssessments.map((a: any) => ({
    ...a,
    questions: { count: a.total_questions || 0 }
  }));

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.category === 'All' || (assessment.domain || assessment.category)?.toLowerCase() === filters.category.toLowerCase()) &&
    (filters.difficulty === 'All' || assessment.difficulty?.toLowerCase() === filters.difficulty.toLowerCase())
  );

  const categories = Array.from(new Set(assessments.map(a => a.domain || a.category).filter(Boolean))).sort();
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  if (queryLoading) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Assessment Library
            <Badge variant="secondary">
              {error ? 'Offline' : filteredAssessments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>
            <Select value={filters.category} onValueChange={(v) => setFilters({...filters, category: v})}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.difficulty} onValueChange={(v) => setFilters({...filters, difficulty: v})}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(diff => (
                  <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm text-destructive">Using cached data ({assessments.length} assessments)</span>
              <Button variant="ghost" size="sm" onClick={() => refetch?.()} disabled={isRefetching}>
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefetching ? 'animate-spin' : ''}`} />
                Retry
              </Button>
            </div>
          )}

          {/* Assessments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No assessments match your filters</p>
                <Button variant="outline" onClick={() => setFilters({search: '', category: 'All', difficulty: 'All'})}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate(`/assessment/${assessment.id}`)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <Badge variant="outline">{assessment.domain || 'General'}</Badge>
                        <Badge>{assessment.difficulty || 'mixed'}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {(assessment.questions?.count ?? 0)} Qs
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-lg mb-2">{assessment.title}</h3>
                    <Button className="w-full mt-auto group-hover:bg-primary" variant="outline">
                      {role === 'jobseeker' ? 'Take Assessment' : 'View Details'}
                      <Play className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentLibrary;

