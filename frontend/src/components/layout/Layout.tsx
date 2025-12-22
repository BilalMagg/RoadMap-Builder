import { Link, useLocation } from "react-router-dom";
import { type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function Layout({ children, hideNav = false }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutContainer}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* Logo */}
          <Link to="/" className={styles.navLogo}>
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            <Link to="/" className={isActive("/") ? styles.active : ""}>
              Home
            </Link>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className={styles.navAuthButtons}>
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginRight: "1rem" }}>
                  {user?.username || user?.email}
                </span>
                <button onClick={handleLogout} className={styles.signInLink} style={{ cursor: "pointer", border: "none", background: "none" }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.signInLink}>
                  Sign In
                </Link>
                <Link to="/signup" className={styles.getStartedButton}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuButton}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ""}`}>
            <div className={styles.mobileMenuContent}>
              <Link to="/" className={styles.mobileMenuLink}>
                Home
              </Link>
              <a href="#about" className={styles.mobileMenuLink}>
                About
              </a>
              <a href="#contact" className={styles.mobileMenuLink}>
                Contact
              </a>
              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {isAuthenticated ? (
                  <>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", padding: "0.5rem 0" }}>
                      {user?.username || user?.email}
                    </div>
                    <button onClick={handleLogout} className={styles.mobileMenuLink} style={{ cursor: "pointer", border: "none", background: "none", textAlign: "left", padding: "0.5rem 0" }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={styles.mobileMenuLink}>
                      Sign In
                    </Link>
                    <Link to="/signup" className={styles.getStartedButton} style={{ marginBottom: 0 }}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            <div>
              <Logo />
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                Design your path, inspire your community.
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4>Product</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Resources</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#help">Help</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Legal</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopy}>
              © 2024 Pathfinder. All rights reserved.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} title="GitHub">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.19.092-.926.35-1.545.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} title="Twitter">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
