/** The name of a product suite, like "Studio". It is also the label on its tab. */
export type ProductSuite = string;

export interface PricingTier {
  id: string;
  name: string;
  badgeTone: 'cool' | 'neutral' | 'sky';
  monthlyPrice: number;
  description: string;
  ctaLabel: string;
  ctaType: 'free' | 'upgrade' | 'sales';
  featured?: boolean;
  features: string[];
}

export interface SuiteInfo {
  id: ProductSuite;
  label: string;
  subtitle: string;
  tiers: PricingTier[];
}

export const ANNUAL_DISCOUNT_RATE = 0.4;

/** Sample plans for the preview. Replace them with your own, keeping the same shape. */
export const PRICING_SUITES: Record<ProductSuite, SuiteInfo> = {
  Studio: {
    id: 'Studio',
    label: 'Studio',
    subtitle: 'Full voice generation & audio production suite',
    tiers: [
      {
        id: 'studio-free',
        name: 'Free',
        badgeTone: 'cool',
        monthlyPrice: 0,
        description:
          'Get started with essential voice synthesis and customization — no credit card required.',
        ctaLabel: 'Get Started Free',
        ctaType: 'free',
        features: [
          'Access to core Text-to-Speech',
          'Limited monthly characters',
          'Standard voice library',
          'Basic voice customization',
          'Community support',
          'Watermarked exports',
        ],
      },
      {
        id: 'studio-creator',
        name: 'Creator',
        badgeTone: 'neutral',
        monthlyPrice: 29,
        description: 'Built for content creators & studio professionals.',
        ctaLabel: 'Upgrade to Creator',
        ctaType: 'upgrade',
        featured: true,
        features: [
          'Everything in Free',
          'Increased monthly characters',
          'Full voice library access',
          'HD audio exports',
          'Advanced voice customization',
          'Commercial usage rights',
        ],
      },
      {
        id: 'studio-business',
        name: 'Business',
        badgeTone: 'sky',
        monthlyPrice: 69,
        description:
          'High-volume access, API integration, team tools, and enterprise-grade security.',
        ctaLabel: 'Contact Sales',
        ctaType: 'sales',
        features: [
          'Everything in Creator',
          'Unlimited or high-volume characters',
          'API access',
          'Team collaboration tools',
          'Custom voice cloning',
          'Enterprise-grade security',
        ],
      },
    ],
  },
  DUB: {
    id: 'DUB',
    label: 'DUB',
    subtitle: 'Automated multilingual video & audio dubbing',
    tiers: [
      {
        id: 'dub-free',
        name: 'Free',
        badgeTone: 'cool',
        monthlyPrice: 0,
        description:
          'Try automated voice translation on short clips with automatic timing sync.',
        ctaLabel: 'Get Started Free',
        ctaType: 'free',
        features: [
          'Up to 10 dubbing minutes / mo',
          '8 supported languages',
          'Single-speaker detection',
          'Standard MP4 / MP3 export',
          'Community support',
          'Watermarked exports',
        ],
      },
      {
        id: 'dub-creator',
        name: 'Creator',
        badgeTone: 'neutral',
        monthlyPrice: 39,
        description: 'Multi-speaker dubbing for YouTube, podcasts & courses.',
        ctaLabel: 'Upgrade to Creator',
        ctaType: 'upgrade',
        featured: true,
        features: [
          'Everything in Free',
          '120 dubbing minutes / mo',
          '29 languages with emotion match',
          'Multi-speaker track separation',
          'SRT & VTT subtitle export',
          'Commercial usage rights',
        ],
      },
      {
        id: 'dub-business',
        name: 'Business',
        badgeTone: 'sky',
        monthlyPrice: 99,
        description:
          'Broadcast-grade localization pipelines, glossary locks, and dedicated SLA.',
        ctaLabel: 'Contact Sales',
        ctaType: 'sales',
        features: [
          'Everything in Creator',
          '1,000+ dubbing minutes / mo',
          'Custom pronunciation glossaries',
          'Team review & timestamp notes',
          '4K lossless audio stems',
          'Enterprise-grade security',
        ],
      },
    ],
  },
  API: {
    id: 'API',
    label: 'API',
    subtitle: 'Ultra-low-latency streaming voice endpoints',
    tiers: [
      {
        id: 'api-free',
        name: 'Free',
        badgeTone: 'cool',
        monthlyPrice: 0,
        description:
          'Prototype real-time voice workflows with REST and WebSocket endpoints.',
        ctaLabel: 'Get Started Free',
        ctaType: 'free',
        features: [
          '10,000 API characters / mo',
          '2 concurrent streams',
          'Standard latency endpoints',
          'TypeScript & Python SDKs',
          'Developer docs & sandbox',
          'Non-commercial testing',
        ],
      },
      {
        id: 'api-creator',
        name: 'Creator',
        badgeTone: 'neutral',
        monthlyPrice: 49,
        description: 'Production streaming endpoints for apps & voice agents.',
        ctaLabel: 'Upgrade to Creator',
        ctaType: 'upgrade',
        featured: true,
        features: [
          'Everything in Free',
          '500,000 API characters / mo',
          '15 concurrent streams',
          'Sub-180ms WebSocket streaming',
          'Webhook usage alerts',
          'Commercial production rights',
        ],
      },
      {
        id: 'api-business',
        name: 'Business',
        badgeTone: 'sky',
        monthlyPrice: 149,
        description:
          'Dedicated regional clusters, custom throughput, and SOC 2 compliance.',
        ctaLabel: 'Contact Sales',
        ctaType: 'sales',
        features: [
          'Everything in Creator',
          '5M+ characters with volume rates',
          '100+ concurrent streams',
          'Custom fine-tuned voice models',
          '99.99% uptime SLA',
          'HIPAA / SOC 2 Type II',
        ],
      },
    ],
  },
};

export function calculateDisplayPrice(
  monthlyPrice: number,
  isAnnual: boolean,
  rate: number = ANNUAL_DISCOUNT_RATE,
): number {
  if (monthlyPrice <= 0) return 0;
  if (!isAnnual) return monthlyPrice;
  return Math.round(monthlyPrice * (1 - rate));
}

export function calculateAnnualSavings(monthlyPrice: number, rate: number = ANNUAL_DISCOUNT_RATE): number {
  if (monthlyPrice <= 0) return 0;
  const discountedMonthly = calculateDisplayPrice(monthlyPrice, true, rate);
  return (monthlyPrice - discountedMonthly) * 12;
}

export function getPlansForSuite(suite: ProductSuite, suites: Record<ProductSuite, SuiteInfo> = PRICING_SUITES): PricingTier[] {
  return suites[suite].tiers;
}

export interface PlanFormInput {
  fullName: string;
  email: string;
  company?: string;
}

export interface PlanFormValidationResult {
  valid: boolean;
  errors: {
    fullName?: string;
    email?: string;
  };
}

export function validatePlanRequestForm(input: PlanFormInput): PlanFormValidationResult {
  const errors: PlanFormValidationResult['errors'] = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailPattern.test(input.email.trim())) {
    errors.email = 'Please enter a valid work or personal email address.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}