import React, { useState } from "react";
import { X, Vote, Check, ShieldCheck, AlertCircle, ExternalLink, Copy, CheckCircle2, Award, UserCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useWeb3 } from "../context/Web3Context";

export default function VotingStationModal({ election, onClose, onOpenResults }) {
  const { account, getVoterStatusForCurrentAccount, castVote, selfRegister, loading, showToast } = useWeb3();
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [confirmStep, setConfirmStep] = useState(false);
  const [justVotedReceipt, setJustVotedReceipt] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!election) return null;

  const voterStatus = getVoterStatusForCurrentAccount(election.id);
  const isActive = election.status === 1;

  const handleCastVote = async () => {
    if (!selectedCandidateId) return;
    try {
      const receipt = await castVote(election.id, selectedCandidateId);
      setJustVotedReceipt(receipt);
      setConfirmStep(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // toast shown in context
    }
  };

  const handleSelfRegister = async () => {
    try {
      await selfRegister(election.id);
    } catch (err) {
      // toast shown in context
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    showToast("info", "Copied", "Hash copied to clipboard");
  };

  const activeCandidate = election.candidates.find((c) => c.id === (justVotedReceipt ? selectedCandidateId : voterStatus.candidateId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{election.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  #{election.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">Official Smart Contract Ballot Box</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Voter Eligibility Notice Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500">Your Connected Wallet:</span>
                <span className="text-xs font-mono text-indigo-600 font-bold">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-2 text-xs">
                {voterStatus.hasVoted || justVotedReceipt ? (
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 inline text-emerald-600" />
                    <span>Ballot Status: Voted & Mined</span>
                  </span>
                ) : voterStatus.isRegistered ? (
                  <span className="text-cyan-700 font-semibold flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 inline text-cyan-600" />
                    <span>Eligibility: Authorized Voter (1 Vote Remaining)</span>
                  </span>
                ) : election.openRegistration ? (
                  <span className="text-amber-700 font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 inline text-amber-600" />
                    <span>Eligibility: Unregistered (Open Ballot)</span>
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 inline text-rose-600" />
                    <span>Eligibility: Not on Official Whitelist</span>
                  </span>
                )}
              </div>
            </div>

            {/* Self-register button if eligible */}
            {!voterStatus.isRegistered && election.openRegistration && !voterStatus.hasVoted && (
              <button
                onClick={handleSelfRegister}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 inline mr-1" />
                Register to Vote
              </button>
            )}
          </div>

          {/* Already Voted / Success Proof View */}
          {(voterStatus.hasVoted || justVotedReceipt) ? (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-white border border-indigo-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Cryptographic Ballot Recorded</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your vote has been signed and validated on the blockchain. Double-voting is mathematically barred by smart contract logic.
                </p>
              </div>

              {activeCandidate && (
                <div className="inline-flex items-center space-x-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
                  <img src={activeCandidate.avatarUrl} alt={activeCandidate.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Your Selection</div>
                    <div className="text-sm font-bold text-slate-900">{activeCandidate.name}</div>
                    <div className="text-xs text-indigo-600 font-medium">{activeCandidate.party}</div>
                  </div>
                </div>
              )}

              {/* Transaction Hash / Proof */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold">Cryptographic Receipt (Tx Hash):</span>
                  <button
                    onClick={() => copyToClipboard(justVotedReceipt?.txHash || voterStatus.txHash || "0x9c8f...21b")}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? "Copied!" : "Copy Proof"}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-white font-mono text-[11px] text-slate-800 break-all border border-slate-200">
                  {justVotedReceipt?.txHash || voterStatus.txHash || "0x78ab12e45d98fa6c301b22ec7819ad5490bc1ef982a46c"}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Mined in Block #{justVotedReceipt?.blockNumber || voterStatus.blockNumber || 483129}</span>
                  <span className="text-emerald-600 font-medium">Consensus: Finalized</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenResults(election);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition"
                >
                  View Live Election Tally & Results
                </button>
              </div>
            </div>
          ) : (
            /* Candidate Selection List */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Candidate:</h4>
                <span className="text-xs text-slate-500">Pick one candidate to cast your vote</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {election.candidates.map((candidate) => {
                  const isSelected = selectedCandidateId === candidate.id;

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? "bg-indigo-50/70 border-indigo-500 glow-indigo shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <img
                          src={candidate.avatarUrl}
                          alt={candidate.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-slate-900 text-base leading-tight">{candidate.name}</h5>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">
                              {candidate.party}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            {candidate.manifesto}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end shrink-0 sm:pl-4">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        {!voterStatus.hasVoted && !justVotedReceipt && (
          <div className="p-6 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>

            {confirmStep ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConfirmStep(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCastVote}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center space-x-1.5"
                >
                  {loading ? (
                    <span>Minting to Blockchain...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Confirm & Mint Ballot</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!voterStatus.isRegistered) {
                    showToast("error", "Not Registered", "You must be registered before voting.");
                    return;
                  }
                  if (!selectedCandidateId) {
                    showToast("error", "Select Candidate", "Please choose a candidate first.");
                    return;
                  }
                  setConfirmStep(true);
                }}
                disabled={!selectedCandidateId || !voterStatus.isRegistered}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center space-x-2"
              >
                <Vote className="w-4 h-4" />
                <span>Review Ballot</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
