import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { RoadmapApi } from '../../features/roadmap/services/roadmapApi';
import { CreateRoadmapModal } from '../../components/roadmap/CreateRoadmapModal';
import { Plus, Trash2, Edit2, Calendar, FileText } from 'lucide-react';
import styles from './RoadmapList.module.css';

interface RoadmapListItem {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  nodeCount: number;
  edgeCount: number;
}

export default function RoadmapList() {
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allRoadmaps = await RoadmapApi.getAllRoadmaps();
      setRoadmaps(allRoadmaps);
    } catch (err: any) {
      console.error('Error loading roadmaps:', err);
      setError(err.message || 'Failed to load roadmaps');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await RoadmapApi.deleteRoadmap(id);
        await loadRoadmaps();
      } catch (err: any) {
        alert(err.message || 'Failed to delete roadmap');
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (roadmapId: string) => {
    navigate(`/canvas/${roadmapId}`);
  };

  const handleSelectRoadmap = (id: string) => {
    navigate(`/canvas/${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading roadmaps...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p style={{ color: 'var(--text-error, #dc2626)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={loadRoadmaps} className={styles.createButton}>
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <CreateRoadmapModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
        />

        {/* Background Decoration */}
        <div className={styles.bgDecoration}>
          <div className={styles.bgBlob1} />
          <div className={styles.bgBlob2} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Roadmaps</h1>
            <p className={styles.subtitle}>
              Create and manage your learning paths and workflows
            </p>
          </div>
          <button onClick={handleCreateNew} className={styles.createButton} data-cy="create-roadmap-button">
            <Plus style={{ width: "1.25rem", height: "1.25rem" }} />
            Create New Roadmap
          </button>
        </div>

        {/* Roadmaps Grid */}
        {roadmaps.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText style={{ width: "4rem", height: "4rem", color: "var(--text-muted)", marginBottom: "1rem" }} />
            <h2 className={styles.emptyTitle}>No roadmaps yet</h2>
            <p className={styles.emptyDescription}>
              Get started by creating your first roadmap
            </p>
            <button onClick={handleCreateNew} className={styles.createButton} data-cy="create-roadmap-button">
              <Plus style={{ width: "1.25rem", height: "1.25rem" }} />
              Create Your First Roadmap
            </button>
          </div>
        ) : (
          <div className={styles.roadmapsGrid}>
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className={styles.roadmapCard}
                onClick={() => handleSelectRoadmap(roadmap.id)}
                data-cy="roadmap-card"
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{roadmap.title}</h3>
                  <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/canvas/${roadmap.id}`}
                      className={styles.actionButton}
                      title="Edit roadmap"
                    >
                      <Edit2 style={{ width: "1rem", height: "1rem" }} />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(roadmap.id, e)}
                      className={styles.actionButton}
                      title="Delete roadmap"
                    >
                      <Trash2 style={{ width: "1rem", height: "1rem" }} />
                    </button>
                  </div>
                </div>

                {roadmap.description && (
                  <p className={styles.cardDescription}>{roadmap.description}</p>
                )}

                <div className={styles.cardStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{roadmap.nodeCount}</span>
                    <span className={styles.statLabel}>Nodes</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{roadmap.edgeCount}</span>
                    <span className={styles.statLabel}>Connections</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.cardMeta}>
                    <Calendar style={{ width: "0.875rem", height: "0.875rem" }} />
                    <span className={styles.cardDate}>
                      Updated {new Date(roadmap.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

