import React from "react";
import { CheckCircle2, AlertCircle, Info, ExternalLink, X } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function Toast() {
  const { feedbackMessage } = useWeb3();

  if (!feedbackMessage) return null;

  const { type, title, description, txHash } = feedbackMessage;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
  };

  const borders = {
    success: "border-emerald-300 bg-white/95 text-emerald-950 shadow-xl shadow-emerald-500/10",
    error: "border-rose-300 bg-white/95 text-rose-950 shadow-xl shadow-rose-500/10",
    info: "border-indigo-300 bg-white/95 text-indigo-950 shadow-xl shadow-indigo-500/10"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl shadow-xl backdrop-blur-md border ${borders[type] || borders.info} flex items-start space-x-3`}>
        {icons[type] || icons.info}
        <div className="flex-1">
          <h4 className="font-bold text-sm leading-tight text-slate-900">{title}</h4>
          <p className="text-xs text-slate-600 mt-1">{description}</p>
          {txHash && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-700">
              <span>Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
              <ExternalLink className="w-3 h-3 inline" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
