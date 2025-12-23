
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-20 md:w-72 border-r border-white/5 flex flex-col h-screen bg-[#080808] z-20 transition-all duration-500 ease-in-out">
      <div className="p-8 mb-8 flex items-center justify-center md:justify-start gap-4">
        <div className="w-12 h-12 bg-white rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-white/10 group">
          <div className="w-6 h-6 bg-[#080808] rounded-md rotate-45 group-hover:rotate-180 transition-transform duration-700"></div>
        </div>
        <div className="hidden md:block">
          <h2 className="font-black text-2xl tracking-tighter text-white">SHADOW</h2>
          <p className="text-[10px] font-bold text-gray-600 tracking-[0.3em] -mt-1 uppercase">Vault v2.0</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-white text-black font-black shadow-xl shadow-white/5 scale-105' 
                : 'text-gray-500 hover:bg-white/5 hover:text-white'}
            `}
          >
            {/* Fix: Using function children pattern to correctly access 'isActive' in nested elements like the icon container */}
            {({ isActive }) => (
              <>
                <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="hidden md:block text-sm uppercase tracking-wider">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto mb-6">
        <div className="hidden md:block p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="space-y-1">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Core Status</p>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Encrypted Node</span>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-4 border-[#080808] bg-blue-500/20 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-4 border-[#080808] bg-white/5 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-600">+2</span>
              </div>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">3/5 MFA</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
