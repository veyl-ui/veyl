'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import {
  ANNUAL_DISCOUNT_RATE,
  PricingTier,
  ProductSuite,
  calculateDisplayPrice,
  validatePlanRequestForm,
} from './pricing-data';

export type ActiveModal = {
  type: 'plan';
  suite: ProductSuite;
  tier: PricingTier;
  isAnnual: boolean;
} | null;

interface PlanModalProps {
  modal: ActiveModal;
  onClose: () => void;
  /** The annual discount, from 0 to 1. Default 0.4. */
  discount?: number;
}

const FIELD =
  'w-full px-3.5 py-2.5 rounded-lg border border-black/[0.12] bg-[#fcfcfd] text-[14px] text-[#0b0d10] focus:outline-none focus:ring-2 focus:ring-[#0b0d10] dark:border-white/[0.14] dark:bg-[#1a1a1d] dark:text-[#f4f4f5] dark:focus:ring-white';
const LABEL = 'block text-[13px] font-medium text-[#111827] dark:text-[#e4e4e7] mb-1';

export function PlanModal({ modal, onClose, discount = ANNUAL_DISCOUNT_RATE }: PlanModalProps) {
  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, onClose]);

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[2px]"
          onClick={onClose}
        >
          <PlanModalBody
            key={`plan-${modal.suite}-${modal.tier.id}-${modal.isAnnual}`}
            modal={modal}
            onClose={onClose}
            discount={discount}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlanModalBody({
  modal,
  onClose,
  discount,
}: {
  modal: NonNullable<ActiveModal>;
  onClose: () => void;
  discount: number;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePlanRequestForm({ fullName, email, company });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    if (modal.tier.ctaType === 'sales') {
      setSubmittedMessage(
        `Thanks ${fullName.trim()}. Our enterprise team will reach out to ${email.trim()} within 1 business day for ${modal.suite} ${modal.tier.name}.`
      );
    } else if (modal.tier.ctaType === 'free') {
      setSubmittedMessage(
        `Welcome ${fullName.trim()}! Your ${modal.suite} Free workspace invite has been sent to ${email.trim()}.`
      );
    } else {
      const price = calculateDisplayPrice(modal.tier.monthlyPrice, modal.isAnnual, discount);
      setSubmittedMessage(
        `Plan reserved for ${fullName.trim()}: ${modal.suite} ${modal.tier.name} at $${price}/mo (${
          modal.isAnnual ? 'Annual billing' : 'Monthly billing'
        }). Confirmation sent to ${email.trim()}.`
      );
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[460px] rounded-2xl bg-white border border-black/[0.08] shadow-[0_24px_60px_rgba(11,13,16,0.18)] p-6 sm:p-7 dark:bg-[#141416] dark:border-white/10 dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute right-4 top-4 w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#0b0d10] hover:bg-[#f3f4f6] transition-colors cursor-pointer dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>

      <div>
        <div className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#6b7280] dark:text-[#a1a1aa]">
          {modal.suite} Suite · {modal.isAnnual ? `Annual Billing (-${Math.round(discount * 100)}%)` : 'Monthly Billing'}
        </div>
        <h2
          id="modal-title"
          className="mt-1.5 font-sans text-[24px] font-bold text-[#0b0d10] dark:text-[#f4f4f5] leading-tight"
        >
          {modal.tier.ctaLabel}
        </h2>
        <p className="mt-1.5 text-[14px] text-[#4b5563] dark:text-[#a1a1aa] leading-relaxed">
          {modal.tier.name} plan —{' '}
          <span className="font-semibold text-[#0b0d10] dark:text-[#f4f4f5] tabular-nums">
            ${calculateDisplayPrice(modal.tier.monthlyPrice, modal.isAnnual, discount)}/Month
          </span>
        </p>

        {submittedMessage ? (
          <div className="mt-6 rounded-xl bg-[#f4fbf7] border border-[#bbf7d0] p-4 dark:bg-[#0f2018] dark:border-[#166534]">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#15803d] dark:text-[#4ade80] shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-[#14532d] dark:text-[#bbf7d0] leading-relaxed">
                  {submittedMessage}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0b0d10] text-white text-[13px] font-medium cursor-pointer hover:bg-[#1f242d] transition-colors dark:bg-[#f4f4f5] dark:text-[#0b0d10] dark:hover:bg-white"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlanSubmit} noValidate className="mt-5 space-y-4">
            <div>
              <label htmlFor="plan-full-name" className={LABEL}>
                Full Name
              </label>
              <input
                id="plan-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Vance"
                className={FIELD}
              />
              {errors.fullName && (
                <p className="mt-1 text-[12px] text-[#b91c1c] dark:text-[#f87171]" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="plan-email" className={LABEL}>
                Work Email
              </label>
              <input
                id="plan-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@studio.com"
                className={FIELD}
              />
              {errors.email && (
                <p className="mt-1 text-[12px] text-[#b91c1c] dark:text-[#f87171]" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {modal.tier.ctaType === 'sales' && (
              <div>
                <label htmlFor="plan-company" className={LABEL}>
                  Company or Team Name
                </label>
                <input
                  id="plan-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Aura Media Group"
                  className={FIELD}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0b0d10] hover:bg-[#1a1d24] text-white text-[13.5px] font-medium transition-colors cursor-pointer dark:bg-[#f4f4f5] dark:hover:bg-white dark:text-[#0b0d10]"
            >
              <span>
                {modal.tier.ctaType === 'sales' ? 'Submit Inquiry' : 'Continue'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}