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

  useEffect(() => {
    const tl = gsap.timeline();

    // Reset initial states
    const isMobile = window.innerWidth <= 768;
    
    gsap.set([headerRef.current, mainTitleRef.current, contentRef.current, subTitleRef.current, dashedLineRef.current], { 
      opacity: 0, 
      y: 20 
    });
    
    // On mobile, coming soon bar is at the top, so we slide it from further top
    gsap.set(comingSoonRef.current, { y: isMobile ? -100 : 100 });
    gsap.set(backgroundRef.current, { opacity: 0 });

    // 1. Background Torus fades in
    tl.to(backgroundRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    });

    // 2. Main content & Subtitle fade in together
    tl.to([headerRef.current, mainTitleRef.current, subTitleRef.current, dashedLineRef.current, contentRef.current], {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out'
    }, "-=0.5");

    // 3. Footer Bar slides up
    tl.to(comingSoonRef.current, {
      y: 0,
      duration: 1.0,
      ease: 'power4.out'
    }, "-=1.0");

    // 4. Coordinates (including internal arrows) fade in at the end of the spread
    tl.to(coordsRef.current, {
      opacity: 1,
      duration: 0.8,
      stagger: 0.1
    }, "-=0.5");

  }, [shouldManifest]);

  return (
    <div className={styles.heroWrapper} ref={containerRef}>
      {/* Side Border Lines */}
      <div className={styles.sideLineLeft} />
      <div className={styles.sideLineRight} />

      {/* Background Layer for Torus */}
      <div className={styles.canvasBackground} ref={backgroundRef}>
        <TorusScene />
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
          EVERYTHING ONCHAIN<br />PRICED TO REALITY
        </h1>
      </div>

      {/* Middle Section (Overlay) */}
      <div className={styles.middleSection} ref={contentRef}>
        <div className={`${styles.coord} ${styles.coordLeft}`} ref={el => { if (el) coordsRef.current[0] = el; }}>
          <span className={styles.arrowIcon} style={{ visibility: 'hidden' }}>⊢</span>
          <span className={`${styles.coordValue} ${styles.desktopOnly}`}>X3.4553</span>
          <div className={`${styles.connectingLine} ${styles.desktopOnly}`} />
        </div>

        <div className={styles.spacer} />

        <div className={`${styles.coord} ${styles.coordRight}`} ref={el => { if (el) coordsRef.current[1] = el; }}>
          <div className={`${styles.connectingLine} ${styles.desktopOnly}`} />
          <span className={`${styles.coordValue} ${styles.desktopOnly}`}>Y3.4553</span>
          <span className={styles.arrowIcon} style={{ visibility: 'hidden' }}>⊣</span>
        </div>
      </div>

      {/* Title & Text Area */}
      <div className={styles.footerArea}>
        {/* Mobile-only Title */}
        <h1 className={`${styles.mainTitle} ${styles.mobileOnly}`}>
          EVERYTHING ON<br />
          CHAIN PRICED<br />
          TO REALITY
        </h1>
        
        <div className={styles.subTextGroup}>
          <div className={styles.dashedLine} ref={dashedLineRef} />
          <span className={styles.subTitle} ref={subTitleRef}>
            <span className={styles.desktopOnly}>the programmable liquidity layer of real markets</span>
            <span className={styles.mobileOnly}>THE PROGRAMMABLE LIQUIDITY<br />LAYER OF REAL MARKETS</span>
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
