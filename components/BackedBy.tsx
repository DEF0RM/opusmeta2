import Image from 'next/image';
import SectionDivider from './SectionDivider';
import styles from './BackedBy.module.css';

export default function BackedBy() {
  return (
    <section className={styles.section}>
      
      {/* Top Divider with Title */}
      <div className={styles.dividerWrapper}>
        <SectionDivider title="Backed by" />
      </div>

      {/* Partner Logos */}
      <div className={styles.logos}>
        <div className={styles.logoItem}>
          <Image 
            src="/backed_by/kyber_swap.svg" 
            alt="KyberSwap" 
            width={140} 
            height={30} 
            priority
          />
        </div>
        <div className={styles.logoItem}>
          <Image 
            src="/backed_by/0x.svg" 
            alt="0x" 
            width={41} 
            height={25} 
            priority
          />
        </div>
        <div className={styles.logoItem}>
          <Image 
            src="/backed_by/okx.svg" 
            alt="OKX" 
            width={73} 
            height={22} 
            priority
          />
        </div>
        <div className={styles.logoItem}>
          <Image 
            src="/backed_by/cow_swap.svg" 
            alt="CoW Swap" 
            width={157} 
            height={24} 
            priority
          />
        </div>
      </div>

    </section>
  );
}
