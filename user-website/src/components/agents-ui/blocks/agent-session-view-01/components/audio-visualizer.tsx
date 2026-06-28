'use client';

import React from 'react';
import { useVoiceAssistant } from '@livekit/components-react';
import { motion, type MotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura';

const MotionAgentAudioVisualizerAura = motion.create(AgentAudioVisualizerAura);

interface AudioVisualizerProps extends MotionProps {
  themeMode?: 'dark' | 'light';
  isChatOpen: boolean;
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorShift?: number;
  className?: string;
}

export function AudioVisualizer({
  themeMode,
  audioVisualizerColor,
  audioVisualizerColorShift = 0.08,
  className,
  ...props
}: AudioVisualizerProps) {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <MotionAgentAudioVisualizerAura
      state={state}
      audioTrack={audioTrack}
      color={audioVisualizerColor}
      colorShift={audioVisualizerColorShift}
      themeMode={themeMode}
      className={cn('size-[300px] md:size-[450px]', className)}
      {...props}
    />
  );
}
