
import React, { useState, useEffect, useRef } from 'react';
import { Course, Lesson } from '../types';
import { geminiService } from '../services/geminiService';
import Skeleton, { AcademicSkeletonBlock } from './Skeleton';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(course.lessons[0] || null);
  const [fullLessonContent, setFullLessonContent] = useState<string | null>(null);
  const [slides, setSlides] = useState<any[] | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [viewMode, setViewMode] = useState<'reading' | 'slides'>('reading');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const contentEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFullLessonContent(null);
    setSlides(null);
    setViewMode('reading');
    setProgress(0);
  }, [selectedLesson]);

  useEffect(() => {
    if (fullLessonContent && isSynthesizing) {
      contentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [fullLessonContent, isSynthesizing]);

  const initiateFullSynthesis = async () => {
    if (!selectedLesson || isSynthesizing) return;
    setIsSynthesizing(true);
    setFullLessonContent("");
    setProgress(5);
    
    try {
      const stream = geminiService.generateFullLessonStream(selectedLesson.title, selectedLesson.code, course.name);
      let acc = "";
      for await (const chunk of stream) {
        acc += chunk;
        setFullLessonContent(acc);
        setProgress(prev => Math.min(99, prev + 1));
      }
      setProgress(100);
    } catch (err) { 
      console.error(err); 
      setFullLessonContent("CRITICAL ERROR: Synthesis uplink failed. Academic data lost.");
    } finally { 
      setIsSynthesizing(false); 
    }
  };

  const generatePresentation = async () => {
    if (!selectedLesson || isGeneratingSlides) return;
    setIsGeneratingSlides(true);
    try {
      const deck = await geminiService.generateSlides(selectedLesson.title, selectedLesson.code, course.name);
      setSlides(deck);
      setViewMode('slides');
      setCurrentSlide(0);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsGeneratingSlides(false); 
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 print:bg-white print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <button onClick={onBack} className="text-cyan-400 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3 hover:text-white transition-all group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Repository Catalog
        </button>
        <div className="flex gap-4">
           {fullLessonContent && (
             <button onClick={downloadPDF} className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:bg-cyan-500 transition-all active:scale-95">
               Generate PDF Document
             </button>
           )}
           {viewMode === 'slides' ? (
             <button onClick={() => setViewMode('reading')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-all">Close Deck</button>
           ) : (
             <button onClick={generatePresentation} disabled={isGeneratingSlides} className="px-8 py-4 bg-magenta-500/10 border border-magenta-500/30 text-magenta-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-magenta-500/20 transition-all">
               {isGeneratingSlides ? 'Compiling...' : 'Presentation View'}
             </button>
           )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-80 glass-panel p-8 rounded-[3rem] border border-white/5 h-fit print:hidden sticky top-8 shadow-2xl">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">{course.name}</h2>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">UoN Secure Uplink</p>
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
            {course.lessons.map(l => (
              <button 
                key={l.id} 
                onClick={() => setSelectedLesson(l)}
                className={`w-full text-left p-6 rounded-[2rem] transition-all duration-300 group ${
                  selectedLesson?.id === l.id 
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-white shadow-lg' 
                  : 'hover:bg-white/5 text-gray-500 border border-transparent'
                }`}
              >
                <p className="text-[10px] font-black uppercase mb-2 tracking-widest">{l.code}</p>
                <p className="text-[13px] font-black uppercase tracking-tight leading-tight">{l.title}</p>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 glass-panel p-10 md:p-16 rounded-[4rem] border border-white/5 min-h-[900px] shadow-2xl relative overflow-hidden flex flex-col print:bg-white print:border-none print:shadow-none">
          {viewMode === 'slides' ? (
            isGeneratingSlides ? (
              <div className="flex-1 flex flex-col justify-center items-center p-20 space-y-12">
                 <Skeleton className="h-24 w-full rounded-3xl" variant="magenta" />
                 <div className="space-y-4 w-full">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                 </div>
                 <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                 </div>
              </div>
            ) : slides ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-16 animate-in zoom-in-95 duration-700 print:hidden">
                 <div className="w-full max-w-6xl p-20 md:p-32 bg-black/60 border border-white/10 rounded-[5rem] shadow-2xl relative">
                    <div className="absolute top-10 left-16 text-[11px] font-black text-cyan-500/40 uppercase tracking-[0.5em]">SLIDE_{currentSlide + 1}</div>
                    <h2 className="text-6xl md:text-[5rem] font-black text-white mb-20 tracking-tighter uppercase leading-[0.8]">{slides[currentSlide].title}</h2>
                    <ul className="text-left inline-block space-y-10 max-w-4xl">
                      {slides[currentSlide].points.map((p: string, i: number) => (
                        <li key={i} className="text-3xl md:text-4xl text-gray-300 flex items-start gap-8 font-medium leading-tight tracking-tight">
                          <span className="text-cyan-500 mt-3 text-2xl">⌬</span> <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-24 pt-12 border-t border-white/5 text-[11px] font-black text-gray-700 tracking-[0.4em] uppercase">
                      {slides[currentSlide].footer}
                    </div>
                 </div>
                 <div className="flex gap-14 items-center">
                    <button onClick={() => setCurrentSlide(s => Math.max(0, s-1))} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="flex gap-3">
                       {slides.map((_, i) => (
                         <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-cyan-500 w-12' : 'bg-white/10'}`}></div>
                       ))}
                    </div>
                    <button onClick={() => setCurrentSlide(s => Math.min(slides.length-1, s+1))} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                 </div>
              </div>
            ) : null
          ) : (
            <div className="flex-1 flex flex-col">
              <header className="mb-20 border-b border-white/5 pb-16 print:border-black">
                <div className="flex items-center gap-6 mb-8 print:hidden">
                   <span className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-lg">{selectedLesson?.code}</span>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span className="text-[11px] text-gray-700 font-black uppercase tracking-[0.2em]">Neural Synthesis Online</span>
                   </div>
                </div>
                <h1 className="text-7xl md:text-[8rem] font-black text-white tracking-tighter uppercase leading-[0.8] print:text-black print:text-5xl">
                  {selectedLesson?.title}
                </h1>
                
                {!fullLessonContent && !isSynthesizing && (
                  <div className="mt-20 p-12 bg-white/5 border border-white/5 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 group relative overflow-hidden print:hidden">
                    <div className="max-w-2xl relative z-10">
                      <p className="text-gray-400 text-2xl font-medium leading-relaxed italic tracking-tight">
                        "{selectedLesson?.description}"
                      </p>
                    </div>
                    <button 
                      onClick={initiateFullSynthesis} 
                      className="relative z-10 whitespace-nowrap px-16 py-8 bg-cyan-500 text-black font-black text-sm uppercase tracking-[0.5em] rounded-3xl shadow-2xl hover:-translate-y-2 transition-all active:scale-95"
                    >
                      Begin Full Synthesis
                    </button>
                  </div>
                )}
              </header>

              <div className="flex-1 relative">
                {isSynthesizing && !fullLessonContent ? (
                  <div className="animate-in fade-in duration-500">
                    <AcademicSkeletonBlock />
                    <div className="mt-20 flex flex-col items-center justify-center space-y-6">
                       <p className="text-cyan-400 font-black text-lg uppercase tracking-[0.8em] animate-pulse">Uplink: {progress}%</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none academic-article print:text-black">
                    <div className="whitespace-pre-wrap text-gray-200 text-2xl leading-[1.6] font-medium tracking-tight selection:bg-cyan-500 selection:text-black print:text-black print:text-lg">
                      {fullLessonContent || selectedLesson?.content}
                      {isSynthesizing && <span className="inline-block w-2.5 h-8 bg-cyan-500 ml-2 animate-pulse"></span>}
                    </div>
                    <div ref={contentEndRef} className="h-40" />
                  </div>
                )}
              </div>

              {fullLessonContent && !isSynthesizing && (
                <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 print:hidden">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 text-4xl">✓</div>
                    <div className="space-y-2">
                      <p className="text-white font-black text-xl uppercase tracking-widest">Document Compiled</p>
                      <p className="text-gray-600 text-[11px] font-black uppercase tracking-[0.4em]">Ready for Peer Review | Archive ID: {Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <button onClick={downloadPDF} className="px-12 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-cyan-500 transition-all">Download PDF</button>
                    <button onClick={generatePresentation} className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-all">Slides</button>
                  </div>
                </footer>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
