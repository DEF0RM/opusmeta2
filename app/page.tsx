'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BackedBy from '@/components/BackedBy';
import IpadSection from '@/components/IpadSection';
import ProblemSection from '@/components/ProblemSection';
import TextRevealSection from '@/components/TextRevealSection';
import MechanicsSection from '@/components/MechanicsSection';
import WhyMetricWins from '@/components/WhyMetricWins';
import { CoverageSection } from '@/components/CoverageSection';
import GraphicDivider from '@/components/GraphicDivider';
import Footer from '@/components/Footer';
import ScrollOptimizer from '@/components/ScrollOptimizer';
import PromoLoader from '@/components/PromoLoader';
import styles from './page.module.css';

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isCornersReady, setIsCornersReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const arrowLeftRef = useRef<HTMLDivElement>(null);
  const arrowRightRef = useRef<HTMLDivElement>(null);

  // Loading Simulation
  useEffect(() => {
    if (!isCornersReady) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExiting(true), 500);
          return 100;
        }
        const inc = Math.floor(Math.random() * 5) + 2;
        return Math.min(prev + inc, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCornersReady]);

  // Transition Logic
  useEffect(() => {
    if (isExiting) {
      const tl = gsap.timeline();
      
      tl.set([arrowLeftRef.current, arrowRightRef.current], { opacity: 0, scale: 0, x: 0 });
      tl.to([arrowLeftRef.current, arrowRightRef.current], { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5, 
        delay: 0.8,
        ease: 'back.out(2)' 
      });

      tl.to(arrowLeftRef.current, { 
        x: () => -(window.innerWidth / 2) + 32, 
        duration: 2.5, 
        ease: 'expo.inOut'
      });
      tl.to(arrowRightRef.current, { 
        x: () => (window.innerWidth / 2) - 32, 
        duration: 2.5, 
        ease: 'expo.inOut' 
      }, "<");

      tl.call(() => {
        setShowContent(true);
      }, [], "+=1.2");
      
      // Fade out arrows eventually
      tl.to([arrowLeftRef.current, arrowRightRef.current], {
        opacity: 0,
        duration: 1,
        delay: 0.5
      });
    }
  }, [isExiting]);

  return (
    <main className={styles.main}>
      {/* Transition Arrows */}
      <div ref={arrowLeftRef} className={styles.arrowLeft}>⊢</div>
      <div ref={arrowRightRef} className={styles.arrowRight}>⊣</div>

      {!showContent && (
        <PromoLoader 
          progress={progress} 
          isExiting={isExiting}
          isLanding={true}
          onCornersReady={() => setIsCornersReady(true)}
        />
      )}

      <div style={{ visibility: showContent ? 'visible' : 'hidden' }}>
        <ScrollOptimizer />
        <Header />
        <Hero />
        <BackedBy />
        <div id="the-setup">
          <IpadSection />
        </div>
        <ProblemSection />
        <TextRevealSection />
        <div id="how-it-works">
          <MechanicsSection />
        </div>
        <div id="why-metric-wins">
          <WhyMetricWins />
        </div>
        <div id="integrations">
          <CoverageSection />
        </div>
        <GraphicDivider />
        <Footer />
      </div>
    </main>
  );
}
