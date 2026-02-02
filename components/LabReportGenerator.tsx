
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import Skeleton from './Skeleton';

const LabReportGenerator: React.FC = () => {
  const [formData, setFormData] = useState({ code: '', name: '', reg: '' });
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.reg) return;
    setLoading(true);
    setReport(null);
    try {
      const res = await geminiService.generateLabReport(formData.code, formData.name, formData.reg);
      setReport(res);
    } catch (err) { 
      console.error(err); 
      setReport("ERROR: Synthesis disrupted. Verify credentials.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 print:bg-white print:p-0">
      <header className="print:hidden">
        <div className="flex items-center gap-4 mb-4">
           <span className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase">Department of Physics</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
          Lab <span className="neon-text-cyan">Report</span> <br />Synthesis
        </h2>
        <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
          Standardized automated reports for the <span className="text-white">UoN Laboratory Protocol</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start print:block">
        <div className="glass-panel p-10 rounded-[3rem] border border-white/5 space-y-10 print:hidden shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-2">Experiment ID</label>
              <input 
                type="text" placeholder="e.g. A-1" 
                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-800"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-2">Full Name</label>
              <input 
                type="text" placeholder="Scholar Name" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-800"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] ml-2">Reg Number</label>
              <input 
                type="text" placeholder="e.g. S13/1234/2024" 
                value={formData.reg} onChange={e => setFormData({...formData, reg: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-800"
              />
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full py-7 bg-white text-black font-black text-sm uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:bg-cyan-500 transition-all active:scale-95 disabled:opacity-30"
            >
              {loading ? 'Synthesizing Report...' : 'Generate Academic Report'}
            </button>
          </form>
        </div>

        <div className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5 min-h-[700px] flex flex-col relative overflow-hidden shadow-2xl print:bg-white print:p-0 print:border-none">
          {loading ? (
             <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
               <Skeleton className="h-10 w-2/3" variant="cyan" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-5/6" />
               <div className="py-4">
                  <Skeleton className="h-40 w-full" variant="cyan" />
               </div>
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-11/12" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-4/5" />
             </div>
          ) : report ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8 print:border-black">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] print:text-black">Official Synthesis Protocol</span>
                    <p className="text-gray-600 text-[9px] font-mono print:text-black">REPORT_ID: {Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
                  </div>
                  <button onClick={() => window.print()} className="px-6 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all print:hidden">
                    Generate PDF
                  </button>
               </div>
               <div className="prose prose-invert max-w-none academic-article print:text-black">
                 <div className="whitespace-pre-wrap text-gray-300 font-serif text-lg leading-relaxed print:text-black print:text-sm">
                    {report}
                 </div>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-gray-800 text-5xl font-black">⌬</div>
              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed">
                Awaiting credentials to initiate laboratory synthesis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReportGenerator;
