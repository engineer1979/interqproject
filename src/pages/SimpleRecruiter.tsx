import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleRecruiter() {
  const [recruiter, setRecruiter] = useState<any>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rData = localStorage.getItem('recruiterData');
    if (!rData) {
      navigate('/signup');
    } else {
      setRecruiter(JSON.parse(rData));
      const jobs = localStorage.getItem('companyJobs');
      if (jobs) setCompanyJobs(JSON.parse(jobs));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="p-4 bg-white border-b flex justify-between items-center px-6">
        <div className="font-bold flex items-center gap-2">
          <div className="bg-emerald-600 text-white w-8 h-8 rounded flex items-center justify-center font-black">R</div>
          Recruiter Hub
        </div>
        <button onClick={() => navigate('/signup')} className="text-sm font-bold text-slate-400">Logout</button>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Hello, {recruiter?.name}!</h1>
        <p className="text-slate-500 mb-8 font-medium">You are managing hiring for InterQ Technologies.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Assigned Jobs</h2>
            <div className="space-y-4">
              {companyJobs.length === 0 ? (
                <p className="text-slate-400 italic text-sm">No jobs assigned yet.</p>
              ) : (
                companyJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-bold">{job.title}</span>
                    <button className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">View Pipeline</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Recent Candidates</h2>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">👥</div>
              <p className="text-slate-400 text-sm font-medium">No candidates have applied yet.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
