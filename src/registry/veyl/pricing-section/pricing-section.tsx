'use client';

import React, { useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ANNUAL_DISCOUNT_RATE,
  PRICING_SUITES,
  ProductSuite,
  PricingTier,
  SuiteInfo,
  calculateDisplayPrice,
  calculateAnnualSavings,
} from './pricing-data';
import { HeroDecorations } from './hero-decorations';
import { CrosshairMark } from './crosshair-mark';
import { ActiveModal, PlanModal } from './plan-modal';

export type PricingSectionProps = {
  /** The suites, one tab each, with three plans in each. Defaults to a sample set. */
  suites?: Record<ProductSuite, SuiteInfo>;
  /** The big heading. */
  title?: string;
  /** The line under the heading. */
  description?: string;
  /** The annual discount from 0 to 1. Default 0.4. At 0 the discount button is hidden. */
  discount?: number;
  className?: string;
};

const BADGE_TONE_CLASSES: Record<PricingTier['badgeTone'], string> = {
  cool: 'bg-gradient-to-b from-[#e8effd] to-[#f8faff] text-[#1e293b] border border-white shadow-[0_3px_10px_rgba(15,23,42,0.08)] dark:from-[#1d2433] dark:to-[#161a24] dark:text-[#e4e4e7] dark:border-white/10 dark:shadow-none',
  neutral:
    'bg-gradient-to-b from-[#eff1f5] to-[#fcfcfd] text-[#1e293b] border border-white shadow-[0_3px_10px_rgba(15,23,42,0.08)] dark:from-[#26272c] dark:to-[#1b1c20] dark:text-[#e4e4e7] dark:border-white/10 dark:shadow-none',
  sky: 'bg-gradient-to-b from-[#e3ecfc] to-[#f6f9ff] text-[#1e293b] border border-white shadow-[0_3px_10px_rgba(15,23,42,0.08)] dark:from-[#1a2740] dark:to-[#151b2a] dark:text-[#e4e4e7] dark:border-white/10 dark:shadow-none',
};

export function PricingSection({
  suites = PRICING_SUITES,
  title = 'Choose Pricing Plan',
  description = 'Choose the perfect plan for your voice creation needs — from getting started to scaling your production.',
  discount = ANNUAL_DISCOUNT_RATE,
  className,
}: PricingSectionProps) {
  const SUITES = Object.keys(suites);
  const [activeSuite, setActiveSuite] = useState<ProductSuite>(SUITES[0]);
  const [isAnnual, setIsAnnual] = useState(false);
  const [modal, setModal] = useState<ActiveModal>(null);

  const currentSuite = suites[activeSuite] ?? suites[SUITES[0]];
  const hasDiscount = discount > 0;
  const annual = isAnnual && hasDiscount;

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="top"
        className={cn(
          'relative min-h-screen bg-[#f5f6f8] dark:bg-[#09090a] py-0 sm:py-4 lg:py-5 px-0 sm:px-6 lg:px-8 flex flex-col justify-center text-[#0b0d10] dark:text-[#f4f4f5]',
          className,
        )}
      >
        {/* Outer Architectural Sheet */}
        <div className="relative w-full max-w-[1320px] mx-auto bg-white dark:bg-[#0f0f11] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_32px_rgba(15,23,42,0.04)] dark:shadow-[0_2px_32px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Outer Corner Crosshairs */}
          <CrosshairMark hiddenOnMobile className="absolute top-[14px] left-[18px] z-30" />
          <CrosshairMark hiddenOnMobile className="absolute top-[14px] right-[18px] z-30" />
          <CrosshairMark hiddenOnMobile className="absolute bottom-[14px] left-[18px] z-30" />
          <CrosshairMark hiddenOnMobile className="absolute bottom-[14px] right-[18px] z-30" />

          {/* Subtle Outer Framing Hairlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden sm:block absolute top-[19px] inset-x-0 h-[1px] bg-black/[0.04] dark:bg-white/[0.06] z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none hidden sm:block absolute bottom-[19px] inset-x-0 h-[1px] bg-black/[0.04] dark:bg-white/[0.06] z-10"
          />

          {/* Upper & Hero Background Architectural Components */}
          <HeroDecorations />

          {/* Main Content */}
          <main className="relative pt-14 sm:pt-16 pb-12 sm:pb-14 px-4 sm:px-8 lg:px-12">

            {/* Hero Centerpiece */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-[660px] mx-auto text-center"
            >
              {/* Interactive Annual Discount Toggle */}
              {hasDiscount && (
                <motion.button
                  type="button"
                  aria-pressed={isAnnual}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsAnnual((prev) => !prev)}
                  className={`group relative inline-flex items-center gap-2.5 pl-3 pr-1.5 py-1 rounded-[10px] border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b0d10] dark:focus-visible:ring-white ${
                    isAnnual
                      ? 'bg-[linear-gradient(90deg,#f5fef9_0%,#e6faef_55%,#9ee6c7_100%)] dark:bg-[linear-gradient(90deg,#12201a_0%,#143325_55%,#1f6b4d_100%)] border-[#6ee7b7] dark:border-[#1f6b4d] shadow-[0_6px_18px_rgba(16,185,129,0.16)]'
                      : 'bg-[linear-gradient(90deg,#fcfcfc_0%,#f7f8f9_62%,#c8f1e0_100%)] dark:bg-[linear-gradient(90deg,#151517_0%,#18181b_62%,#14352a_100%)] border-black/[0.04] dark:border-white/[0.07] shadow-[0_6px_18px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
                  }`}
                >
                  <span className="font-serif text-[11px] font-normal tracking-[0.04em] uppercase text-[#525866] dark:text-[#a1a1aa]">
                    ANNUAL DISCOUNT
                  </span>
                  <span
                    className={`inline-flex items-center justify-center rounded-[7px] px-2 py-0.5 bg-white dark:bg-[#1c1c1f] font-serif text-[11px] font-semibold tabular-nums border border-white dark:border-white/10 shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition-colors duration-150 ${
                      isAnnual ? 'text-[#065f46] dark:text-[#6ee7b7]' : 'text-[#111827] dark:text-[#e4e4e7]'
                    }`}
                  >
                    %{Math.round(discount * 100)}
                  </span>
                </motion.button>
              )}

              {/* Headline */}
              <h1 className="mt-4 font-sans text-[34px] sm:text-[42px] lg:text-[44px] font-bold tracking-[-0.02em] leading-[1.12] text-[#0b0d10] dark:text-[#f4f4f5] text-balance">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="mt-2.5 font-sans text-[14.5px] sm:text-[15.5px] leading-[1.55] text-[#4b5563] dark:text-[#a1a1aa] max-w-[560px] mx-auto">
                {description}
              </p>

              {/* Segmented Product Switcher */}
              <div className="mt-6 flex justify-center">
                <div
                  role="tablist"
                  aria-label="Product suites"
                  className="inline-flex items-center p-1 rounded-[11px] border border-black/[0.08] dark:border-white/10 bg-[#fafafa] dark:bg-[#141416] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {SUITES.map((suite) => {
                    const isSelected = activeSuite === suite;
                    return (
                      <button
                        key={suite}
                        role="tab"
                        type="button"
                        aria-selected={isSelected}
                        onClick={() => setActiveSuite(suite)}
                        className={`relative min-w-[78px] sm:min-w-[88px] px-5 py-1.5 rounded-[8px] font-sans text-[13.5px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b0d10] dark:focus-visible:ring-white ${
                          isSelected
                            ? 'text-white dark:text-[#0b0d10] font-semibold'
                            : 'text-[#4b5563] hover:text-[#0b0d10] dark:text-[#a1a1aa] dark:hover:text-white font-medium'
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="active-suite-pill"
                            transition={{
                              type: 'spring',
                              stiffness: 440,
                              damping: 34,
                            }}
                            className="absolute inset-0 rounded-[8px] bg-[#0b0d10] dark:bg-[#f4f4f5] shadow-[0_4px_12px_rgba(11,13,16,0.22)] dark:shadow-none"
                          />
                        )}
                        <span className="relative z-10">{suite}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Architectural 3-Column Pricing Grid */}
            <div className="relative mt-7 max-w-[1040px] mx-auto">
              {/* Top extended horizontal hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none hidden lg:block absolute top-0 -left-14 -right-14 h-[1px] bg-black/[0.07] dark:bg-white/[0.09]"
              />
              {/* Bottom extended horizontal hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none hidden lg:block absolute bottom-0 -left-14 -right-14 h-[1px] bg-black/[0.07] dark:bg-white/[0.09]"
              />

              {/* Extended Vertical Column Hairlines (4 lines for 3 columns) */}
              <div
                aria-hidden="true"
                className="pointer-events-none hidden lg:grid grid-cols-3 absolute inset-x-0 -top-7 -bottom-7 z-0"
              >
                <div className="border-l border-r border-black/[0.06] dark:border-white/[0.08]" />
                <div className="border-r border-black/[0.06] dark:border-white/[0.08]" />
                <div className="border-r border-black/[0.06] dark:border-white/[0.08]" />
              </div>

              {/* 8 Intersection Crosshair Marks (4 top, 4 bottom) */}
              <div
                aria-hidden="true"
                className="pointer-events-none hidden lg:block"
              >
                <CrosshairMark className="absolute -top-[5px] left-[-5px] z-20" />
                <CrosshairMark className="absolute -top-[5px] left-[33.3333%] -translate-x-1/2 z-20" />
                <CrosshairMark className="absolute -top-[5px] left-[66.6667%] -translate-x-1/2 z-20" />
                <CrosshairMark className="absolute -top-[5px] right-[-5px] z-20" />

                <CrosshairMark className="absolute -bottom-[5px] left-[-5px] z-20" />
                <CrosshairMark className="absolute -bottom-[5px] left-[33.3333%] -translate-x-1/2 z-20" />
                <CrosshairMark className="absolute -bottom-[5px] left-[66.6667%] -translate-x-1/2 z-20" />
                <CrosshairMark className="absolute -bottom-[5px] right-[-5px] z-20" />
              </div>

              {/* Pricing Cards Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSuite}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  role="tabpanel"
                  aria-label={`${currentSuite.label} pricing plans`}
                  className="relative z-10 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.07] dark:divide-white/[0.09] border lg:border-0 border-black/[0.08] dark:border-white/10 rounded-xl lg:rounded-none overflow-hidden lg:overflow-visible bg-white dark:bg-[#0f0f11]"
                >
                  {currentSuite.tiers.map((tier) => {
                    const displayPrice = calculateDisplayPrice(
                      tier.monthlyPrice,
                      annual,
                      discount
                    );
                    const annualSavings = calculateAnnualSavings(
                      tier.monthlyPrice,
                      discount
                    );
                    const isFeatured = Boolean(tier.featured);

                    return (
                      <section
                        key={tier.id}
                        aria-label={`${tier.name} plan`}
                        className={`flex flex-col px-7 sm:px-8 py-6 sm:py-7 transition-colors duration-200 ${
                          isFeatured
                            ? 'bg-gradient-to-t from-[#d7e5fc] via-[#eef4fe] to-white dark:from-[#18294a] dark:via-[#111b31] dark:to-[#0f0f11]'
                            : 'bg-white dark:bg-[#0f0f11]'
                        }`}
                      >
                        {/* Tier Badge */}
                        <div>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-[8px] font-serif text-[13px] font-medium ${BADGE_TONE_CLASSES[tier.badgeTone]}`}
                          >
                            {tier.name}
                          </span>
                        </div>

                        {/* Price Row */}
                        <div className="mt-5 flex items-baseline">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={`${tier.id}-${displayPrice}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{
                                duration: 0.18,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="font-sans text-[42px] leading-none font-bold tracking-[-0.02em] text-[#0b0d10] dark:text-[#f4f4f5] tabular-nums"
                            >
                              ${displayPrice}
                            </motion.span>
                          </AnimatePresence>
                          <span className="ml-2 font-serif text-[13.5px] text-[#374151] dark:text-[#d4d4d8]">
                            /Month
                          </span>
                          {annual && tier.monthlyPrice > 0 && (
                            <span className="ml-2.5 font-sans text-[13px] text-[#9ca3af] dark:text-[#71717a] line-through tabular-nums">
                              ${tier.monthlyPrice}
                            </span>
                          )}
                        </div>

                        {/* Subtle Annual Savings Line (only visible when Annual Discount is active) */}
                        {annual && annualSavings > 0 ? (
                          <p className="mt-1.5 font-sans text-[11.5px] font-semibold text-[#15803d] dark:text-[#4ade80] tabular-nums">
                            Billed annually · Save ${annualSavings}/yr
                          </p>
                        ) : null}

                        {/* Plan Description */}
                        <p className="mt-3 font-sans text-[13.5px] leading-[1.5] text-[#4b5563] dark:text-[#a1a1aa] min-h-[42px]">
                          {tier.description}
                        </p>

                        {/* Primary / Secondary Plan Action */}
                        <div className="mt-4">
                          <motion.button
                            type="button"
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.985 }}
                            transition={{ duration: 0.15 }}
                            onClick={() =>
                              setModal({
                                type: 'plan',
                                suite: activeSuite,
                                tier,
                                isAnnual: annual,
                              })
                            }
                            className={`w-full py-2.5 px-4 rounded-[9px] font-sans text-[13px] font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b0d10] focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#0f0f11] ${
                              isFeatured
                                ? 'bg-[#0b0d10] hover:bg-[#1a1d24] text-white shadow-[0_6px_16px_rgba(11,13,16,0.20)] dark:bg-[#f4f4f5] dark:hover:bg-white dark:text-[#0b0d10] dark:shadow-none'
                                : 'bg-[#f2f4f7] hover:bg-[#e7eaef] text-[#111827] border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-[#1b1b1e] dark:hover:bg-[#242428] dark:text-[#f4f4f5] dark:border-white/[0.08] dark:shadow-none'
                            }`}
                          >
                            {tier.ctaLabel}
                          </motion.button>
                        </div>

                        {/* Feature Checklist */}
                        <ul className="mt-5 space-y-2.5 flex-1">
                          {tier.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2.5 font-sans text-[13px] leading-[1.45] text-[#4b5563] dark:text-[#a1a1aa]"
                            >
                              <Check
                                className="w-[14px] h-[14px] text-[#111827] dark:text-[#e4e4e7] shrink-0 mt-[2px]"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        {/* Interactive Modal (Checkout, Sales Inquiry) */}
        <PlanModal modal={modal} onClose={() => setModal(null)} discount={discount} />
      </div>
    </MotionConfig>
  );
}