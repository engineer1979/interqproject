import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  email?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  status: 'open' | 'closed' | 'draft';
  created_by?: string;
  created_at: string;
  updated_at: string;
  applications?: number;
}

export interface Candidate {
  id: string;
  company_id: string;
  job_id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  current_title?: string;
  location?: string;
  status: string;
  source?: string;
  skills?: string[];
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  email?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  location?: string;
  description?: string;
}

export interface CreateJobData {
  title: string;
  department?: string;
  location?: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  status?: 'open' | 'closed' | 'draft';
}

export interface CreateCandidateData {
  full_name: string;
  email?: string;
  phone?: string;
  job_id?: string;
  current_title?: string;
  location?: string;
  source?: string;
  skills?: string[];
}

export interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalCandidates: number;
  pendingReview: number;
  interviewsScheduled: number;
  offersSent: number;
  hiresCompleted: number;
  totalEmployees: number;
  totalApplications: number;
}

// Company Service
export const companyService = {
  async getById(id: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },

  async create(data: CreateCompanyData, userId: string): Promise<Company> {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .insert({ ...data, created_by: userId })
        .select()
        .single();
      
      if (error) {
        if (error.message.includes('duplicate')) {
          throw new Error('A company with this name already exists');
        }
        throw error;
      }
      
      return company;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<CreateCompanyData>): Promise<Company> {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return company;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
};

// Job Service
export const jobService = {
  async getByCompany(companyId: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  async create(companyId: string, data: CreateJobData, userId: string): Promise<Job> {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .insert({ ...data, company_id: companyId, created_by: userId })
        .select()
        .single();
      
      if (error) throw error;
      return job;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<CreateJobData>): Promise<Job> {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return job;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  async getStats(companyId: string): Promise<{ open: number; closed: number; total: number }> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('status')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      const jobs = data || [];
      return {
        open: jobs.filter(j => j.status === 'open').length,
        closed: jobs.filter(j => j.status === 'closed').length,
        total: jobs.length
      };
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  }
};

// Candidate Service
export const candidateService = {
  async getByCompany(companyId: string): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  async getByJob(jobId: string): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching candidates for job:', error);
      throw error;
    }
  },

  async create(companyId: string, data: CreateCandidateData): Promise<Candidate> {
    try {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .insert({ ...data, company_id: companyId })
        .select()
        .single();
      
      if (error) throw error;
      return candidate;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Candidate>): Promise<Candidate> {
    try {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return candidate;
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: string): Promise<Candidate> {
    try {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return candidate;
    } catch (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }
  },

  async getStats(companyId: string): Promise<{
    total: number;
    applied: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('status')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      const candidates = data || [];
      return {
        total: candidates.length,
        applied: candidates.filter(c => c.status === 'applied').length,
        screening: candidates.filter(c => c.status === 'screening').length,
        interview: candidates.filter(c => c.status === 'interview').length,
        offer: candidates.filter(c => c.status === 'offer').length,
        hired: candidates.filter(c => c.status === 'hired').length,
        rejected: candidates.filter(c => c.status === 'rejected').length
      };
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      throw error;
    }
  }
};

// Dashboard Service
export const dashboardService = {
  async getStats(companyId: string): Promise<DashboardStats> {
    try {
      const [jobStats, candidateStats] = await Promise.all([
        jobService.getStats(companyId),
        candidateService.getStats(companyId)
      ]);

      return {
        totalJobs: jobStats.total,
        openJobs: jobStats.open,
        closedJobs: jobStats.closed,
        totalCandidates: candidateStats.total,
        pendingReview: candidateStats.applied + candidateStats.screening,
        interviewsScheduled: candidateStats.interview,
        offersSent: candidateStats.offer,
        hiresCompleted: candidateStats.hired,
        totalEmployees: 0,
        totalApplications: candidateStats.total
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getAnalytics(companyId: string): Promise<{
    applicationsTrend: Array<{ month: string; applications: number; hires: number }>;
    pipelineDistribution: Array<{ name: string; value: number; color: string }>;
    sourceDistribution: Array<{ source: string; count: number }>;
  }> {
    try {
      const candidates = await candidateService.getByCompany(companyId);
      
      const applicationsTrend = [
        { month: 'Jan', applications: 45, hires: 3 },
        { month: 'Feb', applications: 52, hires: 5 },
        { month: 'Mar', applications: 48, hires: 4 },
        { month: 'Apr', applications: 61, hires: 6 },
        { month: 'May', applications: 55, hires: 4 },
        { month: 'Jun', applications: 70, hires: 8 }
      ];

      const statusColors: Record<string, string> = {
        applied: '#06b6d4',
        screening: '#3b82f6',
        interview: '#8b5cf6',
        offer: '#ec4899',
        hired: '#10b981',
        rejected: '#ef4444'
      };

      const pipelineDistribution = Object.entries(
        candidates.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name,
        value,
        color: statusColors[name] || '#6b7280'
      }));

      const sourceDistribution = Object.entries(
        candidates.reduce((acc, c) => {
          if (c.source) {
            acc[c.source] = (acc[c.source] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>)
      ).map(([source, count]) => ({ source, count }));

      return { applicationsTrend, pipelineDistribution, sourceDistribution };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
};

// Validate URL
export function isValidUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Format location (fix typos)
export function formatLocation(location: string): string {
  if (!location) return '';
  return location
    .replace(/SanFranciso/gi, 'San Francisco')
    .replace(/NewYork/gi, 'New York')
    .replace(/LosAngeles/gi, 'Los Angeles')
    .replace(/用力一试/gi, ''); // Remove any invalid characters
}