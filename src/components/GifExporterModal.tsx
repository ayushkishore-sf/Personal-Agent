/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Film, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Share2, 
  Copy, 
  Layers, 
  Play, 
  ExternalLink,
  Video,
  FileCheck,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { StoryStep } from '../types';

interface GifExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabletRef: React.RefObject<HTMLDivElement | null>;
  onPrepareStep: (step: StoryStep) => Promise<void>;
  currentStep: StoryStep;
  onStartCleanRecording: () => void;
  onStartLiveRecordingAndDownload: () => void;
}

export const GifExporterModal: React.FC<GifExporterModalProps> = ({
  isOpen,
  onClose,
  onStartCleanRecording,
  onStartLiveRecordingAndDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'gif' | 'slides' | 'share' | 'record'>('video');
  const [hasCopiedLink, setHasCopiedLink] = useState<boolean>(false);
  const [hasCopiedGif, setHasCopiedGif] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const videoUrl = '/personal_agent_shopping_story.mp4';
  const gifUrl = '/personal_agent_shopping_story.gif';

  // Robust universal download trigger that works across iframe sandboxes and mobile
  const triggerDownload = async (url: string, filename: string) => {
    try {
      setDownloadSuccessMessage(`Starting download of ${filename}...`);
      
      // Method 1: Fetch as blob to bypass iframe cross-origin restrictions
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setDownloadSuccessMessage(`Downloaded ${filename} successfully!`);
        setTimeout(() => setDownloadSuccessMessage(null), 4000);
      }, 1000);
    } catch (err) {
      console.warn('Direct blob download hit iframe sandbox, opening directly:', err);
      // Fallback: Open in clean window/tab where user can save
      window.open(url, '_blank');
      setDownloadSuccessMessage(`Opened ${filename} in new tab (use right-click > Save Video As)`);
      setTimeout(() => setDownloadSuccessMessage(null), 5000);
    }
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('autoplay', 'true');
    navigator.clipboard.writeText(url.toString());
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  const handleCopyGifImage = async () => {
    try {
      const res = await fetch(gifUrl);
      const blob = await res.blob();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        setHasCopiedGif(true);
        setTimeout(() => setHasCopiedGif(false), 2500);
      } else {
        triggerDownload(gifUrl, 'personal_agent_shopping_story.gif');
      }
    } catch (e) {
      triggerDownload(gifUrl, 'personal_agent_shopping_story.gif');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none">
                Export & Download Prototype
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Studio-quality 1080p recording, animated GIF, and slide frames
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Download Feedback Banner */}
        {downloadSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1 truncate">{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="px-5 pt-3 pb-1 border-b border-slate-100 flex items-center gap-1.5 bg-white overflow-x-auto">
          {[
            { id: 'video', label: '1080p Video (MP4)', icon: Tv, badge: 'HD' },
            { id: 'gif', label: 'Animated GIF', icon: Film, badge: 'Loop' },
            { id: 'slides', label: 'Slide PNGs', icon: Layers },
            { id: 'share', label: 'Share Link', icon: ExternalLink },
            { id: 'record', label: 'Custom Capture', icon: Play },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: 1080p Video (MP4) */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-[16/9] flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Specs pill */}
              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">1920×1080 Full HD</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">H.264 High Profile</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">15s complete story</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Top Studio Quality
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <a
                  href={videoUrl}
                  download="personal_agent_shopping_story_1080p.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerDownload(videoUrl, 'personal_agent_shopping_story_1080p.mp4');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all active:scale-95 text-center cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download 1080p MP4 Video</span>
                </a>

                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  title="Open video in dedicated tab for direct playback and right-click saving"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>Open in New Tab</span>
                </a>
              </div>

              {/* Guaranteed Download Helper */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  100% Download Guarantee:
                </p>
                <p>
                  Clicking the button downloads the crisp MP4 file immediately. If your browser blocks downloads inside this preview frame, click <strong>Open in New Tab</strong> to view and save directly with <em>Right Click &gt; Save Video As...</em>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Animated GIF */}
          {activeTab === 'gif' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={gifUrl}
                  alt="Personal Agent Shopping Story Animated GIF"
                  className="w-full rounded-xl shadow-xs object-contain max-h-[300px]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-bold text-slate-900">800×450 Infinite Loop GIF</span>
                <span className="text-emerald-700 font-semibold">128 KB · Crisp Palette</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <a
                  href={gifUrl}
                  download="personal_agent_shopping_story.gif"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerDownload(gifUrl, 'personal_agent_shopping_story.gif');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download .GIF</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyGifImage}
                  className="py-3 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {hasCopiedGif ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Image</span>
                    </>
                  )}
                </button>

                <a
                  href={gifUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Open</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Slide PNGs */}
          {activeTab === 'slides' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Individual high-resolution 1080p PNG slides of each shopping story step for presentations or design docs:
              </p>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-full aspect-[16/9] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
                      <img
                        src={`/frames/frame_${s}.png`}
                        alt={`Step ${s}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Step {s} of 5</span>
                    <a
                      href={`/frames/frame_${s}.png`}
                      download={`step_${s}_shopping_story.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerDownload(`/frames/frame_${s}.png`, `step_${s}_shopping_story.png`);
                      }}
                      className="w-full py-1 text-[10px] font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-md transition-colors text-center cursor-pointer"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Shareable Link */}
          {activeTab === 'share' && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  Instant Interactive Link (Autoplay enabled)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Anyone opening this link will see the full interactive tablet with the 5-step scripted story playing automatically in full HD.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}${window.location.pathname}?autoplay=true`}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 font-mono select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      hasCopiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {hasCopiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Live Screen Recording */}
          {activeTab === 'record' && (
            <div className="space-y-3.5 py-1">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-blue-600" />
                    Live Browser Tab Screen Recorder
                  </h4>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Captures this browser tab dynamically while the prototype runs. For pre-rendered 1080p Full HD video, use the <strong>1080p Video (MP4)</strong> tab above.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartLiveRecordingAndDownload();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Live Screen Recording</span>
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Prefer QuickTime, Loom, or OBS?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartCleanRecording();
                  }}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Start Clean Fullscreen View
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
