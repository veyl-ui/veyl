
import { FlipWords } from "@/registry/veyl/flip-words";
import "@/registry/veyl/flip-words/flip-words.css";

export default function FlipWordsPreviewPage() {
  const words = ["creative", "powerful", "seamless", "dynamic"];

  return (
    <main className="flex min-h-screen justify-center items-center px-4">
      <div className="flex h-[650px] w-[707px] max-w-full items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex h-full w-full items-center justify-center rounded-md bg-white dark:bg-black shadow-sm">
          <div className="flip-words-container text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
            Create <FlipWords words={words} className="font-semibold" /> <br />
            digital experiences effortlessly
          </div>
        </div>
      </div>
    </main>
  );
}