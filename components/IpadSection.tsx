'use client';

import { useRef } from 'react';
import Image from 'next/image';
import AnimatedLogo from './AnimatedLogo';
import ScrambleText from './ScrambleText';
import SectionDivider from './SectionDivider';
import styles from './IpadSection.module.css';

export default function IpadSection() {
  const ipadSectionRef = useRef<HTMLDivElement>(null);
  
  // We pass the bgContainer ref to AnimatedLogo so the hover gyroscope
  // reacts to mouse movements across the entire background section.
  return (
    <section className={styles.section}>
      <div className={styles.bgContainerWrapper}>
        <div className={styles.bgContainer} ref={ipadSectionRef}>
          {/* Background Image */}
          <Image
            src="/ipad_backgroud.png"
            alt="iPad Background"
            fill
            priority
            sizes="100vw"
            className={styles.bgImage}
          />

          <div className={styles.contentWrapper}>
            <div className={styles.ipadContainer}>
              {/* iPad Mockup */}
              <Image
                src="/Ipad.png"
                alt="iPad Mockup"
                fill
                sizes="(max-width: 1024px) 90vw, 881px"
                className={styles.ipadImage}
              />

              {/* Screen Area containing the Logo */}
              <div className={styles.screenArea}>
                <div className={styles.logoWrapper}>
                  <AnimatedLogo hoverTargetRef={ipadSectionRef} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Launch App Button fixed to bottom right of the bg container on desktop, full width below on mobile */}
        <div className={styles.launchAppWrapper}>
          <a href="/app" className={styles.launchAppBtn}>
            <ScrambleText text="LAUNCH APP" trigger="hover" speed={0.5} />
          </a>
        </div>
      </div>

      {/* Section Divider Below */}
      <div className={styles.dividerWrapper}>
        <SectionDivider title="The setup" />
      </div>
    </section>
  );
}
