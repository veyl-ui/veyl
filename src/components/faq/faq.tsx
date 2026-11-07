import { Reveal } from "@/components/shared/reveal";
import { Faq, type FaqItem } from "@/registry/veyl/faq";
import { faqItems } from "./data";

/** Points the component's colour variables at the site's own tokens, so it follows the theme. */
const siteColours =
  "[--fq-accent:var(--brand)] [--fq-accent-ink:var(--brand-ink)] [--fq-card:var(--card)] " +
  "[--fq-border:var(--border)] [--fq-ink:var(--foreground)] [--fq-muted:var(--muted-foreground)]";

/** The landing page's FAQ section: the Faq component with Veyl's questions and colours. */
export function FAQ({ items = faqItems }: { items?: FaqItem[] }) {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
        <Reveal>
          <Faq
            className={siteColours}
            items={items}
            eyebrow="FAQ"
            title="Questions? We've got answers."
            description="Everything you need to know before you copy your first component."
          />
        </Reveal>
      </div>
    </section>
  );
}