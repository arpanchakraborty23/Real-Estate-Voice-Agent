'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  duration?: number;
  children?: React.ReactNode;
}

export function Shimmer({ className, children, ...props }: ShimmerProps) {
  return (
    <p
      className={cn(
        'text-muted-foreground animate-pulse bg-linear-to-r from-transparent via-foreground/10 to-transparent bg-[length:200%_100%] bg-clip-text text-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
