import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleJobSeeker() {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const jobsData = localStorage.getItem('companyJobs');
    if (jobsData) setJobs(JSON.parse(jobsData));
  }, []);

  return (
    <div className="min-h-screen bg-indigo-50/30 font-sans text-slate-900">
      <header className="p-4 bg-white border-b flex justify-between items-center px-6 shadow-sm">
        <div className="font-bold flex items-center gap-2">
          <div className="bg-indigo-600 text-white w-8 h-8 rounded flex items-center justify-center font-black">J</div>
          Candidate Portal
        </div>
        <button onClick={() => navigate('/signup')} className="text-sm font-bold text-slate-400">Sign Out</button>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">Find your next role.</h1>
          <p className="text-slate-500 font-medium">Browse verified positions from InterQ Companies.</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 px-2">Featured Jobs</h2>
          {jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">No jobs have been posted by companies yet.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xl transition-all">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{job.title}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">📍 {job.location}</span>
                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Full-time</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`Applied to ${job.title}!`)}
                  className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
                >
                  Apply Now
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
