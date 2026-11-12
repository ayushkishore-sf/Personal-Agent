/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TabletFrame } from './components/TabletFrame';
import { ChatHeader } from './components/ChatHeader';
import { ChatInputBar } from './components/ChatInputBar';
import { ProductCard } from './components/ProductCard';
import { ActiveOfferCard } from './components/ActiveOfferCard';
import { CartSummaryCard } from './components/CartSummaryCard';
import { SignInSheet } from './components/SignInSheet';
import { TypingIndicator } from './components/TypingIndicator';
import { ControlBar } from './components/ControlBar';
import { GifExporterModal } from './components/GifExporterModal';
import { PRODUCTS } from './data/offerEngine';
import { StoryStep } from './types';
import { Check, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<StoryStep>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isControlsHidden, setIsControlsHidden] = useState<boolean>(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState<boolean>(false);
  const [isRecordingActive, setIsRecordingActive] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  const tabletContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Animated sub-states
  const [isShopperTyping, setIsShopperTyping] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);

  // Story domain states
  const [hasShopperSentStep1, setHasShopperSentStep1] = useState<boolean>(false);
  const [hasAgentRepliedStep1, setHasAgentRepliedStep1] = useState<boolean>(false);

  const [hasAgentRepliedStep2, setHasAgentRepliedStep2] = useState<boolean>(false);
  const [isSignInButtonTapped, setIsSignInButtonTapped] = useState<boolean>(false);

  const [isSignInSheetOpen, setIsSignInSheetOpen] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [hasAgentRepliedStep3, setHasAgentRepliedStep3] = useState<boolean>(false);

  const [hasShopperSentStep4, setHasShopperSentStep4] = useState<boolean>(false);
  const [isAddSocksTapped, setIsAddSocksTapped] = useState<boolean>(false);
  const [hasSocks, setHasSocks] = useState<boolean>(false);

  const [hasAgentRepliedStep5, setHasAgentRepliedStep5] = useState<boolean>(false);
  const [isApproveTapped, setIsApproveTapped] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  // Ref to chat messages container for auto-scroll
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Timeouts tracker to cancel during navigation
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTo({
          top: chatScrollRef.current.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    });
  }, []);

  // Helper for typing text letter by letter
  const typeText = useCallback((fullText: string, onComplete: () => void, speedMultiplier = 1) => {
    setIsShopperTyping(true);
    setInputText('');
    let currentIndex = 0;
    const charDelay = Math.max(16, Math.floor(32 / speedMultiplier));

    const interval = setInterval(() => {
      currentIndex++;
      setInputText(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        const sendTimer = setTimeout(() => {
          setIsShopperTyping(false);
          setInputText('');
          onComplete();
        }, 300 / speedMultiplier);
        timersRef.current.push(sendTimer);
      }
    }, charDelay);

    timersRef.current.push(interval as unknown as NodeJS.Timeout);
  }, []);

  // Sync state cleanly when jumping directly to a step (via Next, Back, or Restart)
  const jumpToStep = useCallback((targetStep: StoryStep, autoRun = false) => {
    clearAllTimers();
    setStep(targetStep);
    setIsShopperTyping(false);
    setInputText('');
    setIsAgentTyping(false);

    if (targetStep === 1) {
      setIsSignedIn(false);
      setHasSocks(false);
      setIsApproved(false);
      setIsSignInSheetOpen(false);
      setIsSignInButtonTapped(false);
      setIsAddSocksTapped(false);
      setIsApproveTapped(false);

      if (autoRun) {
        setHasShopperSentStep1(false);
        setHasAgentRepliedStep1(false);
        // Play Step 1 animation
        const t1 = setTimeout(() => {
          const step1Text = "I have a hiking trip in 4 days and need good hiking shoes. Size 10. They must reach me by Friday.";
          typeText(step1Text, () => {
            setHasShopperSentStep1(true);
            scrollToBottom();
            setIsAgentTyping(true);
            const t2 = setTimeout(() => {
              setIsAgentTyping(false);
              setHasAgentRepliedStep1(true);
              scrollToBottom();
            }, 900 / playbackSpeed);
            timersRef.current.push(t2);
          }, playbackSpeed);
        }, 500 / playbackSpeed);
        timersRef.current.push(t1);
      } else {
        // Fast static render for step 1
        setHasShopperSentStep1(true);
        setHasAgentRepliedStep1(true);
        scrollToBottom(false);
      }
    } else if (targetStep === 2) {
      setHasShopperSentStep1(true);
      setHasAgentRepliedStep1(true);
      setIsSignedIn(false);
      setHasSocks(false);
      setIsApproved(false);
      setIsSignInSheetOpen(false);
      setIsSignInButtonTapped(false);

      if (autoRun) {
        setHasAgentRepliedStep2(false);
        setIsAgentTyping(true);
        const t = setTimeout(() => {
          setIsAgentTyping(false);
          setHasAgentRepliedStep2(true);
          scrollToBottom();
        }, 900 / playbackSpeed);
        timersRef.current.push(t);
      } else {
        setHasAgentRepliedStep2(true);
        scrollToBottom(false);
      }
    } else if (targetStep === 3) {
      setHasShopperSentStep1(true);
      setHasAgentRepliedStep1(true);
      setHasAgentRepliedStep2(true);
      setHasSocks(false);
      setIsApproved(false);

      if (autoRun) {
        // Step 3 animation: Tap sign in button -> open sheet -> authenticate -> close sheet -> agent reply
        setIsSignInButtonTapped(true);
        const t1 = setTimeout(() => {
          setIsSignInSheetOpen(true);
        }, 350 / playbackSpeed);
        timersRef.current.push(t1);
      } else {
        setIsSignedIn(true);
        setIsSignInSheetOpen(false);
        setIsSignInButtonTapped(false);
        setHasAgentRepliedStep3(true);
        scrollToBottom(false);
      }
    } else if (targetStep === 4) {
      setHasShopperSentStep1(true);
      setHasAgentRepliedStep1(true);
      setHasAgentRepliedStep2(true);
      setIsSignedIn(true);
      setHasAgentRepliedStep3(true);
      setIsApproved(false);

      if (autoRun) {
        setHasShopperSentStep4(false);
        setHasSocks(false);
        setIsAddSocksTapped(false);

        const step4Text = "Yes, add the socks.";
        const t1 = setTimeout(() => {
          typeText(step4Text, () => {
            setHasShopperSentStep4(true);
            scrollToBottom();
            setIsAddSocksTapped(true);
            const t2 = setTimeout(() => {
              setHasSocks(true);
              scrollToBottom();
            }, 350 / playbackSpeed);
            timersRef.current.push(t2);
          }, playbackSpeed);
        }, 400 / playbackSpeed);
        timersRef.current.push(t1);
      } else {
        setHasShopperSentStep4(true);
        setHasSocks(true);
        setIsAddSocksTapped(true);
        scrollToBottom(false);
      }
    } else if (targetStep === 5) {
      setHasShopperSentStep1(true);
      setHasAgentRepliedStep1(true);
      setHasAgentRepliedStep2(true);
      setIsSignedIn(true);
      setHasAgentRepliedStep3(true);
      setHasShopperSentStep4(true);
      setHasSocks(true);

      if (autoRun) {
        setHasAgentRepliedStep5(false);
        setIsApproved(false);
        setIsApproveTapped(false);
        setIsAgentTyping(true);

        const t1 = setTimeout(() => {
          setIsAgentTyping(false);
          setHasAgentRepliedStep5(true);
          scrollToBottom();

          // Auto approve button tap if in play mode
          if (isPlaying) {
            const t2 = setTimeout(() => {
              setIsApproveTapped(true);
              const t3 = setTimeout(() => {
                setIsApproved(true);
                scrollToBottom();
              }, 400 / playbackSpeed);
              timersRef.current.push(t3);
            }, 1200 / playbackSpeed);
            timersRef.current.push(t2);
          }
        }, 900 / playbackSpeed);
        timersRef.current.push(t1);
      } else {
        setHasAgentRepliedStep5(true);
        scrollToBottom(false);
      }
    }
  }, [clearAllTimers, typeText, scrollToBottom, playbackSpeed, isPlaying]);

  // Handle Sign In sheet completion
  const handleSignInComplete = useCallback(() => {
    setIsSignInSheetOpen(false);
    setIsSignedIn(true);
    setIsSignInButtonTapped(false);
    setIsAgentTyping(true);

    const t = setTimeout(() => {
      setIsAgentTyping(false);
      setHasAgentRepliedStep3(true);
      scrollToBottom();
    }, 850 / playbackSpeed);
    timersRef.current.push(t);
  }, [playbackSpeed, scrollToBottom]);

  // Handle direct click on "Sign in to NTO" button
  const handleSignInButtonClick = () => {
    if (isSignedIn) return;
    setIsSignInButtonTapped(true);
    setTimeout(() => {
      setIsSignInSheetOpen(true);
    }, 250);
  };

  // Handle direct click on "Add socks" button
  const handleAddSocksClick = () => {
    if (hasSocks) return;
    setIsAddSocksTapped(true);
    setTimeout(() => {
      setHasShopperSentStep4(true);
      setHasSocks(true);
      if (step < 4) setStep(4);
      scrollToBottom();
    }, 250);
  };

  // Handle direct click on "Approve Purchase" button
  const handleApproveClick = () => {
    if (isApproved) return;
    setIsApproveTapped(true);
    setTimeout(() => {
      setIsApproved(true);
      scrollToBottom();
    }, 350);
  };

  // Next step trigger
  const handleNext = useCallback(() => {
    if (step < 5) {
      const nextStep = (step + 1) as StoryStep;
      jumpToStep(nextStep, true);
    }
  }, [step, jumpToStep]);

  // Back step trigger
  const handleBack = useCallback(() => {
    if (step > 1) {
      const prevStep = (step - 1) as StoryStep;
      jumpToStep(prevStep, false);
    }
  }, [step, jumpToStep]);

  // Restart trigger
  const handleRestart = useCallback(() => {
    setIsPlaying(false);
    jumpToStep(1, true);
  }, [jumpToStep]);

  // Play / Pause toggle
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Speed toggle
  const handleToggleSpeed = () => {
    setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : 1));
  };

  const stopAndDownloadRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsRecordingActive(false);
    setIsControlsHidden(false);
  }, []);

  const startLiveRecordingAndDownload = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert('Screen capture API is not available in this browser. Please use the "Render & Download Video Directly" option in the modal instead!');
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          frameRate: { ideal: 60, max: 60 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
        setIsRecordingActive(false);
        setIsControlsHidden(false);

        if (chunks.length > 0) {
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `personal_agent_shopping_clean_recording.${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      };

      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      };

      recorder.start(200);
      setIsRecordingActive(true);
      setRecordingSeconds(0);
      setIsControlsHidden(true);
      setIsGifModalOpen(false);

      // Play through story
      jumpToStep(1, true);
      setIsPlaying(true);
    } catch (err) {
      console.warn('Screen recording cancelled or failed:', err);
    }
  }, [jumpToStep]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecordingActive) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingActive]);

  // Auto-finish recording when story finishes step 5
  useEffect(() => {
    if (isRecordingActive && step === 5 && isApproved) {
      const t = setTimeout(() => {
        stopAndDownloadRecording();
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [isRecordingActive, step, isApproved, stopAndDownloadRecording]);

  // Initial step 1 animation on load & autoplay URL query support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoplay') === 'true') {
      setIsPlaying(true);
    }
    jumpToStep(1, true);
    return () => clearAllTimers();
  }, []);

  // Autoplay progression engine
  useEffect(() => {
    if (!isPlaying) return;

    let advanceTimer: NodeJS.Timeout | null = null;

    if (step === 1 && hasAgentRepliedStep1) {
      advanceTimer = setTimeout(() => {
        jumpToStep(2, true);
      }, 2600 / playbackSpeed);
    } else if (step === 2 && hasAgentRepliedStep2) {
      advanceTimer = setTimeout(() => {
        jumpToStep(3, true);
      }, 2400 / playbackSpeed);
    } else if (step === 3 && hasAgentRepliedStep3) {
      advanceTimer = setTimeout(() => {
        jumpToStep(4, true);
      }, 3400 / playbackSpeed);
    } else if (step === 4 && hasSocks) {
      advanceTimer = setTimeout(() => {
        jumpToStep(5, true);
      }, 2400 / playbackSpeed);
    } else if (step === 5 && isApproved) {
      // Finished story
      const finishTimer = setTimeout(() => {
        setIsPlaying(false);
      }, 3000 / playbackSpeed);
      timersRef.current.push(finishTimer);
    }

    if (advanceTimer) {
      timersRef.current.push(advanceTimer);
    }

    return () => {
      if (advanceTimer) clearTimeout(advanceTimer);
    };
  }, [
    isPlaying,
    step,
    hasAgentRepliedStep1,
    hasAgentRepliedStep2,
    hasAgentRepliedStep3,
    hasSocks,
    isApproved,
    jumpToStep,
    playbackSpeed,
  ]);

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when input element is focused
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsControlsHidden((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setIsGifModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handleBack, handleRestart, handleTogglePlay]);

  const prepareStepForGif = useCallback(async (targetStep: StoryStep) => {
    jumpToStep(targetStep, false);
    await new Promise((resolve) => setTimeout(resolve, 350));
  }, [jumpToStep]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100/70 via-slate-100 to-indigo-100/60 p-3 sm:p-6 md:p-8 flex flex-col items-center justify-center font-sans antialiased text-slate-800">
      {/* Tablet Frame Viewport */}
      <TabletFrame ref={tabletContainerRef}>
        {/* Chat App Header */}
        <ChatHeader
          isSignedIn={isSignedIn}
          cartItemCount={hasSocks ? 2 : 0}
        />

        {/* Chat Scrollable Body */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth"
        >
          {/* Faded Greeting */}
          <div className="text-center py-2 select-none">
            <span className="text-xs font-medium text-slate-400 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/50">
              Hi Alex. How can I help you?
            </span>
          </div>

          {/* STEP 1: Shopper asks for hiking shoes */}
          {hasShopperSentStep1 && (
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="max-w-[82%] sm:max-w-[70%] bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-sm font-normal shadow-xs leading-relaxed">
                I have a hiking trip in 4 days and need good hiking shoes. Size 10. They must reach me by Friday.
              </div>
            </div>
          )}

          {/* STEP 1: Agent recommends 3 hiking shoes */}
          {hasAgentRepliedStep1 && (
            <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Agent message bubble */}
              <div className="flex items-start gap-2 max-w-full">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5 shadow-xs">
                  PA
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs sm:text-sm font-normal text-slate-800 shadow-xs leading-relaxed">
                  I found three hiking shoes in size 10 that can reach you by Friday.
                </div>
              </div>

              {/* Three Product Cards in a row (Step 1 & Step 2 view) */}
              {step <= 2 && (
                <div className="w-full pl-9 pr-1 mt-1">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {PRODUCTS.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        isBestFit={prod.id === 'trailridge-mid'}
                        showTodayPrice={prod.id === 'trailridge-mid'}
                        isUnlocked={isSignedIn}
                        onNudgeClick={handleSignInButtonClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Agent explains its pick */}
          {step >= 2 && hasAgentRepliedStep2 && (
            <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start gap-2 max-w-full">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5 shadow-xs">
                  PA
                </div>
                <div className="space-y-3 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 text-xs sm:text-sm font-normal text-slate-800 shadow-xs max-w-lg">
                  <p className="leading-relaxed">
                    Trailridge Mid is the best fit for your trip. It is waterproof, has strong grip on rocky trails, and arrives Friday. NTO has more offers for signed in shoppers. Want to sign in to NTO?
                  </p>

                  {/* Sign In CTA Button (under the message) */}
                  {!isSignedIn && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleSignInButtonClick}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSignInButtonTapped
                            ? 'bg-slate-800 text-white scale-95 shadow-inner'
                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-95'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-300" />
                        <span>Sign in to NTO</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 & 4: Signed in Trailridge Mid card with combined top offers */}
          {step >= 3 && hasAgentRepliedStep3 && (
            <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Agent explanatory message */}
              <div className="flex items-start gap-2 max-w-full">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5 shadow-xs">
                  PA
                </div>
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-3 text-xs sm:text-sm font-normal text-slate-800 shadow-xs max-w-lg leading-relaxed">
                  You are signed in, Alex. NTO has a complete your kit offer with your Trailridge Mid. Add any of these items and save. The merino socks are 20% off, and adding them also gets you free shipping. The bottle and rain cover are 10% off and made for the NTO Trail Daypack you already have.
                </div>
              </div>

              {/* Active Offer Card */}
              <div className="w-full pl-9 pr-1">
                <ActiveOfferCard
                  hasSocks={hasSocks}
                  onAddSocks={handleAddSocksClick}
                  isAddSocksTapped={isAddSocksTapped}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Shopper says "Yes, add the socks." */}
          {step >= 4 && hasShopperSentStep4 && (
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-sm font-medium shadow-xs">
                Yes, add the socks.
              </div>
            </div>
          )}

          {/* STEP 5: Final cart summary & approval */}
          {step >= 5 && hasAgentRepliedStep5 && (
            <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Order breakdown card */}
              <div className="w-full pl-9 pr-1">
                <CartSummaryCard
                  isApproved={isApproved}
                  onApprove={handleApproveClick}
                  isApproveTapped={isApproveTapped}
                />
              </div>

              {/* Agent approval message */}
              <div className="flex items-start gap-2 max-w-full mt-1">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5 shadow-xs">
                  PA
                </div>
                <div className="space-y-3 bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 text-xs sm:text-sm font-normal text-slate-800 shadow-xs max-w-lg">
                  <p className="leading-relaxed">
                    Your total is $115 for the shoes and the socks, delivered Friday.
                  </p>

                  {/* Approve Purchase Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleApproveClick}
                      disabled={isApproved}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 text-white shadow-xs cursor-default'
                          : isApproveTapped
                          ? 'bg-slate-800 text-white scale-95 shadow-inner'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md active:scale-95'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Purchase approved</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Approve Purchase</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent Typing Indicator */}
          {isAgentTyping && (
            <div className="pl-9 animate-in fade-in duration-150">
              <TypingIndicator />
            </div>
          )}
        </div>

        {/* Bottom Input Bar with letter-by-letter typing animation */}
        <ChatInputBar
          currentText={inputText}
          isTypingShopper={isShopperTyping}
          onSend={() => {
            if (step === 1 && !hasShopperSentStep1) {
              setHasShopperSentStep1(true);
            } else if (step === 3 && !hasShopperSentStep4) {
              setHasShopperSentStep4(true);
              setHasSocks(true);
            }
          }}
        />

        {/* Touch ID Biometric Sign In Sheet inside tablet */}
        <SignInSheet
          isOpen={isSignInSheetOpen}
          autoTrigger={true}
          onComplete={handleSignInComplete}
          onClose={() => setIsSignInSheetOpen(false)}
        />
      </TabletFrame>

      {/* Slim Control Bar under tablet */}
      <ControlBar
        currentStep={step}
        totalSteps={5}
        isPlaying={isPlaying}
        isControlsHidden={isControlsHidden}
        playbackSpeed={playbackSpeed}
        onNext={handleNext}
        onBack={handleBack}
        onRestart={handleRestart}
        onTogglePlay={handleTogglePlay}
        onToggleHideControls={() => setIsControlsHidden(!isControlsHidden)}
        onToggleSpeed={handleToggleSpeed}
        onOpenGifExporter={() => setIsGifModalOpen(true)}
      />

      {/* GIF & Share Exporter Modal */}
      <GifExporterModal
        isOpen={isGifModalOpen}
        onClose={() => setIsGifModalOpen(false)}
        tabletRef={tabletContainerRef}
        onPrepareStep={prepareStepForGif}
        currentStep={step}
        onStartCleanRecording={() => {
          setIsControlsHidden(true);
          jumpToStep(1, true);
          setIsPlaying(true);
        }}
        onStartLiveRecordingAndDownload={startLiveRecordingAndDownload}
      />

      {/* Floating Live Recording Status Bar */}
      {isRecordingActive && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-full shadow-2xl border border-white/20 backdrop-blur-md animate-in fade-in slide-in-from-top-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-red-400">REC</span>
            <span className="text-xs font-mono tabular-nums text-slate-300">
              {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline">|</span>
          <span className="text-xs text-slate-200 hidden sm:inline">
            Recording clean walkthrough · Auto-downloads on completion
          </span>
          <button
            type="button"
            onClick={stopAndDownloadRecording}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            Stop & Save
          </button>
        </div>
      )}
    </div>
  );
}
