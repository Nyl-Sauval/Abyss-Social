import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  wobbleX1: number;
  wobbleX2: number;
}

interface SeaCreature {
  id: number;
  emoji: string;
  size: number;
  top: number;
  duration: number;
  delay: number;
  direction: number;
  yAmplitude: number;
  repeatDelay: number;
  innerDuration: number;
}

export const BubbleBackground: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [bubbles] = useState<Bubble[]>(() => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < 25; i++) {
      newBubbles.push({
        id: i,
        size: Math.random() * 40 + 10, // Size between 10px and 50px
        left: Math.random() * 100, // Left position 0-100%
        duration: Math.random() * 10 + 10, // Animation duration between 10s and 20s
        delay: Math.random() * 10, // Animation delay up to 10s
        wobbleX1: Math.random() * 50 - 25,
        wobbleX2: Math.random() * 50 - 25,
      });
    }
    return newBubbles;
  });

  const [creatures] = useState<SeaCreature[]>(() => {
    const emojis = ['🦈', '🦈', '🐟', '🐠', '🐡', '🐙', '🦀', '🐬', '🐳', '🐢', '🦑', '🦈'];
    const newCreatures: SeaCreature[] = [];
    for (let i = 0; i < 15; i++) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      newCreatures.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 3 + 2, // 2rem to 5rem
        top: Math.random() * 80 + 10, // 10% to 90% from top
        duration: Math.random() * 20 + 15, // 15s to 35s
        delay: Math.random() * 20, // 0 to 20s
        direction: direction,
        yAmplitude: Math.random() * 15 + 5, // 5px to 20px wobble
        repeatDelay: Math.random() * 5 + 2, // wait a bit before re-entering
        innerDuration: Math.random() * 2 + 2,
      });
    }
    return newCreatures;
  });

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.div
          key={`bubble-${bubble.id}`}
          className="absolute bottom-[-100px] rounded-full border border-secondary/40 bg-gradient-to-tr from-secondary/10 to-secondary/30 backdrop-blur-sm"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
          }}
          animate={{
            y: [0, -1200], // Float up
            x: [0, bubble.wobbleX1, bubble.wobbleX2, 0], // Slight wobble
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Sea Creatures Animation */}
      {creatures.map((creature) => {
        const startX = creature.direction === 1 ? '-20vw' : '120vw';
        const endX = creature.direction === 1 ? '120vw' : '-20vw';
        
        return (
          <motion.div
            key={`creature-${creature.id}`}
            className="absolute z-10 opacity-70"
            style={{ 
              top: `${creature.top}%`,
              fontSize: `${creature.size}rem`,
              transform: `scaleX(${creature.direction === 1 ? -1 : 1})`
            }}
            animate={{
              x: [startX, endX],
            }}
            transition={{
              duration: creature.duration,
              delay: creature.delay,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: creature.repeatDelay, // wait a bit before re-entering
            }}
          >
            <motion.div
              animate={{ y: [-creature.yAmplitude, creature.yAmplitude, -creature.yAmplitude] }}
              transition={{ duration: creature.innerDuration, repeat: Infinity, ease: "easeInOut" }}
            >
              {creature.emoji}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
