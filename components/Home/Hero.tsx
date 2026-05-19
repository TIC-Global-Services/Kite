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
  if (p < 0.25) return 0;    // Place 1
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

  const containerRef       = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileContentRef   = useRef<HTMLDivElement>(null);
  const leftPanelRef       = useRef<HTMLDivElement>(null);
  const canvasWrapperRef   = useRef<HTMLDivElement>(null);

  // Written by GSAP ScrollTrigger onUpdate, read by R3F useFrame — no React state
  const progressRef   = useRef<number>(0);
  const activePlaceRef = useRef<number>(-1);

  const [activePlace, setActivePlace] = useState<number>(-1);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
      if (!mounted) return;
      const triggerEl = isMobile ? mobileContainerRef.current : containerRef.current;
      if (!triggerEl) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 9%",
          end: "+=500%",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (st) => {
            // Clamp at 0.92 (raw ≈ 7.36 in 8-waypoint space, t > 0.3 in last
            // segment so content 8 shows) — prevents camera flying to the
            // dramatic WP8 drone-overview position at the very end of scroll.
            progressRef.current = Math.min(0.92, Math.max(0, (st.progress - 0.2) / 0.8));
            const next = getActivePlace(st.progress);
            if (next !== activePlaceRef.current) {
              activePlaceRef.current = next;
              setActivePlace(next);
              setDotsVisible(st.progress > 0.22);
            }
          },
        },
      });

      if (isMobile) {
        // Mobile: slide content panel up + fade, 3-D was already visible below it
        tl.fromTo(
          mobileContentRef.current,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -60, ease: "power2.in", duration: 0.2 }
        );
      } else {
        // Desktop: expand canvas clip-path + fade left panel
        tl.fromTo(
          canvasWrapperRef.current,
          { clipPath: "inset(0% 0% 0% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.2 }
        );
        tl.fromTo(
          leftPanelRef.current,
          { autoAlpha: 1, x: 0 },
          { autoAlpha: 0, x: -36, ease: "power2.in", duration: 0.18 },
          "<"
        );
      }

      tl.to({}, { duration: 0.8 });
    },
    { dependencies: [isMobile, mounted] }
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

    {/* ── Mobile layout ── */}
    <div ref={mobileContainerRef} className="md:hidden mt-[9dvh] h-[91dvh] relative overflow-hidden">

      {/* Canvas — full-screen, no z-index so overlay's z-30 wins in document context */}
      <div className="absolute inset-0">
        <TownScene progressRef={progressRef} activePlaceIndex={activePlace} isMobile />
      </div>

      {/* Content panel — pinned to top, auto height, 3-D visible below */}
      <div ref={mobileContentRef} className="absolute top-0 left-0 right-0 flex flex-col">
        {/* Waves */}
        <div className="relative bg-[#E3DFD4] overflow-hidden border-b border-gray" style={{ height: "20dvh" }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-full w-full px-4 [mask-image:radial-gradient(circle,black_50%,transparent_90%)]">
              <PlayingWaves barCount={60} analyser={analyser} />
            </div>
          </div>
        </div>

        {/* Title + description */}
        <div className="px-6 py-4 space-y-2 border-b border-gray bg-background">
          <h1 className="text-[clamp(1.5rem,6vw,2.25rem)] leading-[1.1]">
            Make AI see, think,
            <br />
            reason, and execute
          </h1>
          <p className="font-ki text-sm text-foreground/75 leading-relaxed">
            Explore live AI experiences that gather signals from the
            web, organize what matters, and execute tasks autonomously
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 px-4 py-4 border-t border-gray shrink-0 bg-background">
          <PrimaryButton
            onClick={handleTalkClick}
            showIcon={true}
            isPlaying={isListening}
            className="text-xs py-2.5 !px-4 !gap-2 whitespace-nowrap shrink-0"
          >
            {isListening ? "Listening…" : "Talk to Kite"}
          </PrimaryButton>
          <div className="w-0.5 h-5 bg-primary shrink-0" />
          <div className="flex items-center gap-2 cursor-pointer group shrink-0">
            <p className="transition-all duration-300 tracking-tighter group-hover:tracking-0 font-semibold font-ki text-sm whitespace-nowrap">
              Swap your Voice
            </p>
            <DotIcon />
          </div>
        </div>
      </div>
    </div>

    {/* ── Desktop layout ── */}
    <div
      ref={containerRef}
      className="hidden md:block mt-[9dvh] h-[91dvh] relative overflow-hidden"
    >
      {/* ── Left panel (waves + text + buttons) ── */}
      <div
        ref={leftPanelRef}
        className="absolute inset-0 z-20"
      >
        <ContainerLayout
          disablePaddingY
          className="border-x border-b border-gray h-full"
        >
        <div className="grid grid-cols-2 h-full">
          <div className="flex flex-col h-full">
            <div className="flex-1 relative border border-gray overflow-hidden bg-[#E3DFD4]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-full px-4 [mask-image:radial-gradient(circle,black_50%,transparent_90%)]">
                  <PlayingWaves barCount={122} analyser={analyser} />
                </div>
              </div>
            </div>

            <div className="border-x border-gray p-10 space-y-6">
              <h1 className="text-[clamp(2.5rem,6.5dvh,4.75rem)] leading-tight">
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
                className=" text-xs md:text-sm py-3"
              >
                {isListening ? "Listening…" : "Talk to Kite"}
              </PrimaryButton>
              <div className="w-0.5 h-6 bg-primary" />
              <div className="flex items-center gap-3 cursor-pointer group">
                <p className="transition-all text-xs md:text-sm duration-300 tracking-tighter group-hover:tracking-0 font-semibold font-ki">
                  Swap your Voice
                </p>
                <DotIcon />
              </div>
            </div>
          </div>

          {/* Right column — canvas shows through here */}
          <div className="border-l border-gray" />
        </div>
        </ContainerLayout>
      </div>

      {/* ── 3-D Canvas ── */}
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 z-10"
        style={{ clipPath: "inset(0% 0% 0% 50%)" }}
      >
        <div className="absolute inset-0 border border-gray pointer-events-none z-10" />
        <TownScene progressRef={progressRef} activePlaceIndex={activePlace} />
      </div>
    </div>
    </>
  );
};

export default Hero;

