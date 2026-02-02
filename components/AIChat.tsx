
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const STORAGE_KEY = 'seleste_nano_chat_history_v2';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ search: false, maps: false, complex: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      const stream = geminiService.askAdvisorStream(userMessage, options);
      let fullModelResponse = "";
      let grounding: any[] = [];

      for await (const chunk of stream) {
        fullModelResponse = chunk.text;
        if (chunk.grounding) grounding = chunk.grounding;
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { role: 'model', text: fullModelResponse, grounding };
          return updated;
        });
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', text: "ERROR: Neural link disrupted." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
            AI <span className="neon-text-cyan">Academic</span> Advisor
          </h2>
          <p className="text-gray-400 font-medium tracking-tight">University of Nairobi | High-Intelligence Synthesis</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setOptions(o => ({ ...o, search: !o.search }))} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${options.search ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-gray-500'}`}>Search Grounding</button>
          <button onClick={() => setOptions(o => ({ ...o, maps: !o.maps }))} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${options.maps ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-gray-500'}`}>Maps Grounding</button>
          <button onClick={() => setOptions(o => ({ ...o, complex: !o.complex }))} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${options.complex ? 'bg-magenta-500 text-white shadow-[0_0_15px_rgba(255,0,255,0.5)]' : 'bg-white/5 text-gray-500'}`}>Deep Thinking</button>
          <button onClick={() => setMessages([])} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20">Purge</button>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto opacity-50">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-2xl">⌬</div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Awaiting Scholar Input...</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-6 rounded-3xl ${m.role === 'user' ? 'bg-cyan-600/10 border border-cyan-500/20 text-cyan-100' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.grounding && m.grounding.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Grounding Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {m.grounding.map((chunk, idx) => {
                        const uri = chunk.web?.uri || chunk.maps?.uri;
                        const title = chunk.web?.title || chunk.maps?.title || "Source";
                        return uri ? (
                          <a key={idx} href={uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all truncate max-w-[200px]">{title}</a>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-white/5 border border-white/10 p-4 rounded-3xl animate-pulse text-[10px] text-gray-500 uppercase font-black tracking-widest">Advisor Thinking...</div></div>}
        </div>
        <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
          <form onSubmit={handleSend} className="flex gap-4">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Engage the academic nexus..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none" />
            <button type="submit" disabled={!input.trim() || loading} className="px-8 bg-cyan-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 disabled:opacity-30">Execute</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
