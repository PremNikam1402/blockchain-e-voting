import React, { useState } from "react";
import { X, Activity, CheckCircle2, Shield, Search, ExternalLink, Hash, Clock, Cpu } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function AuditLedgerModal({ onClose }) {
  const { recentTransactions, contractAddress } = useWeb3();
  const [filterType, setFilterType] = useState("all");
  const [query, setQuery] = useState("");

  const defaultMockLogs = [
    {
      hash: "0x7a83b928ecf19028eab7682910fae77c823901bca2847582b1928374aef00192",
      type: "VoteCast",
      title: "Vote Cast in Election #1 (Web3 Board)",
      timestamp: "10 mins ago",
      from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      blockNumber: 483129,
    },
    {
      hash: "0x89201bcde8291029384756102938475610293847561029384756102938475610",
      type: "VoterRegistered",
      title: "Batch Registration (4 Voters)",
      timestamp: "25 mins ago",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      blockNumber: 483120,
    },
    {
      hash: "0x3344556677889900aabbccddeeff0011223344556677889900aabbccddeeff00",
      type: "ElectionCreated",
      title: "Created: Metropolitan University Council",
      timestamp: "1 hour ago",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      blockNumber: 483015,
    },
    {
      hash: "0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddeeff",
      type: "ElectionCreated",
      title: "Created: 2026 Web3 Foundation Board",
      timestamp: "2 hours ago",
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      blockNumber: 482910,
    }
  ];

  const allLogs = [...recentTransactions, ...defaultMockLogs];

  const filteredLogs = allLogs.filter((log) => {
    const matchesType = filterType === "all" || log.type === filterType;
    const matchesQuery =
      log.hash.toLowerCase().includes(query.toLowerCase()) ||
      log.from.toLowerCase().includes(query.toLowerCase()) ||
      log.title.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white leading-tight">Blockchain Audit Trail</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                  Transparent Public Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Contract: {contractAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType("VoteCast")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === "VoteCast" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              VoteCast
            </button>
            <button
              onClick={() => setFilterType("ElectionCreated")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === "ElectionCreated" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              ElectionCreated
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search hash or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Log list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredLogs.map((log, idx) => (
            <div
              key={log.hash + idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 hover:border-slate-800 transition space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    log.type === "VoteCast"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : log.type === "ElectionCreated"
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                      : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-xs font-bold text-white">{log.title}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div>
                  <span className="text-slate-600">Tx Hash: </span>
                  <span className="text-indigo-300 truncate inline-block max-w-[200px] align-bottom">
                    {log.hash}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-slate-600">Caller: </span>
                  <span className="text-slate-300">
                    {log.from.slice(0, 8)}...{log.from.slice(-6)}
                  </span>
                  <span className="ml-2 text-slate-600">Block: </span>
                  <span className="text-emerald-400 font-bold">#{log.blockNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Consensus Proof: SHA3 Keccak256 State Tree</span>
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
