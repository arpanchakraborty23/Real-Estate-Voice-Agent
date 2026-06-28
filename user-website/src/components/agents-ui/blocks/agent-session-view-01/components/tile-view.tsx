'use client';

import React from 'react';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { AudioVisualizer } from './audio-visualizer';

const ANIMATION_TRANSITION: MotionProps['transition'] = {
  type: 'spring',
  stiffness: 675,
  damping: 75,
  mass: 1,
};

interface TileLayoutProps {
  themeMode?: 'dark' | 'light';
  isChatOpen: boolean;
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorShift?: number;
}

export function TileLayout({
  themeMode,
  isChatOpen,
  audioVisualizerColor,
  audioVisualizerColorShift,
}: TileLayoutProps) {
  const animationDelay = isChatOpen ? 0 : 0.15;

  return (
    <div className="absolute inset-x-0 top-8 bottom-32 z-50 md:top-12 md:bottom-40">
      <div className="relative mx-auto h-full max-w-2xl px-4 md:px-0">
        <div
          className={cn(
            'grid h-full w-full place-content-center',
            isChatOpen
              ? 'grid-cols-[1fr] grid-rows-[90px_1fr]'
              : 'grid-cols-[1fr] grid-rows-[1fr]',
          )}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key="agent"
              layoutId="agent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                ...ANIMATION_TRANSITION,
                delay: animationDelay,
              }}
              className={cn(
                'relative',
                isChatOpen ? 'aspect-square h-[90px] justify-self-center' : 'aspect-square h-full justify-self-center',
              )}
            >
              <AudioVisualizer
                key="audio-visualizer"
                initial={{ scale: 1 }}
                animate={{ scale: isChatOpen ? 0.2 : 1 }}
                transition={{
                  ...ANIMATION_TRANSITION,
                  delay: animationDelay,
                }}
                isChatOpen={isChatOpen}
                audioVisualizerColor={audioVisualizerColor}
                audioVisualizerColorShift={audioVisualizerColorShift}
                themeMode={themeMode}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'bg-background rounded-[50px] border border-transparent transition-[border,drop-shadow]',
                  isChatOpen && 'border-input shadow-2xl/10 delay-200',
                )}
                style={{ color: audioVisualizerColor }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
