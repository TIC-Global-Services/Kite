"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import ContainerLayout from "../Layout/ContainerLayout";

// ── Data ───────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "Orchestrate Intelligence",
    desc: "Eliminate the friction between isolated AI systems with the Orchestrator, a universal runtime where specialized agents seamlessly collaborate as one coordinated workforce.",
    subtitle: "What It Enables:",
    bullets: [
      "Universal Framework Interoperability",
      "Cross-Platform Coordination",
      "Unified State Management",
      "Standardized Protocols",
    ],
    footer:
      "Backed by award-winning research and trusted by millions of developers through AutoGen and StateFlow.",
    img: "/assets/process/1.png",
  },
  {
    title: "Build & Evolve",
    desc: "Push your AI workflows to production with zero infrastructure friction. Kite handles orchestration, load balancing, and failover — so your agents stay resilient under any load.",
    subtitle: "What It Enables:",
    bullets: [
      "One-Click Production Deployment",
      "Auto-Scaling Agent Pools",
      "Built-in Failover & Retry Logic",
      "Edge & Cloud Agnostic Runtime",
    ],
    footer:
      "Trusted by enterprise teams shipping millions of agent calls daily with sub-100ms median latency.",
    img: "/assets/process/2.png",
  },
  {
    title: "Deploy Everywhere",
    desc: "Gain full observability into every agent decision, token spend, and workflow bottleneck. Continuously improve performance with actionable real-time insights.",
    subtitle: "What It Enables:",
    bullets: [
      "Real-Time Trace Visualization",
      "Token & Cost Attribution",
      "Latency Heatmaps per Agent",
      "Automated Regression Detection",
    ],
    footer:
      "Purpose-built dashboards designed for ML engineers and platform teams who demand production-grade visibility.",
    img: "/assets/process/3.png",
  },
];

// ── Slide variants ─────────────────────────────────────────────────────────

const EASE_OUT = [0.25, 0.1, 0, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.3, ease: EASE_IN },
  }),
};

const bulletVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: EASE_OUT },
  }),
};

// ── Process ────────────────────────────────────────────────────────────────

export default function Process() {
  const [index, setIndex] = useState(0);
  const direction = useRef(1);

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const step = STEPS[index];
  const total = STEPS.length;

  function go(delta: number) {
    direction.current = delta;
    setIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <section ref={sectionRef} className="w-full ">
      <ContainerLayout disablePaddingY>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0, 1] }}
          className="border-x border-gray"
        >
          {/* ── Top spacer row ──────────────────────────────────────────── */}
          <div className="hidden md:grid grid-cols-2 border-b border-gray h-20">
            <div className="border-r border-gray" />
            <div />
          </div>

          {/* ── Main content row ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] border-b border-gray">

            {/* [R1,C1] Dark header */}
            <div className="bg-primary px-6 md:px-10 py-8 md:py-12 border-b border-gray md:border-r">
              <AnimatePresence mode="wait" custom={direction.current}>
                <motion.h2
                  key={index}
                  custom={direction.current}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-background text-2xl md:text-5xl font-light leading-snug"
                >
                  {step.title}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* [R1,C2] Desktop: empty top-right with arrows pinned bottom-right */}
            <div className="relative border-b border-gray hidden md:block">
              <div className="absolute bottom-0 right-0 flex border border-gray">
                <motion.button
                  onClick={() => go(-1)}
                  whileHover={{ backgroundColor: "rgba(44,59,78,0.06)" }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="px-5 py-4 border-r border-gray cursor-pointer"
                  aria-label="Previous"
                >
                  <Image src="/icons/prev-btn.svg" alt="prev" width={20} height={20} />
                </motion.button>
                <motion.button
                  onClick={() => go(1)}
                  whileHover={{ backgroundColor: "rgba(44,59,78,0.06)" }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="px-5 py-4 cursor-pointer"
                  aria-label="Next"
                >
                  <Image src="/icons/next-btn.svg" alt="next" width={20} height={20} />
                </motion.button>
              </div>
            </div>

            {/* Mobile-only: image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: EASE_IN } }}
                className="md:hidden border-b border-gray bg-[#f0ede6] flex items-center justify-center p-8"
                style={{ minHeight: "40vw" }}
              >
                <Image
                  src={step.img}
                  alt={step.title}
                  width={400}
                  height={400}
                  className="w-full max-w-[280px] h-auto object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* [R2,C1] Content */}
            <AnimatePresence mode="wait" custom={direction.current}>
              <motion.div
                key={index}
                custom={direction.current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="px-6 md:px-10 py-8 md:py-12 flex flex-col gap-5 font-ki md:border-r border-gray"
              >
                <p className="text-foreground text-sm md:text-lg leading-relaxed">
                  {step.desc}
                </p>
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-[#ff6b00] text-base md:text-lg">{step.subtitle}</h4>
                  <ul className="flex flex-col gap-1.5">
                    {step.bullets.map((b, i) => (
                      <motion.li
                        key={b}
                        custom={i}
                        variants={bulletVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-foreground text-sm md:text-lg flex items-start gap-2"
                      >
                        <span className="text-foreground/40 shrink-0">-</span>
                        {b}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <p className="text-foreground text-sm md:text-lg leading-relaxed mt-auto pt-2 border-t border-gray/40">
                  {step.footer}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* [R2,C2] Desktop: image */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0, 1] }}
                  >
                    <Image
                      src={step.img}
                      alt={step.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile-only arrows + step counter */}
            <div className="flex md:hidden items-center border-t border-gray">
              <motion.button
                onClick={() => go(-1)}
                whileHover={{ backgroundColor: "rgba(44,59,78,0.06)" }}
                whileTap={{ scale: 0.92 }}
                className="px-5 py-4 border-r border-gray cursor-pointer"
                aria-label="Previous"
              >
                <Image src="/icons/prev-btn.svg" alt="prev" width={20} height={20} />
              </motion.button>
              <motion.button
                onClick={() => go(1)}
                whileHover={{ backgroundColor: "rgba(44,59,78,0.06)" }}
                whileTap={{ scale: 0.92 }}
                className="px-5 py-4 border-r border-gray cursor-pointer"
                aria-label="Next"
              >
                <Image src="/icons/next-btn.svg" alt="next" width={20} height={20} />
              </motion.button>
              <span className="font-ki text-sm text-foreground/40 px-5">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

          </div>

          {/* ── Bottom spacer row ───────────────────────────────────────── */}
          <div className="hidden md:grid grid-cols-2 h-20">
            <div className="border-r border-gray" />
            <div />
          </div>
        </motion.div>
      </ContainerLayout>
    </section>
  );
}
