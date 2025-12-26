import { Handle, Position, type NodeProps, NodeToolbar } from 'reactflow';
import { FileText, Pencil, Eye, Copy, Trash2 } from 'lucide-react';
import styles from './MinimalNode.module.css';
import type { NodeData } from '../types/roadmap.types';
import { useCanvasContext } from '../../../pages/canva/CanvasContext';

export default function MinimalNode({ id, data }: NodeProps<NodeData>) {
  const { onEditNode, onViewNode, onDeleteNode, onDuplicateNode } = useCanvasContext();

  return (
    <div className={styles.minimalNodeContainer} style={{ cursor: 'pointer' }}>
      <NodeToolbar isVisible={undefined} position={Position.Top} className={styles.nodeToolbar}>
        <button className={styles.toolbarBtn} onClick={() => onEditNode(id)} title="Edit">
          <Pencil size={14} />
        </button>
        <button className={styles.toolbarBtn} onClick={() => onViewNode(id)} title="View">
          <Eye size={14} />
        </button>
        <button className={styles.toolbarBtn} onClick={() => onDuplicateNode(id)} title="Duplicate">
          <Copy size={14} />
        </button>
        <button className={styles.toolbarBtn} onClick={() => onDeleteNode(id)} title="Delete" style={{ color: '#ef4444' }}>
          <Trash2 size={14} />
        </button>
      </NodeToolbar>

      {/* Icon */}
      <div className={styles.minimalNodeIcon}>
        <FileText style={{ width: "1.25rem", height: "1.25rem" }} />
      </div>

      {/* Title */}
      <div className={styles.minimalNodeTitle}>{data.title}</div>

      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className={`${styles.handle} ${styles.handleTop}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${styles.handle} ${styles.handleBottom}`}
      />
    </div>
  );
}

