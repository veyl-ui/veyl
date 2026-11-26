'use client';

import React, {type ReactNode} from 'react';
import {ArrowRight, Blocks} from 'lucide-react';
import {cn} from '@/lib/utils';
import {LOGOS, type CloudLogo} from './logo-data';
import LogoField from './logo-field';

export type LogoCloudProps = {
  /** The logos. Each one is { name, color, path }. Defaults to twenty well-known brands. */
  logos?: CloudLogo[];
  /** The small pill above the heading. Pass null to hide it. */
  badge?: ReactNode | null;
  /** The heading. */
  title?: ReactNode;
  /** The short line under the heading. */
  description?: ReactNode;
  /** Text of the button. Pass null to hide the button. */
  buttonLabel?: ReactNode | null;
  /** Where the button goes. */
  buttonHref?: string;
  /** Text under the cloud while no logo is close to the pointer. */
  hint?: string;
  className?: string;
};

export default function LogoCloud({
  logos = LOGOS,
  badge = 'Integrations',
  title = 'Works with the tools you already use',
  description = 'Plug into your stack in minutes. Connect the apps your team lives in and keep everything in one place.',
  buttonLabel = 'Explore integrations',
  buttonHref = '#',
  hint,
  className,
}: LogoCloudProps) {
  return (
    <section className={cn('relative w-full px-6 py-16 sm:py-20', className)}>
      <div className="mx-auto max-w-2xl text-center">
        {badge ? (
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-white px-1.5 py-0.5 text-[12px] font-medium text-neutral-700 shadow-sm ring-1 shadow-black/10 ring-black/5 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-black/50 dark:ring-white/5">
            <Blocks aria-hidden="true" className="h-3.5 w-3.5" />
            {badge}
          </span>
        ) : null}
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 [text-wrap:balance] sm:text-5xl dark:text-white">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-600 [text-wrap:balance] sm:text-base dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-10 sm:mt-12">
        <LogoField logos={logos} hint={hint} />
      </div>

      {buttonLabel ? (
        <div className="mt-8 text-center">
          <a
            href={buttonHref}
            className="group inline-flex h-11 items-center gap-2 rounded-sm bg-zinc-950 px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[background-color,transform] duration-200 hover:bg-zinc-800 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
          >
            {buttonLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      ) : null}
    </section>
  );
}

export {LogoCloud};