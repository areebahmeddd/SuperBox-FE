"use client";

import { motion } from "framer-motion";

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute w-full h-full opacity-[0.08]"
        style={{ filter: "blur(2px)" }}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5252" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#ff5252" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff5252" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave1)"
          d="M0,400 Q240,280 480,380 T960,400 Q1200,420 1440,360 L1440,800 L0,800 Z"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="M0,400 Q240,280 480,380 T960,400 Q1200,420 1440,360 L1440,800 L0,800 Z;
                    M0,360 Q240,420 480,340 T960,380 Q1200,300 1440,400 L1440,800 L0,800 Z;
                    M0,400 Q240,280 480,380 T960,400 Q1200,420 1440,360 L1440,800 L0,800 Z"
          />
        </path>
      </svg>

      <svg
        className="absolute w-full h-full opacity-[0.1]"
        style={{ filter: "blur(2.5px)" }}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff5252" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ff5252" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff5252" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave2)"
          d="M0,520 Q360,440 720,500 T1440,480 L1440,800 L0,800 Z"
        >
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="M0,520 Q360,440 720,500 T1440,480 L1440,800 L0,800 Z;
                    M0,480 Q360,560 720,460 T1440,520 L1440,800 L0,800 Z;
                    M0,520 Q360,440 720,500 T1440,480 L1440,800 L0,800 Z"
          />
        </path>
      </svg>

      <svg
        className="absolute w-full h-full opacity-[0.12]"
        style={{ filter: "blur(3px)" }}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="wave3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff5252" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ff5252" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff5252" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave3)"
          d="M0,320 Q180,240 360,300 T720,320 Q900,340 1080,300 T1440,280 L1440,800 L0,800 Z"
        >
          <animate
            attributeName="d"
            dur="4.5s"
            repeatCount="indefinite"
            values="M0,320 Q180,240 360,300 T720,320 Q900,340 1080,300 T1440,280 L1440,800 L0,800 Z;
                    M0,280 Q180,360 360,260 T720,300 Q900,240 1080,340 T1440,320 L1440,800 L0,800 Z;
                    M0,320 Q180,240 360,300 T720,320 Q900,340 1080,300 T1440,280 L1440,800 L0,800 Z"
          />
        </path>
      </svg>

      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#ff5252]/5 via-transparent to-transparent" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  );
}
