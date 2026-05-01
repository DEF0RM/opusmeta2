import React from 'react';
import Image from 'next/image';
import ScrambleText from './ScrambleText';
import styles from './CoverageSection.module.css';
import SectionDivider from './SectionDivider';
import RiveAnimation from './RiveAnimation';

interface CoverageCardProps {
  title: string;
  artboard: string;
  icons: string[];
  color?: string;
  bottomBg?: string;
}

const CoverageCard: React.FC<CoverageCardProps> = ({ title, artboard, icons, color = '#FCFCF4', bottomBg }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.riveWrapper} style={{ borderColor: color }}>
          <div className={styles.iconCross1} />
          <div className={styles.iconCross2} />
          <div className={styles.riveContainer}>
            <RiveAnimation 
              src="/assets/animations/metric_-_everything_onchain_priced_to_reality.riv"
              artboard={artboard}
              className={styles.riveIcon}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.smallIconsRow}>
          {icons.map((icon, i) => (
            <div key={i} className={styles.smallIconBox}>
              <Image 
                src={icon} 
                alt="token" 
                width={40} 
                height={40} 
                className={styles.smallIcon} 
              />
            </div>
          ))}
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      
      {/* Background diagonal line */}
      <div className={styles.diagonalBg} />
      
      {/* Bottom decorative bar */}
      {bottomBg && (
        <div className={styles.bottomBar}>
          <Image
            src={bottomBg}
            alt=""
            fill
            sizes="25vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  );
};

export const CoverageSection: React.FC = () => {
  const cryptoIcons = [
    '/crypto/eth.svg',
    '/crypto/bnb.svg',
    '/crypto/btc.svg',
    '/crypto/lite.svg'
  ];

  const features = [
    {
      title: 'commodities/FX',
      artboard: 'commodities/FX',
      icons: cryptoIcons,
      color: '#FCFCF4',
      bottomBg: '/card_bg/firstcard_backg.png',
    },
    {
      title: 'equities/RWAs',
      artboard: 'equities/RWAs',
      icons: cryptoIcons,
      color: '#84E0F7',
      bottomBg: '/card_bg/secondcard_backg.png',
    },
    {
      title: 'majors + tokenized',
      artboard: 'majors + tokenized',
      icons: cryptoIcons,
      color: '#3DB1CF',
      bottomBg: '/card_bg/thirdcard_backg.png',
    },
    {
      title: 'options/prediction',
      artboard: 'options/prediction',
      icons: cryptoIcons,
      color: '#0096BA',
      bottomBg: '/card_bg/fourthcard_backg.png',
    }
  ];

  return (
    <section className={styles.section}>
      <SectionDivider title="COVERAGE" />

      <div className={styles.container}>
        <h2 className={styles.title}>
          <ScrambleText text="EVERYTHING ONCHAIN" trigger="scroll" />
          <br />
          <ScrambleText text="PRICED TO REALITY" trigger="scroll" />
        </h2>

        <div className={styles.grid}>
          {/* Side Border Line Left */}
          <div className={styles.sideLine}>
            <div className={styles.sideLineIndicator} />
          </div>

          <div className={styles.cardsContainer}>
            {features.map((item, index) => (
              <CoverageCard key={index} {...item} />
            ))}
          </div>

          {/* Side Border Line Right */}
          <div className={styles.sideLine}>
            <div className={styles.sideLineIndicator} />
          </div>
        </div>
      </div>
    </section>
  );
};

