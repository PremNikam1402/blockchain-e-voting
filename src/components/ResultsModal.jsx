import React, { useState } from "react";
import { X, Trophy, BarChart3, Users, CheckCircle2, ShieldCheck, Clock, ExternalLink } from "lucide-react";

export default function ResultsModal({ election, onClose }) {
  const [tab, setTab] = useState("tally"); // "tally" or "roster"

  if (!election) return null;

  const totalVotes = election.totalVotes || 0;
  const candidatesSorted = [...election.candidates].sort((a, b) => b.voteCount - a.voteCount);
  const leader = candidatesSorted[0];
  const isEnded = election.status === 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white leading-tight">{election.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  isEnded ? "bg-slate-800 text-slate-400" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {isEnded ? "Official Certified Results" : "Live Real-Time Tally"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Election Contract ID: #{election.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800 flex space-x-4 bg-slate-900/40">
          <button
            onClick={() => setTab("tally")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              tab === "tally"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Candidate Tallies ({totalVotes} votes)</span>
          </button>

          <button
            onClick={() => setTab("roster")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              tab === "roster"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Audited Voter Roster ({election.registeredVoters?.length || 0})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {tab === "tally" ? (
            <>
              {/* Leader Highlight Card */}
              {leader && leader.voteCount > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-900/20 to-cyan-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={leader.avatarUrl}
                        alt={leader.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/50"
                      />
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black text-xs">
                        👑
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                          {isEnded ? "Declared Winner" : "Current Leader"}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-white">{leader.name}</h4>
                      <p className="text-xs text-indigo-300">{leader.party}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">{leader.voteCount}</span>
                    <span className="text-xs text-slate-400 block font-medium">
                      {totalVotes > 0 ? ((leader.voteCount / totalVotes) * 100).toFixed(1) : 0}% of votes
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Bar Breakdown for each candidate */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Candidates Breakdown</h4>
                <div className="space-y-3">
                  {candidatesSorted.map((candidate, idx) => {
                    const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <div key={candidate.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="w-5 text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                            <img src={candidate.avatarUrl} alt={candidate.name} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <div className="text-xs font-bold text-white">{candidate.name}</div>
                              <div className="text-[10px] text-slate-400">{candidate.party}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-cyan-400">{candidate.voteCount} votes</span>
                            <span className="text-[10px] text-slate-500 block">{percentage}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Audited Voter Roster */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Whitelisted Voter Addresses</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Immutable registry of authorized wallet accounts for this election.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-indigo-400">
                  {election.registeredVoters?.length || 0} Registered
                </span>
              </div>

              {election.registeredVoters?.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No voters registered yet. Open registration or admin authorization required.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {election.registeredVoters?.map((addr, idx) => (
                    <div
                      key={addr + idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 flex items-center justify-between text-xs font-mono text-slate-300"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-600 w-6">#{idx + 1}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{addr}</span>
                      </div>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Authorized
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tamper-proof on Ethereum Virtual Machine</span>
          </div>
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
