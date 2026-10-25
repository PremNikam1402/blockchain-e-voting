import React from "react";
import { Vote, Users, ShieldCheck, CheckCircle2, Cpu } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function StatsBanner() {
  const { elections, contractAddress } = useWeb3();

  const totalElections = elections.length;
  const activeElections = elections.filter((e) => e.status === 1).length;
  const totalVotesCast = elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0);
  const totalRegisteredVoters = elections.reduce((sum, e) => sum + (e.registeredVoters?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Metric 1 */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-300 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Elections</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Vote className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">{activeElections}</span>
          <span className="text-xs text-slate-500 font-medium">of {totalElections} total</span>
        </div>
        <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>EVM Nodes Active</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-300 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ballots Cast</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">{totalVotesCast}</span>
          <span className="text-xs text-slate-500 font-medium">votes minted</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
          <span>Cryptographically verified</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-300 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Whitelisted Voters</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-slate-900">{totalRegisteredVoters}</span>
          <span className="text-xs text-slate-500 font-medium">registered</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
          <span>Sybil-resistant on-chain roster</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-300 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Smart Contract</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-xs font-mono font-bold text-indigo-600 truncate max-w-[170px]">
            {contractAddress ? `${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}` : "0x5FbDB...80aa3"}
          </span>
        </div>
        <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-500">
          <Cpu className="w-3.5 h-3.5 text-indigo-500" />
          <span>Solidity v0.8.24 • Paris EVM</span>
        </div>
      </div>

    </div>
  );
}
