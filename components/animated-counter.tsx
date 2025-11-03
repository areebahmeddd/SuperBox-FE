"use client";

import { useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }

    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [isInView, spring, value, display]);

  return <span ref={ref}>{displayValue}</span>;
}
