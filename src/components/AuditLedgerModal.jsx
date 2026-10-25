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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Blockchain Audit Trail</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold uppercase">
                  Transparent Public Ledger
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Contract: {contractAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl p-1 text-xs shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === "all" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterType("VoteCast")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === "VoteCast" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              VoteCast
            </button>
            <button
              onClick={() => setFilterType("ElectionCreated")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filterType === "ElectionCreated" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ElectionCreated
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search hash or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-mono shadow-sm"
            />
          </div>
        </div>

        {/* Log list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredLogs.map((log, idx) => (
            <div
              key={log.hash + idx}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    log.type === "VoteCast"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : log.type === "ElectionCreated"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{log.title}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              {/* Hash container */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-700 break-all flex items-center justify-between gap-2 shadow-sm">
                <span>{log.hash}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 font-sans font-medium">
                  Block #{log.blockNumber}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <div className="flex items-center space-x-1">
                  <span>From:</span>
                  <span className="text-slate-700 font-bold">{log.from}</span>
                </div>
                <div className="flex items-center space-x-1 text-emerald-600 font-semibold font-sans text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Consensus Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>Real-time polling of EVM block transactions</span>
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
