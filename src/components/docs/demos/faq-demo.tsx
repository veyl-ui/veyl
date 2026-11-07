import { Faq } from "@/registry/veyl/faq";

const items = [
  {
    category: "Getting started",
    question: "Is this a package I install?",
    answer: "No. One command adds the component's files to your project, and the code is yours.",
  },
  {
    category: "Getting started",
    question: "What do I need to use it?",
    answer: "A React project with Tailwind CSS. Nothing else.",
  },
  {
    category: "Customising",
    question: "Can I change the colours?",
    answer: "Yes. Override the --fq-* variables on the className, or edit faq.css directly.",
  },
  {
    category: "Customising",
    question: "Does it work in dark mode?",
    answer: "Yes. It follows the class-based dark variant, and every colour is a variable.",
  },
];

export function FaqDemo() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <Faq items={items} eyebrow="FAQ" title="Questions, answered" />
    </div>
  );
}