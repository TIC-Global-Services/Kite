"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface WaveIconProps {
  isPlaying?: boolean;
  color?: string;
  className?: string;
}

const WaveIcon: React.FC<WaveIconProps> = ({ 
  isPlaying = false, 
  color = '#EC7A4E', // Orange accent color
  className = '' 
}) => {
  const bars = [1, 2, 3]; // The three vertical lines

  const barVariants: Variants = {
    // When playing, the lines pulse vertically
    animate: (i: number) => ({
      height: ['30%', '100%', '50%', '30%'],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeInOut"
      }
    }),
    // When static (stopped or loading), they sit still
    static: {
      height: '30%',
    }
  };

  return (
    <div className={`flex items-center justify-center gap-[3px] h-4 w-4 ${className}`}>
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full"
          style={{ backgroundColor: color }}
          variants={barVariants}
          // Only play if isPlaying is true
          animate={isPlaying ? "animate" : "static"}
          custom={i}
          initial="static"
        />
      ))}
    </div>
  );
};

export default WaveIcon;