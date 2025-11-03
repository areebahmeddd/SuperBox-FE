"use client";

import { motion } from "framer-motion";

export default function GradientLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-3xl"
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
        <defs>
          <linearGradient
            id="lineGradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#06b6d4", stopOpacity: 0.2 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#06b6d4", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#3b82f6", stopOpacity: 0.2 }}
            />
          </linearGradient>

          <linearGradient
            id="lineGradient2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#3b82f6", stopOpacity: 0.2 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#06b6d4", stopOpacity: 0.2 }}
            />
          </linearGradient>

          <linearGradient
            id="lineGradient3"
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#ec4899", stopOpacity: 0.2 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#06b6d4", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#ec4899", stopOpacity: 0.2 }}
            />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`diag1-${i}`}
            x1={`${i * 15}%`}
            y1="0%"
            x2={`${i * 15 + 40}%`}
            y2="100%"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`diag2-${i}`}
            x1={`${100 - i * 15}%`}
            y1="0%"
            x2={`${60 - i * 15}%`}
            y2="100%"
            stroke="url(#lineGradient2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.3 + 0.5,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {[...Array(4)].map((_, i) => (
          <motion.line
            key={`horiz-${i}`}
            x1="0%"
            y1={`${20 + i * 20}%`}
            x2="100%"
            y2={`${20 + i * 20}%`}
            stroke="url(#lineGradient3)"
            strokeWidth="1.5"
            strokeDasharray="10 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 5,
              delay: i * 0.5 + 1,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          />
        ))}

        {[...Array(12)].map((_, i) => {
          const cx = 15 + ((i * 55) % 85);
          const cy = 15 + ((i * 35) % 75);
          return (
            <g key={`node-${i}`}>
              <motion.circle
                cx={`${cx}%`}
                cy={`${cy}%`}
                r="6"
                fill="#06b6d4"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1, 1.2, 0],
                  opacity: [0, 1, 1, 1, 0],
                }}
                transition={{
                  duration: 5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              <motion.circle
                cx={`${cx}%`}
                cy={`${cy}%`}
                r="6"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{
                  scale: [1, 2.5, 3],
                  opacity: [0.8, 0.3, 0],
                }}
                transition={{
                  duration: 5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </g>
          );
        })}

        {[...Array(6)].map((_, i) => {
          const startX = 20 + i * 30;
          const startY = 20 + i * 15;
          const endX = startX + 40;
          const endY = startY + 30;

          return (
            <motion.path
              key={`path-${i}`}
              d={`M ${startX}% ${startY}% Q ${startX + 20}% ${startY + 40}% ${endX}% ${endY}%`}
              stroke="url(#lineGradient1)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 6,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          );
        })}
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </div>
  );
}
