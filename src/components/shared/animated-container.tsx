"use client";

import { motion } from "framer-motion";

type AnimatedContainerProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function AnimatedContainer({
  children,
  delay = 0,
  className,
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}