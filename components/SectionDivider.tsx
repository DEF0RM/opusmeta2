import Image from 'next/image';
import styles from './SectionDivider.module.css';

interface SectionDividerProps {
  title: string;
}

export default function SectionDivider({ title }: SectionDividerProps) {
  return (
    <div className={styles.divider}>
      <div className={styles.line} />
      <span className={styles.title}>{title}</span>
      <div className={styles.line} />
      
      <Image 
        src="/side_blocks_lb_left.svg" 
        alt="" 
        width={15} 
        height={8} 
        className={styles.blockLeft} 
      />
      <Image 
        src="/side_blocks_lb_right.svg" 
        alt="" 
        width={15} 
        height={8} 
        className={styles.blockRight} 
      />
    </div>
  );
}
