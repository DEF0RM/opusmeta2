'use client';

import React from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveAnimationProps {
  src: string;
  artboard?: string;
  stateMachine?: string;
  className?: string;
  autoplay?: boolean;
}

const RiveAnimation: React.FC<RiveAnimationProps> = ({ 
  src, 
  artboard,
  stateMachine, 
  className,
  autoplay = true 
}) => {
  const { RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachine ? [stateMachine] : undefined,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay,
  });

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <RiveComponent />
    </div>
  );
};

export default RiveAnimation;
