
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const STORAGE_KEY = 'seleste_nano_chat_history';

const AIChat: React.FC = () => {
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load chat history", e);
      return [];
    }
  });
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newUserMessage: ChatMessage = { role: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    setLoading(true);

    try {
      // Add a placeholder message for the model that we'll fill with chunks
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const stream = geminiService.askQuestionStream(userMessage);
      let fullModelResponse = "";

      for await (const chunk of stream) {
        fullModelResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].role === 'model') {
            updated[lastIdx] = { ...updated[lastIdx], text: fullModelResponse };
          }
          return updated;
        });
      }
    } catch (err: any) {
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        // If the last message was the one we were streaming into, replace it with the error.
        // Otherwise, add a new error message.
        const errorMessage = "ERROR: Advisor connection lost. Please verify your neural link.";
        if (updated[lastIdx]?.role === 'model' && updated[lastIdx]?.text === "") {
          updated[lastIdx] = { role: 'model', text: errorMessage };
          return updated;
        }
        return [...prev, { role: 'model', text: errorMessage }];
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
            AI <span className="neon-text-cyan">Academic</span> Advisor
          </h2>
          <p className="text-gray-400 font-medium tracking-tight">Expert guidance on Microprocessor Technology and instrumentation.</p>
        </div>
        <button 
          onClick={clearChat}
          className="px-4 py-2 border border-white/5 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Purge Session
        </button>
      </header>

      <div className="flex-1 glass-panel rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
        {/* Chat Log */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-3xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                ⌬
              </div>
              <div className="space-y-2">
                <p className="text-white font-black uppercase tracking-widest">Uplink Established</p>
                <p className="text-gray-500 text-xs leading-relaxed tracking-tight">
                  Welcome back to the Seleste NanoSphere. I am your specialized AI advisor. 
                  Streaming interface active for real-time pedagogical synthesis.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {["Explain 8086 addressing modes", "UoN Bachelor course requirements", "Future of VLSI instrumentation"].map(q => (
                  <button 
                    key={q} 
                    onClick={() => { setInput(q); }}
                    className="p-3 text-[10px] font-black uppercase tracking-widest text-cyan-400/60 bg-white/5 border border-white/5 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[80%] p-6 rounded-3xl ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 text-cyan-100 rounded-tr-none shadow-lg' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap tracking-tight">{m.text}</p>
                {m.text === "" && m.role === 'model' && loading && (
                   <div className="flex gap-1 py-1">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                   </div>
                )}
                <div className={`mt-2 text-[8px] font-black uppercase tracking-widest ${m.role === 'user' ? 'text-cyan-500/50' : 'text-gray-600'}`}>
                  {m.role === 'user' ? 'Scholar' : 'Advisor System'}
                </div>
              </div>
            </div>
          ))}

          {loading && messages[messages.length-1]?.text !== "" && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white/5 border border-white/10 p-2 px-4 rounded-full">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-cyan-500/50 rounded-full animate-ping"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Interface */}
        <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
          <form onSubmit={handleSend} className="flex gap-4">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Query the academic advisor..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-gray-700 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="px-8 bg-cyan-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] relative overflow-hidden group"
            >
              <span className="relative z-10">Execute</span>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </form>
          <div className="mt-4 text-[8px] text-gray-700 text-center font-black uppercase tracking-[0.3em]">
            Neural Interface Active // Port 8085-Advisor // Real-Time Streaming // Storage Enabled
          </div>
        </div>

        {/* Subtle Decoration */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AIChat;
