
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import Skeleton from './Skeleton';

type MediaTab = 'video' | 'image' | 'edit' | 'analysis' | 'speech';

const MediaLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaTab>('video');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [config, setConfig] = useState({ aspectRatio: '16:9', size: '1K' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  const resetState = () => {
    setResult(null);
    setError(null);
    setStatus('');
  };

  const handleAction = async () => {
    if (!prompt.trim() && activeTab !== 'speech') {
      setError("Please provide a neural directive.");
      return;
    }
    
    setLoading(true);
    resetState();

    try {
      if (activeTab === 'video') {
        setStatus('Initializing Veo-3.1 Synthesis...');
        const url = await geminiService.generateVideo(prompt, config.aspectRatio as any, sourceImage?.split(',')[1]);
        if (!url) throw new Error("Video synthesis returned no data.");
        setResult(url);
      } else if (activeTab === 'image') {
        setStatus('Compiling Pro-Image Grid...');
        const url = await geminiService.generateProImage(prompt, { aspectRatio: config.aspectRatio, imageSize: config.size });
        if (!url) throw new Error("Image generation failed.");
        setResult(url);
      } else if (activeTab === 'edit') {
        if (!sourceImage) throw new Error("Source image required for neural shift.");
        setStatus('Applying Neural Shift Protocol...');
        const base64 = sourceImage.split(',')[1];
        const mimeType = sourceImage.split(';')[0].split(':')[1];
        const url = await geminiService.editImage(base64, prompt, mimeType);
        if (!url) throw new Error("Image edit failed.");
        setResult(url);
      } else if (activeTab === 'speech') {
        setStatus('Modulating TTS Frequency...');
        const base64 = await geminiService.generateSpeech(prompt || "Frequency test initiated.");
        if (base64) setResult(`data:audio/wav;base64,${base64}`);
        else throw new Error("Speech synthesis failed.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Uplink disrupted. Synthesis failed.");
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Full = reader.result as string;
      setSourceImage(base64Full);
      
      if (activeTab === 'analysis') {
        setLoading(true);
        resetState();
        setStatus('Analyzing Media DNA...');
        try {
          const base64 = base64Full.split(',')[1];
          const res = await geminiService.analyzeMedia(prompt || "Provide high-fidelity analysis.", base64, file.type);
          setResult(res);
        } catch (err: any) {
          setError(err.message || "Analysis failed.");
        } finally {
          setLoading(false);
          setStatus('');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <div className="flex items-center gap-4 mb-4">
           <span className="px-5 py-1.5 bg-magenta-500/10 border border-magenta-500/20 rounded-full text-magenta-400 text-[10px] font-black tracking-[0.4em] uppercase">Academic Asset Synthesis</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 leading-[0.85]">Nano <span className="neon-text-magenta">Media</span> Lab</h2>
        <p className="text-gray-400 font-medium tracking-tight text-xl max-w-3xl">
          High-performance workstation for <span className="text-white">Video Generation</span>, <span className="text-white">Pro Image Compiling</span>, and <span className="text-white">Neural Analysis</span>.
        </p>
      </header>

      <div className="flex gap-4 border-b border-white/5 pb-6 overflow-x-auto scrollbar-hide">
        {(['video', 'image', 'edit', 'analysis', 'speech'] as const).map(tab => (
          <button 
            key={tab} 
            onClick={() => { setActiveTab(tab); resetState(); setSourceImage(null); }} 
            className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-magenta-500 text-white shadow-[0_0_30px_rgba(255,0,255,0.4)] scale-105' : 'text-gray-600 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel p-12 rounded-[3.5rem] border border-white/5 space-y-10 shadow-2xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-magenta-500 uppercase tracking-[0.5em] ml-2">Neural Directive</label>
            <textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              placeholder={activeTab === 'speech' ? "Enter text for modulation..." : "Describe the asset to be synthesized..."}
              className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 text-white min-h-[160px] focus:outline-none focus:ring-1 focus:ring-magenta-500/50 text-lg font-medium transition-all" 
            />
          </div>

          {(activeTab === 'video' || activeTab === 'image' || activeTab === 'edit') && (
            <div className="space-y-8">
              {(activeTab === 'video' || activeTab === 'edit') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                    {activeTab === 'edit' ? 'Source Asset' : 'Reference Asset (Optional)'}
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group transition-all overflow-hidden relative ${
                      sourceImage ? 'border-magenta-500/50' : 'border-white/5 hover:border-magenta-500/30'
                    }`}
                  >
                    {sourceImage ? (
                      <>
                        <img src={sourceImage} className="w-full h-full object-cover" alt="Source" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Asset</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-700 group-hover:text-magenta-400 mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Upload Reference</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Aspect Ratio</label>
                  <select 
                    value={config.aspectRatio} 
                    onChange={e => setConfig({...config, aspectRatio: e.target.value})} 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-xs font-black uppercase appearance-none"
                  >
                    {['1:1', '16:9', '9:16', '3:4', '4:3', '21:9', '2:3', '3:2'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {activeTab === 'image' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Resolution</label>
                    <select 
                      value={config.size} 
                      onChange={e => setConfig({...config, size: e.target.value})} 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-xs font-black uppercase appearance-none"
                    >
                      {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analysis' ? (
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={loading}
              className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] rounded-[2.5rem] shadow-2xl hover:bg-magenta-500 hover:text-white transition-all active:scale-95 disabled:opacity-30"
            >
              Upload for Analysis
            </button>
          ) : (
            <button 
              onClick={handleAction} 
              disabled={loading} 
              className="w-full py-8 bg-magenta-500 text-white font-black uppercase tracking-[0.5em] rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-30"
            >
              {loading ? 'Synthesizing...' : 'Execute Protocol'}
            </button>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
        </div>

        <div className="glass-panel p-12 rounded-[3.5rem] border border-white/5 min-h-[600px] flex flex-col justify-center items-center relative overflow-hidden shadow-2xl">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
              <Skeleton className="w-full aspect-video rounded-[2.5rem]" variant="magenta" />
              <div className="space-y-4 text-center">
                 <p className="text-magenta-400 font-black text-sm uppercase tracking-[0.8em] animate-pulse">{status}</p>
                 <div className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] text-gray-700 uppercase tracking-widest">Neural Link Synchronized</span>
                 </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-8 animate-in zoom-in-95">
               <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                 <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <div className="space-y-2">
                 <p className="text-red-400 font-black text-xs uppercase tracking-widest">Protocol Failure</p>
                 <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">{error}</p>
               </div>
               <button onClick={resetState} className="text-[9px] font-black text-magenta-500 uppercase tracking-[0.3em] hover:text-white transition-colors">Acknowledge Error</button>
            </div>
          ) : result ? (
            <div className="w-full h-full flex flex-col animate-in zoom-in-95 duration-700">
              <div className="flex-1 flex items-center justify-center">
                {activeTab === 'video' && <video src={result} controls autoPlay className="w-full rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5" />}
                {activeTab === 'image' && <img src={result} alt="Synthesized Asset" className="max-w-full max-h-[500px] object-contain rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5" />}
                {activeTab === 'edit' && <img src={result} alt="Neural Shift" className="max-w-full max-h-[500px] object-contain rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5" />}
                {activeTab === 'speech' && (
                  <div className="w-full p-12 bg-magenta-500/5 rounded-[2.5rem] border border-magenta-500/10 flex flex-col items-center gap-10">
                    <div className="flex gap-1 items-end h-16">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="w-1.5 bg-magenta-500 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                    <audio src={result} controls autoPlay className="w-full filter invert hue-rotate-180" />
                  </div>
                )}
                {activeTab === 'analysis' && (
                  <div className="prose prose-invert max-w-none academic-article w-full">
                    <div className="p-10 bg-white/5 rounded-3xl border border-white/10 whitespace-pre-wrap text-gray-200 text-lg leading-relaxed font-medium">
                      {result}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-magenta-400 uppercase tracking-[0.4em]">Synthesis Successful</span>
                  <span className="text-[9px] text-gray-700 uppercase font-mono tracking-widest">ID_{Math.random().toString(36).substr(2, 6).toUpperCase()} // VEO_CORE_ACTIVE</span>
                </div>
                <div className="flex gap-4">
                  {activeTab !== 'analysis' && <a href={result} download={`seleste-asset-${Date.now()}.png`} className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-magenta-500 transition-all">Archive Asset</a>}
                  <button onClick={resetState} className="px-8 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Reset Console</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8 opacity-20 hover:opacity-100 transition-opacity duration-1000">
               <div className="w-24 h-24 rounded-[3rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-gray-800 text-5xl font-black shadow-inner">⌬</div>
               <div className="space-y-3">
                <p className="text-white font-black text-sm uppercase tracking-[0.8em]">Synthesis Standby</p>
                <p className="text-gray-700 text-[11px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                  Awaiting neural directive to initiate high-fidelity asset synthesis protocol.
                </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
