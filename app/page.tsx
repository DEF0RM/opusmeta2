'use client';

import React, { useState, useEffect } from 'react';
import PromoLoader from '@/components/PromoLoader';
import styles from './Promo.module.css';

// We will create this component next
import PromoHero from '@/components/PromoHero';

export default function PromoPage() {
  const [progress, setProgress] = useState(0);
  const [isCornersReady, setIsCornersReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isCornersReady) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a bit at 100% then start exit
          setTimeout(() => setIsExiting(true), 500);
          return 100;
        }
        // Random increments for a "real" feel
        const inc = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + inc, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCornersReady]);

  return (
    <main className={styles.promoWrapper}>
      {!showContent && (
        <PromoLoader 
          progress={progress} 
          isExiting={isExiting}
          onCornersReady={() => setIsCornersReady(true)}
          onExitComplete={() => setShowContent(true)}
        />
      )}

      {showContent && (
        <PromoHero />
      )}
    </main>
  );
}
