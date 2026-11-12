/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 shadow-xs">
        PA
      </div>
      <div className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
      </div>
    </div>
  );
};
