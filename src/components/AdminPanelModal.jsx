import React, { useState } from "react";
import { X, Plus, Trash2, Shield, UserCheck, AlertTriangle, CheckCircle2, Clock, Check } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function AdminPanelModal({ onClose }) {
  const { elections, createElection, registerVoter, batchRegisterVoters, endElection, loading, showToast } = useWeb3();
  const [activeTab, setActiveTab] = useState("create"); // "create", "voters", "lifecycle"

  // Create election form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(1440); // 24 hours
  const [openRegistration, setOpenRegistration] = useState(true);
  const [candidates, setCandidates] = useState([
    { name: "", party: "", manifesto: "", avatarUrl: "" },
    { name: "", party: "", manifesto: "", avatarUrl: "" }
  ]);

  // Voter management form state
  const [selectedElectionId, setSelectedElectionId] = useState(elections[0]?.id || 1);
  const [singleAddress, setSingleAddress] = useState("");
  const [batchAddresses, setBatchAddresses] = useState("");

  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      { name: "", party: "", manifesto: "", avatarUrl: "" }
    ]);
  };

  const handleRemoveCandidate = (index) => {
    if (candidates.length <= 2) {
      showToast("error", "Minimum Candidates", "An election requires at least 2 candidates.");
      return;
    }
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const handleCreateElectionSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("error", "Missing Details", "Please provide election title and description.");
      return;
    }

    const invalidCandidates = candidates.some((c) => !c.name.trim() || !c.party.trim());
    if (invalidCandidates) {
      showToast("error", "Candidate Info Required", "All candidates must have a name and party.");
      return;
    }

    try {
      await createElection({
        title,
        description,
        durationInMinutes: Number(duration),
        openRegistration,
        candidates
      });
      onClose();
    } catch (err) {
      // toast shown in context
    }
  };

  const handleSingleRegister = async (e) => {
    e.preventDefault();
    if (!singleAddress.trim()) return;
    try {
      await registerVoter(Number(selectedElectionId), singleAddress.trim());
      setSingleAddress("");
    } catch (err) {
      // toast in context
    }
  };

  const handleBatchRegister = async (e) => {
    e.preventDefault();
    if (!batchAddresses.trim()) return;
    try {
      const addresses = batchAddresses
        .split(/[\n,]+/)
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      await batchRegisterVoters(Number(selectedElectionId), addresses);
      setBatchAddresses("");
    } catch (err) {
      // toast in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white leading-tight">Election Commission Portal</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-bold">
                  Admin Master Control
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Deploy new ballots, authorize voters, and manage election lifecycles</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800 flex space-x-4 bg-slate-900/40">
          <button
            onClick={() => setActiveTab("create")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === "create"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Election</span>
          </button>

          <button
            onClick={() => setActiveTab("voters")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === "voters"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Voter Whitelisting</span>
          </button>

          <button
            onClick={() => setActiveTab("lifecycle")}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center space-x-2 ${
              activeTab === "lifecycle"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Close / Finalize Elections</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "create" && (
            <form onSubmit={handleCreateElectionSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Election Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Council Representative Election 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Description & Scope *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Provide voter instructions, purpose, and key dates..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">1440 min = 24 Hours</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Registration Policy
                  </label>
                  <div className="flex items-center space-x-3 mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={openRegistration}
                        onChange={(e) => setOpenRegistration(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-3 text-xs font-medium text-slate-300">
                        {openRegistration ? "Open Self-Registration" : "Whitelist Only"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Candidates Builder */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Candidate Roster</h4>
                  <button
                    type="button"
                    onClick={handleAddCandidate}
                    className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Candidate</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {candidates.map((cand, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Candidate #{idx + 1}</span>
                        {candidates.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCandidate(idx)}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Candidate Full Name *"
                          value={cand.name}
                          onChange={(e) => handleCandidateChange(idx, "name", e.target.value)}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Party / Affiliation *"
                          value={cand.party}
                          onChange={(e) => handleCandidateChange(idx, "party", e.target.value)}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Manifesto summary / Motto"
                          value={cand.manifesto}
                          onChange={(e) => handleCandidateChange(idx, "manifesto", e.target.value)}
                          className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Avatar image URL (optional)"
                          value={cand.avatarUrl}
                          onChange={(e) => handleCandidateChange(idx, "avatarUrl", e.target.value)}
                          className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{loading ? "Deploying..." : "Deploy Election to Blockchain"}</span>
                </button>
              </div>

            </form>
          )}

          {activeTab === "voters" && (
            <div className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Target Election
                </label>
                <select
                  value={selectedElectionId}
                  onChange={(e) => setSelectedElectionId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  {elections.map((elec) => (
                    <option key={elec.id} value={elec.id}>
                      #{elec.id} - {elec.title} ({elec.status === 1 ? "Active" : "Concluded"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Single voter register */}
              <form onSubmit={handleSingleRegister} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Authorize Single Citizen Address</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                    value={singleAddress}
                    onChange={(e) => setSingleAddress(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shrink-0"
                  >
                    Authorize
                  </button>
                </div>
              </form>

              {/* Batch register */}
              <form onSubmit={handleBatchRegister} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Batch Authorize (Bulk Roster)</h4>
                <p className="text-xs text-slate-400">Paste multiple Ethereum addresses separated by commas or line breaks.</p>
                <textarea
                  rows={4}
                  placeholder={`0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC\n0x90F79bf6EB2c4f870365E785982E1f101E93b906`}
                  value={batchAddresses}
                  onChange={(e) => setBatchAddresses(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-md transition"
                >
                  Process Batch Authorization
                </button>
              </form>

            </div>
          )}

          {activeTab === "lifecycle" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Election Controls</h4>
              <p className="text-xs text-slate-400">
                Early close or finalize elections. Once ended, no further ballots can be cast on-chain.
              </p>

              <div className="space-y-3">
                {elections.map((elec) => (
                  <div
                    key={elec.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-850 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">#{elec.id} {elec.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          elec.status === 1 ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-500"
                        }`}>
                          {elec.status === 1 ? "Active" : "Closed"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                        {elec.totalVotes} votes cast • {elec.registeredVoters?.length || 0} registered
                      </span>
                    </div>

                    {elec.status === 1 && (
                      <button
                        onClick={() => endElection(elec.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                      >
                        End Election
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
