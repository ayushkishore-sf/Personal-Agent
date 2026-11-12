/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { Wifi } from 'lucide-react';

interface TabletFrameProps {
  children: React.ReactNode;
}

export const TabletFrame = forwardRef<HTMLDivElement, TabletFrameProps>(({ children }, ref) => {
  return (
    <div ref={ref} className="relative mx-auto my-auto w-full max-w-[820px] transition-all">
      {/* Tablet Hardware Shell */}
      <div className="relative rounded-[38px] sm:rounded-[44px] bg-[#1a1c22] p-2.5 sm:p-3.5 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35),0_0_0_1px_rgba(255,255,255,0.1)_inset] ring-1 ring-slate-800/80">
        {/* Subtle camera lens at top bezel */}
        <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-50 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ring-1 ring-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-950/80" />
          </div>
        </div>

        {/* Inner Screen Display */}
        <div data-tablet-screen="true" className="relative w-full h-[720px] sm:h-[780px] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-slate-50 flex flex-col shadow-inner select-none">
          {/* Tablet Status Bar */}
          <div className="px-5 pt-2 pb-1.5 bg-white text-slate-800 flex items-center justify-between text-[11px] font-semibold tracking-tight border-b border-slate-100/80 shrink-0 z-20">
            {/* Left: Time and Date */}
            <div className="flex items-center gap-2">
              <span className="tabular-nums font-bold text-slate-900">9:41</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">Wed Nov 11</span>
            </div>

            {/* Right: Network, Wifi, Battery */}
            <div className="flex items-center gap-2 text-slate-700">
              {/* Cellular Signal bars */}
              <div className="flex items-end gap-0.5 h-2.5" title="Full cellular signal">
                <span className="w-0.5 h-1 bg-slate-800 rounded-xs" />
                <span className="w-0.5 h-1.5 bg-slate-800 rounded-xs" />
                <span className="w-0.5 h-2 bg-slate-800 rounded-xs" />
                <span className="w-0.5 h-2.5 bg-slate-800 rounded-xs" />
              </div>

              {/* Wifi */}
              <Wifi className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />

              {/* Battery */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] tabular-nums font-bold">92%</span>
                <div className="w-5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center relative">
                  <div className="h-full w-[85%] bg-slate-800 rounded-2xs" />
                  <div className="w-0.5 h-1 bg-slate-700 absolute -right-1 rounded-r-2xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Child Applet Canvas */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {children}
          </div>

          {/* Bottom Home Indicator */}
          <div className="h-3.5 bg-white flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
});

TabletFrame.displayName = 'TabletFrame';
