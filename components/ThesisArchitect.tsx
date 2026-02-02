
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Faculty } from '../types';
import Skeleton from './Skeleton';

const ThesisArchitect: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [faculty, setFaculty] = useState<Faculty>(Faculty.SCIENCE_TECH);
  const [keywords, setKeywords] = useState('');
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setDraft(null);
    try {
      const res = await geminiService.generateThesisDraft(topic, faculty, keywords);
      setDraft(res);
    } catch (err) {
      console.error(err);
      setDraft("UPLINK FAILURE: Research architecture synthesis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 print:bg-white print:p-0">
      <header className="print:hidden">
        <div className="flex items-center gap-4 mb-6">
           <span className="px-5 py-2 bg-magenta-500/10 border border-magenta-500/30 rounded-full text-magenta-400 text-[10px] font-black tracking-[0.4em] uppercase">Post-Graduate Research Nexus</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.85]">
          Thesis <br /><span className="neon-text-magenta">Architect</span>
        </h2>
        <p className="text-gray-400 text-xl font-medium max-w-3xl leading-relaxed">
          Synthesize formal <span className="text-white">Research Proposals</span> and <span className="text-white">Dissertation Drafts</span> for the University of Nairobi postgraduate program.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start print:block">
        <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 space-y-10 shadow-2xl print:hidden">
          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.4em] ml-2">Proposed Research Topic</label>
              <textarea 
                placeholder="Ex: Optimization of CMOS Microprocessors..." 
                value={topic} onChange={e => setTopic(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 text-white text-lg focus:outline-none focus:ring-1 focus:ring-magenta-500 transition-all placeholder:text-gray-800 min-h-[160px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.4em] ml-2">Faculty</label>
                <select 
                  value={faculty} onChange={e => setFaculty(e.target.value as Faculty)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-magenta-500 appearance-none font-bold text-xs"
                >
                  {Object.values(Faculty).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.4em] ml-2">Keywords</label>
                <input 
                  type="text" placeholder="VLSI, AI, Healthcare"
                  value={keywords} onChange={e => setKeywords(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-magenta-500"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-8 bg-gradient-to-r from-magenta-600 to-magenta-400 text-white font-black text-sm uppercase tracking-[0.5em] rounded-[2.5rem] shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4"
            >
              {loading ? 'Synthesizing Architecture...' : 'Commence Proposal Synthesis'}
            </button>
          </form>
        </div>

        <div className="glass-panel p-10 md:p-16 rounded-[3.5rem] border border-white/5 min-h-[800px] flex flex-col relative overflow-hidden shadow-2xl print:bg-white print:border-none print:shadow-none">
          {loading ? (
             <div className="flex-1 flex flex-col space-y-10 animate-in fade-in duration-500">
               <Skeleton className="h-16 w-3/4" variant="magenta" />
               <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
               </div>
               <Skeleton className="h-56 w-full rounded-[2rem]" variant="magenta" />
               <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
               </div>
             </div>
          ) : draft ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-10 print:border-black">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-magenta-400 uppercase tracking-[0.4em] print:text-black">Official Synthesis Protocol</span>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest print:text-black">UoN POST-GRADUATE DRAFT</p>
                  </div>
                  <button onClick={() => window.print()} className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-magenta-500 transition-all print:hidden">
                    Generate PDF Archive
                  </button>
               </div>
               <div className="prose prose-invert max-w-none academic-article print:text-black">
                 <div className="whitespace-pre-wrap text-gray-200 font-serif text-xl leading-relaxed print:text-black print:text-sm">
                    {draft}
                 </div>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
              <div className="w-24 h-24 rounded-[3rem] bg-magenta-500/5 border border-magenta-500/10 flex items-center justify-center text-magenta-500 text-5xl font-black">⌬</div>
              <div className="space-y-4">
                <p className="text-white font-black uppercase tracking-[0.5em] text-lg">Awaiting Topic Input</p>
                <p className="text-gray-700 text-xs font-black uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
                  Provide your research objectives to initiate the High-Fidelity Synthesis Protocol.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThesisArchitect;
