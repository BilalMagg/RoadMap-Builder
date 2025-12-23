import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/http/axios";
import { User, Mail, Calendar, UserCircle, Edit2, LogOut, CheckCircle2 } from "lucide-react";
import styles from "./Profile.module.css";

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

export default function Profile() {
  const { user: authUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setProfile(response.data.data.user);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username
    : authUser?.username || "User";

  const getInitials = (name: string) => {
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
        <div className={styles.profileContainer}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !profile) {
    return (
      <Layout>
        <div className={styles.profileContainer}>
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.profileContainer}>
        {/* Background Decoration */}
        <div className={styles.bgDecoration}>
          <div className={styles.bgBlob1} />
          <div className={styles.bgBlob2} />
        </div>

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            {profile?.avatar ? (
              <img src={profile.avatar} alt={displayName} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {getInitials(displayName)}
              </div>
            )}
            {profile?.isActive && (
              <div className={styles.activeBadge}>
                <CheckCircle2 style={{ width: "1rem", height: "1rem" }} />
                Active
              </div>
            )}
          </div>

          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{displayName}</h1>
            <p className={styles.profileUsername}>@{profile?.username || authUser?.username}</p>
            {profile?.email && (
              <p className={styles.profileEmail}>
                <Mail style={{ width: "1rem", height: "1rem" }} />
                {profile.email}
              </p>
            )}
          </div>

          <div className={styles.profileActions}>
            <Link to="/profile/edit" className={styles.editButton}>
              <Edit2 style={{ width: "1rem", height: "1rem" }} />
              Edit Profile
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <LogOut style={{ width: "1rem", height: "1rem" }} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className={styles.profileDetails}>
          <div className={styles.detailsGrid}>
            {/* Personal Information Card */}
            <div className={styles.detailCard}>
              <div className={styles.cardHeader}>
                <UserCircle style={{ width: "1.25rem", height: "1.25rem" }} />
                <h2>Personal Information</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>First Name</span>
                  <span className={styles.detailValue}>
                    {profile?.firstName || "Not set"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Last Name</span>
                  <span className={styles.detailValue}>
                    {profile?.lastName || "Not set"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Username</span>
                  <span className={styles.detailValue}>
                    {profile?.username || authUser?.username || "N/A"}
                  </span>
                </div>
                {profile?.age && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Age</span>
                    <span className={styles.detailValue}>{profile.age} years old</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information Card */}
            <div className={styles.detailCard}>
              <div className={styles.cardHeader}>
                <Mail style={{ width: "1.25rem", height: "1.25rem" }} />
                <h2>Account Information</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>
                    {profile?.email || authUser?.email || "N/A"}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Account Status</span>
                  <span className={styles.detailValue}>
                    <span className={profile?.isActive ? styles.statusActive : styles.statusInactive}>
                      {profile?.isActive ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>User ID</span>
                  <span className={styles.detailValue}>
                    <code className={styles.userId}>{profile?.id || authUser?.id || "N/A"}</code>
                  </span>
                </div>
              </div>
            </div>

            {/* Account Stats Card */}
            <div className={styles.detailCard}>
              <div className={styles.cardHeader}>
                <Calendar style={{ width: "1.25rem", height: "1.25rem" }} />
                <h2>Account Stats</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Roadmaps</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Followers</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

