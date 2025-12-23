
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Repeat, Shield, ExternalLink, Download } from 'lucide-react';

const TRANSACTIONS = [
  { id: '1', type: 'send', amount: '0.45 ETH', to: '0x742d...44e', status: 'confirmed', time: '2 hours ago', icon: <ArrowUpRight /> },
  { id: '2', type: 'receive', amount: '1,200 USDC', from: 'Shadow Bridge', status: 'confirmed', time: 'Yesterday', icon: <ArrowDownLeft /> },
  { id: '3', type: 'swap', amount: '1.2 ETH → 3,120 USDT', status: 'confirmed', time: '2 days ago', icon: <Repeat /> },
  { id: '4', type: 'recovery', amount: 'MFA Threshold Met', status: 'confirmed', time: '3 days ago', icon: <Shield /> },
  { id: '5', type: 'send', amount: '0.1 WBTC', to: '0x123...abc', status: 'failed', time: '1 week ago', icon: <ArrowUpRight /> },
];

const History: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Activity</h1>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <Download size={20} className="text-gray-400" />
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
            Clear Local Cache
          </button>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-white/10 rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                        ${tx.type === 'send' ? 'bg-white/5 text-gray-400' : 
                          tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-400' :
                          tx.type === 'recovery' ? 'bg-blue-600/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}
                      `}>
                        {tx.icon}
                      </div>
                      <div className="md:hidden">
                         <p className="font-bold capitalize">{tx.type}</p>
                         <p className="text-[10px] text-gray-500">{tx.time}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="font-bold capitalize">{tx.type}</p>
                        <p className="text-[10px] text-gray-500">{tx.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 hidden md:table-cell">
                    <p className="text-sm font-mono text-gray-400">{tx.to || tx.from || 'On-chain Event'}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold">{tx.amount}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded
                      ${tx.status === 'confirmed' ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'}
                    `}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 text-gray-600 hover:text-white transition-colors">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center py-8">
        <button className="text-sm text-gray-500 hover:text-white transition-colors">Load more transactions</button>
      </div>
    </div>
  );
};

export default History;
