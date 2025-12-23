import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Auth.module.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const passwordLength = formData.password.length >= 8;
  const hasVariety =
    /[a-z]/.test(formData.password) &&
    /[A-Z]/.test(formData.password) &&
    /[0-9]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const isReady = passwordLength && hasVariety && passwordsMatch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isReady) {
      setError("Please meet all requirements");
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    }
  };

  return (
    <Layout hideNav={true}>
      <div className={styles.authContainer}>
        {/* Left Side - Creative Visual */}
        <div className={styles.authLeftPanel}>
          <div className={styles.authDecoration}>
            <div className={styles.authBlob1} />
            <div className={styles.authBlob2} />
          </div>

          <div className={styles.authLeftContent}>
            <h2>Begin Your Path</h2>
            <p>Join pathfinders creating and sharing roadmaps that inspire. Build something meaningful in minutes.</p>

            <div className={styles.authSteps}>
              <div className={styles.authStep}>
                <div className={styles.authStepNumber}>1</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>Create your account</div>
                  <div className={styles.authStepDesc}>Quick setup—no credit card needed</div>
                </div>
              </div>

              <div className={styles.authStepDivider} />

              <div className={styles.authStep}>
                <div className={`${styles.authStepNumber} ${styles.inactive}`}>2</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>Design your roadmap</div>
                  <div className={styles.authStepDesc}>Visualize your vision with ease</div>
                </div>
              </div>

              <div className={styles.authStepDivider} />

              <div className={styles.authStep}>
                <div className={`${styles.authStepNumber} ${styles.inactive}`}>3</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>Share & inspire</div>
                  <div className={styles.authStepDesc}>Build a community of builders</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "var(--primary-50)", borderRadius: "0.5rem", border: "1px solid var(--primary-100)" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--primary-900)", margin: 0 }}>
                ✓ Your account is safe and secure
              </p>
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
              <h1>Create your account</h1>
              <p>Join creators building amazing roadmaps.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className={styles.authError}>
                <p>{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div className={styles.authFormGroup}>
              <label className={styles.authLabel}>Full name</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={styles.authInput}
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className={styles.authFormGroup}>
              <label className={styles.authLabel}>Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={styles.authInput}
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className={styles.authFormGroup}>
              <label className={styles.authLabel}>Password</label>
              <div className={styles.authInputWrapper}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.authInput}
                  placeholder="Create a strong password"
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

              {/* Password strength */}
              <div className={styles.authPasswordStrength}>
                <div className={`${styles.authPasswordStrengthBar} ${passwordLength ? styles.met : ""}`} />
                <div className={`${styles.authPasswordStrengthBar} ${hasVariety ? styles.met : ""}`} />
                <div className={`${styles.authPasswordStrengthBar} ${passwordsMatch ? styles.met : ""}`} />
              </div>

              <div className={styles.authPasswordRequirements}>
                <div className={styles.authPasswordRequirement}>
                  {passwordLength ? "✓" : "○"} At least 8 characters
                </div>
                <div className={styles.authPasswordRequirement}>
                  {hasVariety ? "✓" : "○"} Mix of uppercase, lowercase & numbers
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={styles.authFormGroup}>
              <label className={styles.authLabel}>Confirm password</label>
              <div className={styles.authInputWrapper}>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.authInput}
                  placeholder="Confirm your password"
                  style={{
                    paddingRight: "2.5rem",
                    borderColor: formData.confirmPassword && !passwordsMatch ? "#dc2626" : "var(--border-color)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.authInputIconButton}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: "1.25rem", height: "1.25rem" }} /> : <Eye style={{ width: "1.25rem", height: "1.25rem" }} />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p style={{ fontSize: "0.8125rem", color: "#dc2626", margin: "0.25rem 0 0 0" }}>
                  Passwords don't match
                </p>
              )}
            </div>

            {/* Terms */}
            <div className={styles.authCheckbox}>
              <input id="terms" type="checkbox" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading || !isReady} className={styles.authButtonPrimary}>
              {isLoading ? (
                <>
                  <div style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "9999px", animation: "spin 1s linear infinite" }} />
                  Creating account...
                </>
              ) : (
                <>
                  Get started
                  <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className={styles.authDivider}>
              <div className={styles.authDividerLine} />
              <div className={styles.authDividerText}>Or signup with</div>
              <div className={styles.authDividerLine} />
            </div>

            {/* Social */}
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

            {/* Sign In Link */}
            <div className={styles.authLink}>
              Already a member? <Link to="/login">Sign in</Link>
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
