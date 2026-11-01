import { FlipWords } from "@/registry/veyl/flip-words";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
});

const words = ["modern", "better", "cute", "beautiful"];

export function FlipWordsDemo() {
  return (
    <div className={`${manrope.className} text-4xl font-normal leading-snug text-neutral-600 dark:text-neutral-400`}>
      Build <FlipWords words={words} className="font-semibold" /> <br />
      websites with Veyl
    </div>
  );
}
