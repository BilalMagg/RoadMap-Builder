import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/http/axios";
import { ArrowLeft, Save, Mail, UserCircle, Image as ImageIcon, X } from "lucide-react";
import styles from "./EditProfile.module.css";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number | null;
  avatar: string | null;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: any;
  timestamp: Date;
}

export default function EditProfile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    age: "",
    avatar: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<ApiResponse<{ user: ProfileData }>>("/auth/profil");
        if (response.data.success && response.data.data?.user) {
          const userData = response.data.data.user;
          setProfile(userData);
          setFormData({
            username: userData.username || "",
            email: userData.email || "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            age: userData.age?.toString() || "",
            avatar: userData.avatar || "",
          });
        } else {
          setError("Failed to load profile");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to load profile";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare update data
      const updateData: any = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        avatar: formData.avatar || undefined,
      };

      // Add age if provided and valid
      if (formData.age) {
        const ageNum = parseInt(formData.age, 10);
        if (!isNaN(ageNum) && ageNum >= 0) {
          updateData.age = ageNum;
        }
      }

      // TODO: Update this endpoint when backend update route is created
      // Expected: PUT or PATCH /auth/profil
      const response = await api.put<ApiResponse<{ user: ProfileData }>>("/auth/profil", updateData);

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        // Redirect to profile page after a short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      let errorMessage = "Failed to update profile. Please try again.";

      if (err.response?.data) {
        const apiError = err.response.data as ApiResponse<null>;
        if (apiError.error) {
          if (Array.isArray(apiError.error)) {
            errorMessage = apiError.error.join(", ");
          } else {
            errorMessage = apiError.message || errorMessage;
          }
        } else {
          errorMessage = apiError.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      // If endpoint doesn't exist yet, show a helpful message
      if (err.response?.status === 404 || err.response?.status === 501) {
        errorMessage = "Update endpoint not yet implemented. Backend update route needs to be created.";
      }

      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (firstName: string, lastName: string, username: string) => {
    const name = `${firstName || ""} ${lastName || ""}`.trim() || username;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.editContainer}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !profile) {
    return (
      <Layout>
        <div className={styles.editContainer}>
          <div className={styles.errorState}>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button onClick={() => window.location.reload()} className={styles.retryButton}>
                Try again
              </button>
              <Link to="/profile" className={styles.backButton}>
                Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.editContainer}>
        {/* Background Decoration */}
        <div className={styles.bgDecoration}>
          <div className={styles.bgBlob1} />
          <div className={styles.bgBlob2} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <Link to="/profile" className={styles.backLink}>
            <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
            Back to Profile
          </Link>
          <h1 className={styles.title}>Edit Profile</h1>
          <p className={styles.subtitle}>Update your personal information and preferences</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Success Message */}
          {success && (
            <div className={styles.successMessage}>
              <p>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className={styles.closeError}
                aria-label="Close error"
              >
                <X style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
          )}

          {/* Avatar Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <ImageIcon style={{ width: "1.25rem", height: "1.25rem" }} />
              <h2>Profile Picture</h2>
            </div>
            <div className={styles.avatarSection}>
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar preview" className={styles.avatarPreview} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {getInitials(formData.firstName, formData.lastName, formData.username)}
                </div>
              )}
              <div className={styles.avatarInputGroup}>
                <label htmlFor="avatar" className={styles.label}>Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className={styles.helpText}>Enter a valid image URL for your profile picture</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <UserCircle style={{ width: "1.25rem", height: "1.25rem" }} />
              <h2>Personal Information</h2>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="John"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Doe"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="johndoe"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="age" className={styles.label}>
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="25"
                  min="0"
                  max="150"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Mail style={{ width: "1.25rem", height: "1.25rem" }} />
              <h2>Account Information</h2>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link to="/profile" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" disabled={isSaving} className={styles.saveButton}>
              {isSaving ? (
                <>
                  <div className={styles.spinnerSmall} />
                  Saving...
                </>
              ) : (
                <>
                  <Save style={{ width: "1rem", height: "1rem" }} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

