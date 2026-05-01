import React from 'react';
import styles from './GraphicDivider.module.css';

export default function GraphicDivider() {
  return (
    <div className={styles.container}>
      <img src="/razdel.svg" alt="Section Divider" className={styles.svg} />
    </div>
  );
}
