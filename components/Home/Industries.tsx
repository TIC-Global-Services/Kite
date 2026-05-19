"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ContainerLayout from "../Layout/ContainerLayout";

// ── Data ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "media", label: "Media And Entertainment" },
  { id: "ads", label: "Advertising" },
  { id: "security", label: "Security & Defense" },
  { id: "fleet", label: "Fleet Management" },
  { id: "creators", label: "Content Creators" },
];

const PH = "/assets/industry_placeholder.png";

const TAB_CARDS = [
  [
    { title: "Content Research\n& Creation", image: '/icons/industries/research.svg' },
    { title: "Archive\nRepurposing", image: '/icons/industries/archive.svg' },
    { title: "Game Highlights\n& Reels", image: '/icons/industries/highlight.svg' },
    { title: "Performance\nAnalysis & Intel", image: '/icons/industries/analysis.svg' },
  ],
  [
    { title: "Campaign\nIntelligence", image: PH },
    { title: "Audience\nSegmentation", image: PH },
    { title: "Ad Creative\nOptimization", image: PH },
    { title: "Real-Time\nBid Analysis", image: PH },
  ],
  [
    { title: "Threat\nDetection", image: PH },
    { title: "Perimeter\nMonitoring", image: PH },
    { title: "Incident\nResponse AI", image: PH },
    { title: "Intelligence\nSynthesis", image: PH },
  ],
  [
    { title: "Route\nOptimization", image: PH },
    { title: "Predictive\nMaintenance", image: PH },
    { title: "Driver\nBehavior Analysis", image: PH },
    { title: "Fuel\nEfficiency Intel", image: PH },
  ],
  [
    { title: "Trend\nResearch", image: PH },
    { title: "Script\nAssistance", image: PH },
    { title: "Audience\nInsights", image: PH },
    { title: "Content\nScheduling", image: PH },
  ],
];

// ── Card ───────────────────────────────────────────────────────────────────

function Card({
  title,
  image,
  index,
}: {
  title: string;
  image: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: index * 0.06,
          duration: 0.38,
          ease: [0.25, 0.1, 0, 1],
        },
      }}
      whileHover={{
        y: -8,
        scale: 1.025,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      }}
      className="bg-[#d5d1c8] flex flex-col min-h-[40dvh] md:min-h-[60dvh] border border-gray p-6 cursor-default"
    >
      <motion.div
        className="flex-1 relative overflow-hidden"
        whileHover={{
          scale: 1.04,
          transition: { type: "spring", stiffness: 260, damping: 16 },
        }}
      >
        <Image src={image} alt={title} fill className="object-contain p-10" />
      </motion.div>
      <p className="text-[#ff6b00] text-xl leading-snug whitespace-pre-line">
        {title}
      </p>
    </motion.div>
  );
}

// ── Industries ─────────────────────────────────────────────────────────────

export default function Industries() {
  const [activeTab, setActiveTab] = useState(0);
  const direction = useRef(1);
  const prevTab = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCards = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : el.offsetWidth;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  }, []);

  const handleTab = (i: number) => {
    direction.current = i > prevTab.current ? 1 : -1;
    prevTab.current = i;
    setActiveTab(i);
  };

  return (
    <section className="w-full">
      <ContainerLayout disablePaddingY>
        <div className=" border-x border-gray border-b">
          {/* ── Header ── */}
          <div className=" border-b  pt-10 md:pt-20 border-gray">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border-t border-gray">
              <h2 className="text-4xl md:text-6xl leading-[1.05]">
                Customized
                <br />
                Intelligence, Enterprise-Ready
              </h2>
              <div className="flex md:items-end md:justify-end">
                <p className="font-ki text-foreground text-sm md:text-base leading-relaxed max-w-lg">
                  While most AI understands text, Kite understands reality
                  combining visual, auditory, and contextual signals to operate
                  beyond the screen.
                </p>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 px-6 md:px-10 py-4 border-b border-gray overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => handleTab(i)}
                className={`relative px-5 py-3 text-sm border whitespace-nowrap transition-colors duration-200 ${
                  activeTab === i
                    ? "border-primary text-background"
                    : "border-gray text-foreground/60 hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {activeTab === i && (
                  <motion.span
                    layoutId="tab-active-bg"
                    className="absolute inset-0 bg-primary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Cards — slide direction-aware on tab switch ── */}
          <div className="py-6 px-6 md:p-10 md:overflow-hidden">
            <AnimatePresence mode="wait" custom={direction.current}>
              <motion.div
                key={activeTab}
                custom={direction.current}
                initial={{ opacity: 0, x: direction.current * 50 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.32, ease: [0.25, 0.1, 0, 1] },
                }}
                exit={{
                  opacity: 0,
                  x: direction.current * -50,
                  transition: { duration: 0.18, ease: "easeIn" },
                }}
                className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:snap-none gap-4 pb-2 md:pb-0"
                ref={scrollRef as any}
              >
                {TAB_CARDS[activeTab].map((card, i) => (
                  <div key={i} className="snap-center shrink-0 w-[78vw] md:w-auto md:shrink-[unset]">
                    <Card
                      title={card.title}
                      image={card.image}
                      index={i}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Arrow buttons — mobile only */}
            <div className="flex items-center gap-3 mt-4 md:hidden">
              <button
                onClick={() => scrollCards(-1)}
                className="flex items-center justify-center w-10 h-10 border border-gray hover:border-primary transition-colors"
                aria-label="Previous card"
              >
                <Image src="/icons/prev-btn.svg" alt="Previous" width={20} height={20} />
              </button>
              <button
                onClick={() => scrollCards(1)}
                className="flex items-center justify-center w-10 h-10 border border-gray hover:border-primary transition-colors"
                aria-label="Next card"
              >
                <Image src="/icons/next-btn.svg" alt="Next" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </ContainerLayout>
    </section>
  );
}
