'use client';

import React, {useId, type ReactNode} from 'react';
import {ArrowRight} from 'lucide-react';
import {cn} from '@/lib/utils';
import {TEAM_MEMBERS, type TeamMember} from './team-data';
import TeamCarousel from './team-carousel';

export type TeamSectionProps = {
  /** The people. One hanging card each. Defaults to six sample people. */
  members?: TeamMember[];
  /** The small pill above the heading. Pass null to hide it. */
  badge?: ReactNode | null;
  /** The heading. */
  title?: ReactNode;
  /** The paragraph under the cards. */
  description?: ReactNode;
  /** Text of the button. Pass null to hide the button. */
  buttonLabel?: ReactNode | null;
  /** Where the button goes. */
  buttonHref?: string;
  /** Slow drift to the left, in px per second. It pauses while the pointer is over the cards. 0 turns it off. */
  speed?: number;
  /** Let people drag the cards. */
  draggable?: boolean;
  className?: string;
};

/** Two people, filled and shaded instead of outlined. The ring matches the badge so the front person lifts off the back one. */
function TeamIcon({className}: {className?: string}) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-back`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7d2fe" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
        <radialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fde4cf" />
          <stop offset="0.6" stopColor="#f0bf98" />
          <stop offset="1" stopColor="#d79a6c" />
        </radialGradient>
        <radialGradient id={`${id}-skin2`} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f6d6bd" />
          <stop offset="1" stopColor="#c98d60" />
        </radialGradient>
      </defs>
      {/* Person behind */}
      <path d="M12.6 21c0-3.4 1.9-6 4.7-6s4.7 2.6 4.7 6v.2h-9.4z" fill={`url(#${id}-back)`} />
      <circle cx="17.3" cy="10" r="2.9" fill={`url(#${id}-skin2)`} />
      {/* Person in front */}
      <path
        d="M2.4 21.2c0-4 2.9-7 6.6-7s6.6 3 6.6 7v.2H2.4z"
        fill={`url(#${id}-front)`}
        strokeWidth="1.2"
        className="stroke-white dark:stroke-neutral-900"
      />
      <circle
        cx="9"
        cy="9.2"
        r="3.7"
        fill={`url(#${id}-skin)`}
        strokeWidth="1.2"
        className="stroke-white dark:stroke-neutral-900"
      />
      <path d="M6.4 7.9c.8-1.5 2.3-2.1 3.9-1.8" stroke="#fff" strokeOpacity=".55" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function TeamSection({
  members = TEAM_MEMBERS,
  badge = 'Our team',
  title = 'The people behind the product',
  description = 'We are a small, close-knit group of designers, engineers and writers spread across eleven time zones. Everyone owns a real piece of the product, ships work that people actually use, and has a say in where we go next. We keep meetings short, feedback kind and standards high. If you like building thoughtful things with thoughtful people, we would love to hear from you.',
  buttonLabel = 'See open roles',
  buttonHref = '#',
  speed = 33,
  draggable = true,
  className,
}: TeamSectionProps) {
  return (
    <section className={cn('relative w-full py-16 sm:py-20', className)}>
      <div className="mx-auto max-w-[1200px] px-6">
        {badge ? (
            <span className="inline-flex items-center gap-1 rounded-sm bg-white px-1 py-0.5 text-[12px] font-medium text-neutral-700 shadow-sm ring-1 shadow-black/10 ring-black/5 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-black/50 dark:ring-white/5 ">
                <TeamIcon className="h-5 w-5" />
                {badge}
            </span>
        ): null}
        <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 [text-wrap:balance] sm:text-5xl dark:text-white">
          {title}
        </h2>
      </div>

      <div className="mt-6 sm:mt-8">
        <TeamCarousel members={members} speed={speed} draggable={draggable} />
      </div>

      <div className="mx-auto -mt-6 max-w-[1200px] px-6">
        {description ? (
          <p className="max-w-[56rem] text-[15px] leading-relaxed text-zinc-600 [text-wrap:pretty] sm:text-base dark:text-zinc-400">
            {description}
          </p>
        ) : null}
        {buttonLabel ? (
          <a
            href={buttonHref}
            className="group mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[background-color,transform] duration-200 hover:bg-zinc-800 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
          >
            {buttonLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        ) : null}
      </div>
    </section>
  );
}

export {TeamSection};