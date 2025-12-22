import styles from "./PathfinderLogo.module.css";

export default function PathfinderLogo() {
  return (
    <div className={styles.logoContainer}>
      <svg
        className={styles.logoSvg}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="24" cy="24" r="22" fill="url(#logoBgGradient)" opacity="0.1" />

        {/* Main path/roadmap line */}
        <path
          className={styles.mainPath}
          d="M 10 28 L 18 18 L 28 24 L 36 14 L 40 20"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Milestone dots */}
        <circle cx="10" cy="28" r="2.5" fill="currentColor" className={styles.startDot} />
        <circle cx="18" cy="18" r="2" fill="currentColor" className={styles.midDot} />
        <circle cx="28" cy="24" r="2" fill="currentColor" className={styles.midDot} />
        <circle cx="36" cy="14" r="2" fill="currentColor" className={styles.midDot} />
        <circle cx="40" cy="20" r="2.5" fill="currentColor" className={styles.endDot} />

        {/* Compass indicator */}
        <g className={styles.compass}>
          <circle cx="24" cy="37" r="1.5" fill="currentColor" opacity="0.6" />
          <path
            d="M 24 34 L 23 36 L 24 35 L 25 36 Z"
            fill="currentColor"
            opacity="0.7"
          />
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(13, 148, 136)" />
            <stop offset="50%" stopColor="rgb(20, 184, 166)" />
            <stop offset="100%" stopColor="rgb(245, 158, 11)" />
          </linearGradient>
          <linearGradient id="logoBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(13, 148, 136)" />
            <stop offset="100%" stopColor="rgb(245, 158, 11)" />
          </linearGradient>
        </defs>
      </svg>
      <span className={styles.logoText}>Pathfinder</span>
    </div>
  );
}
