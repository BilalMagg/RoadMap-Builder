import { useRef } from 'react';
import { PanelLeft, FileText, Box, GripVertical, X } from 'lucide-react';
import styles from './TemplateSidebar.module.css';

interface TemplateSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddNode: (type: 'minimalNode' | 'customNode') => void;
}

export default function TemplateSidebar({ isOpen, onToggle, onAddNode }: TemplateSidebarProps) {

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (!isOpen) {
    return (
      <button
        className={styles.toggleButton}
        onClick={onToggle}
        title="Open Node Templates"
      >
        <PanelLeft size={20} />
      </button>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className={styles.title}>Templates</h3>
        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <X size={16} />
        </button>
      </div>

      <div className={styles.nodeList}>
        <div
          className={styles.nodeItem}
          onDragStart={(event) => onDragStart(event, 'minimalNode')}
          onClick={() => onAddNode('minimalNode')}
          draggable
        >
          <div className={styles.iconWrapper}>
            <FileText size={16} />
          </div>
          <div className={styles.nodeInfo}>
            <span className={styles.nodeLabel}>Minimal Node</span>
            <span className={styles.nodeDescription}>Simple title-only node</span>
          </div>
          <GripVertical size={14} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
        </div>

        <div
          className={styles.nodeItem}
          onDragStart={(event) => onDragStart(event, 'customNode')}
          onClick={() => onAddNode('customNode')}
          draggable
        >
          <div className={styles.iconWrapper}>
            <Box size={16} />
          </div>
          <div className={styles.nodeInfo}>
            <span className={styles.nodeLabel}>Custom Node</span>
            <span className={styles.nodeDescription}>Full detail node</span>
          </div>
          <GripVertical size={14} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </div>
  );
}
