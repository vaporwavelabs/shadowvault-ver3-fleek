
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Loader2, 
  Fingerprint, 
  Mail, 
  UserCheck, 
  LifeBuoy,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { RECOVERY_FACTORS } from '../constants';

const Recovery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'manage' | 'initiate'>('manage');
  const [isAddingFactor, setIsAddingFactor] = useState(false);
  const [setupStep, setSetupStep] = useState<'type' | 'verify' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Initiation state
  const [initMode, setInitMode] = useState<'guardian' | 'nft' | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [guardianInputs, setGuardianInputs] = useState(['', '', '']);
  const [nftData, setNftData] = useState({ contract: '', tokenId: '' });

  const startAddFactor = () => {
    setIsAddingFactor(true);
    setSetupStep('type');
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setSetupStep('verify');
  };

  const handleVerify = () => {
    setSetupStep('success');
    setTimeout(() => {
      setIsAddingFactor(false);
      setSelectedType(null);
    }, 2000);
  };

  const handleStartRecovery = () => {
    setIsRecovering(true);
    setTimeout(() => {
       alert("Recovery transaction broadcasted. Waiting for guardian signatures (est. 24h).");
       setIsRecovering(false);
       setViewMode('manage');
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck size={32} className={`${viewMode === 'manage' ? 'text-emerald-400' : 'text-red-400'}`} />
            {viewMode === 'manage' ? 'Recovery Management' : 'Emergency Initiation'}
          </h1>
          <p className="text-gray-400">
            {viewMode === 'manage' 
              ? 'Configure your 3-of-5 Multi-Factor on-chain recovery module.' 
              : 'Lost access? Trigger the vault recovery protocol using your proof factors.'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setViewMode(viewMode === 'manage' ? 'initiate' : 'manage')}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold
              ${viewMode === 'manage' 
                ? 'bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20' 
                : 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20'}
            `}
          >
            <LifeBuoy size={20} />
            {viewMode === 'manage' ? 'Initiate Recovery' : 'Return to Config'}
          </button>
          
          {viewMode === 'manage' && !isAddingFactor && (
            <button 
              onClick={startAddFactor}
              className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all shadow-xl shadow-white/10"
            >
              <Plus size={20} />
              Add Security Factor
            </button>
          )}
        </div>
      </div>

      {viewMode === 'initiate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
          <div className="space-y-6">
             <div className="bg-[#0d0d0d] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl">
                <h3 className="text-xl font-bold">Select Recovery Proof</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setInitMode('guardian')}
                    className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all
                      ${initMode === 'guardian' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                    `}
                   >
                      <UserCheck size={32} />
                      <span className="text-sm font-bold">Social Guardian</span>
                   </button>
                   <button 
                    onClick={() => setInitMode('nft')}
                    className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all
                      ${initMode === 'nft' ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                    `}
                   >
                      <ImageIcon size={32} />
                      <span className="text-sm font-bold">Shadow NFT</span>
                   </button>
                </div>

                {initMode === 'guardian' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <p className="text-xs text-gray-500">Provide 3 of your registered guardian addresses to trigger recovery.</p>
                    {guardianInputs.map((val, idx) => (
                      <input 
                        key={idx}
                        type="text"
                        placeholder={`Guardian Address ${idx + 1}`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-white/20 font-mono text-xs"
                        value={val}
                        onChange={(e) => {
                          const newInputs = [...guardianInputs];
                          newInputs[idx] = e.target.value;
                          setGuardianInputs(newInputs);
                        }}
                      />
                    ))}
                  </div>
                )}

                {initMode === 'nft' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <p className="text-xs text-gray-500">Provide the contract details for your Shadow Key NFT factor.</p>
                    <input 
                      type="text"
                      placeholder="Contract Address"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-white/20 font-mono text-xs"
                      value={nftData.contract}
                      onChange={(e) => setNftData({...nftData, contract: e.target.value})}
                    />
                    <input 
                      type="text"
                      placeholder="Token ID"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-white/20 font-mono text-xs"
                      value={nftData.tokenId}
                      onChange={(e) => setNftData({...nftData, tokenId: e.target.value})}
                    />
                  </div>
                )}

                <button 
                  disabled={!initMode || isRecovering}
                  onClick={handleStartRecovery}
                  className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isRecovering ? <Loader2 className="animate-spin" /> : <>Trigger Emergency Recovery <ArrowRight size={18} /></>}
                </button>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                <div className="flex items-center gap-3 text-red-400">
                   <AlertCircle size={20} />
                   <h4 className="font-bold">Recovery Policy</h4>
                </div>
                <ul className="space-y-4">
                   <li className="flex gap-3 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></div>
                      Once triggered, a 24-hour timelock begins to prevent unauthorized access.
                   </li>
                   <li className="flex gap-3 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></div>
                      Your guardians will be notified via ZK-Email proof.
                   </li>
                   <li className="flex gap-3 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></div>
                      A successful recovery resets all biometric anchors to prevent replay attacks.
                   </li>
                </ul>
             </div>
          </div>
        </div>
      ) : (
        <>
          {isAddingFactor && (
            <div className="bg-[#111] border-2 border-blue-500/30 rounded-[32px] p-8 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Setup Recovery Factor</h2>
                <button onClick={() => setIsAddingFactor(false)} className="text-gray-500 hover:text-white">Cancel</button>
              </div>

              {setupStep === 'type' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleSelectType('biometric')}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                  >
                    <Fingerprint className="mb-4 text-gray-500 group-hover:text-blue-400" size={32} />
                    <h4 className="font-bold mb-1">Passkey / Biometric</h4>
                    <p className="text-xs text-gray-500">Hardware-level secure enclave authentication.</p>
                  </button>
                  <button 
                    onClick={() => handleSelectType('email')}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                  >
                    <Mail className="mb-4 text-gray-500 group-hover:text-blue-400" size={32} />
                    <h4 className="font-bold mb-1">Email Redundancy</h4>
                    <p className="text-xs text-gray-500">A secondary email for emergency verification.</p>
                  </button>
                  <button 
                    onClick={() => handleSelectType('guardian')}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                  >
                    <UserCheck className="mb-4 text-gray-500 group-hover:text-blue-400" size={32} />
                    <h4 className="font-bold mb-1">Social Guardian</h4>
                    <p className="text-xs text-gray-500">Assign a trusted contact to approve recovery.</p>
                  </button>
                </div>
              )}

              {setupStep === 'verify' && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-blue-600/20 text-blue-400 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <Loader2 size={40} className="animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold capitalize">Verifying {selectedType}</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      Establishing the on-chain link between your Shadow Account and this security factor. This requires a small gasless transaction.
                    </p>
                  </div>
                  <button 
                    onClick={handleVerify}
                    className="px-12 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-xl"
                  >
                    Initiate Secure Handshake
                  </button>
                </div>
              )}

              {setupStep === 'success' && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold">Verification Successful</h3>
                  <p className="text-gray-500">Your Shadow Vault is now more secure.</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-2xl">
                {RECOVERY_FACTORS.map((factor) => (
                  <div key={factor.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                        ${factor.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                          factor.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-gray-500'}
                      `}>
                        {factor.icon}
                      </div>
                      <div>
                        <h4 className="font-bold flex items-center gap-2">
                          {factor.name}
                          {factor.status === 'active' && <CheckCircle2 size={14} className="text-emerald-400" />}
                        </h4>
                        <p className="text-xs text-gray-500">{factor.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded
                        ${factor.status === 'active' ? 'text-emerald-400 bg-emerald-400/5' : 
                          factor.status === 'pending' ? 'text-amber-400 bg-amber-400/5' : 'text-gray-500 bg-white/5'}
                      `}>
                        {factor.status}
                      </span>
                      <button className="p-2 text-gray-600 hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-blue-400" />
                  <h3 className="font-bold">Account Integrity</h3>
                </div>
                <div className="relative h-48 flex items-center justify-center">
                  <svg className="w-40 h-40 rotate-[-90deg]">
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="transparent" 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeWidth="12" 
                    />
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="transparent" 
                      stroke="#3b82f6" 
                      strokeWidth="12" 
                      strokeDasharray="440" 
                      strokeDashoffset={440 - (440 * 0.6)} 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">60%</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">3 / 5 Active</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 size={12} />
                    Smart Account Verified
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 size={12} />
                    Account Abstraction Active
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <AlertCircle size={12} />
                    Security Threshold: Low
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Recovery;
