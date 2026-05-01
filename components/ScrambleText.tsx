'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';

interface ScrambleTextProps {
  text: string;
  trigger?: 'hover' | 'scroll';
  className?: string;
  speed?: number;
}

export default function ScrambleText({ 
  text, 
  trigger = 'hover', 
  className = '',
  speed = 1
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>(0);
  const iterationRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);

  const scramble = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    iterationRef.current = 0;

    const animate = () => {
      setDisplayText(() => {
        const nextText = text.split('').map((letter, index) => {
          if (index < iterationRef.current) {
            return text[index];
          }
          // Preserve spaces
          if (letter === ' ') return ' ';
          return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        }).join('');
        return nextText;
      });

      // Increase iteration. The smaller the number, the slower the decode.
      // 1 / 7.5 is base speed. Multiplying by speed prop.
      iterationRef.current += (1 / 7.5) * speed;

      if (iterationRef.current < text.length) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text); // Ensure final text is exact
        isAnimatingRef.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [text]);

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    isAnimatingRef.current = false;
    // We don't reset the text to original here because we want it to stay readable
    // but the next trigger will restart the scramble.
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (trigger === 'hover') {
      // Find the closest clickable parent to trigger early if it has padding
      const triggerEl = el.closest('a, button') || el;
      
      const handleMouseEnter = () => scramble();
      triggerEl.addEventListener('mouseenter', handleMouseEnter);
      
      return () => {
        triggerEl.removeEventListener('mouseenter', handleMouseEnter);
        reset();
      };
    }

    if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              scramble();
            } else {
              // Ready it to trigger again when scrolling back
              reset();
            }
          });
        },
        { threshold: 0.1 } // triggers when 10% visible
      );

      observer.observe(el);
      return () => {
        observer.unobserve(el);
        reset();
      };
    }
  }, [trigger, scramble, reset]);

  return (
    <span ref={containerRef} className={className} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Invisible text to reserve exact layout dimensions */}
      <span style={{ visibility: 'hidden' }}>{text}</span>
      {/* Absolute positioned changing text to prevent layout shifts */}
      <span style={{ position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap' }}>
        {displayText}
      </span>
    </span>
  );
}
