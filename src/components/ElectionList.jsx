import React, { useState } from "react";
import { Vote, BarChart3, Clock, Users, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function ElectionList({ onSelectVote, onSelectResults, onOpenAdmin }) {
  const { elections, account, getVoterStatusForCurrentAccount, isAdmin } = useWeb3();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredElections = elections.filter((elec) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && elec.status === 1) ||
      (filter === "ended" && elec.status === 2);

    const matchesSearch =
      elec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elec.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Decentralized Ballots & Elections</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse active votes, inspect candidate platforms, or cast your cryptographically signed ballot.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({elections.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "active" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Active ({elections.filter((e) => e.status === 1).length})
            </button>
            <button
              onClick={() => setFilter("ended")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === "ended" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Concluded ({elections.filter((e) => e.status === 2).length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Elections */}
      {filteredElections.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
          <Vote className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No elections match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching tabs or adjusting search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election) => {
            const voterStatus = getVoterStatusForCurrentAccount(election.id);
            const isActive = election.status === 1;

            return (
              <div
                key={election.id}
                className="glass-panel rounded-2xl p-6 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center space-x-1.5 ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}></span>
                        <span>{isActive ? "Active Voting" : "Concluded"}</span>
                      </span>

                      {election.openRegistration ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                          Open Entry
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-medium flex items-center space-x-1">
                          <Lock className="w-2.5 h-2.5 inline" />
                          <span>Whitelist Only</span>
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-slate-500">#{election.id}</span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {election.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {election.description}
                  </p>

                  {/* Candidates preview avatars */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-medium">Candidates ({election.candidates?.length || 0}):</span>
                      <span className="font-mono text-slate-300">{election.totalVotes} votes cast</span>
                    </div>

                    <div className="flex items-center -space-x-2 overflow-hidden py-1">
                      {election.candidates?.map((cand) => (
                        <img
                          key={cand.id}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                          src={cand.avatarUrl}
                          alt={cand.name}
                          title={`${cand.name} (${cand.party})`}
                        />
                      ))}
                      <div className="pl-4 text-[11px] text-slate-400 font-medium truncate">
                        {election.candidates?.map((c) => c.name.split(" ")[0]).join(", ")}
                      </div>
                    </div>
                  </div>

                  {/* Voter Status Tag for logged-in user */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    {voterStatus.hasVoted ? (
                      <div className="flex items-center justify-between text-emerald-400 font-semibold">
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Ballot Cast</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Candidate #{voterStatus.candidateId}
                        </span>
                      </div>
                    ) : voterStatus.isRegistered ? (
                      <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Authorized & Ready to Vote</span>
                      </div>
                    ) : election.openRegistration ? (
                      <div className="flex items-center space-x-1.5 text-amber-300 font-medium">
                        <Users className="w-4 h-4 shrink-0" />
                        <span>Self-Registration Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>Voter Authorization Required</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2">
                  {isActive && !voterStatus.hasVoted ? (
                    <button
                      onClick={() => onSelectVote(election)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition"
                    >
                      <Vote className="w-3.5 h-3.5" />
                      <span>{voterStatus.isRegistered ? "Cast Ballot" : "Register & Vote"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectVote(election)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View My Ballot</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectResults(election)}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center space-x-1 border border-slate-800 transition"
                    title="Live Results & Audit"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Results</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
