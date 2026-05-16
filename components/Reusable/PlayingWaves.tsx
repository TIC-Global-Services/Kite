"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface PlayingWavesProps {
  barCount?: number;
  className?: string;
  /** When provided, bar heights are driven by real audio data via RAF */
  analyser?: AnalyserNode | null;
}

// Deterministic pseudo-random — no hydration mismatch
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const SPEED_GROUPS = [2.6, 1.8, 1.1]; // slow · mid · fast  (idle is slower now)

const PlayingWaves: React.FC<PlayingWavesProps> = ({
  barCount = 40,
  className = "",
  analyser = null,
}) => {
  // Refs for active-mode direct DOM updates (no re-renders)
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  // Pre-compute per-bar config once
  const bars = useMemo(() => {
    const center = (barCount - 1) / 2;
    return Array.from({ length: barCount }, (_, i) => {
      const dist = Math.abs(i - center) / center;
      const envelope = Math.pow(1 - dist, 1.8);
      const r = (o: number) => seededRand(i * 137 + o);

      const sinePhase = Math.sin(i * 0.32) * 0.55;
      const delay = sinePhase + i * 0.014;
      const duration = SPEED_GROUPS[i % 3] + r(1) * 0.5;

      const minH = Math.max(envelope * 10, 3);
      const maxH = Math.max(envelope * 96, 10);
      const span = maxH - minH;

      const heights = [
        minH,
        minH + span * (0.25 + r(2) * 0.25),
        minH + span * (0.65 + r(3) * 0.28),
        maxH,
        minH + span * (0.45 + r(4) * 0.30),
        minH + span * (0.15 + r(5) * 0.20),
        minH,
      ].map((h) => `${h.toFixed(1)}%`);

      const base = 0.28 + envelope * 0.72;
      const opacityFrames = [
        base * 0.6,
        base * 0.85,
        base,
        1,
        base * 0.85,
        base * 0.65,
        base * 0.6,
      ];

      return { id: i, duration, delay, heights, opacityFrames, envelope };
    });
  }, [barCount]);

  // Active mode: RAF loop reads analyser and directly sets bar heights
  useEffect(() => {
    if (!analyser) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    const center = (barCount - 1) / 2;

    const tick = () => {
      analyser.getByteFrequencyData(data);

      barRefs.current.forEach((bar, i) => {
        if (!bar) return;

        // Map each bar to a frequency bin — lower 65% of spectrum (voice fundamentals)
        const binIndex = Math.floor((i / barCount) * data.length * 0.65);
        const raw = data[binIndex] / 255; // 0 → 1

        // Power curve boosts quiet signals (normal speech sits around 0.1–0.3)
        const boosted = Math.pow(raw, 0.4);

        // Bell envelope only caps the ceiling — not applied to the multiplier
        const dist = Math.abs(i - center) / center;
        const envelope = Math.pow(1 - dist, 1.6);

        const minH = Math.max(envelope * 6, 3);
        const maxH = 8 + envelope * 88; // edge bars max ~8%, center ~96%
        const h = minH + boosted * (maxH - minH);

        bar.style.height = `${h}%`;
        bar.style.opacity = String(0.4 + boosted * 0.6);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, barCount]);

  const isActive = analyser !== null;

  return (
    <div
      className={`flex items-end justify-center gap-[3px] h-full w-full ${className}`}
    >
      {bars.map((bar, i) =>
        isActive ? (
          // Active mode: plain div driven by RAF
          <div
            key={bar.id}
            ref={(el) => { barRefs.current[i] = el; }}
            className="rounded-full shrink-0 transition-[height] duration-75"
            style={{
              width: "3px",
              height: `${Math.max(bar.envelope * 4, 2)}%`,
              backgroundColor: "var(--color-primary, #2C3B4E)",
              opacity: 0.28 + bar.envelope * 0.72,
            }}
          />
        ) : (
          // Idle mode: framer-motion ambient animation
          <motion.div
            key={bar.id}
            className="rounded-full shrink-0"
            style={{
              width: "3px",
              backgroundColor: "var(--color-primary, #2C3B4E)",
            }}
            animate={{
              height: bar.heights,
              opacity: bar.opacityFrames,
            }}
            transition={{
              duration: bar.duration,
              repeat: Infinity,
              delay: bar.delay,
              ease: [0.42, 0, 0.58, 1],
              times: [0, 0.15, 0.38, 0.56, 0.72, 0.88, 1],
            }}
          />
        )
      )}
    </div>
  );
};

export default PlayingWaves;
