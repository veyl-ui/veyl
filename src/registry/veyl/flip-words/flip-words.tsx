"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type FlipWordsProps = {
  /** The words to cycle through, in order. */
  words: string[];
  /** How long each word stays on screen, in milliseconds. */
  duration?: number;
  /** Classes for the animated word (colour, size, weight, etc.). */
  className?: string;
};

export function FlipWords({ words, duration = 3000, className }: FlipWordsProps) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const word = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
          position: "absolute",
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2 [perspective:1000px]",
          className,
        )}
        key={currentWord}
      >
        {currentWord.split("").map((letter, index) => (
          <motion.span
            key={currentWord + index}
            initial={{ rotateX: 0, opacity: 0 }}
            animate={{ rotateX: 360, opacity: 1 }}
            exit={{ rotateX: 360, opacity: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.6,
              type: "spring",
              stiffness: 150,
              damping: 12,
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}