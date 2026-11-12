/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Mic, Send, Paperclip, SlidersHorizontal, Sparkles } from 'lucide-react';

interface ChatInputBarProps {
  currentText: string;
  isTypingShopper: boolean;
  onSend?: () => void;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  currentText,
  isTypingShopper,
  onSend,
  disabled = false,
}) => {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const handleMicClick = () => {
    setIsMicActive((prev) => !prev);
    setTimeout(() => setIsMicActive(false), 2000);
  };

  return (
    <div className="relative px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shrink-0">
      {/* Plus Menu Popover */}
      {showPlusMenu && (
        <div className="absolute bottom-16 left-4 bg-white rounded-xl shadow-xl border border-slate-200 p-2 min-w-[190px] z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <button
            type="button"
            onClick={() => setShowPlusMenu(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Paperclip className="w-3.5 h-3.5 text-slate-500" />
            <span>Add trail photo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPlusMenu(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Shoe preferences (Size 10)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPlusMenu(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>NTO Member perks</span>
          </button>
        </div>
      )}

      {/* Mic Active Listening Pill */}
      {isMicActive && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-in fade-in duration-150">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Listening...</span>
        </div>
      )}

      {/* Main Rounded Input Bar */}
      <div className="flex items-center gap-2 bg-slate-100/90 rounded-full px-2 py-1.5 border border-slate-200/80 focus-within:border-slate-400 focus-within:bg-white transition-all shadow-inner">
        {/* Plus Button */}
        <button
          type="button"
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            showPlusMenu
              ? 'bg-slate-200 text-slate-800'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
          title="More options"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Input Text Box display */}
        <div className="flex-1 px-2 py-1 text-xs text-slate-900 min-h-[22px] flex items-center overflow-x-auto whitespace-pre">
          {currentText ? (
            <span className="font-normal leading-relaxed">
              {currentText}
              {isTypingShopper && (
                <span className="inline-block w-1.5 h-3.5 bg-blue-600 ml-0.5 animate-pulse align-middle" />
              )}
            </span>
          ) : (
            <span className="text-slate-400 select-none">
              Ask Personal Agent anything...
            </span>
          )}
        </div>

        {/* Mic Button */}
        <button
          type="button"
          onClick={handleMicClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isMicActive
              ? 'bg-red-50 text-red-600 ring-2 ring-red-500/30'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
          }`}
          title="Voice input"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Send Button */}
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !currentText}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            currentText
              ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:scale-90'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
          }`}
          title="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
