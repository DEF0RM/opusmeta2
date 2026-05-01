'use client';

import Image from 'next/image';
import ScrambleText from './ScrambleText';
import styles from './Header.module.css';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollToPlugin);

const navLinks = [
  { label: 'The setup', href: '#the-setup', targetId: 'the-setup' },
  { label: 'How it works', href: '#how-it-works', targetId: 'how-it-works' },
  { label: 'Why Metric Wins', href: '#why-metric-wins', targetId: 'why-metric-wins' },
  { label: 'Integrations', href: '#integrations', targetId: 'integrations' },
];

export default function Header() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 44;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: offsetPosition, autoKill: false },
        ease: 'expo.inOut'
      });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.sideLine} />
      <div className={styles.mainContent}>
        {/* Logo */}
        <a 
          href="/" 
          className={styles.logo} 
          aria-label="Metric Home"
          onClick={(e) => {
            e.preventDefault();
            gsap.to(window, { duration: 1.5, scrollTo: 0, ease: 'expo.inOut' });
          }}
        >
          <Image
            src="/metriclp_biglogo.svg"
            alt="Metric Logo"
            width={24}
            height={24}
            priority
          />
        </a>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className={styles.navLink}
              onClick={(e) => handleScroll(e, link.targetId)}
            >
              <ScrambleText text={link.label} trigger="hover" />
            </a>
          ))}
        </nav>

        {/* Action buttons */}
        <div className={styles.actions}>
          <a href="/docs" className={styles.docsBtn} aria-label="Documentation">
            <span className={styles.docsText}>
              <ScrambleText text="Docs" trigger="hover" speed={0.25} />
            </span>
          </a>
          <a href="/app" className={styles.launchBtn} aria-label="Launch App">
            <span className={styles.launchText}>
              <ScrambleText text="Launch app" trigger="hover" speed={0.5} />
            </span>
          </a>
        </div>
      </div>
      <div className={styles.sideLine} />
    </header>
  );
}
