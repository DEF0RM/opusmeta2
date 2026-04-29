'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './PromoHero.module.css';
import TorusScene from './TorusScene';

export default function PromoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subTitleRef = useRef<HTMLDivElement>(null);
  const dashedLineRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Reset initial states
    gsap.set([headerRef.current, contentRef.current, subTitleRef.current, dashedLineRef.current], { 
      opacity: 0, 
      y: 20 
    });
    gsap.set(comingSoonRef.current, { y: 100 });
    gsap.set(backgroundRef.current, { opacity: 0 });

    // 1. Background Torus fades in
    tl.to(backgroundRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    });

    // 2. Main content & Subtitle fade in together
    tl.to([headerRef.current, subTitleRef.current, dashedLineRef.current, contentRef.current], {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: 'expo.out'
    }, "-=1.5");

    // 3. Footer Bar slides up
    tl.to(comingSoonRef.current, {
      y: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, "-=0.8");

    tl.to(coordsRef.current, {
      opacity: 1,
      duration: 1,
      stagger: 0.2
    }, "-=1");

  }, []);

  return (
    <div className={styles.heroWrapper} ref={containerRef}>
      {/* Background Layer for Torus */}
      <div className={styles.canvasBackground} ref={backgroundRef}>
        <TorusScene />
        <div className={styles.torusGlow} />
      </div>

      {/* Header Section */}
      <header className={styles.header} ref={headerRef}>
        <div className={styles.logoWrapper}>
          <Image
            src="/pre_white_logo.svg"
            alt="Metric Logo"
            width={48}
            height={48}
          />
        </div>
        <h1 className={styles.mainTitle}>
          EVERYTHING ONCHAIN <br />
          PRICED TO REALITY
        </h1>
      </header>

      {/* Middle Section (Overlay) */}
      <div className={styles.middleSection} ref={contentRef}>
        <div className={`${styles.coord} ${styles.coordLeft}`} ref={el => { if (el) coordsRef.current[0] = el; }}>
          <span className={styles.arrowIcon}>⊢</span>
          <span className={styles.coordValue}>X3.4553</span>
          <div className={styles.connectingLine} />
        </div>

        <div className={styles.spacer} />

        <div className={`${styles.coord} ${styles.coordRight}`} ref={el => { if (el) coordsRef.current[1] = el; }}>
          <div className={styles.connectingLine} />
          <span className={styles.coordValue}>Y3.4553</span>
          <span className={styles.arrowIcon}>⊣</span>
        </div>
      </div>

      {/* Footer Area with Subtitle and Coming Soon Bar */}
      <div className={styles.footerArea}>
        <span className={styles.subTitle} ref={subTitleRef}>
          the programmable liquidity layer of real markets
        </span>
        <div className={styles.dashedLine} ref={dashedLineRef} />

        <div className={styles.comingSoonBar} ref={comingSoonRef}>
          <p className={styles.comingSoonText}>COMING SOON</p>
        </div>
      </div>
    </div>
  );
}
