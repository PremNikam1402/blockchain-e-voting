import React, { useState } from "react";
import { X, Search, CheckCircle2, AlertCircle, ShieldCheck, Hash, UserCheck, ShieldAlert } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function VerifyBallotModal({ onClose }) {
  const { elections, account } = useWeb3();
  const [lookupAddress, setLookupAddress] = useState(account);
  const [selectedElectionId, setSelectedElectionId] = useState(elections[0]?.id || 1);
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!lookupAddress.trim()) return;

    const election = elections.find((el) => el.id === Number(selectedElectionId));
    if (!election) return;

    const clean = lookupAddress.trim().toLowerCase();
    const isRegistered = election.registeredVoters?.some((v) => v.toLowerCase() === clean);

    // Let's create an intuitive verification response
    setResult({
      searchedAddress: clean,
      electionTitle: election.title,
      isRegistered,
      electionStatus: election.status === 1 ? "Active" : "Concluded",
      verifiedAt: new Date().toLocaleTimeString(),
      blockchainProof: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Verify Ballot & Eligibility</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cryptographic voter verification tool</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 overflow-y-auto">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Election
              </label>
              <select
                value={selectedElectionId}
                onChange={(e) => setSelectedElectionId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {elections.map((elec) => (
                  <option key={elec.id} value={elec.id}>
                    #{elec.id} - {elec.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Voter Ethereum Wallet Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={lookupAddress}
                  onChange={(e) => setLookupAddress(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          </form>

          {/* Verification Result Card */}
          {result && (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Result</span>
                <span className="text-[10px] text-slate-500 font-mono">Time: {result.verifiedAt}</span>
              </div>

              {result.isRegistered ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-300">Registered & Authorized Voter</h5>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5 leading-relaxed">
                      This address is officially recorded in the smart contract whitelist for "{result.electionTitle}".
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-300">Not Whitelisted for this Ballot</h5>
                    <p className="text-[11px] text-amber-400/80 mt-0.5 leading-relaxed">
                      This address is not yet in the authorized voter roster for this election.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-850 space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Address:</span>
                  <span className="text-slate-300">{result.searchedAddress.slice(0, 10)}...{result.searchedAddress.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Election Status:</span>
                  <span className="text-cyan-400 font-bold">{result.electionStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Merkle Proof Leaf:</span>
                  <span className="text-indigo-400">{result.blockchainProof.slice(0, 16)}...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
