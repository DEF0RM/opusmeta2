'use client';

import React from 'react';
import styles from './ProblemSection.module.css';
import SectionDivider from './SectionDivider';
import ScrambleText from './ScrambleText';
import RiveAnimation from './RiveAnimation';

export default function ProblemSection() {
  const cards = [
    {
      number: '01',
      text: 'For majors + tokenized equities/RWAs, the real price is set off-chain — on major exchanges and regulated markets.',
      artboard: '01',
    },
    {
      number: '02',
      text: 'Yet AMMs still try to discover price inside the pool. When markets move, the pool goes stable.',
      artboard: '02',
    },
    {
      number: '03',
      text: 'Arbitrage re-aligns the pool — LPs pay for it. “Incentives” may inflate headline APR, but they don’t cover the leakage.',
      artboard: '03',
    },
  ];

  return (
    <>
      <section className={styles.section} id="core-problem">
        <div className={styles.leftCol}>
          <h2 className={styles.title}>
            <ScrambleText text="The Price" trigger="scroll" /><br />
            <ScrambleText text="Discovery" trigger="scroll" /><br />
            <ScrambleText text="Problem" trigger="scroll" />
          </h2>
        </div>
        
        <div className={styles.rightCol}>
          {cards.map((card, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.animationWrapper}>
                <RiveAnimation 
                  src="/assets/animations/metric_-_the_setup.riv"
                  artboard={card.artboard}
                  className={styles.riveCanvas}
                />
              </div>
              
              <div className={styles.textWrapper}>
                <span className={styles.cardNumber}>{card.number}</span>
                <p className={card.number === '03' ? `${styles.cardText} ${styles.cardTextSmall}` : styles.cardText}>
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Divider exactly like in the design */}
      <SectionDivider title="Core Problem" />
    </>
  );
}
