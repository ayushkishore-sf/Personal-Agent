/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, ArrowLeft, ArrowRight, Play, Pause, EyeOff, Eye, Gauge, Film, Download } from 'lucide-react';
import { StoryStep } from '../types';

interface ControlBarProps {
  currentStep: StoryStep;
  totalSteps: number;
  isPlaying: boolean;
  isControlsHidden: boolean;
  playbackSpeed: number; // 1 or 1.5
  onNext: () => void;
  onBack: () => void;
  onRestart: () => void;
  onTogglePlay: () => void;
  onToggleHideControls: () => void;
  onToggleSpeed: () => void;
  onOpenGifExporter: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  isControlsHidden,
  playbackSpeed,
  onNext,
  onBack,
  onRestart,
  onTogglePlay,
  onToggleHideControls,
  onToggleSpeed,
  onOpenGifExporter,
}) => {
  if (isControlsHidden) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={onToggleHideControls}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white/90 text-xs backdrop-blur-md shadow-lg transition-all border border-white/10 opacity-70 hover:opacity-100 cursor-pointer"
          title="Show Controls (Press H)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Show controls (H)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-center gap-2 z-30 select-none">
      {/* Main slim control bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5">
        {/* Restart */}
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Restart story (Press R)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Restart</span>
        </button>

        <div className="w-px h-4 bg-slate-200" />

        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep <= 1}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            currentStep <= 1
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Previous step (Left Arrow)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Step Counter */}
        <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800 tabular-nums flex items-center gap-1.5">
          <span>Step {currentStep} of {totalSteps}</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  s === currentStep
                    ? 'bg-blue-600 scale-125'
                    : s < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={currentStep >= totalSteps}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            currentStep >= totalSteps
              ? 'text-slate-300 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs active:scale-95'
          }`}
          title="Next step (Right Arrow or Space)"
        >
          <span>Next</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-200" />

        {/* Play / Pause */}
        <button
          type="button"
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isPlaying
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Autoplay all steps with natural pauses (Press P)"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </>
          )}
        </button>

        {/* Speed button */}
        <button
          type="button"
          onClick={onToggleSpeed}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Toggle speed (1x / 1.5x)"
        >
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span className="tabular-nums font-semibold">{playbackSpeed}x</span>
        </button>

        {/* Download Video & GIF button */}
        <button
          type="button"
          onClick={onOpenGifExporter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          title="Download 1080p MP4 Video, Animated GIF, or slides (Press G)"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Download Video & GIF</span>
          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">1080p</span>
        </button>

        <div className="w-px h-4 bg-slate-200" />

        {/* Hide Controls */}
        <button
          type="button"
          onClick={onToggleHideControls}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Hide controls for recording (Press H)"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Hide</span>
        </button>
      </div>

      {/* Helpful keyboard hint */}
      <p className="text-[11px] text-slate-500/80 tracking-tight">
        Keys: <kbd className="px-1 py-0.5 bg-white/70 rounded border border-slate-200 font-mono text-[10px]">Space</kbd> Next · <kbd className="px-1 py-0.5 bg-white/70 rounded border border-slate-200 font-mono text-[10px]">←</kbd> Back · <kbd className="px-1 py-0.5 bg-white/70 rounded border border-slate-200 font-mono text-[10px]">R</kbd> Restart · <kbd className="px-1 py-0.5 bg-white/70 rounded border border-slate-200 font-mono text-[10px]">H</kbd> Hide Controls
      </p>
    </div>
  );
};
