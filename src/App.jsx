import React, { useState } from "react";
import Navbar from "./components/Navbar";
import StatsBanner from "./components/StatsBanner";
import ElectionList from "./components/ElectionList";
import VotingStationModal from "./components/VotingStationModal";
import ResultsModal from "./components/ResultsModal";
import AdminPanelModal from "./components/AdminPanelModal";
import AuditLedgerModal from "./components/AuditLedgerModal";
import VerifyBallotModal from "./components/VerifyBallotModal";
import Toast from "./components/Toast";
import { Vote, Shield, CheckCircle2, Lock, Cpu, Globe, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { useWeb3 } from "./context/Web3Context";

export default function App() {
  const { isDemoMode, account, isAdmin } = useWeb3();
  const [selectedVotingElection, setSelectedVotingElection] = useState(null);
  const [selectedResultsElection, setSelectedResultsElection] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Alert */}
      <Toast />

      {/* Top Navbar */}
      <Navbar
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenAudit={() => setShowAuditModal(true)}
        onOpenVerify={() => setShowVerifyModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/70 border border-slate-200/90 p-8 sm:p-10 shadow-lg shadow-indigo-100/40">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Cryptographically Secured on EVM • Zero Fraud Potential</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Decentralized, Transparent & <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Tamper-Proof</span> E-Voting.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              ElectraChain executes every ballot casting as an immutable smart contract transaction on Ethereum. With automated double-voting prevention, cryptographically signed receipts, and full public audit trails.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAuditModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 shadow-sm transition flex items-center space-x-2"
              >
                <span>Live Audit Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
              </button>

              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 shadow-sm transition flex items-center space-x-2"
              >
                <span>Check Voter Eligibility</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center space-x-2"
                >
                  <span>Launch New Election</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Global Blockchain Metrics Banner */}
        <StatsBanner />

        {/* Elections Marketplace / List */}
        <ElectionList
          onSelectVote={(election) => setSelectedVotingElection(election)}
          onSelectResults={(election) => setSelectedResultsElection(election)}
          onOpenAdmin={() => setShowAdminModal(true)}
        />

      </main>

      {/* Modals */}
      {selectedVotingElection && (
        <VotingStationModal
          election={selectedVotingElection}
          onClose={() => setSelectedVotingElection(null)}
          onOpenResults={(election) => {
            setSelectedVotingElection(null);
            setSelectedResultsElection(election);
          }}
        />
      )}

      {selectedResultsElection && (
        <ResultsModal
          election={selectedResultsElection}
          onClose={() => setSelectedResultsElection(null)}
        />
      )}

      {showAdminModal && (
        <AdminPanelModal onClose={() => setShowAdminModal(false)} />
      )}

      {showAuditModal && (
        <AuditLedgerModal onClose={() => setShowAuditModal(false)} />
      )}

      {showVerifyModal && (
        <VerifyBallotModal onClose={() => setShowVerifyModal(false)} />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">
              E
            </div>
            <span className="font-bold text-slate-700">ElectraChain Protocol</span>
            <span>— Decentralized Autonomous Voting Infrastructure</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-slate-700">Local EVM 31337 Ready</span>
            </span>
            <span>•</span>
            <span>Solidity 0.8.24</span>
            <span>•</span>
            <span>OpenZeppelin Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
