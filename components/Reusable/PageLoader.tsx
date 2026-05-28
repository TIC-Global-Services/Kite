"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ── Cyber scramble hook ────────────────────────────────────────────────────

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function useScramble(text: string, startDelay = 0, duration = 250) {
  const [display, setDisplay] = useState(text);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let iid: ReturnType<typeof setInterval>;
    let elapsed = 0;

    const tid = setTimeout(() => {
      setDisplay(text.split("").map(c => (c === " " ? " " : rand())).join(""));
      iid = setInterval(() => {
        elapsed += 50;
        if (elapsed >= duration) {
          clearInterval(iid);
          setDisplay(text);
        } else {
          setDisplay(text.split("").map(c => (c === " " ? " " : rand())).join(""));
        }
      }, 50);
    }, startDelay);

    return () => { clearTimeout(tid); clearInterval(iid); };
  }, [text, startDelay, duration, trigger]);

  const rescramble = () => setTrigger(t => t + 1);
  return [display, rescramble] as const;
}

// ── Status text ────────────────────────────────────────────────────────────

function statusLabel(progress: number) {
  if (progress < 30) return "Initializing Intelligence Runtime...";
  if (progress < 60) return "Loading 3D Environment...";
  if (progress < 90) return "Preparing Visual Systems...";
  return "Almost Ready...";
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PageLoader({ progress, visible }: { progress: number; visible: boolean }) {
  const [left,  rescrambleLeft]  = useScramble("FLY ABOVE", 0, 250);
  const [right, rescrambleRight] = useScramble("THE NOISE", 0, 250);

  const handleHover = () => { rescrambleLeft(); rescrambleRight(); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0, 1] }}
        >
          {/* FLY ABOVE [kite] THE NOISE */}
          <div
            className="flex items-center gap-6 md:gap-10 cursor-default"
            onMouseEnter={handleHover}
          >
            <motion.span
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.1, 0, 1] }}
              className="text-white text-xl md:text-4xl font-bold font-ki select-none"
            >
              {left}
            </motion.span>

            {/* Kite — pops in with spring, then floats forever */}
            <motion.div
              initial={{ scale: 0, rotate: -160 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                className="relative w-14 h-14 md:w-20 md:h-20 shrink-0"
              >
                <Image src="/assets/kite.png" alt="Kite" fill className="object-contain" priority />
              </motion.div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.55, ease: [0.25, 0.1, 0, 1] }}
              className="text-white text-xl md:text-4xl font-bold font-ki select-none"
            >
              {right}
            </motion.span>
          </div>

          {/* Progress + status */}
          <div className="absolute bottom-16 flex flex-col items-center gap-2">
            <p className="text-white text-2xl md:text-3xl font-bold font-ki">
              {Math.round(progress)}%
            </p>
            <p className="text-white/40 text-[11px] font-ki">
              {statusLabel(progress)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
