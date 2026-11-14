/** Everything the License page says, in one place. The LICENSE file in the repo root must match FULL_TEXT. */
export const REPO = "https://github.com/veyl-ui/veyl";
export const COPYRIGHT = "Copyright (c) 2026 Veyl-ui";

/** A piece of the licence text. A { mark } piece is a phrase the highlighter sweeps over. */
export type Seg = string | { mark: string };

export const GRANT: Seg[] = [
  'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software ',
  { mark: "without restriction" },
  ", including without limitation the rights to ",
  { mark: "use, copy, modify, merge, publish, distribute, sublicense, and/or sell" },
  " copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
];

export const NOTICE: Seg[] = [
  "The above copyright notice and this permission notice ",
  { mark: "shall be included" },
  " in all copies or substantial portions of the Software.",
];

export const WARRANTY =
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.';

const flat = (segs: Seg[]) => segs.map((s) => (typeof s === "string" ? s : s.mark)).join("");

export const FULL_TEXT = ["MIT License", COPYRIGHT, flat(GRANT), flat(NOTICE), WARRANTY].join("\n\n");

export type Tone = "yes" | "note" | "no";

/** The "Can I...?" chips. */
export const CHECKS: { chip: string; tone: Tone; word: string; text: string }[] = [
  { chip: "Use Veyl in a client project", tone: "yes", word: "Yes", text: "Paid or free, it makes no difference. No permission needed, no fee." },
  { chip: "Sell something I built with it", tone: "yes", word: "Yes", text: "A template, a product or a site. It is yours to sell." },
  { chip: "Change the code", tone: "yes", word: "Yes", text: "Edit it however you like. That is the point of copy and paste." },
  { chip: "Share my changes", tone: "yes", word: "Yes", text: "Publish your version. Keep the original copyright line with it." },
  { chip: "Keep my own code private", tone: "yes", word: "Yes", text: "MIT does not ask you to open your own code." },
  { chip: "Skip the credit", tone: "note", word: "Almost", text: "You do not need a credit on your website. Keep the copyright line and license text in the code you copy." },
  { chip: "Blame Veyl if it breaks", tone: "no", word: "No", text: "It comes with no warranty. You are responsible for what you ship." },
];

/** The licence read line by line: the real words, and what they mean. */
export const CLAUSES: { title: string; text: string; note: string }[] = [
  { title: "Who owns it", text: `MIT License\n${COPYRIGHT}`, note: "The authors keep the copyright. You get a license to use the work." },
  { title: "What you can do", text: flat(GRANT), note: "Almost anything: use it, change it, share it, even sell it. No fee, no sign-up." },
  { title: "The one thing to do", text: flat(NOTICE), note: "Keep the copyright line and this text with the code you copy." },
  { title: "No promises", text: WARRANTY, note: "It is offered as it is. If something breaks, the authors are not responsible." },
];

export const BUILT_ON: { name: string; license: string }[] = [
  { name: "Next.js", license: "MIT" },
  { name: "Tailwind CSS", license: "MIT" },
  { name: "motion", license: "MIT" },
  { name: "shiki", license: "MIT" },
  { name: "Nunito", license: "OFL 1.1" },
  { name: "Demo photos", license: "Unsplash License" },
];