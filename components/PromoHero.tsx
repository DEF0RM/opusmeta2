'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './PromoHero.module.css';
import TorusScene from './TorusScene';

export default function PromoHero({ shouldManifest = false }: { shouldManifest?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const dashedLineRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);
  const sideLineLeftRef = useRef<HTMLDivElement>(null);
  const sideLineRightRef = useRef<HTMLDivElement>(null);
  const subTitleTextRef = useRef<HTMLDivElement>(null);

  // Helper to wrap characters in spans
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char" style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
        {char}
      </span>
    ));
  };

  useEffect(() => {
    if (!shouldManifest) return;

    const tl = gsap.timeline();

    // Reset initial states
    const isMobile = window.innerWidth <= 768;
    
    // Select all split characters
    const chars = containerRef.current?.querySelectorAll('.char');
    
    gsap.set(chars, { 
      opacity: 0, 
      scale: 0.3,
      y: 20,
      transformOrigin: 'center center'
    });

    gsap.set([headerRef.current, dashedLineRef.current], { opacity: 0, y: 10 });
    gsap.set(comingSoonRef.current, { y: isMobile ? -100 : 100, opacity: 0 });
    gsap.set(backgroundRef.current, { opacity: 0 });
    gsap.set(coordsRef.current, { opacity: 0 });
    
    // Initial state for side lines
    gsap.set(sideLineLeftRef.current, { x: -50, opacity: 0 });
    gsap.set(sideLineRightRef.current, { x: 50, opacity: 0 });
    
    // Initial state for connecting lines
    const connectingLines = containerRef.current?.querySelectorAll(`.${styles.connectingLine}`);
    gsap.set(connectingLines, { scaleX: 0 });
    // Left line grows from left, Right line grows from right
    gsap.set(containerRef.current?.querySelector(`.${styles.coordLeft} .${styles.connectingLine}`), { transformOrigin: 'left center' });
    gsap.set(containerRef.current?.querySelector(`.${styles.coordRight} .${styles.connectingLine}`), { transformOrigin: 'right center' });

    // 1. Background Torus fades in
    tl.to(backgroundRef.current, {
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out'
    });

    // 2. Side Lines slide in
    tl.to([sideLineLeftRef.current, sideLineRightRef.current], {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'expo.out'
    }, "-=0.8");

    // 3. Characters growth (Staggered left-to-right)
    tl.to(chars, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.02,
      ease: 'back.out(1.7)'
    }, "-=1.0");

    // 4. Header & Dashed Line
    tl.to([headerRef.current, dashedLineRef.current], {
      opacity: 1,
      y: 0,
      duration: 1.0
    }, "<");

    // 5. Footer slide up
    tl.to(comingSoonRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'expo.out'
    }, "-=1.5");

    // 6. Coordinates fade in & lines grow
    tl.to(coordsRef.current, {
      opacity: 1,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.8");

    tl.to(connectingLines, {
      scaleX: 1,
      duration: 1.2,
      ease: 'expo.out'
    }, "<");

  }, [shouldManifest]);

  return (
    <div className={styles.heroWrapper} ref={containerRef}>
      {/* Side Border Lines */}
      <div className={styles.sideLineLeft} ref={sideLineLeftRef} />
      <div className={styles.sideLineRight} ref={sideLineRightRef} />

      {/* Background Layer for Torus */}
      <div className={styles.canvasBackground} ref={backgroundRef}>
        <TorusScene shouldManifest={shouldManifest} />
        <div className={styles.torusGlow} />
      </div>

      {/* Logo & Desktop Title Section */}
      <div className={styles.logoSection} ref={headerRef}>
        <Image
          src="/pre_white_logo.svg"
          alt="Metric Logo"
          width={48}
          height={48}
        />
        <h1 className={`${styles.mainTitle} ${styles.desktopOnly}`} ref={mainTitleRef}>
          {splitText("EVERYTHING ONCHAIN")}
          <br />
          {splitText("PRICED TO REALITY")}
        </h1>
      </div>

      {/* Middle Section (Overlay) */}
      <div className={styles.middleSection} ref={contentRef}>
        <div className={`${styles.coord} ${styles.coordLeft}`} ref={el => { if (el) coordsRef.current[0] = el; }}>
          <span className={styles.arrowIcon} style={{ visibility: 'hidden' }}>⊢</span>
          <div className={`${styles.connectingLine} ${styles.desktopOnly}`} />
          <span className={`${styles.coordValue} ${styles.desktopOnly}`}>{splitText("X3.4553")}</span>
        </div>

        <div className={styles.spacer} />

        <div className={`${styles.coord} ${styles.coordRight}`} ref={el => { if (el) coordsRef.current[1] = el; }}>
          <span className={`${styles.coordValue} ${styles.desktopOnly}`}>{splitText("Y3.4553")}</span>
          <div className={`${styles.connectingLine} ${styles.desktopOnly}`} />
          <span className={styles.arrowIcon} style={{ visibility: 'hidden' }}>⊣</span>
        </div>
      </div>

      {/* Title & Text Area */}
      <div className={styles.footerArea}>
        {/* Mobile-only Title */}
        <h1 className={`${styles.mainTitle} ${styles.mobileOnly}`}>
          {splitText("EVERYTHING ON")}
          <br />
          {splitText("CHAIN PRICED")}
          <br />
          {splitText("TO REALITY")}
        </h1>
        
        <div className={styles.subTextGroup}>
          <div className={styles.dashedLine} ref={dashedLineRef} />
          <span className={styles.subTitle} ref={subTitleRef}>
            <span className={styles.desktopOnly}>{splitText("the programmable liquidity layer of real markets")}</span>
            <span className={styles.mobileOnly}>
              {splitText("THE PROGRAMMABLE LIQUIDITY")}
              <br />
              {splitText("LAYER OF REAL MARKETS")}
            </span>
          </span>
        </div>
      </div>

      {/* Coming Soon Bar */}
      <div className={styles.comingSoonBar} ref={comingSoonRef}>
        <p className={styles.comingSoonText}>COMING SOON</p>
      </div>
    </div>
  );
}
