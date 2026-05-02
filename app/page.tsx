'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import PromoLoader from '@/components/PromoLoader';
import styles from './Promo.module.css';

// We will create this component next
import PromoHero from '@/components/PromoHero';

export default function PromoPage() {
  const [progress, setProgress] = useState(0);
  const [isCornersReady, setIsCornersReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [shouldManifest, setShouldManifest] = useState(false);

  useEffect(() => {
    if (!isCornersReady) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 500);
          return 100;
        }
        const inc = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + inc, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCornersReady]);

  // Just trigger content and manifestation
  useEffect(() => {
    if (isExiting) {
      setTimeout(() => {
        setShouldManifest(true);
        setShowContent(true);
      }, 1000); // Delay to sync with loader exit
    }
  }, [isExiting]);

  return (
    <main className={styles.promoWrapper}>
      {!showContent && (
        <PromoLoader 
          progress={progress} 
          isExiting={isExiting}
          onCornersReady={() => setIsCornersReady(true)}
        />
      )}

      {showContent && (
        <PromoHero shouldManifest={shouldManifest} />
      )}
    </main>
  );
}
