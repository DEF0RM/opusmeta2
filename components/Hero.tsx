'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ScrambleText from './ScrambleText';
import TorusScene from './TorusScene';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const logoInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section   = sectionRef.current;
    const logoInner = logoInnerRef.current;
    if (!section || !logoInner) return;

    // --- Scroll: rotate + scale ---
    const scrollTween = gsap.to(logoInner, {
      rotation: 360,
      scale: 0.8,
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section className={styles.hero} ref={sectionRef}>

      {/* Torus Logo Container */}
      <div className={styles.torusLogoContainer}>
        <div className={styles.torusLogoInner} ref={logoInnerRef}>
          <TorusScene shouldManifest={true} />
        </div>
      </div>

      {/* Left content */}
      <div className={styles.leftContent}>
        <p className={styles.title}>
          <ScrambleText text="The" trigger="scroll" /><br />
          <ScrambleText text="reference" trigger="scroll" /><br />
          <ScrambleText text="point for DeFi" trigger="scroll" />
        </p>
        <p className={styles.subtitle}>
          Powering the financial era of on-chain markets
        </p>
        <div className={styles.buttons}>
          <a href="/docs" className={styles.docBtn}>
            <span className={styles.docBtnText}>
              <ScrambleText text="Doc" trigger="hover" speed={0.25} />
            </span>
          </a>
          <a href="/app" className={styles.launchBtn}>
            <span className={styles.launchBtnText}>
              <ScrambleText text="Launch app" trigger="hover" speed={0.5} />
            </span>
          </a>
        </div>
      </div>

      {/* Right text */}
      <div className={styles.rightText}>
        An oracle-guided AMM that separates price formation from liquidity provision
      </div>

    </section>
  );
}
