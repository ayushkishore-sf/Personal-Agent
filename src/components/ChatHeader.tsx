/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ShoppingBag, ShieldCheck, User } from 'lucide-react';

interface ChatHeaderProps {
  isSignedIn: boolean;
  cartItemCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isSignedIn,
  cartItemCount,
}) => {
  return (
    <header className="px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between shrink-0 z-10">
      {/* Agent Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
            Personal Agent
          </h2>
          <p className="text-[11px] text-emerald-600 font-medium leading-tight mt-0.5 flex items-center gap-1">
            <span>Online</span>
          </p>
        </div>
      </div>

      {/* Right zone: Cart chip & Account status */}
      <div className="flex items-center gap-2">
        {/* Cart chip - appears especially when socks added (2 items) */}
        {cartItemCount > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-right-1 duration-200">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 whitespace-nowrap">
              You saved $13 today
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{cartItemCount} items</span>
            </div>
          </div>
        )}

        {/* Member Status Badge */}
        {isSignedIn ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[85px] sm:max-w-none">Alex · NTO</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
            <User className="w-3 h-3 text-slate-400" />
            <span>Guest</span>
          </div>
        )}
      </div>
    </header>
  );
};
