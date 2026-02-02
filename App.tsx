
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import AIStudio from './components/AIStudio';
import AIChat from './components/AIChat';
import CourseDetail from './components/CourseDetail';
import LabReportGenerator from './components/LabReportGenerator';
import ThesisArchitect from './components/ThesisArchitect';
import { AppView, Course, AcademicLevel } from './types';
import { COURSES } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <HomeDashboard 
          onExplore={() => setView('courses')} 
          onEdit={() => setView('ai-studio')} 
          onAsk={() => setView('ai-advisor')}
          onCourseClick={handleCourseClick} 
        />;
      case 'courses':
        return <CourseGrid courses={COURSES} onCourseClick={handleCourseClick} onBack={() => setView('home')} />;
      case 'course-detail':
        return selectedCourse ? <CourseDetail course={selectedCourse} onBack={() => setView('courses')} /> : <CourseGrid courses={COURSES} onCourseClick={handleCourseClick} onBack={() => setView('home')} />;
      case 'ai-studio':
        return <AIStudio />;
      case 'ai-advisor':
        return <AIChat />;
      case 'lab-reports':
        return <LabReportGenerator />;
      case 'thesis-architect':
        return <ThesisArchitect />;
      default:
        return <HomeDashboard onExplore={() => setView('courses')} onEdit={() => setView('ai-studio')} onAsk={() => setView('ai-advisor')} onCourseClick={handleCourseClick} />;
    }
  };

  return (
    <Layout activeView={view} setActiveView={setView}>
      {renderContent()}
    </Layout>
  );
};

const HomeDashboard: React.FC<{ onExplore: () => void; onEdit: () => void; onAsk: () => void; onCourseClick: (c: Course) => void }> = ({ onExplore, onEdit, onAsk, onCourseClick }) => {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      <section className="relative glass-panel rounded-[4rem] p-12 md:p-32 overflow-hidden border border-white/5 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/10 to-transparent blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 max-w-5xl">
          <div className="flex items-center gap-6 mb-12">
            <div className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[11px] font-black tracking-[0.5em] uppercase shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              EXASCALE NEXUS v3.0
            </div>
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            <div className="text-[11px] text-gray-600 font-black uppercase tracking-[0.3em]">Seleste Technologies Protocol</div>
          </div>
          <h2 className="text-7xl md:text-[10rem] font-black mb-14 leading-[0.8] tracking-tighter text-white">
            Pioneer <br />The <span className="neon-text-cyan">Future</span>
          </h2>
          <p className="text-gray-400 text-2xl md:text-3xl mb-16 leading-relaxed max-w-3xl font-medium">
            Elite academic roadmap for scholars at the <span className="text-white">University of Nairobi</span>. Fully synthesized coverage across <span className="text-white border-b-2 border-cyan-500/50">Engineering, Health, and Science</span>.
          </p>
          <div className="flex flex-wrap gap-10">
            <button onClick={onExplore} className="px-16 py-8 bg-cyan-500 text-black font-black text-base uppercase tracking-widest rounded-3xl hover:bg-cyan-400 transition-all shadow-[0_0_60px_-10px_rgba(6,182,212,0.6)] hover:-translate-y-2 active:scale-95">Access Full Repository</button>
            <button onClick={onAsk} className="px-16 py-8 bg-white/5 border border-white/10 text-white font-black text-base uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all hover:-translate-y-2 active:scale-95">Consult AI Advisor</button>
          </div>
        </div>
      </section>

      <section className="space-y-16">
        <div className="flex justify-between items-end gap-10">
          <div>
            <h3 className="text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">Global Catalog</h3>
            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Access synthesized modules from all UoN Faculties</p>
          </div>
          <button onClick={onExplore} className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-500 hover:text-white transition-colors border-b border-cyan-500/30 pb-2">View All Faculties</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COURSES.slice(0, 6).map(course => (
            <CourseCard key={course.id} course={course} onClick={() => onCourseClick(course)} />
          ))}
        </div>
      </section>
    </div>
  );
};

const CourseGrid: React.FC<{ courses: Course[]; onCourseClick: (c: Course) => void; onBack: () => void }> = ({ courses, onCourseClick, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return courses;
    return courses.filter(course => 
      course.name.toLowerCase().includes(query) ||
      course.faculty.toLowerCase().includes(query) ||
      course.level.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  return (
    <div className="space-y-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="max-w-4xl space-y-6">
          <button onClick={onBack} className="text-cyan-500 font-black uppercase text-xs tracking-[0.3em] flex items-center gap-2 hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Return to Nexus
          </button>
          <h2 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]">Degree <br />Repository</h2>
          <p className="text-gray-500 text-xl font-medium tracking-tight">Access complete curricula for over 50 programs across the University of Nairobi faculties.</p>
        </div>
        
        <div className="w-full md:w-96 relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search degrees, faculty, or level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-gray-700 transition-all shadow-inner group-hover:border-white/20"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onClick={() => onCourseClick(course)} large />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6">
          <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-gray-800 text-4xl font-black">⌬</div>
          <div className="space-y-2">
            <p className="text-white font-black text-xl uppercase tracking-widest">No matching results</p>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.3em]">Adjust your query for the neural interface</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseCard: React.FC<{ course: Course; onClick: () => void; large?: boolean }> = ({ course, onClick, large }) => (
  <div onClick={onClick} className="group cursor-pointer glass-panel rounded-[3rem] p-10 transition-all hover:-translate-y-3 border border-white/5 hover:border-cyan-500/50 shadow-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between mb-10 items-center">
      <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">{course.faculty}</div>
      <div className="text-[10px] text-gray-700 font-black uppercase tracking-widest">{course.years}YR</div>
    </div>
    <h4 className="text-2xl font-black text-white mb-6 uppercase leading-[1.1] tracking-tight group-hover:text-cyan-400 transition-colors">{course.name}</h4>
    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
       <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{course.level}</span>
       <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
       </div>
    </div>
  </div>
);

export default App;
