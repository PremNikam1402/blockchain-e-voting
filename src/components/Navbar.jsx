import React, { useState } from "react";
import { Vote, Shield, Wallet, ChevronDown, Check, User, Activity, Search, PlusCircle, ExternalLink } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";
import { DEMO_ACCOUNTS } from "../utils/constants";

export default function Navbar({ onOpenAdmin, onOpenAudit, onOpenVerify }) {
  const { account, demoUser, isDemoMode, isAdmin, switchDemoAccount, connectMetaMask } = useWeb3();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/20">
            <Vote className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                ElectraChain
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                dApp v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Decentralized E-Voting Protocol</p>
          </div>
        </div>

        {/* Quick Nav Tools */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={onOpenAudit}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white shadow-sm transition"
          >
            <Activity className="w-4 h-4 text-cyan-600" />
            <span>Audit Ledger</span>
          </button>

          <button
            onClick={onOpenVerify}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-white shadow-sm transition"
          >
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Verify Ballot</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Admin Control</span>
            </button>
          )}
        </div>

        {/* Wallet & Account Switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 pr-3 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition"
          >
            <img
              src={demoUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="text-left hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {demoUser?.name || "Connected User"}
                </span>
                {isAdmin ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold uppercase">
                    Admin
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold uppercase">
                    Voter
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Account Switcher Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Switch Role / Demo Account</div>
                <div className="text-xs text-slate-400 mt-0.5">Test voting or admin actions instantly without gas</div>
              </div>

              <div className="py-1 space-y-1">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = account.toLowerCase() === acc.address.toLowerCase();
                  return (
                    <button
                      key={acc.address}
                      onClick={() => switchDemoAccount(acc)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                        isSelected
                          ? "bg-indigo-50 border border-indigo-200 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <img src={acc.avatar} alt={acc.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold leading-tight text-slate-900">{acc.name}</p>
                          <p className="text-[10px] font-mono text-slate-500">{acc.address.slice(0, 6)}...{acc.address.slice(-4)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          acc.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {acc.badge}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={connectMetaMask}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Connect MetaMask</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
