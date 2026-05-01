'use client';

import React, { useEffect, useRef } from 'react';
import styles from './Footer.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: logoRef.current,
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      });
    }
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Links Grid */}
        <div className={styles.grid}>
          <div className={styles.sideLine}></div>
          <div className={styles.linksArea}>
            <div className={styles.column}>
              <p className={styles.colTitle}>SITE</p>
              <div className={styles.links}>
                <a href="#" className={styles.link}>THE PROBLEM</a>
                <a href="#" className={styles.link}>THE SETUP</a>
                <a href="#" className={styles.link}>HOW IT WORKS</a>
              </div>
            </div>

            <div className={styles.column}>
              <p className={styles.colTitle}>DOCS</p>
              <div className={styles.links}>
                <a href="#" className={styles.link}>DOCS</a>
                <a href="#" className={styles.link}>DOCS</a>
                <a href="#" className={styles.link}>DOCS</a>
              </div>
            </div>

            <div className={styles.column}>
              <p className={styles.colTitle}>SOCIALS</p>
              <div className={styles.links}>
                <a href="#" className={styles.link}>TELEGRAM</a>
                <a href="#" className={styles.link}>X (TWITTER)</a>
                <a href="#" className={styles.link}>IG</a>
              </div>
            </div>
          </div>
          <div className={styles.sideLine}></div>
        </div>

        {/* Bottom Logo and Info Grid */}
        <div className={styles.grid}>
          <div className={styles.sideLine}></div>
          <div className={styles.bottomArea}>
            <div className={styles.footerInfo}>
              <img src="/all_rights_reserved.svg" alt="All rights reserved" className={styles.infoIcon} />
              <span className={styles.infoText}>ALL RIGHTS RESERVED.</span>
            </div>
            <div className={styles.bigLogoWrapper} ref={logoRef}>
              <img src="/big_logo_footer_desk.svg" alt="Metric Logo" className={styles.bigLogoDesktop} />
              <img src="/big_logo_footer_mobile.svg" alt="Metric Logo" className={styles.bigLogoMobile} />
            </div>
          </div>
          <div className={styles.sideLine}></div>
        </div>
      </div>
    </footer>
  );
}
