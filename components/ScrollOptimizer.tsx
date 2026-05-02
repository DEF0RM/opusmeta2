'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ScrollOptimizer() {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Global ScrollTrigger configuration for maximum smoothness
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
      });

      // Normalize scroll to eliminate browser vs JS "tug-of-war"
      // This is the key fix for the "fighting with the mouse" feel
      const normalizer = ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
        momentum: 1, // Use number 1 instead of boolean true to satisfy TS
      });

      // Force recalculation on refresh to prevent jumps
      ScrollTrigger.addEventListener('refreshInit', () => {
        gsap.set('body', { overflow: 'hidden' });
      });
      ScrollTrigger.addEventListener('refresh', () => {
        gsap.set('body', { overflow: 'visible' });
      });

      return () => {
        if (normalizer) normalizer.disable();
      };
    }
  }, []);

  return null;
}
