import { motion } from "framer-motion";
import type { ReactNode } from "react";

// A small, reusable scroll-reveal wrapper: content fades and slides up
// into place the first time it scrolls into view. Used across the site
// to give sections a bit of premium, editorial motion instead of
// everything just appearing statically.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
