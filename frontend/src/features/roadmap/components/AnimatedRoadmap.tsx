import styles from "./AnimatedRoadmap.module.css";

export default function AnimatedRoadmap() {
  return (
    <div className={styles.roadmapContainer}>
      <svg
        className={styles.roadmapSvg}
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
      >
        {/* Background path */}
        <g>
          {/* Animated path line */}
          <path
            className={styles.pathLine}
            d="M 20 60 L 100 40 L 180 70 L 260 35 L 340 65 L 380 45"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="1" />
              <stop offset="50%" stopColor="var(--accent-400)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--primary-600)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Milestone nodes */}
          <circle cx="20" cy="60" className={styles.node1} r="6" />
          <circle cx="100" cy="40" className={styles.node2} r="5" />
          <circle cx="180" cy="70" className={styles.node3} r="5" />
          <circle cx="260" cy="35" className={styles.node4} r="5" />
          <circle cx="340" cy="65" className={styles.node5} r="5" />
          <circle cx="380" cy="45" className={styles.node6} r="6" />

          {/* Animated dots traveling along the path */}
          <circle className={styles.dot1} cx="20" cy="60" r="3" />
          <circle className={styles.dot2} cx="20" cy="60" r="3" />
        </g>

        {/* Decorative connecting lines */}
        <g className={styles.connectingLines}>
          <line x1="20" y1="60" x2="100" y2="40" className={styles.connectionLine} />
          <line x1="100" y1="40" x2="180" y2="70" className={styles.connectionLine} />
          <line x1="180" y1="70" x2="260" y2="35" className={styles.connectionLine} />
          <line x1="260" y1="35" x2="340" y2="65" className={styles.connectionLine} />
          <line x1="340" y1="65" x2="380" y2="45" className={styles.connectionLine} />
        </g>
      </svg>

      {/* Labels below the roadmap */}
      <div className={styles.labels}>
        <div className={styles.label}>Plan</div>
        <div className={styles.label}>Design</div>
        <div className={styles.label}>Build</div>
        <div className={styles.label}>Test</div>
        <div className={styles.label}>Launch</div>
      </div>
    </div>
  );
}
