
import React, { useState } from 'react';
import { Send as SendIcon, QrCode, ArrowRight, User } from 'lucide-react';
import { MOCK_TOKENS } from '../constants';

const Send: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(MOCK_TOKENS[0]);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Send Assets</h1>
        <p className="text-gray-500">Securely transfer crypto to any wallet address</p>
      </div>

      <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Select Token</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MOCK_TOKENS.map(token => (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(token)}
                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2
                  ${selectedToken.symbol === token.symbol ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                `}
              >
                <img src={token.icon} className="w-6 h-6 rounded-full" alt="" />
                <span className="text-xs font-bold">{token.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Recipient Address</label>
          <div className="relative">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x... or ENS"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-white/20 font-mono text-sm"
            />
            <User className="absolute left-4 top-4 text-gray-500" size={18} />
            <button className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors">
              <QrCode size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-400">Amount</label>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Balance: {selectedToken.amount} {selectedToken.symbol}</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-4 text-3xl font-bold focus:outline-none focus:border-white/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="px-2 py-1 text-[10px] bg-white/10 rounded-md font-bold hover:bg-white/20">MAX</button>
              <span className="font-bold text-gray-400">{selectedToken.symbol}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 pl-1">≈ ${(Number(amount) * (selectedToken.valueUsd / Number(selectedToken.amount.replace(/,/g, '')))).toFixed(2)} USD</p>
        </div>

        <button 
          onClick={() => setShowConfirm(true)}
          disabled={!recipient || !amount}
          className="w-full py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Preview Transaction
          <ArrowRight size={18} />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/10 rounded-3xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-center">Confirm Send</h3>
            <div className="space-y-4 bg-white/5 p-6 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Sending</span>
                <span className="font-bold">{amount} {selectedToken.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">To</span>
                <span className="font-mono text-xs">{recipient.slice(0, 10)}...{recipient.slice(-6)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Network Fee</span>
                <span className="text-gray-400 text-sm">$2.45</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Send;
