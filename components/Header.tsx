
import React, { useState } from 'react';
import { useAccount, useDisconnect, useChainId, useSwitchChain, useConnect } from 'wagmi';
import { ChevronDown, Moon, Sun, Power, MessageSquare, Zap, ShieldAlert, Wallet } from 'lucide-react';
import { CHAINS } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onLogout: () => void;
  onToggleAI: () => void;
  onToggleLive: () => void;
  identity?: { address?: string; role: string; isLive: boolean };
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, onLogout, onToggleAI, onToggleLive, identity }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showChains, setShowChains] = useState(false);

  const activeChain = CHAINS.find(c => c.id === currentChainId) || CHAINS[0];

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const displayAddress = identity?.address || (isConnected && address ? address : '');

  // Find the WalletConnect connector specifically
  const handleConnectWallet = () => {
    const connector = connectors.find((c) => c.id === 'walletConnect');
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-3xl sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowChains(!showChains)}
            className="flex items-center gap-4 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${activeChain.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}></div>
            <span className="text-xs font-black uppercase tracking-widest">{activeChain.name}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showChains ? 'rotate-180' : ''}`} />
          </button>

          {showChains && (
            <div className="absolute top-full left-0 mt-3 w-56 bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden py-3 z-50 animate-in fade-in slide-in-from-top-3">
              {CHAINS.map(chain => (
                <button
                  key={chain.id}
                  onClick={() => {
                    switchChain({ chainId: chain.id });
                    setShowChains(false);
                  }}
                  className="w-full text-left px-5 py-4 hover:bg-white/5 flex items-center gap-4 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${chain.color}`}></div>
                  <span className="text-sm font-bold">{chain.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {identity?.role === 'ADMIN' && (
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <ShieldAlert size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Root Access</span>
           </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {!isConnected && (
          <button 
            onClick={handleConnectWallet}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 group"
          >
            <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
            Connect Wallet
          </button>
        )}

        <button 
          onClick={onToggleLive}
          className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-2xl transition-all flex items-center gap-3 group"
        >
          <Zap size={20} className="group-hover:animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden xl:block">Voice Node</span>
        </button>

        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 text-gray-500 hover:text-white transition-colors">
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        
        <button onClick={onToggleAI} className="p-3 text-gray-500 hover:text-white transition-colors relative">
          <MessageSquare size={22} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]"></span>
        </button>

        <div className="h-8 w-px bg-white/5 mx-2"></div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl pl-5 pr-2 py-2">
          <span className="text-xs font-mono font-bold text-gray-500">
            {displayAddress ? truncateAddress(displayAddress) : 'No Identity'}
          </span>
          <button 
            onClick={onLogout}
            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
          >
            <Power size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
