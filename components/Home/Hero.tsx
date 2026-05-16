"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import ContainerLayout from "../Layout/ContainerLayout";
import PlayingWaves from "../Reusable/PlayingWaves";
import PrimaryButton from "../Reusable/PrimaryButton";
import DotIcon from "../Reusable/Icons/DotIcon";
import { useAudioAnalyser } from "@/lib/useAudioAnalyser";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Avoid SSR crash — Canvas needs browser WebGL
const TownScene = dynamic(() => import("./TownScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

// ── Scroll progress → which place is active ───────────────────────────────
//
// Scroll phases (0–1 maps to 500vh of scroll via GSAP pin):
//   0.00 – 0.20  Canvas expands right-half → full-screen, left panel fades
//   0.20 – 0.25  Place 1  (WP 0)
//   0.25 – 0.35  Place 2  (WP 1)
//   0.35 – 0.45  Place 3  (WP 2)
//   0.45 – 0.55  Place 4  (WP 3)
//   0.55 – 0.65  Place 5  (WP 4)
//   0.65 – 0.75  Place 6  (WP 5)
//   0.75 – 0.85  Place 7  (WP 6)
//   0.85 – 0.95  Place 8  (WP 7)
//   0.95 – 1.00  Drone overview — all models (no label)

function getActivePlace(p: number): number {
  if (p < 0.20) return -1;   // expansion phase (no label)
  if (p < 0.25) return 0;    // Place 1  (PLACES[0])
  if (p < 0.35) return 1;    // Place 2
  if (p < 0.45) return 2;    // Place 3
  if (p < 0.55) return 3;    // Place 4
  if (p < 0.65) return 4;    // Place 5
  if (p < 0.75) return 5;    // Place 6
  if (p < 0.85) return 6;    // Place 7
  if (p < 0.95) return 7;    // Place 8
  return -1;                  // drone overview (no label)
}

// ── Hero ──────────────────────────────────────────────────────────────────

const Hero = () => {
  const { mode, analyser, startListening, stop } = useAudioAnalyser();
  const isListening = mode !== "idle";

  const containerRef   = useRef<HTMLDivElement>(null);
  const leftPanelRef   = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Written by GSAP ScrollTrigger onUpdate, read by R3F useFrame — no React state
  const progressRef   = useRef<number>(0);
  const activePlaceRef = useRef<number>(-1);

  const [activePlace, setActivePlace] = useState<number>(-1);
  const [dotsVisible, setDotsVisible] = useState(false);

  // Full-page loader — tracks GLB model loading via Three.js DefaultLoadingManager
  const { progress, active } = useProgress();
  const [sceneLoaded, setSceneLoaded] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) setSceneLoaded(true);
  }, [active, progress]);

  const handleTalkClick = () => (isListening ? stop() : startListening());

  // ── GSAP scroll timeline ────────────────────────────────────────────────

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          // "top 9dvh" fires at scroll=0 because the hero's top is already
          // at 9dvh (below the fixed nav). The hero is pinned in place for
          // the entire 500vh of scroll room that follows.
          start: "top 9%",
          end: "+=500%",

          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (st) => {
            // Camera progress starts after expansion (first 20% of scroll)
            progressRef.current = Math.max(0, (st.progress - 0.2) / 0.8);

            const next = getActivePlace(st.progress);
            if (next !== activePlaceRef.current) {
              activePlaceRef.current = next;
              setActivePlace(next);
              // Show dots once the canvas has expanded past the mid-point
              setDotsVisible(st.progress > 0.22);
            }
          },
        },
      });

      // Phase 1 (0–20 %): expand canvas clip-path + fade left panel
      tl.fromTo(
        canvasWrapperRef.current,
        { clipPath: "inset(0% 0% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.2 }
      );
      tl.fromTo(
        leftPanelRef.current,
        { autoAlpha: 1, x: 0 },
        { autoAlpha: 0, x: -36, ease: "power2.in", duration: 0.18 },
        "<" // concurrent
      );

      // Phase 2–5 (20–100 %): camera handled by progressRef in R3F useFrame
      tl.to({}, { duration: 0.8 });
    },
    { scope: containerRef, dependencies: [] }
  );

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <>
    {/* ── Full-page loader ── */}
    <AnimatePresence>
      {!sceneLoaded && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0, 1] }}
        >
          <div className="flex flex-col items-center gap-10">
            <h1 className="text-5xl font-ki tracking-tight text-primary">Kite</h1>
            {/* Progress bar */}
            <div className="w-56 h-[1px] bg-gray relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              />
            </div>
            <p className="text-[11px] font-mono tracking-[0.3em] text-primary/40 uppercase">
              {Math.round(progress)} %
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <div
      ref={containerRef}
      className="mt-[9dvh] h-[91dvh] relative overflow-hidden"
    >

      {/* ── Left panel (waves + text + buttons) ── */}
      <div
        ref={leftPanelRef}
        className="absolute inset-0 z-20"
      >
        {/* ContainerLayout provides border-x + horizontal padding */}
        <ContainerLayout
          disablePaddingY
          className="border-x border-b border-gray h-full"
        >
        <div className="grid grid-cols-2 h-full">
          {/* Left column — fully interactive until it fades */}
          <div className="flex flex-col h-full">
            <div className="flex-1 relative border border-gray overflow-hidden bg-[#E3DFD4]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-full px-4 [mask-image:radial-gradient(circle,black_50%,transparent_90%)]">
                  <PlayingWaves barCount={122} analyser={analyser} />
                </div>
              </div>
            </div>

            <div className="border-x border-gray p-10 space-y-6">
              <h1 className="text-6xl">
                Make AI see, think,
                <br />
                reason, and execute
              </h1>
              <p className="font-ki text-lg">
                Explore live AI experiences that gather signals from the
                web, organize what matters, and execute tasks autonomously
              </p>
            </div>

            <div className="flex items-center gap-6 p-10 border-x border-t border-gray">
              <PrimaryButton
                onClick={handleTalkClick}
                showIcon={true}
                isPlaying={isListening}
                className="text-sm py-3"
              >
                {isListening ? "Listening…" : "Talk to Kite"}
              </PrimaryButton>
              <div className="w-0.5 h-6 bg-primary" />
              <div className="flex items-center gap-3 cursor-pointer group">
                <p className="transition-all duration-300 tracking-tighter group-hover:tracking-0 font-semibold font-ki">
                  Swap your Voice
                </p>
                <DotIcon />
              </div>
            </div>
          </div>

          {/* Right column — canvas (z-10) shows through here */}
          <div className="border-l border-gray" />
        </div>
        </ContainerLayout>
      </div>

      {/* ── 3-D Canvas ── */}
      {/*
        Starts clipped to the right 50% (matching the hero's right column).
        GSAP animates clip-path to 0% as user scrolls.
      */}
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 z-10"
        style={{ clipPath: "inset(0% 0% 0% 50%)" }}
      >
        {/* Border sits inside the clip so it animates with the canvas */}
        <div className="absolute inset-0 border border-gray pointer-events-none z-10" />
        <TownScene progressRef={progressRef} />
      </div>
    </div>
    </>
  );
};

export default Hero;

