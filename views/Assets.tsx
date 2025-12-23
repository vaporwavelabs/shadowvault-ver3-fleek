
import React, { useState } from 'react';
import { Search, Filter, Layers, LayoutGrid } from 'lucide-react';
import { MOCK_TOKENS } from '../constants';

const Assets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl font-bold">My Assets</h1>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('tokens')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'tokens' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Tokens
          </button>
          <button 
            onClick={() => setActiveTab('nfts')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'nfts' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            NFTs
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-white/20"
          />
          <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
        </div>
        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 text-sm font-medium hover:bg-white/10 transition-all">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {activeTab === 'tokens' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TOKENS.map((token) => (
            <div key={token.symbol} className="bg-[#0d0d0d] border border-white/10 rounded-[32px] p-6 hover:border-white/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-8">
                <img src={token.icon} alt={token.symbol} className="w-12 h-12 rounded-full p-1 bg-white" />
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-mono">{token.symbol}</p>
                  <p className="text-emerald-400 text-xs font-bold">+$12.40</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{token.name}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold">${token.valueUsd.toLocaleString()}</h3>
                  <p className="text-sm font-mono text-gray-500">{token.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-white/5 rounded-[32px] border border-white/10 overflow-hidden relative mb-3">
                <img 
                  src={`https://picsum.photos/seed/${i + 20}/400/400`} 
                  alt="NFT" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-3 bg-white text-black rounded-full scale-90 group-hover:scale-100 transition-transform">
                    <Layers size={20} />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-sm">Shadow Entity #{1024 + i}</h4>
              <p className="text-xs text-gray-500">Floor: 0.45 ETH</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assets;
