
import React, { useState } from 'react';
import { WalletCards, Plus, Scan, Copy, ExternalLink, ShieldCheck, MoreVertical, Search, Globe } from 'lucide-react';
import { MOCK_WALLETS, CHAINS } from '../constants';

const Wallets: React.FC = () => {
  const [wallets, setWallets] = useState(MOCK_WALLETS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleScan = () => {
    // Simulate finding a new smart account on Base
    const newWallet = {
      id: `w${wallets.length + 1}`,
      name: `Imported Account ${wallets.length}`,
      address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      balance: '$0.00',
      chain: 'Base',
      active: false
    };
    setWallets([...wallets, newWallet]);
  };

  const setActive = (id: string) => {
    setWallets(wallets.map(w => ({ ...w, active: w.id === id })));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <WalletCards size={32} className="text-blue-400" />
            Wallet Set
          </h1>
          <p className="text-gray-400">Manage all your seedless Shadow accounts in one place.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleScan}
            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all font-semibold"
          >
            <Scan size={18} />
            Scan Network
          </button>
          <button className="px-5 py-3 bg-white text-black rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all font-bold shadow-xl">
            <Plus size={18} />
            Create New
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <input 
          type="text" 
          placeholder="Search addresses or names..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-white/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {wallets.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.address.toLowerCase().includes(searchTerm.toLowerCase())).map((wallet) => (
          <div 
            key={wallet.id}
            onClick={() => setActive(wallet.id)}
            className={`relative group cursor-pointer p-6 rounded-[32px] border transition-all duration-300 overflow-hidden
              ${wallet.active ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-[#0d0d0d] border-white/10 hover:border-white/20'}
            `}
          >
            <div className="absolute top-0 right-0 p-4">
              <button className="text-gray-600 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
                  ${wallet.active ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}
                `}>
                   {wallet.active ? <ShieldCheck size={24} /> : <Globe size={24} />}
                </div>
                <div>
                  <h4 className="font-bold">{wallet.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    {wallet.address}
                    <Copy size={12} className="hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold">{wallet.balance}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                   <div className={`w-1.5 h-1.5 rounded-full ${CHAINS.find(c => c.name === wallet.chain)?.color || 'bg-gray-500'}`}></div>
                   <span className="text-[10px] font-bold text-gray-400">{wallet.chain}</span>
                </div>
              </div>

              {wallet.active && (
                <div className="pt-4 border-t border-blue-500/20 flex gap-4">
                   <button className="flex-1 py-2 bg-white text-black text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-gray-200 transition-all">
                      <ExternalLink size={14} /> Explorer
                   </button>
                   <div className="flex-1 flex items-center justify-center gap-2 text-blue-400 text-[11px] font-bold">
                      <ShieldCheck size={14} /> Active Node
                   </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600/10 to-transparent border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
         <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
            <Plus className="text-blue-400" size={32} />
         </div>
         <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Need more segregation?</h3>
            <p className="text-sm text-gray-400 max-w-xl">
              Shadow Vault supports unlimited smart accounts. Each account is independent, gasless-ready, and can have its own unique set of recovery guardians.
            </p>
         </div>
         <button className="whitespace-nowrap px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
            Learn about Account Abstraction
          </button>
      </div>
    </div>
  );
};

export default Wallets;
