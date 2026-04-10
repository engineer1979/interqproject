import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleAdmin() {
  const [stats, setStats] = useState({ companies: 0, jobs: 0, assessments: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const compData = localStorage.getItem('companyData');
    const jobsData = localStorage.getItem('companyJobs');
    
    setStats({
      companies: compData ? 1 : 0,
      jobs: jobsData ? JSON.parse(jobsData).length : 0,
      assessments: 0
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-black">A</div>
          <h1 className="text-xl font-black italic tracking-tighter">ADMIN TERMINAL</h1>
        </div>
        <button onClick={() => navigate('/signup')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">ABORT SESSION</button>
      </header>

      <main className="p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
             <div className="text-4xl font-black text-blue-400 mb-2">{stats.companies}</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Companies</div>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
             <div className="text-4xl font-black text-emerald-400 mb-2">{stats.jobs}</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Job Inventory</div>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
             <div className="text-4xl font-black text-purple-400 mb-2">0</div>
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assessments Verified</div>
          </div>
        </div>

        <section className="bg-slate-800/30 rounded-3xl p-10 border border-slate-800">
          <h2 className="text-2xl font-black mb-8 border-b border-slate-800 pb-4">Platform Overview</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="font-bold">InterQ Platform Status</span>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-500">Normal</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-400">Database Integrity</span>
                <span className="text-[10px] font-black uppercase text-blue-500">Secure</span>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
