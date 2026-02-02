
import React, { useState } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleView = (view: AppView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#050508] selection:bg-cyan-500 selection:text-black">
      {/* Sidebar - Desktop */}
      <aside className="w-80 glass-panel border-r border-white/5 sticky top-0 h-screen hidden md:flex flex-col p-8 z-50">
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-2 group cursor-pointer" onClick={() => toggleView('home')}>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-magenta-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-transform group-hover:rotate-12 group-active:scale-90">
              <span className="text-black text-2xl font-black">⌬</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">SELESTE</h1>
              <p className="text-[10px] text-cyan-400 font-black tracking-[0.3em] uppercase mt-1">NanoSphere</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4 ml-4">Neural Interface</p>
          <NavItem 
            label="Nexus Dashboard" 
            isActive={activeView === 'home'} 
            onClick={() => toggleView('home')} 
            icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
          />
          <NavItem 
            label="Faculty Catalog" 
            isActive={activeView === 'courses' || activeView === 'course-detail'} 
            onClick={() => toggleView('courses')} 
            icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
          
          <div className="h-px bg-white/5 mx-4 my-6"></div>
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4 ml-4">Academic Tools</p>
          
          <NavItem 
            label="Thesis Architect" 
            isActive={activeView === 'thesis-architect'} 
            onClick={() => toggleView('thesis-architect')} 
            icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            highlight="magenta"
          />
          <NavItem 
            label="Lab Reports" 
            isActive={activeView === 'lab-reports'} 
            onClick={() => toggleView('lab-reports')} 
            icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            highlight="cyan"
          />
          <NavItem 
            label="AI Nano Studio" 
            isActive={activeView === 'ai-studio'} 
            onClick={() => toggleView('ai-studio')} 
            icon="M13 10V3L4 14h7v7l9-11h-7z" 
            highlight="blue"
          />
          <NavItem 
            label="Academic Advisor" 
            isActive={activeView === 'ai-advisor'} 
            onClick={() => toggleView('ai-advisor')} 
            icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Created By</p>
          <p className="text-[11px] text-cyan-400 font-black tracking-tight">Seleste Technologies © 2024</p>
          <p className="text-[9px] text-gray-700 mt-2 uppercase tracking-widest font-mono">v3.1.0 // NEXUS-GRID</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 glass-panel p-4 flex justify-between items-center border-b border-white/5 shadow-2xl">
          <div className="flex items-center gap-3" onClick={() => toggleView('home')}>
             <span className="text-cyan-400 text-2xl font-black">⌬</span>
             <h1 className="text-xs font-black tracking-tighter text-white uppercase leading-none">Seleste <br/>NanoSphere</h1>
          </div>
          <div className="flex gap-2">
            <button 
              className={`p-3 rounded-xl transition-all ${isMobileMenuOpen ? 'bg-cyan-500 text-black' : 'bg-cyan-500/10 text-cyan-400'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 pt-20 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
            <nav className="p-8 space-y-4">
              <NavItem label="Nexus Home" isActive={activeView === 'home'} onClick={() => toggleView('home')} icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3" />
              <NavItem label="Degrees" isActive={activeView === 'courses'} onClick={() => toggleView('courses')} icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
              <NavItem label="Thesis Architect" isActive={activeView === 'thesis-architect'} onClick={() => toggleView('thesis-architect')} icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" highlight="magenta" />
              <NavItem label="Lab Reports" isActive={activeView === 'lab-reports'} onClick={() => toggleView('lab-reports')} icon="M9 12h6m-6 4h6m2 5" highlight="cyan" />
              <NavItem label="AI Studio" isActive={activeView === 'ai-studio'} onClick={() => toggleView('ai-studio')} icon="M13 10V3L4 14h7v7l9-11" highlight="blue" />
              <NavItem label="Advisor" isActive={activeView === 'ai-advisor'} onClick={() => toggleView('ai-advisor')} icon="M8 10h.01M12 10h.01M16 10h.01" />
            </nav>
          </div>
        )}

        <div className="p-6 md:p-14 lg:p-20 max-w-[1400px] mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ label: string; isActive: boolean; onClick: () => void; icon: string; highlight?: 'cyan' | 'magenta' | 'blue' }> = ({ label, isActive, onClick, icon, highlight }) => {
  const getHighlightColor = () => {
    switch (highlight) {
      case 'cyan': return 'from-cyan-500/20 text-cyan-400 border-cyan-500 shadow-cyan-500/10';
      case 'magenta': return 'from-magenta-500/20 text-magenta-400 border-magenta-500 shadow-magenta-500/10';
      case 'blue': return 'from-blue-500/20 text-blue-400 border-blue-500 shadow-blue-500/10';
      default: return 'from-cyan-500/15 text-cyan-400 border-cyan-500 shadow-cyan-500/5';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
        isActive 
          ? `bg-gradient-to-r ${getHighlightColor()} border-l-2 shadow-lg` 
          : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
      }`}
    >
      <svg className={`w-6 h-6 transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className="font-black text-[13px] tracking-tight uppercase whitespace-nowrap">{label}</span>
      {isActive && (
        <div className="absolute right-5 w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]"></div>
      )}
    </button>
  );
};

export default Layout;
