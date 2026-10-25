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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{election.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  isEnded ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {isEnded ? "Official Certified Results" : "Live Real-Time Tally"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Election Contract ID: #{election.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex space-x-4 bg-slate-50/40">
          <button
            onClick={() => setTab("tally")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              tab === "tally"
                ? "border-cyan-600 text-cyan-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Candidate Tallies ({totalVotes} votes)</span>
          </button>

          <button
            onClick={() => setTab("roster")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              tab === "roster"
                ? "border-cyan-600 text-cyan-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
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
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-indigo-50/40 to-cyan-50 border border-amber-200/80 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={leader.avatarUrl}
                        alt={leader.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/80"
                      />
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow font-black text-xs">
                        👑
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                          {isEnded ? "Declared Winner" : "Current Leader"}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900">{leader.name}</h4>
                      <p className="text-xs text-indigo-600 font-medium">{leader.party}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-600">{leader.voteCount}</span>
                    <span className="text-xs text-slate-500 block font-medium">
                      {totalVotes > 0 ? ((leader.voteCount / totalVotes) * 100).toFixed(1) : 0}% of votes
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Bar Breakdown for each candidate */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">All Candidates Breakdown</h4>
                <div className="space-y-3">
                  {candidatesSorted.map((candidate, idx) => {
                    const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <div key={candidate.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="w-5 text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                            <img src={candidate.avatarUrl} alt={candidate.name} className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-slate-200" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{candidate.name}</div>
                              <div className="text-[10px] text-slate-500">{candidate.party}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-cyan-700">{candidate.voteCount} votes</span>
                            <span className="text-[10px] text-slate-500 block">{percentage}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
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
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Whitelisted Voter Addresses</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Immutable registry of authorized wallet accounts for this election.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-indigo-600">
                  {election.registeredVoters?.length || 0} Registered
                </span>
              </div>

              {election.registeredVoters?.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  No voters registered yet. Open registration or admin authorization required.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {election.registeredVoters?.map((addr, idx) => (
                    <div
                      key={addr + idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-700"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 w-6">#{idx + 1}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{addr}</span>
                      </div>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tamper-proof on Ethereum Virtual Machine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition border border-slate-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
