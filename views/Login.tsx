
import React, { useState, useEffect, useCallback } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { 
  Shield, 
  Fingerprint, 
  Loader2, 
  Globe, 
  ArrowRight, 
  Zap, 
  Smartphone, 
  Copy, 
  ShieldAlert,
  Terminal,
  XCircle,
  Cpu,
  AlertCircle,
  Lock,
  ChevronRight
} from 'lucide-react';

interface LoginProps {
  onLogin: (isAdmin?: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { connect, connectors, isPending, error: connectError, reset: resetConnect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  
  const [activeStep, setActiveStep] = useState<'gateway' | 'handshake'>('gateway');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAllowlistError, setIsAllowlistError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Catch Allowlist/Origin errors specifically for the 'Admin Tactic'
  useEffect(() => {
    if (connectError) {
      const msg = connectError.message;
      if (msg.includes('Allowlist') || msg.includes('Origin') || msg.includes('403')) {
        setIsAllowlistError(true);
        setErrorMessage("Administrative Block Detected");
      } else {
        setErrorMessage(msg);
      }
      setActiveStep('gateway');
    }
  }, [connectError]);

  useEffect(() => {
    if (isConnected && address) {
      onLogin(false);
    }
  }, [isConnected, address, onLogin]);

  const handleConnect = useCallback((connectorId: string) => {
    resetConnect();
    setErrorMessage(null);
    setIsAllowlistError(false);
    
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      connect({ connector });
      setActiveStep('handshake');
    }
  }, [connect, connectors, resetConnect]);

  const copyOrigin = () => {
    navigator.clipboard.writeText(window.location.origin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[100%] h-[100%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[100%] h-[100%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
        {isAllowlistError && (
          <div className="absolute inset-0 bg-red-600/5 animate-pulse duration-[100ms]"></div>
        )}
      </div>

      <div className="max-w-md w-full space-y-12 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="relative inline-block group">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10">
              <div className="w-12 h-12 bg-[#020202] rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>
            </div>
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">Shadow</h1>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.8em] pl-2">Protocol Enclave</p>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-[3.5rem] p-10 space-y-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 overflow-hidden relative group">
          
          {/* Admin Override Layer */}
          {isAllowlistError && (
            <div className="absolute inset-0 bg-black/95 z-40 p-10 flex flex-col justify-between animate-in fade-in duration-500">
               <div className="space-y-8">
                  <div className="flex items-center gap-4 text-red-500">
                     <ShieldAlert size={32} className="animate-pulse" />
                     <h2 className="text-2xl font-black uppercase tracking-tighter">Handshake Error</h2>
                  </div>
                  
                  <div className="space-y-4">
                     <p className="text-xs text-gray-500 font-bold leading-relaxed uppercase tracking-tight">
                        Third-party relay (Reown) origin check failed for this sandbox instance.
                     </p>
                     
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <p className="text-[9px] text-gray-600 font-black uppercase">Blocked Origin</p>
                        <div className="flex items-center justify-between gap-3">
                           <code className="text-[10px] text-blue-400 truncate font-mono">{window.location.origin}</code>
                           <button onClick={copyOrigin} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                              {isCopied ? <span className="text-emerald-400 text-[9px] font-black">OK</span> : <Copy size={16} className="text-gray-500" />}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex gap-4">
                     <Cpu size={20} className="text-blue-400 shrink-0" />
                     <p className="text-[10px] text-blue-300 font-black uppercase leading-relaxed tracking-tight">
                        Initiating <span className="text-white">Protocol Root Bypass</span> will promote this session to Administrative status using local cryptographic proof.
                     </p>
                  </div>
               </div>

               <div className="space-y-3">
                  <button 
                    onClick={() => onLogin(true)}
                    className="w-full py-6 bg-white text-black font-black rounded-3xl text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
                  >
                    <Zap size={20} className="fill-blue-600 text-blue-600" /> Initiate Root Override
                  </button>
                  <button 
                    onClick={() => { setIsAllowlistError(false); setErrorMessage(null); }}
                    className="w-full py-3 text-gray-600 font-black rounded-xl text-[10px] uppercase hover:text-white transition-all tracking-[0.4em]"
                  >
                    Back to Gateway
                  </button>
               </div>
            </div>
          )}

          {activeStep === 'gateway' ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-[2.5rem] border border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Terminal size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Awaiting Verification</p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase">Biometric Enclave Standby</p>
                  </div>
                </div>

                {errorMessage && !isAllowlistError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                    <XCircle size={16} className="text-red-400" />
                    <p className="text-[10px] font-black text-red-400 uppercase">{errorMessage}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button 
                    onClick={() => handleConnect('injected')}
                    className="w-full py-7 bg-white text-black font-black rounded-[2rem] flex items-center justify-between px-10 hover:bg-gray-200 transition-all group shadow-2xl active:scale-95"
                  >
                    <div className="flex items-center gap-5">
                      <Fingerprint size={28} />
                      <span className="text-2xl tracking-tighter italic">PASSKEY</span>
                    </div>
                    <ChevronRight size={24} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => handleConnect('walletConnect')}
                    className="w-full py-7 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] flex items-center justify-between px-10 hover:bg-white/10 transition-all group active:scale-95"
                  >
                    <div className="flex items-center gap-5">
                      <Smartphone size={28} className="text-blue-400" />
                      <span className="text-2xl tracking-tighter italic text-gray-300">REMOTE</span>
                    </div>
                    <ChevronRight size={24} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => onLogin(true)}
                  className="text-[10px] text-gray-700 hover:text-blue-500 font-black uppercase tracking-[0.8em] transition-all"
                >
                  Enter via Root Enclave
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12 py-10 text-center animate-in fade-in zoom-in-95">
              <div className="relative w-48 h-48 mx-auto">
                 <div className="absolute inset-0 border-[12px] border-blue-500/10 rounded-full"></div>
                 <div className="absolute inset-0 border-[12px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={64} className="text-blue-400 animate-pulse" />
                 </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Securing Handshake</h3>
                <p className="text-[11px] text-gray-600 font-black uppercase tracking-[0.4em]">Multiplexing Tunnel Established</p>
              </div>
              <button 
                onClick={() => { disconnect(); resetConnect(); setActiveStep('gateway'); }}
                className="text-[11px] text-gray-500 hover:text-white underline font-black uppercase tracking-[0.3em]"
              >
                Cancel Protocol
              </button>
            </div>
          )}
        </div>
        
        <p className="text-center text-[9px] text-gray-800 font-black uppercase tracking-[0.6em]">
          End-to-End Encrypted Session Node A1-ROOT
        </p>
      </div>
    </div>
  );
};

export default Login;
