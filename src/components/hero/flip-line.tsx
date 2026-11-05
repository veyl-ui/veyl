"use client";

import { motion } from "motion/react";
import { FlipWords } from "@/registry/veyl/flip-words";

// Short words keep the line on one row, even on a phone.
const words = ["alive", "smooth", "fluid", "yours"];

/**
 * The second headline line. Only the flipping word is coloured. The words differ in length,
 * so the whole line glides to stay centred while the word changes, instead of jumping.
 */
export function FlipLine() {
  return (
    <motion.span
      layout="position"
      transition={{ type: "spring", stiffness: 170, damping: 24 }}
      className="inline-block whitespace-nowrap"
    >
      that feel quietly{" "}
      <FlipWords words={words} duration={2800} className="px-0 text-brand-ink dark:text-brand-ink" />
    </motion.span>
  );
}