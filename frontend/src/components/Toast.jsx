import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-zinc-900 text-white border-zinc-800',
    error: 'bg-rose-950 text-rose-100 border-rose-800',
    info: 'bg-zinc-900 text-white border-zinc-800',
  }[type] || 'bg-zinc-900 text-white border-zinc-800';

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type] || CheckCircle2;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl border text-sm animate-fade-in backdrop-blur-md max-w-md">
      <div className={`${bgStyles} flex items-center gap-3 w-full p-1`}>
        <Icon className="w-5 h-5 flex-shrink-0 text-emerald-400" />
        <span className="flex-1 font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
