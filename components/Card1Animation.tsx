import React from 'react';
import styles from './ProblemSection.module.css';

export default function Card1Animation() {
  return (
    <svg width="522" height="522" viewBox="0 0 522 522" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles.riveCanvas} ${styles.card1Svg}`}>
      <g clipPath="url(#clip0_3635_10681)">
        <rect width="522" height="522" fill="#1D1D1F"/>
        <line x1="261.5" y1="259.437" x2="261.5" y2="488.877" stroke="#343435"/>
        <line x1="261.5" y1="259.437" x2="261.5" y2="488.877" stroke="#343435"/>
        
        {/* Animated Group */}
        <g className={styles.spinSlow} style={{ transformOrigin: '261px 261px' }}>
          <path d="M204.698 261.099C204.698 268.637 206.182 276.101 209.067 283.065C211.952 290.029 216.18 296.357 221.51 301.688C226.84 307.018 233.168 311.246 240.132 314.131C247.097 317.015 254.561 318.5 262.099 318.5C269.637 318.5 277.101 317.015 284.065 314.131C291.03 311.246 297.357 307.018 302.688 301.688C308.018 296.357 312.246 290.03 315.131 283.065C318.015 276.101 319.5 268.637 319.5 261.099C319.5 253.561 318.015 246.097 315.131 239.132C312.246 232.168 308.018 225.84 302.688 220.51C297.357 215.18 291.03 210.952 284.065 208.067C277.101 205.182 269.637 203.698 262.099 203.698C254.561 203.698 247.097 205.182 240.132 208.067C233.168 210.952 226.84 215.18 221.51 220.51C216.18 225.84 211.952 232.168 209.067 239.132C206.182 246.097 204.698 253.561 204.698 261.099L204.698 261.099Z" stroke="#343435"/>
          <path d="M100.5 261C100.5 282.077 104.651 302.948 112.717 322.421C120.783 341.893 132.606 359.587 147.509 374.491C162.413 389.394 180.107 401.217 199.579 409.283C219.052 417.349 239.923 421.5 261 421.5C282.077 421.5 302.948 417.349 322.421 409.283C341.893 401.217 359.587 389.394 374.491 374.491C389.394 359.587 401.217 341.893 409.283 322.421C417.349 302.948 421.5 282.077 421.5 261C421.5 239.923 417.349 219.052 409.283 199.579C401.217 180.107 389.394 162.413 374.491 147.509C359.587 132.606 341.893 120.783 322.421 112.717C302.948 104.651 282.077 100.5 261 100.5C239.923 100.5 219.052 104.651 199.579 112.717C180.107 120.783 162.413 132.606 147.509 147.509C132.606 162.413 120.783 180.107 112.717 199.579C104.651 219.052 100.5 239.923 100.5 261L100.5 261Z" stroke="#84E0F7" strokeDasharray="1 20"/>
          <circle cx="422" cy="261" r="6" fill="#84E0F7" className={styles.pulse}/>
          <circle cx="97" cy="261" r="6" fill="#84E0F7" className={styles.pulse}/>
          <circle cx="374.402" cy="375.905" r="6" transform="rotate(45 374.402 375.905)" fill="#84E0F7" className={styles.pulseDelay1}/>
          <circle cx="144.594" cy="146.095" r="6" transform="rotate(45 144.594 146.095)" fill="#84E0F7" className={styles.pulseDelay1}/>
          <circle cx="261.5" cy="423.5" r="6" transform="rotate(90 261.5 423.5)" fill="#84E0F7" className={styles.pulseDelay2}/>
          <circle cx="261.5" cy="98.5" r="6" transform="rotate(90 261.5 98.5)" fill="#84E0F7" className={styles.pulseDelay2}/>
          <circle cx="144.597" cy="375.904" r="6" transform="rotate(135 144.597 375.904)" fill="#84E0F7" className={styles.pulseDelay3}/>
          <circle cx="374.405" cy="146.096" r="6" transform="rotate(135 374.405 146.096)" fill="#84E0F7" className={styles.pulseDelay3}/>
        </g>
        
        <line x1="261.5" y1="261" x2="261.5" y2="473" stroke="#84E0F7"/>
        <circle cx="261.439" cy="261.439" r="228.939" stroke="#84E0F7" className={styles.dashSpin}/>
        <rect x="265.5" y="493.5" width="7" height="7" transform="rotate(-180 265.5 493.5)" fill="#1D1D1F" stroke="#84E0F7"/>
        <circle cx="261.107" cy="489.107" r="41.1068" fill="#1D1D1F"/>
        <circle cx="261.108" cy="489.108" r="31.2176" fill="#1D1D1F" stroke="#84E0F7"/>
      </g>
      <defs>
        <clipPath id="clip0_3635_10681">
          <rect width="522" height="522" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
