
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, Type, LiveServerMessage } from '@google/genai';
import { X, Mic, MicOff, Waves, Shield, Zap, AlertCircle, Loader2 } from 'lucide-react';

interface LiveAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  
  const sessionRef = useRef<any>(null);
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // PCM Encoding/Decoding Helpers
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopLive = useCallback(() => {
    if (sessionRef.current) sessionRef.current.close();
    sessionRef.current = null;
    setIsActive(false);
    setStatus('idle');
    
    // Stop all playing audio
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
  }, []);

  const startLive = async () => {
    if (isActive) {
      stopLive();
      return;
    }

    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Audio Contexts
      audioContextInputRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutputRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are the Shadow Vault Voice Core. You manage on-chain operations. Be concise, professional, and slightly futuristic. Use the vaultControl tool for sensitive operations.",
          tools: [{
            functionDeclarations: [{
              name: 'vaultControl',
              parameters: {
                type: Type.OBJECT,
                description: 'Control sensitive vault operations.',
                properties: {
                  action: { type: Type.STRING, enum: ['check_health', 'lock_vault', 'sync_rpc'], description: 'The vault action to perform.' }
                },
                required: ['action']
              }
            }]
          }]
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus('listening');

            const source = audioContextInputRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInputRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(inputData) }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInputRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              setStatus('speaking');
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              const ctx = audioContextOutputRef.current!;
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000);
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                console.log("Vault Function Call:", fc);
                const result = fc.args.action === 'lock_vault' ? "Emergency Lock Protocol Activated" : "System Health: Optimal (100%)";
                sessionPromise.then(session => session.sendToolResponse({
                  functionResponses: { id: fc.id, name: fc.name, response: { result } }
                }));
              }
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Error:", e);
            stopLive();
          },
          onclose: () => stopLive(),
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start Live AI:", err);
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="max-w-md w-full relative">
        <button 
          onClick={() => { stopLive(); onClose(); }}
          className="absolute -top-12 right-0 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-10 space-y-10 text-center shadow-2xl relative overflow-hidden">
          {/* Neural Background Animation */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className={`absolute inset-0 bg-blue-500/20 blur-[100px] transition-all duration-1000 ${status === 'speaking' ? 'scale-150' : 'scale-100'}`}></div>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-center gap-2">
              <Zap size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Quantum Live Bridge</span>
            </div>
            <h2 className="text-3xl font-black text-white">Voice Core</h2>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center relative transition-all duration-500
              ${status === 'speaking' ? 'bg-blue-600/20 scale-110 shadow-[0_0_50px_rgba(37,99,235,0.3)]' : 
                status === 'listening' ? 'bg-emerald-600/10' : 'bg-white/5'}
            `}>
              {/* Visualizer Waves */}
              {status === 'speaking' && (
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-1 bg-blue-400 rounded-full animate-pulse`} style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 100}ms` }}></div>
                  ))}
                </div>
              )}
              {status === 'listening' && <Waves size={40} className="text-emerald-400 animate-pulse" />}
              {status === 'idle' && <Shield size={40} className="text-gray-600" />}
            </div>

            <div className="space-y-2">
              <p className={`text-sm font-bold transition-colors ${status === 'speaking' ? 'text-blue-400' : 'text-gray-400'}`}>
                {isConnecting ? 'Establishing Cryptographic Link...' : 
                 status === 'speaking' ? 'Shadow Core is transmitting...' : 
                 status === 'listening' ? 'Listening for voice commands...' : 
                 'Bridge Standby'}
              </p>
              <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                {isActive ? 'Encrypted Stream: Active' : 'Encryption Key Required'}
              </p>
            </div>
          </div>

          <div className="pt-4 relative z-10">
            <button 
              onClick={startLive}
              disabled={isConnecting}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all
                ${isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white text-black hover:bg-gray-200'}
              `}
            >
              {isConnecting ? <Loader2 className="animate-spin" /> : isActive ? <MicOff size={20} /> : <Mic size={20} />}
              {isActive ? 'Disconnect Core' : 'Initialize Voice Link'}
            </button>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left flex gap-3 relative z-10">
             <AlertCircle size={16} className="text-gray-500 mt-0.5 shrink-0" />
             <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tighter">
               Try: "Shadow Core, status report" or "Check vault security health".
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
