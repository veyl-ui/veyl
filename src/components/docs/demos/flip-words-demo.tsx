import { FlipWords } from "@/registry/veyl/flip-words";

const words = ["modern", "better", "cute", "beautiful"];

export function FlipWordsDemo() {
  return (
    <div className="text-4xl font-normal leading-snug text-neutral-600 dark:text-neutral-400">
      Build <FlipWords words={words} /> <br />
      websites with Veyl
    </div>
  );
}
