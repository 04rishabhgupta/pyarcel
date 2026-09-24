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

        // Virtual Grid logic: 3 columns x 5 rows = 15 cells total
        const COLS = 3;
        const ROWS = 5;
        const generated: FloatingIcon[] = [];

        for (let i = 0; i < COLS * ROWS; i++) {
          const row = Math.floor(i / COLS);
          const col = i % COLS;

          // Base percentages for this cell
          const cellWidth = 100 / COLS;
          const cellHeight = 100 / ROWS;

          // Exact starting coordinate + random offset within the cell bounds
          const x = (col * cellWidth) + (Math.random() * (cellWidth * 0.8));
          const y = (row * cellHeight) + (Math.random() * (cellHeight * 0.8));

          generated.push({
            id: i,
            src: `/decorations/${svgs[Math.floor(Math.random() * svgs.length)]}`,
            x,
            y,
            size: 30 + Math.random() * 40, // 30px to 70px
            delay: Math.random() * 5, // 0 to 5 seconds
            duration: 8 + Math.random() * 8, // 8 to 16 seconds
          });
        }

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
      {icons.map((icon) => {
        // Randomize the animation limits slightly per icon
        const yDelta = 15 + Math.random() * 20;
        const xDelta = 10 + Math.random() * 15;
        const rotDelta = 8 + Math.random() * 10;
        
        return (
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
              y: [0, -yDelta, 0],
              x: [0, xDelta, -xDelta, 0],
              rotate: [0, rotDelta, -rotDelta, 0],
            }}
            transition={{
              duration: icon.duration,
              repeat: Infinity,
              delay: icon.delay,
              ease: "easeInOut",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon.src} alt="" style={{ width: '100%', height: '100%' }} />
          </motion.div>
        );
      })}
    </div>
  );
}
