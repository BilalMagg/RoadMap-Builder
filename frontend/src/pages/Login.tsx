import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <Layout hideNav={true}>
      <div className={styles.authContainer}>
        {/* Left Side - Creative Journey Visual */}
        <div className={styles.authLeftPanel}>
          <div className={styles.authDecoration}>
            <div className={styles.authBlob1} />
            <div className={styles.authBlob2} />
          </div>

          <div className={styles.authLeftContent}>
            <h2>Welcome back, pathfinder</h2>
            <p>Your roadmaps are waiting. Let's pick up where you left off and continue building something amazing.</p>

            <div className={styles.authSteps}>
              <div className={styles.authStep}>
                <div className={styles.authStepNumber}>✓</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>Your Roadmaps</div>
                  <div className={styles.authStepDesc}>Access all your created paths instantly</div>
                </div>
              </div>

              <div className={styles.authStepDivider} />

              <div className={styles.authStep}>
                <div className={`${styles.authStepNumber} ${styles.inactive}`}>2</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>Collaborate & Share</div>
                  <div className={styles.authStepDesc}>Build with your community</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.authRightPanel}>
          <form className={styles.authForm} onSubmit={handleSubmit}>
            {/* Logo */}
            <Link to="/" className={styles.authLogo}>
              <span style={{ width: "1.5rem", height: "1.5rem", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--primary-600)", fontSize: "1.5rem" }}>🗺️</span>
              <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Pathfinder</span>
            </Link>

            {/* Heading */}
            <div className={styles.authHeading}>
              <h1>Sign in</h1>
              <p>Pick up where you left off.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className={styles.authError}>
                <p>{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className={styles.authFormGroup}>
              <label className={styles.authLabel}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.authInput}
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div className={styles.authFormGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className={styles.authLabel}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 600 }}>
                  Forgot?
                </Link>
              </div>
              <div className={styles.authInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.authInput}
                  placeholder="••••••••"
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.authInputIconButton}
                >
                  {showPassword ? <EyeOff style={{ width: "1.25rem", height: "1.25rem" }} /> : <Eye style={{ width: "1.25rem", height: "1.25rem" }} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className={styles.authCheckbox}>
              <input id="remember" type="checkbox" />
              <label htmlFor="remember">Keep me signed in</label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className={styles.authButtonPrimary}>
              {isLoading ? (
                <>
                  <div style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "9999px", animation: "spin 1s linear infinite" }} />
                  Signing in...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className={styles.authDivider}>
              <div className={styles.authDividerLine} />
              <div className={styles.authDividerText}>Or continue with</div>
              <div className={styles.authDividerLine} />
            </div>

            {/* Social Buttons */}
            <div className={styles.authSocialButtons}>
              <button className={styles.authSocialButton}>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.19.092-.926.35-1.545.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub
              </button>
              <button className={styles.authSocialButton}>
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            {/* Sign Up Link */}
            <div className={styles.authLink}>
              New to Pathfinder? <Link to="/signup">Create an account</Link>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Layout>
  );
}
