import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import styles from "./Auth.module.css";

/**
 * CONFIGURATION: Easily customize these messages if needed
 */
const RESET_PASSWORD_CONFIG = {
  page: {
    title: "Reset your password",
    subtitle: "We'll help you get back on track.",
  },
  form: {
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    submitButton: "Send reset link",
    submitButtonLoading: "Sending...",
  },
  confirmation: {
    title: "Check your inbox",
    message: "We've sent a password reset link to your email. Click the link to create a new password.",
    hint: "Didn't receive the email? Check your spam folder or",
    resendLink: "try again",
    backToLogin: "Back to sign in",
  },
  journey: {
    step1Title: "Request reset",
    step1Desc: "Enter your email",
    step2Title: "Check your email",
    step2Desc: "Click the reset link",
    step3Title: "Create new password",
    step3Desc: "Secure your account",
  },
};

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Password reset requested for:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setIsLoading(true);

    try {
      console.log("Password reset link resent to:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNav={true}>
      <div className={styles.authContainer}>
        {/* Left Side */}
        <div className={styles.authLeftPanel}>
          <div className={styles.authDecoration}>
            <div className={styles.authBlob1} />
            <div className={styles.authBlob2} />
          </div>

          <div className={styles.authLeftContent}>
            <h2>Back on track</h2>
            <p>Your roadmap awaits. Let's reset your password so you can continue building your journey.</p>

            <div className={styles.authSteps}>
              <div className={styles.authStep}>
                <div className={styles.authStepNumber}>1</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>{RESET_PASSWORD_CONFIG.journey.step1Title}</div>
                  <div className={styles.authStepDesc}>{RESET_PASSWORD_CONFIG.journey.step1Desc}</div>
                </div>
              </div>

              <div className={styles.authStepDivider} />

              <div className={styles.authStep}>
                <div className={`${styles.authStepNumber} ${isSubmitted ? "" : styles.inactive}`}>2</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>{RESET_PASSWORD_CONFIG.journey.step2Title}</div>
                  <div className={styles.authStepDesc}>{RESET_PASSWORD_CONFIG.journey.step2Desc}</div>
                </div>
              </div>

              <div className={styles.authStepDivider} />

              <div className={styles.authStep}>
                <div className={`${styles.authStepNumber} ${styles.inactive}`}>3</div>
                <div className={styles.authStepContent}>
                  <div className={styles.authStepTitle}>{RESET_PASSWORD_CONFIG.journey.step3Title}</div>
                  <div className={styles.authStepDesc}>{RESET_PASSWORD_CONFIG.journey.step3Desc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.authRightPanel}>
          {!isSubmitted ? (
            // Form
            <form className={styles.authForm} onSubmit={handleSubmit}>
              <Link to="/" className={styles.authLogo}>
                <span style={{ width: "1.5rem", height: "1.5rem", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--primary-600)", fontSize: "1.5rem" }}>🗺️</span>
                <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Pathfinder</span>
              </Link>

              <div className={styles.authHeading}>
                <h1>{RESET_PASSWORD_CONFIG.page.title}</h1>
                <p>{RESET_PASSWORD_CONFIG.page.subtitle}</p>
              </div>

              {error && (
                <div className={styles.authError}>
                  <p>{error}</p>
                </div>
              )}

              <div className={styles.authFormGroup}>
                <label className={styles.authLabel}>{RESET_PASSWORD_CONFIG.form.emailLabel}</label>
                <div className={styles.authInputWrapper}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.authInput}
                    placeholder={RESET_PASSWORD_CONFIG.form.emailPlaceholder}
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <Mail className={styles.authInputIcon} />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className={styles.authButtonPrimary}>
                {isLoading ? (
                  <>
                    <div style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "9999px", animation: "spin 1s linear infinite" }} />
                    {RESET_PASSWORD_CONFIG.form.submitButtonLoading}
                  </>
                ) : (
                  <>
                    {RESET_PASSWORD_CONFIG.form.submitButton}
                    <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} />
                  </>
                )}
              </button>

              <Link to="/login" className={styles.authBackLink}>
                ← Back to sign in
              </Link>
            </form>
          ) : (
            // Confirmation
            <div className={styles.authSuccess}>
              <div className={styles.authSuccessIcon}>
                <div>
                  <CheckCircle2 style={{ width: "2rem", height: "2rem" }} />
                </div>
              </div>

              <div className={styles.authSuccessContent}>
                <h1>{RESET_PASSWORD_CONFIG.confirmation.title}</h1>
                <p>{RESET_PASSWORD_CONFIG.confirmation.message}</p>

                <div className={styles.authSuccessBox}>
                  <p>Email sent to:</p>
                  <p className={styles.authSuccessBoxEmail}>{email}</p>
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {RESET_PASSWORD_CONFIG.confirmation.hint}{" "}
                  <button
                    onClick={handleResend}
                    disabled={isLoading}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary-600)",
                      fontWeight: 600,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    {RESET_PASSWORD_CONFIG.confirmation.resendLink}
                  </button>
                </p>
              </div>

              <Link to="/login" className={styles.authButtonSecondary}>
                {RESET_PASSWORD_CONFIG.confirmation.backToLogin}
              </Link>
            </div>
          )}
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
