'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import SectionDivider from './SectionDivider';
import ScrambleText from './ScrambleText';
import styles from './WhyMetricWins.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhyMetricWins() {
  const [activeRow, setActiveRow] = React.useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const toggleRow = (index: number) => {
    setActiveRow(activeRow === index ? null : index);
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || !svgRef.current || !listRef.current || !footerRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const calculateAnimations = () => {
        const title = titleRef.current!;
        const list = listRef.current!;
        const container = sectionRef.current!;
        
        const sectionRect = container.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();

        const titleBottom = (titleRect.bottom - sectionRect.top);
        const listTop = (listRect.top - sectionRect.top);
        
        const targetTop = titleBottom + (isMobile ? 20 : 40);
        let moveDistance = listTop - targetTop;

        if (isMobile) moveDistance = 0; 
        if (isTablet) moveDistance = Math.min(moveDistance, 150);

        return { moveDistance, isMobile };
      };

      const { moveDistance, isMobile: mobileMode } = calculateAnimations();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => mobileMode ? '+=10%' : `+=${Math.abs(moveDistance) + 50}`,
          pin: !mobileMode,
          scrub: 0.5, 
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(svgRef.current, {
        y: mobileMode ? -50 : -200,
        z: -500,
        scale: mobileMode ? 0.8 : 0.4,
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        filter: 'blur(10px)',
        ease: 'power2.inOut',
      }, 0);

      tl.to(footerRef.current, {
        opacity: 1,
        ease: 'power2.out',
      }, 0.1);

      if (!mobileMode) {
        tl.fromTo(listRef.current,
          { y: 60, opacity: 0 },
          { 
            y: -moveDistance, 
            opacity: 1, 
            ease: 'power2.out' 
          },
          0.1
        );
      } else {
        tl.fromTo(listRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.1
        );
      }
    });

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <SectionDivider title="WHY METRIC WINS" />

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title} ref={titleRef}>
            <ScrambleText text="Why" trigger="scroll" /><br />
            <ScrambleText text="Metric" trigger="scroll" /><br />
            <ScrambleText text="Wins" trigger="scroll" />
          </h2>

          <div className={styles.footer} ref={footerRef}>
            <div className={styles.learnMoreWrapper}>
              <a href="#" className={styles.learnMore}>
                <span className={styles.arrow}>↳</span>
                <span className={styles.learnMoreText}>LEARN MORE [DOC]</span>
              </a>
              <div className={styles.footerLine} />
            </div>
          </div>
        </div>

        <div className={styles.svgWrapper} ref={svgRef}>
          <Image 
            src="/static_wmw.svg" 
            alt="Why Metric Wins Diagram" 
            className={styles.mainSvgDesktop}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            priority={true}
          />
          <Image 
            src="/wmw_adaptive.svg" 
            alt="Why Metric Wins Diagram Mobile" 
            className={styles.mainSvgMobile}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <div className={styles.featuresList} ref={listRef}>
          {[
            { id: '01', title: 'Market-aligned pricing', desc: 'YET MOST DEXS STILL TREAT AMM' },
            { id: '02', title: 'ROUTED ORDERFLOW', desc: 'OPTIMIZING EVERY TRADE PATH' },
            { id: '03', title: 'BETTER LP RETURNS', desc: 'MAXIMIZING YIELD EFFICIENCY' },
            { id: '04', title: 'FAST EXECUTION', desc: 'INSTANT ON-CHAIN SETTLEMENT' },
            { id: '05', title: 'DEEP LIQUIDITY', desc: 'MINIMAL SLIPPAGE FOR LARGE TRADES' }
          ].map((item, index) => (
            <div
              key={index}
              className={`${styles.row} ${activeRow === index ? styles.active : ''}`}
              onClick={() => toggleRow(index)}
            >
              <div className={styles.bgLayers}>
                <div className={styles.layerBlue} />
                <div className={styles.layerBeige} />
                <div className={styles.layerOlive} />
              </div>

              <div className={styles.rowContentPassive}>
                <div className={styles.itemContainer}>
                  <div className={styles.iconContainer}>
                    <div className={styles.diagonalLine} />
                  </div>
                  <div className={styles.placeholderContainer}>
                    <span className={styles.placeholderText}>###</span>
                  </div>
                </div>
                <div className={styles.textContainer}>
                  <span className={styles.largeText}>{item.title}</span>
                </div>
              </div>

              <div className={styles.rowContentActiveWrapper}>
                <div className={styles.rowContentActive}>
                  <div className={styles.itemContainer}>
                    <div className={styles.iconContainer}>
                      <div className={styles.diagonalLine} />
                    </div>
                    <div className={styles.placeholderContainer}>
                      <span className={styles.activeDesc}>{item.desc}</span>
                    </div>
                  </div>
                  <div className={styles.textContainer}>
                    <span className={styles.largeText}>{item.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
