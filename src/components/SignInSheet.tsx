/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Fingerprint, Check, ShieldCheck, X } from 'lucide-react';

interface SignInSheetProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose?: () => void;
  autoTrigger?: boolean;
}

export const SignInSheet: React.FC<SignInSheetProps> = ({
  isOpen,
  onComplete,
  onClose,
  autoTrigger = false,
}) => {
  const [phase, setPhase] = useState<'idle' | 'pressed' | 'scanning' | 'success'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setPhase('idle');
      return;
    }

    if (autoTrigger) {
      // Simulate button tap, biometric scan, then success
      const pressTimer = setTimeout(() => {
        setPhase('pressed');
      }, 350);

      const scanTimer = setTimeout(() => {
        setPhase('scanning');
      }, 700);

      const successTimer = setTimeout(() => {
        setPhase('success');
      }, 1600);

      const finishTimer = setTimeout(() => {
        onComplete();
      }, 2300);

      return () => {
        clearTimeout(pressTimer);
        clearTimeout(scanTimer);
        clearTimeout(successTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [isOpen, autoTrigger, onComplete]);

  const handleManualAuth = () => {
    if (phase !== 'idle') return;
    setPhase('pressed');
    setTimeout(() => setPhase('scanning'), 300);
    setTimeout(() => setPhase('success'), 1200);
    setTimeout(() => {
      onComplete();
    }, 1900);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] flex items-end justify-center transition-opacity duration-300">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-up sheet */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-[28px] p-6 shadow-2xl border-t border-slate-200 z-50 transform transition-all duration-300 animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* NTO Brand Lockup */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-wider mb-3 shadow-md">
            NTO
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Sign in to Northern Trail Outfitters
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
            Share your NTO account with Personal Agent to unlock offers for signed in shoppers.
          </p>
        </div>

        {/* Member profile teaser */}
        <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center text-xs">
              A
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">Alex Morgan</p>
              <p className="text-[11px] text-slate-500">NTO Trailhead Member · #84920</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified</span>
          </div>
        </div>

        {/* Biometric Scan Visualizer */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              phase === 'success' 
                ? 'bg-emerald-500 text-white scale-105 shadow-lg shadow-emerald-500/25' 
                : phase === 'scanning'
                ? 'bg-blue-50 text-blue-600 ring-4 ring-blue-500/30'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {phase === 'scanning' && (
              <span className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            )}

            {phase === 'success' ? (
              <Check className="w-10 h-10 animate-in zoom-in-50 duration-200" strokeWidth={3} />
            ) : (
              <Fingerprint className={`w-10 h-10 transition-transform ${phase === 'pressed' ? 'scale-90' : ''}`} />
            )}
          </div>

          <p className="text-xs font-medium text-slate-600 mt-2.5 tracking-tight">
            {phase === 'idle' && 'Biometric authentication ready'}
            {phase === 'pressed' && 'Authenticating...'}
            {phase === 'scanning' && 'Reading fingerprint...'}
            {phase === 'success' && 'Signed in successfully'}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleManualAuth}
          disabled={phase !== 'idle'}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            phase === 'pressed' || phase === 'scanning'
              ? 'bg-slate-800 text-white scale-[0.98]'
              : phase === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-[0.98]'
          }`}
        >
          {phase === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Signed In</span>
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 text-slate-300" />
              <span>Continue with Touch ID</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Instant guest-to-member passkey link
        </p>
      </div>
    </div>
  );
};
