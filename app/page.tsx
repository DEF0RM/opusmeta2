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

  // Transition Logic: Start manifesting as soon as loader starts exiting
  useEffect(() => {
    if (isExiting) {
      // Trigger manifestation for the hero
      setShouldManifest(true);
      
      // After transition is done, unmount loader and clean up
      setTimeout(() => {
        setShowContent(true);
      }, 2000); 
    }
  }, [isExiting]);

  return (
    <main className={styles.promoWrapper}>
      {/* Show loader until content is fully ready to take over */}
      {!showContent && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: isExiting ? 10 : 100, // Drop priority when exiting
          pointerEvents: isExiting ? 'none' : 'auto'
        }}>
          <PromoLoader 
            progress={progress} 
            isExiting={isExiting}
            onCornersReady={() => setIsCornersReady(true)}
          />
        </div>
      )}

      {/* Only mount Hero when it's time to animate, to save GPU resources */}
      {(isExiting || showContent) && (
        <PromoHero shouldManifest={shouldManifest} />
      )}
    </main>
  );
}
