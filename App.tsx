
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import AIStudio from './components/AIStudio';
import AIChat from './components/AIChat';
import CourseDetail from './components/CourseDetail';
import LabReportGenerator from './components/LabReportGenerator';
import ThesisArchitect from './components/ThesisArchitect';
import MediaLab from './components/MediaLab';
import LiveLounge from './components/LiveLounge';
import { AppView, Course } from './types';
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
          onMedia={() => setView('media-lab')} 
          onLive={() => setView('live-lounge')}
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
      case 'media-lab':
        return <MediaLab />;
      case 'live-lounge':
        return <LiveLounge />;
      default:
        return <HomeDashboard onExplore={() => setView('courses')} onMedia={() => setView('media-lab')} onLive={() => setView('live-lounge')} onCourseClick={handleCourseClick} />;
    }
  };

  return (
    <Layout activeView={view} setActiveView={setView}>
      {renderContent()}
    </Layout>
  );
};

const HomeDashboard: React.FC<{ onExplore: () => void; onMedia: () => void; onLive: () => void; onCourseClick: (c: Course) => void }> = ({ onExplore, onMedia, onLive, onCourseClick }) => {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      <section className="relative glass-panel rounded-[4rem] p-12 md:p-24 overflow-hidden border border-white/5 shadow-2xl">
        <div className="relative z-10 max-w-5xl">
          <div className="flex items-center gap-6 mb-12">
            <div className="px-6 py-2 bg-magenta-500/10 border border-magenta-500/30 rounded-full text-magenta-400 text-[11px] font-black tracking-[0.5em] uppercase">ULTRA NEXUS v3.2</div>
          </div>
          <h2 className="text-7xl md:text-[9rem] font-black mb-14 leading-[0.8] tracking-tighter text-white">Academic <br /><span className="neon-text-magenta">Ultra-Core</span></h2>
          <p className="text-gray-400 text-2xl mb-16 max-w-3xl">High-fidelity pedagogical synthesis for the University of Nairobi. Now featuring <span className="text-white">Live Voice</span> and <span className="text-white">Veo Video Synthesis</span>.</p>
          <div className="flex flex-wrap gap-8">
            <button onClick={onExplore} className="px-12 py-6 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-magenta-500 transition-all">Explore Degrees</button>
            <button onClick={onMedia} className="px-12 py-6 bg-magenta-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl">Media Synthesis</button>
            <button onClick={onLive} className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-2xl">Live Lounge</button>
          </div>
        </div>
      </section>

      <section className="space-y-16">
        <div className="flex justify-between items-end">
          <h3 className="text-5xl font-black text-white tracking-tighter uppercase">Recent Modules</h3>
          <button onClick={onExplore} className="text-[11px] font-black uppercase tracking-[0.4em] text-magenta-400 border-b border-magenta-500/30 pb-2">Catalog Interface</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COURSES.slice(0, 3).map(course => (
            <div key={course.id} onClick={() => onCourseClick(course)} className="glass-panel p-10 rounded-[3rem] cursor-pointer hover:border-magenta-500/50 transition-all">
               <h4 className="text-xl font-black text-white uppercase mb-4">{course.name}</h4>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{course.faculty}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const CourseGrid: React.FC<{ courses: Course[]; onCourseClick: (c: Course) => void; onBack: () => void }> = ({ courses, onCourseClick, onBack }) => {
  return (
    <div className="space-y-20">
      <header className="space-y-6">
        <button onClick={onBack} className="text-cyan-500 font-black uppercase text-xs tracking-[0.3em]">Return home</button>
        <h2 className="text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">Faculty <br />Catalog</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {courses.map(course => (
          <div key={course.id} onClick={() => onCourseClick(course)} className="glass-panel p-10 rounded-[3rem] cursor-pointer hover:border-cyan-500/50 transition-all">
             <h4 className="text-xl font-black text-white uppercase mb-4">{course.name}</h4>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{course.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
