import React from "react";
import { CheckCircle2, AlertCircle, Info, ExternalLink, X } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

export default function Toast() {
  const { feedbackMessage } = useWeb3();

  if (!feedbackMessage) return null;

  const { type, title, description, txHash } = feedbackMessage;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
  };

  const borders = {
    success: "border-emerald-500/30 bg-emerald-950/80 text-emerald-100",
    error: "border-rose-500/30 bg-rose-950/80 text-rose-100",
    info: "border-indigo-500/30 bg-indigo-950/80 text-indigo-100"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-xl shadow-2xl backdrop-blur-md border ${borders[type] || borders.info} flex items-start space-x-3`}>
        {icons[type] || icons.info}
        <div className="flex-1">
          <h4 className="font-semibold text-sm leading-tight text-white">{title}</h4>
          <p className="text-xs text-slate-300 mt-1">{description}</p>
          {txHash && (
            <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center space-x-1.5 text-xs font-mono text-indigo-300 hover:text-indigo-200">
              <span>Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
              <ExternalLink className="w-3 h-3 inline" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
