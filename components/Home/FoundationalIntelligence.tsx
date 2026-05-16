"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ContainerLayout from "../Layout/ContainerLayout";
import Image from "next/image";

// ── Data ───────────────────────────────────────────────────────────────────

const CARDS = [
  {
    title: "Vision",
    iconSrc: "/icons/intelligence/vision.svg",
    desc: "Understands visual data across images and video in real time — identifying patterns, objects, and context to interpret the physical world with accuracy.",
  },
  {
    title: "Reasoning",
    iconSrc: "/icons/intelligence/reasoning.svg",
    desc: "Analyzes complexity, breaks down tasks, and makes informed decisions — enabling structured thinking and intelligent execution across workflows.",
  },
  {
    title: "Speech",
    iconSrc: "/icons/intelligence/lang.svg",
    desc: "Listens, understands, and responds naturally — enabling seamless, human-like communication between users and intelligent systems.",
  },
];

// ── Floating orb ───────────────────────────────────────────────────────────

function FloatingOrb({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="w-28 h-28 rounded-full shrink-0"
      style={{
        background:
          "radial-gradient(circle at 38% 32%, #3d5270 0%, #1e2d3e 50%, #0f1c2a 100%)",
        boxShadow:
          "inset -8px -8px 24px rgba(0,0,0,0.65), inset 5px 5px 14px rgba(255,255,255,0.04), 0 16px 48px rgba(0,0,0,0.55)",
      }}
      animate={{ y: [0, -14, 0] }}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

function CapabilityCard({
  title,
  iconSrc,
  desc,
  index,
}: {
  title: string;
  iconSrc: string;
  desc: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.55,
        ease: [0.25, 0.1, 0, 1],
      }}
      className="relative flex flex-col min-h-[380px] justify-between p-8 border-b border-gray md:border-b-0 md:border-r last:border-0 group cursor-default"
      whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
    >
      {/* Title row */}
      <div className="flex items-center gap-3">
        <motion.h3
          className="text-[#ff6b00] text-3xl font-light"
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.15 + 0.1, duration: 0.4 }}
        >
          {title}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.15 + 0.25, duration: 0.4 }}
        >
          <Image src={iconSrc} alt={title} width={28} height={28} />
        </motion.div>
      </div>

      {/* Description */}
      <motion.p
        className="font-ki text-lg text-background leading-relaxed mt-6"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.35, duration: 0.45 }}
      >
        {desc}
      </motion.p>
    </motion.div>
  );
}

// ── FoundationalIntelligence ───────────────────────────────────────────────

export default function FoundationalIntelligence() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="w-full bg-primary">
      <ContainerLayout disablePaddingY>
        <div className="border-x border-b border-gray py-20">
          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
            className="text-center py-10 px-6  border-t border-gray"
          >
            <h2 className="text-background text-5xl font-light mb-6 leading-tight">
              Foundational Intelligence
            </h2>
            <p className="font-ki text-background text-base max-w-2xl mx-auto leading-relaxed">
              Everything Kite does is powered by three core, native capabilities
              that drive how it understands, decides, and acts.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-gray">
            {CARDS.map((card, i) => (
              <CapabilityCard key={card.title} {...card} index={i} />
            ))}
          </div>
        </div>
      </ContainerLayout>
    </section>
  );
}
