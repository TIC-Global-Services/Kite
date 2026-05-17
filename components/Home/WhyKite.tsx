"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import ContainerLayout from "../Layout/ContainerLayout";
import MultimodalIcon from "../Reusable/Icons/Multimodal";
import CloudIcon from "../Reusable/Icons/Cloud";
import FineTuningIcon from "../Reusable/Icons/FineTuning";
import ReadyIcon from "../Reusable/Icons/Ready";
import DotIcon from "../Reusable/Icons/DotIcon";

// ── Data ───────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: MultimodalIcon,
    title: "True Multimodal",
    desc: "Native video, image, audio, and text understanding — not bolted-on features.",
  },
  {
    Icon: CloudIcon,
    title: "Deploy Anywhere",
    desc: "Cloud, on-prem, VPC, or fully air-gapped environments.",
  },
  {
    Icon: FineTuningIcon,
    title: "Domain Fine-Tuning",
    desc: "Customize models for your specific use case and data.",
  },
  {
    Icon: ReadyIcon,
    title: "Enterprise Ready",
    desc: "Built for reliability, security, and compliance at scale.",
  },
];

// ── Feature row ────────────────────────────────────────────────────────────

function FeatureRow({
  Icon,
  title,
  desc,
  index,
}: {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 32 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
      className="flex items-center gap-6 p-8 border-b border-gray last:border-b-0 group"
    >
      {/* Icon — draw animation on inView, rotate on group-hover */}
      <div className="shrink-0 transition-transform duration-300 ease-out group-hover:rotate-[-8deg] group-hover:scale-110">
        <Icon className={inView ? "active" : ""} />
      </div>

      {/* Text */}
      <div className="space-y-1 max-w-md">
        <h3 className="text-[#ff6b00] text-2xl">{title}</h3>
        <p className="font-ki text-lg text-foreground/80 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ── WhyKite ────────────────────────────────────────────────────────────────

export default function WhyKite() {
  const leftRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-80px" });

  return (
    <section className="w-full">
      <ContainerLayout disablePaddingY >
        <div className="grid grid-cols-1 md:grid-cols-2 border-x border-b py-20 border-gray">

          {/* ── Left col ── */}
          <div className="flex flex-col border-b  md:border-r border-y border-gray">

            {/* GIF */}
            <motion.div
              className="flex-1 relative overflow-hidden border-b border-gray min-h-75"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <Image
                src="/assets/gif/loop1.gif"
                alt="Kite animation"
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>

            {/* Text panel */}
            <motion.div
              ref={leftRef}
              initial={{ opacity: 0, y: 24 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
              className="p-10 space-y-5"
            >
              {/* Label */}
              <div className="flex items-center gap-2">
                <DotIcon />
                <span className="font-ki text-base text-[#ff6b00] tracking-widest uppercase">
                  Why kite?
                </span>
              </div>

              <h2 className="text-5xl leading-[1.05]">
                Built For<br />The Physical World
              </h2>

              <p className="font-ki text-lg text-foreground/80 leading-relaxed max-w-xl">
                From complex operations to everyday workflows, Kite seamlessly
                adapts to your domain — flexible enough to handle depth, yet
                simple enough for daily use.
              </p>
            </motion.div>
          </div>

          {/* ── Right col: feature rows ── */}
          <div className="flex flex-col justify-center divide-y divide-gray border-y border-gray">
            {FEATURES.map((f, i) => (
              <FeatureRow key={f.title} Icon={f.Icon} title={f.title} desc={f.desc} index={i} />
            ))}
          </div>

        </div>
      </ContainerLayout>
    </section>
  );
}
