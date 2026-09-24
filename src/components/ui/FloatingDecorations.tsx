"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingIcon {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function FloatingDecorations() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    async function fetchDecorations() {
      try {
        const res = await fetch('/api/decorations');
        const svgs: string[] = await res.json();
        
        if (svgs.length === 0) return;

        // Generate 15 floating icons randomly selecting from the available svgs
        const generated: FloatingIcon[] = Array.from({ length: 15 }).map((_, i) => ({
          id: i,
          src: `/decorations/${svgs[Math.floor(Math.random() * svgs.length)]}`,
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: 30 + Math.random() * 40, // 30px to 70px
          delay: Math.random() * 5, // 0 to 5 seconds
          duration: 15 + Math.random() * 10, // 15 to 25 seconds
        }));

        setIcons(generated);
      } catch (err) {
        console.error("Failed to load decorations", err);
      }
    }

    fetchDecorations();
  }, []);

  if (icons.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          style={{
            position: 'absolute',
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            width: icon.size,
            height: icon.size,
            opacity: 0.15, // Subtle opacity
          }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: icon.duration,
            repeat: Infinity,
            delay: icon.delay,
            ease: "linear",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon.src} alt="" style={{ width: '100%', height: '100%' }} />
        </motion.div>
      ))}
    </div>
  );
}
