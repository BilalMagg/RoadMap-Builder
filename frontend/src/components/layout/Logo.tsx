import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.logoSvg}
      >
        {/* Path starting point */}
        <circle cx="4" cy="12" r="2" fill="currentColor" />
        {/* Journey path */}
        <path d="M 6 12 Q 12 4 18 12" />
        {/* Mid-point node */}
        <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        {/* End point */}
        <circle cx="20" cy="12" r="2" fill="currentColor" />
        {/* Direction indicator */}
        <path d="M 20 12 L 22 12" strokeWidth="1.5" />
      </svg>
      <span className={styles.logoText}>Pathfinder</span>
    </div>
  );
}
