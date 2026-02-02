
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const LiveLounge: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    if (isActive) return;
    setIsActive(true);
    setMessages(["Connecting to Seleste Live Neural Hub..."]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setMessages(p => [...p, "Uplink Active. Speak now."]);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({
              media: { data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))), mimeType: 'audio/pcm;rate=16000' }
            }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const buffer = await decodeAudioData(decode(audio), outputCtx, 24000, 1);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: 'You are the Seleste Live Academic Guide. Engage in helpful, high-fidelity technical conversation.'
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col justify-center items-center space-y-12 animate-in fade-in duration-700">
      <div className="relative">
        <div className={`w-64 h-64 rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${isActive ? 'border-magenta-500 scale-110 shadow-[0_0_80px_rgba(255,0,255,0.4)]' : 'border-white/5 opacity-30'}`}>
          <div className={`text-6xl font-black ${isActive ? 'text-magenta-500 animate-pulse' : 'text-gray-800'}`}>⌬</div>
          {isActive && <div className="absolute inset-[-20px] rounded-full border border-magenta-500/20 animate-ping"></div>}
        </div>
      </div>

      <div className="text-center max-w-xl space-y-6">
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Live <span className="neon-text-magenta">Neural</span> Lounge</h2>
        <p className="text-gray-500 text-sm font-medium tracking-tight">Real-time low-latency voice interaction with the academic core. Discuss complex microprocessor concepts orally.</p>
        
        <div className="flex justify-center gap-6">
          {!isActive ? (
            <button onClick={startSession} className="px-12 py-6 bg-magenta-500 text-white font-black uppercase tracking-[0.4em] rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Engage Link</button>
          ) : (
            <button onClick={stopSession} className="px-12 py-6 bg-white/10 border border-white/20 text-white font-black uppercase tracking-[0.4em] rounded-3xl">Disconnect</button>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2">Protocol Log:</p>
          <div className="text-[11px] text-magenta-400 font-bold uppercase tracking-tight leading-relaxed">{messages[messages.length - 1]}</div>
        </div>
      )}
    </div>
  );
};

export default LiveLounge;
