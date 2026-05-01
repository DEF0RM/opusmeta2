'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './TextRevealSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "MAJORS, AMMS",
  "TURN LPS INTO THE",
  "COUNTERPARTY",
  "FUNDING PRICE"
];

export default function TextRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const coloredCorrectionRef = useRef<HTMLDivElement>(null);
  
  // We need refs to all letter spans to animate them sequentially
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  // Clear refs on each render to avoid duplicates
  lettersRef.current = [];

  const addLetterRef = (el: HTMLSpanElement | null) => {
    if (el) {
      lettersRef.current.push(el);
    }
  };

  useGSAP(() => {
    if (!sectionRef.current) return;
    
    // Create the main scroll timeline for the curtain and text wave
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top', // Pin when top of section hits top of viewport
        end: '+=200%', // Enough scroll distance for both wave and curtain
        pin: true,
        pinSpacing: true, // Ensure next section is pushed down
        scrub: 1, // Smooth scrubbing
        anticipatePin: 1, // Avoid jumpiness
      }
    });

    // Speed up the stagger significantly so it doesn't take too long to scroll
    const letterStagger = 0.015;
    const waveEndTime = lettersRef.current.length * letterStagger;

    // 1. Animate the normal letters (wave: grey -> cyan -> white)
    tl.to(lettersRef.current, {
      keyframes: [
        { color: '#84E0F7', duration: 0.1 },
        { color: '#FFFFFF', duration: 0.2 }
      ],
      stagger: letterStagger,
      ease: "power1.inOut"
    }, 0);

    // 2. Animate CORRECTION word at the end of the text wave
    tl.addLabel("correctionStart", waveEndTime);
    
    // Animate curtain shrinking to the right (transform-origin is right)
    tl.to(curtainRef.current, {
      scaleX: 0,
      duration: 1,
      ease: "power1.inOut"
    }, "correctionStart");
    
    // Reveal colored text underneath synchronously with the curtain
    tl.to(coloredCorrectionRef.current, {
      clipPath: "inset(0 0% 0 0)", // Reveal fully
      duration: 1,
      ease: "power1.inOut"
    }, "correctionStart");
    
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.textContainer}>
        {LINES.map((line, lineIdx) => (
          <div key={lineIdx} className={styles.line}>
            {line.split(' ').map((word, wordIdx) => (
              <div key={wordIdx} className={styles.word}>
                {word.split('').map((char, charIdx) => (
                  <span key={`${wordIdx}-${charIdx}`} ref={addLetterRef} className={styles.letter}>
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
        
        {/* CORRECTION line */}
        <div className={styles.line}>
          <div className={styles.correctionWrapper}>
            <Image 
              src="/side_blocks_lb_left.svg" 
              alt="" 
              width={30} 
              height={16} 
              className={styles.cornerLeft} 
            />
            <Image 
              src="/side_blocks_lb_right.svg" 
              alt="" 
              width={30} 
              height={16} 
              className={styles.cornerRight} 
            />
            <div className={styles.curtain} ref={curtainRef}></div>
            
            {/* Base dark text */}
            <div className={`${styles.correctionTextBase} ${styles.paddedContainer}`}>
              {"CORRECTION".split('').map((char, i) => (
                <span key={i} className={styles.letter}>
                  {char}
                </span>
              ))}
            </div>
            
            {/* Colored overlay text */}
            <div className={`${styles.correctionTextColored} ${styles.paddedContainer}`} ref={coloredCorrectionRef}>
              {"CORRECTION".split('').map((char, i) => (
                <span key={`col-${i}`} className={styles.letter}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
