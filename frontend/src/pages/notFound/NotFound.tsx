import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { ArrowLeft } from "lucide-react";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundContent}>
          <div className={styles.notFoundCode}>404</div>
          <h1 className={styles.notFoundTitle}>Page not found</h1>
          <p className={styles.notFoundDesc}>
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <Link to="/" className={styles.notFoundButton}>
            <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
            Return to home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
