'use client';

import React, { useLayoutEffect, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './PromoLoader.module.css';

interface PromoLoaderProps {
  progress?: number;
  isExiting?: boolean;
  onCornersReady?: () => void;
  onExitComplete?: () => void;
}

export default function PromoLoader({ 
  progress = 0, 
  isExiting = false,
  onCornersReady,
  onExitComplete 
}: PromoLoaderProps) {
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const brandRef = useRef<HTMLDivElement>(null);
  const loadingAreaRef = useRef<HTMLDivElement>(null);
  const cubeLeftRef = useRef<HTMLDivElement>(null);
  const cubeRightRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement[]>([]);
  
  const animatedRef = useRef(false);

  // Initial Entrance Animation
  useLayoutEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const corners = cornersRef.current;
    gsap.set(corners, { opacity: 0 });
    gsap.set(corners[0], { x: -150, y: -150 });
    gsap.set(corners[1], { x: 150, y: -150 });
    gsap.set(corners[2], { x: -150, y: 150 });
    gsap.set(corners[3], { x: 150, y: 150 });

    const tl = gsap.timeline({
      onComplete: () => {
        if (onCornersReady) onCornersReady();
      }
    });

    tl.to(corners, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'expo.out',
      stagger: 0.05
    });
  }, [onCornersReady]);

  // Exit Animation Sequence
  useEffect(() => {
    if (isExiting) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onExitComplete) onExitComplete();
        }
      });

      // 1. Blinking effect
      const blinkItems = [brandRef.current, loadingAreaRef.current, cubeLeftRef.current, cubeRightRef.current];
      tl.to(blinkItems, { opacity: 0, duration: 0.03, repeat: 3, yoyo: true });

      // 2. Everything fades out
      tl.to([brandRef.current, loadingAreaRef.current, cubeLeftRef.current, cubeRightRef.current], { 
        opacity: 0, 
        duration: 0.4, 
        ease: 'power2.inOut' 
      });

      // 3. Corners fly to center and transform
      tl.to(cornersRef.current, {
        x: (i) => (i % 2 === 0 ? 396 : -396),
        y: (i) => (i < 2 ? 60 : -20),
        opacity: 0,
        duration: 0.8,
        ease: 'expo.inOut'
      }, "<");

      tl.set(arrowsRef.current, { opacity: 1, scale: 0 });
      tl.to(arrowsRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(2)'
      });

      tl.to(arrowsRef.current[0], { x: -350, duration: 1, ease: 'expo.inOut' });
      tl.to(arrowsRef.current[1], { x: 350, duration: 1, ease: 'expo.inOut' }, "<");
    }
  }, [isExiting, onExitComplete]);

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.content}>
        {/* Corners */}
        <div ref={el => { if (el) cornersRef.current[0] = el; }} className={`${styles.corner} ${styles.topLeft}`} />
        <div ref={el => { if (el) cornersRef.current[1] = el; }} className={`${styles.corner} ${styles.topRight}`} />
        <div ref={el => { if (el) cornersRef.current[2] = el; }} className={`${styles.corner} ${styles.bottomLeft}`} />
        <div ref={el => { if (el) cornersRef.current[3] = el; }} className={`${styles.corner} ${styles.bottomRight}`} />

        {/* Transition Arrows */}
        <div ref={el => { if (el) arrowsRef.current[0] = el; }} className={styles.arrowLeft}>⊢</div>
        <div ref={el => { if (el) arrowsRef.current[1] = el; }} className={styles.arrowRight}>⊣</div>

        <div className={styles.topRow} ref={brandRef}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Image 
                src="/pre_white_logo.svg" 
                alt="Logo" 
                width={28} 
                height={28} 
              />
            </div>
            <span className={styles.brandName}>METRIC</span>
          </div>
          <span className={styles.progress}>{progress}</span>
        </div>

        <div className={styles.loadingArea} ref={loadingAreaRef}>
          <div className={styles.lineBase} />
          
          <div className={styles.cubeLeft} ref={cubeLeftRef}>
            <Image src="/pre_left_cubes.svg" alt="Cubes" width={16} height={8} />
          </div>

          <div className={styles.cubeRight} ref={cubeRightRef}>
            <Image src="/pre_right_cubes.svg" alt="Cubes" width={16} height={8} />
          </div>

          <div className={styles.progressClipper}>
            <div 
              className={styles.lineProgress} 
              style={{ 
                width: `${progress}%`, 
                opacity: progress > 1 ? 1 : 0,
                transition: 'width 0.1s linear, opacity 0.3s ease'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
