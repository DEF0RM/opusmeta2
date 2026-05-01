'use client';

import React from 'react';
import Image from 'next/image';
import SectionDivider from './SectionDivider';
import ScrambleText from './ScrambleText';
import styles from './MechanicsSection.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MechanicsSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const leftColRef = React.useRef<HTMLDivElement>(null);
  const rightColRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Left column animation
    gsap.from(leftColRef.current, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: leftColRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    // Right column animation
    gsap.from(rightColRef.current, {
      x: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2, // Slight stagger
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rightColRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }, { scope: containerRef });

  return (
    <section className={styles.section} ref={containerRef}>
      <SectionDivider title="MECHANICS" />
      
      <div className={styles.container}>
        <div className={styles.columns}>
          {/* LEFT COLUMN: PRICE PROVIDER */}
          <div className={styles.columnLeft} ref={leftColRef}>
            <div className={styles.block}>
              <h2 className={styles.title}>
                <ScrambleText text="Price" trigger="scroll" /><br />
                <ScrambleText text="Provider" trigger="scroll" />
              </h2>
              <p className={styles.description}>
                Any oracle feeds raw price. The Price Provider applies spread + safety logic, then quotes the pool.
              </p>
            </div>
            <div className={styles.headerLineLeft} />
            
            <div className={styles.svgWrapper}>
              <img src="/left_side_mechanics.svg" alt="Price Provider Mechanics" className={styles.mechanicsSvg} />
            </div>
          </div>

          {/* RIGHT COLUMN: LIQUIDITY MODULE */}
          <div className={styles.columnRight} ref={rightColRef}>
            <div className={styles.block}>
              <h2 className={styles.title}>
                <ScrambleText text="Liquidity" trigger="scroll" /><br />
                <ScrambleText text="Module" trigger="scroll" />
              </h2>
              <p className={styles.description}>
                The Price Provider applies spread + safety logic, then quotes the pool.
              </p>
            </div>
            <div className={styles.headerLineRight} />

            <div className={styles.svgWrapper}>
              <img src="/right_side_mechanics.svg" alt="Liquidity Module Mechanics" className={styles.mechanicsSvg} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
