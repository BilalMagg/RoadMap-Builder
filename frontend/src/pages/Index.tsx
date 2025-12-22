import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { ArrowRight, Lightbulb, Users, Zap, Globe, Lock, Share2 } from "lucide-react";
import styles from "./Index.module.css";

interface ValueProposition {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const valuePropositions: ValueProposition[] = [
  {
    icon: <Lightbulb style={{ width: "1.5rem", height: "1.5rem" }} />,
    title: "Turn ideas into reality",
    description: "Transform your vision into a visual roadmap. Make complex journeys simple and understandable.",
  },
  {
    icon: <Users style={{ width: "1.5rem", height: "1.5rem" }} />,
    title: "Share your knowledge",
    description: "Create learning paths that guide others. Build a community around your expertise.",
  },
  {
    icon: <Zap style={{ width: "1.5rem", height: "1.5rem" }} />,
    title: "Move at your speed",
    description: "No complicated setup. Start building immediately and iterate as you go.",
  },
  {
    icon: <Globe style={{ width: "1.5rem", height: "1.5rem" }} />,
    title: "Works for anything",
    description: "Education, business, creative projects—Pathfinder adapts to your vision.",
  },
  {
    icon: <Lock style={{ width: "1.5rem", height: "1.5rem" }} />,
    title: "Keep control",
    description: "Your roadmaps are yours. Choose who sees them, who follows them, and how they're shared.",
  },
  {
    icon: <Share2 style={{ width: "1.5rem", height: "1.5rem" }} />,
    title: "Inspire others",
    description: "Build in public, collect feedback, and watch your roadmaps guide and inspire a community.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgDecoration}>
          <div className={styles.heroBgBlob1} />
          <div className={styles.heroBgBlob2} />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            ✨ The simplest way to plan and share
          </div>

          <h1 className={styles.heroTitle}>
            Map your journey,{" "}
            <span className={styles.heroTitleGradient}>inspire your path</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Create beautiful, interactive roadmaps for any domain. From learning paths to project timelines, guide your community toward their goals.
          </p>

          <div className={styles.heroCTA}>
            <Link to="/signup" className={styles.ctaPrimary}>
              Start building free
              <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
            </Link>
            <a href="#values" className={styles.ctaSecondary}>
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="values" className={styles.valueSection}>
        <div className={styles.valueTitle}>
          <h2>Everything you need</h2>
          <p>Focused on what matters—helping you build and share.</p>
        </div>

        <div className={styles.valueGrid}>
          {valuePropositions.map((prop, idx) => (
            <div key={idx} className={styles.valueCard}>
              <div className={styles.valueCardIcon}>{prop.icon}</div>
              <h3 className={styles.valueCardTitle}>{prop.title}</h3>
              <p className={styles.valueCardDesc}>{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaBoxTitle}>Ready to build your roadmap?</h2>
          <p className={styles.ctaBoxDesc}>
            Join creators who are already building roadmaps, sharing knowledge, and inspiring their communities.
          </p>
          <div className={styles.ctaBoxButtons}>
            <Link to="/signup" className={styles.ctaPrimary}>
              Get started—it's free
              <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
            </Link>
            <a href="#help" className={styles.ctaSecondary}>
              Have questions?
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
