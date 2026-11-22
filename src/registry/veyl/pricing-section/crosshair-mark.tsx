'use client';

import React from 'react';

interface CrosshairMarkProps {
  className?: string;
  hiddenOnMobile?: boolean;
}

export function CrosshairMark({ className = '', hiddenOnMobile = false }: CrosshairMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none items-center justify-center w-[11px] h-[11px] ${
        hiddenOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'
      } ${className}`}
    >
      <span className="relative w-full h-full">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 w-[1px] h-full bg-[#374151] dark:bg-[#a1a1aa]" />
        <span className="absolute top-1/2 left-0 -translate-y-1/2 h-[1px] w-full bg-[#374151] dark:bg-[#a1a1aa]" />
      </span>
    </span>
  );
}