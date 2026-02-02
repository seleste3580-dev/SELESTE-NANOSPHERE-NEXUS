
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { AIEditState, BatchAsset } from '../types';
import { PROMPT_SUGGESTIONS } from '../constants';

const AIStudio: React.FC = () => {
  const [state, setState] = useState<AIEditState>({
    assets: [],
    selectedIndex: -1,
    loading: false,
    error: null,
    prompt: '',
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Zoom and Pan State for the currently selected asset
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    "UPLINKING TO SELESTE NEURAL CORE",
    "INITIALIZING BATCH DECONSTRUCTION",
    "MAPPING MULTI-NODE CIRCUITRY",
    "SYNTHESIZING PARALLEL TOPOLOGIES",
    "RECONSTRUCTING ASSET CLUSTER",
    "FINALIZING SHIFT VISUALIZATION"
  ];

  useEffect(() => {
    let interval: any;
    let progressInterval: any;

    if (state.loading) {
      setLoadingStep(0);
      setProgress(0);

      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 2000);

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) return prev;
          const diff = 100 - prev;
          const increment = Math.random() * (diff / 15);
          return Math.min(prev + increment, 99);
        });
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [state.loading]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: "Access denied to the optical sensor (Camera)." }));
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const newAsset: BatchAsset = {
          id: Math.random().toString(36).substr(2, 9),
          original: dataUrl,
          edited: null,
          status: 'idle',
          error: null
        };
        setState(prev => ({ 
          ...prev, 
          assets: [...prev.assets, newAsset],
          selectedIndex: prev.assets.length,
          error: null 
        }));
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAssets: BatchAsset[] = [];
      let loadedCount = 0;

      // Fix: Use Array.from and explicit type casting to ensure the loop treats items as File.
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          newAssets.push({
            id: Math.random().toString(36).substr(2, 9),
            original: reader.result as string,
            edited: null,
            status: 'idle',
            error: null
          });
          loadedCount++;
          if (loadedCount === files.length) {
            setState(prev => ({ 
              ...prev, 
              assets: [...prev.assets, ...newAssets],
              selectedIndex: prev.selectedIndex === -1 ? 0 : prev.selectedIndex,
              error: null 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleEditBatch = async () => {
    if (state.assets.length === 0 || !state.prompt) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const updatedAssets = [...state.assets];
    
    // Process sequentially to respect rate limits and show individual progress
    for (let i = 0; i < updatedAssets.length; i++) {
      updatedAssets[i] = { ...updatedAssets[i], status: 'processing', error: null };
      setState(prev => ({ ...prev, assets: [...updatedAssets] }));

      try {
        const base64Data = updatedAssets[i].original.split(',')[1];
        const mimeType = updatedAssets[i].original.split(';')[0].split(':')[1];
        
        const editedBase64 = await geminiService.editImage(base64Data, state.prompt, mimeType);
        
        if (editedBase64) {
          updatedAssets[i] = { ...updatedAssets[i], edited: editedBase64, status: 'done' };
        } else {
          throw new Error("Neural synthesis failed for asset " + (i + 1));
        }
      } catch (err: any) {
        updatedAssets[i] = { ...updatedAssets[i], status: 'error', error: err.message || 'Shift protocol error.' };
      }
      setState(prev => ({ ...prev, assets: [...updatedAssets] }));
    }

    setState(prev => ({ ...prev, loading: false }));
    setProgress(100);
  };

  const resetStudio = () => {
    setState({
      assets: [],
      selectedIndex: -1,
      loading: false,
      error: null,
      prompt: '',
    });
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    stopCamera();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (state.selectedIndex === -1) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(prev * delta, 5)));
  };

  // Fixed: Corrected name from 'setIs dragging' to 'setIsDragging'
  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.selectedIndex === -1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedAsset = state.selectedIndex !== -1 ? state.assets[state.selectedIndex] : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            AI <span className="neon-text-magenta">Batch-Shift</span> Studio
          </h2>
          <p className="text-gray-400 font-medium tracking-tight">University of Nairobi | Bulk Technical Asset Processing</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-6 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isSidebarOpen 
                ? 'border-white/5 bg-white/5 text-gray-500 hover:text-white' 
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            {isSidebarOpen ? 'Maximize Workspace' : 'Interface Console'}
          </button>
          <button 
            onClick={resetStudio}
            className="px-6 py-3 border border-white/5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
          >
            Clear Batch
          </button>
        </div>
      </header>

      {state.error && (
        <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-400 text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-4">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <p>{state.error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start min-h-[700px]">
        {/* Sidebar Controls */}
        <div className={`transition-all duration-700 ease-in-out ${isSidebarOpen ? 'w-full lg:w-[40%] opacity-100' : 'w-0 opacity-0 hidden'}`}>
          <div className="glass-panel p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
            <div className="space-y-6">
              <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em]">Asset Acquisition (Batch)</label>
              
              {!isCameraActive && (
                <div className="grid grid-cols-2 gap-6">
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-white/5 rounded-3xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                    <svg className="w-10 h-10 text-gray-700 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-cyan-400">Add Assets</span>
                  </button>
                  <button onClick={startCamera} className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-white/5 rounded-3xl hover:border-magenta-500/50 hover:bg-magenta-500/5 transition-all group">
                    <svg className="w-10 h-10 text-gray-700 group-hover:text-magenta-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-magenta-400">Scan Sensor</span>
                  </button>
                </div>
              )}

              {isCameraActive && (
                <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-magenta-500/30 bg-black aspect-video shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-magenta-500/5 pointer-events-none"></div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6">
                    <button onClick={captureFrame} className="p-5 bg-magenta-600 text-white rounded-full shadow-[0_0_30px_rgba(219,39,119,0.5)] active:scale-90 transition-transform">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                    </button>
                    <button onClick={stopCamera} className="p-5 bg-black/60 text-white rounded-full backdrop-blur-xl border border-white/10">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              )}

              {state.assets.length > 0 && (
                <div className="space-y-4">
                   <div className="flex justify-between items-center px-2">
                     <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Queue: {state.assets.length} Assets</p>
                     <button onClick={() => setState(prev => ({ ...prev, assets: [], selectedIndex: -1 }))} className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-300">Purge All</button>
                   </div>
                   <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {state.assets.map((asset, idx) => (
                        <div 
                          key={asset.id} 
                          onClick={() => { setState(prev => ({ ...prev, selectedIndex: idx })); setZoom(1); setPosition({ x: 0, y: 0 }); }}
                          className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative group ${
                            state.selectedIndex === idx ? 'border-cyan-500 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border-white/5 hover:border-white/20'
                          }`}
                        >
                          <img src={asset.original} alt="Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                          {asset.status === 'processing' && <div className="absolute inset-0 bg-cyan-500/20 animate-pulse flex items-center justify-center"><div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>}
                          {asset.status === 'done' && <div className="absolute top-1 right-1 bg-green-500 text-black rounded-full p-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></div>}
                          {asset.status === 'error' && <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg></div>}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="space-y-6 relative" ref={suggestionRef}>
              <label className="block text-[10px] font-black text-magenta-500 uppercase tracking-[0.4em]">Neural Directive (Global)</label>
              <textarea
                value={state.prompt}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setState(prev => ({ ...prev, prompt: e.target.value }));
                  setShowSuggestions(true);
                }}
                placeholder="Directive applied to entire batch..."
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-white focus:outline-none focus:ring-1 focus:ring-magenta-500/50 min-h-[160px] text-base font-medium placeholder:text-gray-800 transition-all"
              />
              
              {showSuggestions && (PROMPT_SUGGESTIONS.length > 0) && (
                <div className="absolute z-50 w-full mt-3 glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 bg-white/5 border-b border-white/5">
                    <p className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2 px-2">Shift Presets</p>
                    {PROMPT_SUGGESTIONS.slice(0, 4).map((s, i) => (
                      <button key={i} onClick={() => { setState(prev => ({ ...prev, prompt: s })); setShowSuggestions(false); }} className="w-full text-left px-4 py-3 text-xs text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-xl transition-all truncate font-bold">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleEditBatch}
              disabled={state.loading || state.assets.length === 0 || !state.prompt}
              className="w-full py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.6em] transition-all duration-500 disabled:opacity-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-magenta-600 text-white shadow-2xl hover:scale-[1.02] hover:shadow-cyan-500/20 active:scale-95"
            >
              {state.loading ? 'PROCESSING BATCH...' : 'EXECUTE BATCH SHIFT'}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className={`flex-1 transition-all duration-700 min-h-[700px] ${isSidebarOpen ? 'lg:w-[60%]' : 'w-full'}`}>
          <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 h-full flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden bg-black/20">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="space-y-1">
                 <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
                   {state.selectedIndex !== -1 ? `Asset Analysis: ${state.selectedIndex + 1}/${state.assets.length}` : 'High-Fidelity Workspace'}
                 </h3>
                 {selectedAsset?.error && <p className="text-[9px] text-red-500 font-bold uppercase">{selectedAsset.error}</p>}
              </div>
              {selectedAsset?.edited && (
                <div className="flex gap-4">
                  <button onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }} className="px-4 py-2 border border-cyan-500/20 rounded-xl text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:bg-cyan-500/10 transition-all">Reset</button>
                  <a href={selectedAsset.edited} download={`seleste-asset-${state.selectedIndex + 1}.png`} className="px-4 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all">Archive</a>
                </div>
              )}
            </div>

            <div 
              className="flex-1 rounded-[2.5rem] bg-[#060608] border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-inner"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {selectedAsset ? (
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-100 cursor-grab active:cursor-grabbing"
                  style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
                >
                   <img 
                    src={selectedAsset.edited || selectedAsset.original} 
                    alt="Current Asset" 
                    className={`max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.2)] select-none pointer-events-none transition-all duration-700 ${!selectedAsset.edited ? 'grayscale blur-sm opacity-40' : ''}`} 
                   />
                </div>
              ) : state.loading ? (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center space-y-16 p-12 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500">
                   <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_#06b6d4] animate-[scan_3s_linear_infinite]"></div>
                   
                   <div className="relative w-64 h-64">
                      <div className="absolute inset-0 border-[2px] border-cyan-500/10 rounded-full"></div>
                      <div className="absolute inset-0 border-t-[3px] border-cyan-500 rounded-full animate-spin [animation-duration:1s]"></div>
                      <div className="absolute inset-4 border-[2px] border-magenta-500/10 rounded-full"></div>
                      <div className="absolute inset-4 border-b-[3px] border-magenta-500 rounded-full animate-spin [animation-duration:3s] [animation-direction:reverse]"></div>
                      <div className="absolute inset-10 border-[1px] border-white/5 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">⌬</span>
                      </div>
                   </div>

                   <div className="w-full max-w-lg space-y-8 text-center relative z-10">
                      <div className="space-y-3">
                        <p className="text-cyan-400 text-base font-black uppercase tracking-[0.8em] animate-pulse drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                          {loadingMessages[loadingStep]}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                           <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.3em]">Batch_Mode_Active // Assets_Processed: {state.assets.filter(a => a.status === 'done').length}/{state.assets.length}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-magenta-600 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between px-2">
                           <p className="text-[11px] font-black text-cyan-500/60 uppercase tracking-widest">{Math.floor(progress)}% BATCH SYNTHESIS</p>
                           <p className="text-[11px] font-black text-gray-700 uppercase tracking-widest">UoN_GRID_PROTOCOL</p>
                        </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="text-center space-y-8 px-16 opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
                   <div className="w-24 h-24 rounded-[3.5rem] bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-gray-800 text-5xl font-black">⌬</div>
                   <div className="space-y-3">
                    <p className="text-white font-black text-sm uppercase tracking-[0.6em]">Batch Interface Standby</p>
                    <p className="text-gray-700 text-[11px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                      Upload one or more assets to initiate neural processing. The directive will be applied universally.
                    </p>
                   </div>
                </div>
              )}
              
              {selectedAsset?.edited && (
                <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3 pointer-events-none group-hover:opacity-100 opacity-20 transition-opacity duration-500">
                   <div className="px-4 py-2 bg-black/90 border border-white/10 rounded-xl text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] backdrop-blur-md">
                      SCALE: {Math.round(zoom * 100)}%
                   </div>
                   <div className="px-4 py-2 bg-black/90 border border-white/10 rounded-xl text-[9px] font-bold text-gray-600 uppercase tracking-widest backdrop-blur-md">
                      Drag to Pan // Scroll to Zoom
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AIStudio;
