
import React, { useState, useEffect } from 'react';
import { 
  RefreshCcw, 
  ArrowDown, 
  ChevronDown, 
  Settings2, 
  Zap, 
  Sparkles,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';
import { MOCK_TOKENS } from '../constants';
import { GoogleGenAI } from "@google/genai";

const Swap: React.FC = () => {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [fromToken, setFromToken] = useState(MOCK_TOKENS[0]);
  const [toToken, setToToken] = useState(MOCK_TOKENS[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  
  // AI Feedback state
  const [aiAnalysis, setAiAnalysis] = useState<string>('Initializing route optimization analysis...');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const exchangeRate = 2240.50; 

  const fetchAiAnalysis = async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsAiAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this swap: User is paying ${amount} ${fromToken.symbol} to receive ${toToken.symbol}. 
                      The current exchange rate is ${exchangeRate}. 
                      Determine if there is high price impact and if the "Shadow Route" is optimal. 
                      Keep response under 25 words. Be technical and reassuring.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiAnalysis(response.text || "Route optimal. Liquidity verified across Shadow Pools.");
    } catch (error) {
      setAiAnalysis("Route optimized via Base Mainnet Relay. Slippage minimized.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  useEffect(() => {
    if (payAmount && !isLoading) {
      const calculated = parseFloat(payAmount) * (fromToken.symbol === 'ETH' ? exchangeRate : 1/exchangeRate);
      setReceiveAmount(calculated.toFixed(4));
      
      const timer = setTimeout(() => fetchAiAnalysis(payAmount), 1000);
      return () => clearTimeout(timer);
    } else {
      setReceiveAmount('');
    }
  }, [payAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setPayAmount('');
    setReceiveAmount('');
  };

  const handleExecuteSwap = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Swap successful! Your vault balance will update shortly.");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-black tracking-tighter">SWAP</h1>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
        >
          <Settings2 size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 space-y-4 animate-in slide-in-from-top-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Swap Settings</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Max Slippage</span>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0'].map(val => (
                <button 
                  key={val}
                  onClick={() => setSlippage(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                    ${slippage === val ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}
                  `}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative space-y-2">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 space-y-4 group focus-within:border-blue-500/50 transition-all">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">You Pay</label>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Balance: {fromToken.amount}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-4xl font-black focus:outline-none placeholder:text-gray-800"
            />
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl transition-all">
              <img src={fromToken.icon} className="w-6 h-6 rounded-full" alt="" />
              <span className="font-bold">{fromToken.symbol}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </div>
          <div className="text-[10px] text-gray-600 font-mono">
             ≈ ${(parseFloat(payAmount || '0') * (fromToken.valueUsd / parseFloat(fromToken.amount.replace(/,/g, '')))).toLocaleString()}
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={handleSwapTokens}
            className="w-12 h-12 bg-[#0a0a0a] border-4 border-[#0a0a0a] rounded-2xl flex items-center justify-center text-blue-400 hover:text-white hover:scale-110 transition-all shadow-2xl"
          >
            <div className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <ArrowDown size={20} />
            </div>
          </button>
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 space-y-4 group">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">You Receive</label>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Balance: {toToken.amount}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="text"
              readOnly
              value={receiveAmount}
              placeholder="0.0"
              className="flex-1 bg-transparent text-4xl font-black focus:outline-none placeholder:text-gray-800"
            />
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl transition-all">
              <img src={toToken.icon} className="w-6 h-6 rounded-full" alt="" />
              <span className="font-bold">{toToken.symbol}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </div>
          <div className="text-[10px] text-gray-600 font-mono">
             1 {fromToken.symbol} = {exchangeRate.toLocaleString()} {toToken.symbol}
          </div>
        </div>
      </div>

      <div className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4 transition-all duration-500">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
          {isAiAnalyzing ? <Loader2 size={20} className="text-blue-400 animate-spin" /> : <Zap size={20} className="text-blue-400" />}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Shadow Route Optimized</p>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
              <Sparkles size={10} className="text-blue-400" />
              <span className="text-[9px] font-black text-blue-400">GEMINI AI RECO</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed min-h-[1.5rem]">
            {aiAnalysis}
          </p>
        </div>
      </div>

      <button 
        disabled={!payAmount || isLoading}
        onClick={handleExecuteSwap}
        className="w-full py-6 bg-white text-black font-black text-lg rounded-[2rem] flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-white/5"
      >
        {isLoading ? <RefreshCcw size={24} className="animate-spin" /> : <><ArrowRightLeft size={20} /> INITIATE SWAP</>}
      </button>

      <div className="flex justify-center gap-8 pt-4">
        <div className="flex flex-col items-center">
           <span className="text-[9px] font-black text-gray-600 uppercase">Provider</span>
           <span className="text-xs font-bold">Shadow Pool v2</span>
        </div>
        <div className="w-px h-8 bg-white/5"></div>
        <div className="flex flex-col items-center">
           <span className="text-[9px] font-black text-gray-600 uppercase">Price Impact</span>
           <span className="text-xs font-bold text-emerald-400">0.02%</span>
        </div>
        <div className="w-px h-8 bg-white/5"></div>
        <div className="flex flex-col items-center">
           <span className="text-[9px] font-black text-gray-600 uppercase">Network Fee</span>
           <span className="text-xs font-bold text-blue-400">$0.00</span>
        </div>
      </div>
    </div>
  );
};

export default Swap;
