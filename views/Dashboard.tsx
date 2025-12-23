
import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ArrowUpRight, ArrowDownLeft, Shield, CheckCircle, AlertTriangle, Info, Zap, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: 'Mon', value: 4200 },
  { name: 'Tue', value: 4398 },
  { name: 'Wed', value: 4800 },
  { name: 'Thu', value: 5908 },
  { name: 'Fri', value: 6800 },
  { name: 'Sat', value: 7800 },
  { name: 'Sun', value: 8245 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Balance Card */}
        <div className="flex-1 p-10 rounded-[3rem] bg-[#0d0d0d] border border-white/5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
               <div className="space-y-1">
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global Portfolio</p>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Real-time RPC Sync</span>
                 </div>
               </div>
               <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                  <Globe size={12} className="text-blue-400" />
                  <span className="text-[10px] font-mono text-gray-400">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
               </div>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white">
              {balance ? `${balance.formatted.slice(0, 8)} ${balance.symbol}` : '---'}
            </h1>
          </div>

          <div className="mt-12 flex gap-4 relative z-10">
            <button 
              onClick={() => navigate('/send')}
              className="flex-1 bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-xl active:scale-95"
            >
              <ArrowUpRight size={20} />
              SEND
            </button>
            <button className="flex-1 bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
              <ArrowDownLeft size={20} />
              RECEIVE
            </button>
          </div>
        </div>

        {/* Security Health Mini-Panel */}
        <div className="w-full xl:w-[400px] p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 space-y-8 flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white flex items-center gap-3">
                <Shield size={20} className="text-blue-400" />
                VAULT HEALTH
              </h3>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                <CheckCircle size={12} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Secured</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-xs text-gray-400 font-bold">MFA THRESHOLD</p>
                <p className="text-sm font-black text-blue-400">3 / 5 FACTORS</p>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div className="w-3/5 h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md">
             <div className="flex gap-4 items-start">
               <Info size={18} className="text-gray-500 mt-1 shrink-0" />
               <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                 Your <span className="text-white font-bold">Biometric Passkey</span> is registered as your primary identity anchor on {balance?.symbol === 'ETH' ? 'Mainnet' : 'Current Chain'}.
               </p>
             </div>
          </div>

          <button 
            onClick={() => navigate('/recovery')}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            MANAGE RECOVERY
          </button>
        </div>
      </div>

      {/* Stats and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <CheckCircle size={24} className="text-emerald-400" />
            LIVE VERIFICATIONS
          </h2>
          <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Shield size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Smart Account Sync</p>
                <p className="text-xs text-gray-500">ERC-4337 compatibility confirmed</p>
              </div>
              <span className="ml-auto text-[10px] text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-1 rounded">SYNCED</span>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Zap size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Gasless Paymaster</p>
                <p className="text-xs text-gray-500">Abstracted fees active via Shadow Node</p>
              </div>
              <span className="ml-auto text-[10px] text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-1 rounded">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Growth Metrics</h2>
          <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-8 h-[280px] shadow-xl">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} fontWeight="bold" />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
