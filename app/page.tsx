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

  const arrowLeftRef = useRef<HTMLDivElement>(null);
  const arrowRightRef = useRef<HTMLDivElement>(null);

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

  // Handle the arrow spread and manifestation trigger
  useEffect(() => {
    if (isExiting) {
      const tl = gsap.timeline();
      
      // 1. Initial appear of arrows (they start in center)
      tl.set([arrowLeftRef.current, arrowRightRef.current], { opacity: 0, scale: 0, x: 0 });
      tl.to([arrowLeftRef.current, arrowRightRef.current], { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5, 
        delay: 0.8, // Match loader's corner fly time
        ease: 'back.out(2)' 
      });

      // 2. Spread arrows AND trigger manifestation simultaneously
      tl.to(arrowLeftRef.current, { 
        x: () => -(window.innerWidth / 2) + 32, 
        duration: 2.5, 
        ease: 'expo.inOut',
        onStart: () => {
          setShouldManifest(true);
          setShowContent(true);
        }
      });
      tl.to(arrowRightRef.current, { 
        x: () => (window.innerWidth / 2) - 32, 
        duration: 2.5, 
        ease: 'expo.inOut' 
      }, "<");
    }
  }, [isExiting]);

  return (
    <main className={styles.promoWrapper}>
      {/* Persistent Transition Arrows */}
      <div ref={arrowLeftRef} className={styles.arrowLeft}>⊢</div>
      <div ref={arrowRightRef} className={styles.arrowRight}>⊣</div>

      {!showContent && (
        <PromoLoader 
          progress={progress} 
          isExiting={isExiting}
          onCornersReady={() => setIsCornersReady(true)}
          // onExitComplete is no longer needed to trigger setShowContent here
        />
      )}

      {showContent && (
        <PromoHero shouldManifest={shouldManifest} />
      )}
    </main>
  );
}
