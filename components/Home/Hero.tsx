"use client";

import { useRef, useState, useEffect, Component } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";
import ContainerLayout from "../Layout/ContainerLayout";
import PlayingWaves from "../Reusable/PlayingWaves";
import PrimaryButton from "../Reusable/PrimaryButton";
import DotIcon from "../Reusable/Icons/DotIcon";
import { useAudioAnalyser } from "@/lib/useAudioAnalyser";
import PageLoader from "../Reusable/PageLoader";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Catch WebGL / Three.js crashes so the rest of the page survives
class SceneErrorBoundary extends Component<{ children: ReactNode }, { dead: boolean }> {
  state = { dead: false };
  static getDerivedStateFromError() { return { dead: true }; }
  render() { return this.state.dead ? <div className="w-full h-full" /> : this.props.children; }
}

// Avoid SSR crash — Canvas needs browser WebGL
const TownScene = dynamic(() => import("./TownScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

// ── Scroll progress → which place is active ───────────────────────────────
//
// Scroll phases (0–1 maps to scroll via GSAP pin):
//   0.00 – 0.08  Canvas expands right-half → full-screen, left panel fades
//   0.08 – 0.18  Place 1  (WP 0)
//   0.18 – 0.28  Place 2  (WP 1)
//   0.28 – 0.38  Place 3  (WP 2)
//   0.38 – 0.48  Place 4  (WP 3)
//   0.48 – 0.58  Place 5  (WP 4)
//   0.58 – 0.68  Place 6  (WP 5)
//   0.68 – 0.78  Place 7  (WP 6)
//   0.78 – 0.88  Place 8  (WP 7)
//   0.88 – 1.00  Drone overview — all models (no label)

function getActivePlace(p: number): number {
  if (p < 0.08) return -1;   // expansion phase (no label)
  if (p < 0.18) return 0;    // Place 1
  if (p < 0.28) return 1;    // Place 2
  if (p < 0.38) return 2;    // Place 3
  if (p < 0.48) return 3;    // Place 4
  if (p < 0.58) return 4;    // Place 5
  if (p < 0.68) return 5;    // Place 6
  if (p < 0.78) return 6;    // Place 7
  if (p < 0.88) return 7;    // Place 8
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
          end: isMobile ? "+=600%" : "+=2400%",
          pin: true,
          pinSpacing: true,
          scrub: isMobile ? 1 : 2,
          onUpdate: (st) => {
            // Clamp at 0.92 (raw ≈ 7.36 in 8-waypoint space, t > 0.3 in last
            // segment so content 8 shows) — prevents camera flying to the
            // dramatic WP8 drone-overview position at the very end of scroll.
            progressRef.current = Math.min(0.92, Math.max(0, (st.progress - 0.08) / 0.92));
            const next = getActivePlace(st.progress);
            if (next !== activePlaceRef.current) {
              activePlaceRef.current = next;
              setActivePlace(next);
              setDotsVisible(st.progress > 0.10);
            }
          },
        },
      });

      if (isMobile) {
        // Mobile: slide content panel up + fade, 3-D was already visible below it
        tl.fromTo(
          mobileContentRef.current,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -60, ease: "power2.in", duration: 0.08 }
        );
      } else {
        // Desktop: expand canvas clip-path + fade left panel
        tl.fromTo(
          canvasWrapperRef.current,
          { clipPath: "inset(0% 0% 0% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.08 }
        );
        tl.fromTo(
          leftPanelRef.current,
          { autoAlpha: 1, x: 0 },
          { autoAlpha: 0, x: -36, ease: "power2.in", duration: 0.07 },
          "<"
        );
      }

      tl.to({}, { duration: 0.92 });
    },
    { dependencies: [isMobile, mounted] }
  );

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <>
    {/* ── Full-page loader ── */}
    <PageLoader progress={progress} visible={!sceneLoaded} />

    {/* ── Mobile layout ── */}
    <div ref={mobileContainerRef} className="md:hidden mt-[9dvh] h-[91dvh] relative overflow-hidden">

      {/* Canvas — only mount after we know this is mobile, prevents double WebGL context */}
      <div className="absolute inset-0">
        {mounted && isMobile && (
          <SceneErrorBoundary>
            <TownScene progressRef={progressRef} activePlaceIndex={activePlace} isMobile />
          </SceneErrorBoundary>
        )}
      </div>

      {/* Content panel — full height, transparent middle lets 3-D show through */}
      <div ref={mobileContentRef} className="absolute inset-0 flex flex-col">
        {/* Title + description */}
        <div className="px-6 py-4 space-y-2 md:border-b border-gray bg-background shrink-0">
          <h1 className="text-[clamp(1.5rem,7vw,2.25rem)] leading-[1.1]">
            Make AI see, think,
            <br />
            reason, and execute
          </h1>
          <p className="font-ki text-sm text-foreground/75 leading-relaxed">
            Explore live AI experiences that gather signals from the
            web, organize what matters, and execute tasks autonomously
          </p>
        </div>

        {/* 3D shows through here */}
        <div className="flex-1" />

        {/* Waves */}
        <div className="relative bg-[#E3DFD4] overflow-hidden border-t border-gray shrink-0" style={{ height: "20dvh" }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-full w-full px-4 [mask-image:radial-gradient(circle,black_50%,transparent_90%)]">
              <PlayingWaves barCount={60} analyser={analyser} />
            </div>
          </div>
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

            <div className="border-x border-gray p-6 space-y-6">
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

            <div className="flex items-center gap-6 p-6 border-x border-t border-gray">
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

      {/* ── 3-D Canvas — only mount after we know this is desktop, prevents double WebGL context ── */}
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 z-10"
        style={{ clipPath: "inset(0% 0% 0% 50%)" }}
      >
        <div className="absolute inset-0 border border-gray pointer-events-none z-10" />
        {mounted && !isMobile && (
          <SceneErrorBoundary>
            <TownScene progressRef={progressRef} activePlaceIndex={activePlace} />
          </SceneErrorBoundary>
        )}
      </div>
    </div>
    </>
  );
};

export default Hero;

