import type { FaqItem } from "@/registry/veyl/faq";

export const faqItems: FaqItem[] = [
  {
    category: "Getting started",
    question: "Is Veyl a package I install?",
    answer:
      "No. You run one command and the component's files are added to your project. There is nothing to keep updated, and the code is yours.",
  },
  {
    category: "Getting started",
    question: "What do I need to use it?",
    answer:
      "A React project with Tailwind CSS. Some components also use Motion. Each docs page lists exactly what that component needs.",
  },
  {
    category: "Getting started",
    question: "How long does it take to add one?",
    answer: "About a minute. Run the install command, import the component, and it is on your page.",
  },
  {
    category: "Using components",
    question: "Does it work outside Next.js?",
    answer:
      "Yes. The components are plain React. Where a router is involved, like the Drop Navbar, you pass in your own link component.",
  },
  {
    category: "Using components",
    question: "Do the components work on mobile?",
    answer:
      "Yes. Each one adapts to small screens. Use the Mobile view in the Components section to see it on a phone.",
  },
  {
    category: "Using components",
    question: "What about dark mode and reduced motion?",
    answer:
      "Both are built in. Dark mode follows your theme, and people who prefer reduced motion get calm, still versions.",
  },
  {
    category: "Project",
    question: "Is it free to use?",
    // Placeholder until the license is chosen.
    answer: "Yes. Veyl is free to use in personal and commercial projects. License details will be linked here.",
  },
  {
    category: "Project",
    question: "Can I change the components?",
    answer:
      "Yes, that is the point. The code lives in your project, so you can edit anything to match your brand.",
  },
];