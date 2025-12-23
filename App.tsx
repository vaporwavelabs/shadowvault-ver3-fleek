
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIAssistant from './components/AIAssistant';
import LiveAssistant from './components/LiveAssistant';
import Dashboard from './views/Dashboard';
import Assets from './views/Assets';
import Send from './views/Send';
import History from './views/History';
import Recovery from './views/Recovery';
import Login from './views/Login';
import Wallets from './views/Wallets';
import Swap from './views/Swap';

const App: React.FC = () => {
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('shadow_auth') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('shadow_admin') === 'true';
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const navigate = useNavigate();

  // Unified identity: Real Wallet > Admin Root > Null
  const identity = useMemo(() => {
    if (isWagmiConnected && wagmiAddress) {
      return { address: wagmiAddress, role: 'USER', isLive: true };
    }
    if (isAdmin) {
      return { address: '0xADMIN_ROOT_ENCLAVE_742d35Cc6634C0532925a3b844' as `0x${string}`, role: 'ADMIN', isLive: false };
    }
    return { address: undefined, role: 'GUEST', isLive: false };
  }, [wagmiAddress, isWagmiConnected, isAdmin]);

  const handleLogin = (admin: boolean = false) => {
    setIsAuthenticated(true);
    setIsAdmin(admin);
    localStorage.setItem('shadow_auth', 'true');
    localStorage.setItem('shadow_admin', admin ? 'true' : 'false');
    navigate('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('shadow_auth');
    localStorage.removeItem('shadow_admin');
    navigate('/login');
  };

  if (!isAuthenticated && !isWagmiConnected) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Pass identity to header for Admin Badge */}
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          onLogout={handleLogout}
          onToggleAI={() => setIsAiOpen(!isAiOpen)}
          onToggleLive={() => setIsLiveOpen(!isLiveOpen)}
          identity={identity}
        />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {isAdmin && (
               <div className="mb-6 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Protocol Root Access Enabled</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-500/50">SHADOW_OS_v2.6_ROOT</span>
               </div>
            )}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/wallets" element={<Wallets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/send" element={<Send />} />
              <Route path="/history" element={<History />} />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        <LiveAssistant isOpen={isLiveOpen} onClose={() => setIsLiveOpen(false)} />
      </div>
    </div>
  );
};

export default App;
