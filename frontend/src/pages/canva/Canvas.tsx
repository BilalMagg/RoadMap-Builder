import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Layout from '../../components/layout/Layout';
import CustomNode from '../../features/roadmap/components/CustomNode';
import MinimalNode from '../../features/roadmap/components/MinimalNode';
import NodeEditor from '../../features/roadmap/components/NodeEditor';
import NodeSidebar from '../../features/roadmap/components/NodeSidebar';
import { RoadmapApi } from '../../features/roadmap/services/roadmapApi';
import type { Roadmap, NodeData, RoadmapNode } from '../../features/roadmap/types/roadmap.types';
import { X, Code2, Plus, Save, ArrowLeft } from 'lucide-react';
import styles from './Canva.module.css';
import TemplateSidebar from '../../features/roadmap/components/TemplateSidebar';
import EditableTitle from '../../components/common/EditableTitle';
import { CanvasContext } from './CanvasContext';

export default function Canvas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [showJsonViewer, setShowJsonViewer] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Node Details Sidebar
  const [isTemplateSidebarOpen, setIsTemplateSidebarOpen] = useState(true); // Node Template Sidebar
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [viewingNode, setViewingNode] = useState<Node | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  // Use ReactFlow's state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Handlers for CanvasContext
  const onEditNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setIsEditorOpen(true);
    }
  }, [nodes]);

  const onViewNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setViewingNode(node);
      setIsSidebarOpen(true);
    }
  }, [nodes]);

  const onDeleteNode = useCallback((nodeId: string) => {
    if (window.confirm('Delete this node?')) {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    }
  }, [setNodes, setEdges]);

  const onDuplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && reactFlowInstance) {
      const position = {
        x: node.position.x + 50,
        y: node.position.y + 50,
      };

      const newNode: Node = {
        ...node,
        id: `node_${Date.now()}`,
        position,
        selected: true,
      };

      setNodes((nds) => [...nds.map(n => ({ ...n, selected: false })), newNode]);
    }
  }, [nodes, reactFlowInstance, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type,
        position: position || { x: 0, y: 0 },
        style: { width: 200 },
        data: {
          title: `New ${type === 'minimalNode' ? 'Minimal' : 'Custom'} Node`,
          description: '',
          tags: [],
          resources: [],
        },
      };

      setNodes((nds) => nds.concat(newNode));

      // select the new node
      if (type === 'customNode') {
        setEditingNode(newNode);
        setIsEditorOpen(true);
      }
    },
    [reactFlowInstance, setNodes]
  );

  const handleAddNodeFromSidebar = useCallback((type: 'minimalNode' | 'customNode') => {
    if (reactFlowInstance) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const position = reactFlowInstance.screenToFlowPosition({
        x: centerX,
        y: centerY,
      });

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type,
        position,
        style: { width: 200 },
        data: {
          title: 'New Node',
          description: '',
          tags: [],
          resources: [],
        },
      };

      setNodes((nds) => [...nds, newNode]);

      if (type === 'customNode') {
        setEditingNode(newNode);
        setIsEditorOpen(true);
      }
    }
  }, [reactFlowInstance, setNodes]);

  // Load roadmap on mount
  useEffect(() => {
    const loadRoadmap = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const loadedRoadmap = await RoadmapApi.getRoadmapById(id);
        setRoadmap(loadedRoadmap);
        setNodes(loadedRoadmap.data.nodes as Node[]);
        setEdges(loadedRoadmap.data.edges as Edge[]);
      } catch (err: any) {
        console.error('Error loading roadmap:', err);
        setError(err.message || 'Failed to load roadmap');
        // If roadmap not found, redirect to roadmaps list
        if (err.message.includes('not found')) {
          setTimeout(() => navigate('/roadmaps'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmap();
  }, [id, navigate, setNodes, setEdges]);

  // Auto-save when nodes or edges change (debounced)
  useEffect(() => {
    if (roadmap && !isLoading && nodes.length >= 0 && isAutoSaveEnabled) {
      const timeoutId = setTimeout(() => {
        saveRoadmap();
      }, 2000); // Debounce saves to 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, roadmap, isLoading, isAutoSaveEnabled]);

  const saveRoadmap = useCallback(async () => {
    if (!roadmap || !id) return;

    setIsSaving(true);
    try {
      const updatedRoadmap = await RoadmapApi.updateRoadmap(id, {
        data: {
          ...roadmap.data,
          nodes: nodes as RoadmapNode[],
          edges: edges,
        },
      });
      setRoadmap(updatedRoadmap);
    } catch (err: any) {
      console.error('Error saving roadmap:', err);
      // Don't show alert for auto-save errors, just log them
      // User can manually save if needed
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [roadmap, nodes, edges, id]);

  const saveRoadmapTitle = useCallback(async (newTitle: string) => {
    if (!roadmap || !id) return;

    try {
      const updated = await RoadmapApi.updateRoadmap(id, {
        title: newTitle,
      });
      setRoadmap((prev) => prev ? { ...prev, title: updated.title } : prev);
    } catch (err) {
      console.error('Failed to update title:', err);
      // Optional: show error toast
    }
  }, [roadmap, id]);

  // Register Custom Node Types
  const nodeTypes = useMemo(() => ({
    customNode: CustomNode,
    minimalNode: MinimalNode,
  }), []);

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node click - show sidebar for minimal nodes, editor for full nodes
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === 'minimalNode') {
      setViewingNode(node);
      setIsSidebarOpen(true);
    } else {
      setEditingNode(node);
      setIsEditorOpen(true);
    }
  }, []);

  // Handle node save
  const handleNodeSave = useCallback((data: NodeData) => {
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode.id
            ? { ...node, data }
            : node
        )
      );
    }
    setIsEditorOpen(false);
    setEditingNode(null);
  }, [editingNode, setNodes]);

  // Handle node delete
  const handleNodeDelete = useCallback(() => {
    if (editingNode) {
      setNodes((nds) => nds.filter((node) => node.id !== editingNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== editingNode.id && edge.target !== editingNode.id
        )
      );
    }
    setIsEditorOpen(false);
    setEditingNode(null);
  }, [editingNode, setNodes, setEdges]);

  // Handle edge delete (on edge click)
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    if (window.confirm('Delete this connection?')) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, [setEdges]);

  // Add node button handler
  const handleAddNode = useCallback(() => {
    if (reactFlowInstance) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const position = reactFlowInstance.screenToFlowPosition({
        x: centerX,
        y: centerY,
      });

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: 'minimalNode', // Default to minimal node
        position,
        style: { width: 200 },
        data: {
          title: 'New Node',
          description: '',
          tags: [],
          resources: [],
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setEditingNode(newNode);
      setIsEditorOpen(true);
    }
  }, [reactFlowInstance, setNodes]);

  // Get current JSON representation
  const currentJson = JSON.stringify(
    {
      version: roadmap?.data.version || '1.0',
      viewport: roadmap?.data.viewport || { x: 0, y: 0, zoom: 1 },
      nodes,
      edges,
    },
    null,
    2
  );

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.canvasContainer}>
          <div className={styles.canvasHeader}>
            <div className={styles.headerLeft}>
              <button
                onClick={() => navigate('/roadmaps')}
                className={styles.backButton}
                title="Back to roadmaps"
              >
                <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
              </button>
              <div>
                <h1 className={styles.canvasTitle}>Loading...</h1>
              </div>
            </div>
          </div>
          <div className={styles.canvasWrapper}>
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading roadmap...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !roadmap) {
    return (
      <Layout>
        <div className={styles.canvasContainer}>
          <div className={styles.canvasHeader}>
            <div className={styles.headerLeft}>
              <button
                onClick={() => navigate('/roadmaps')}
                className={styles.backButton}
                title="Back to roadmaps"
              >
                <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
              </button>
              <div>
                <h1 className={styles.canvasTitle}>Error</h1>
              </div>
            </div>
          </div>
          <div className={styles.canvasWrapper}>
            <div className={styles.loadingState}>
              <p style={{ color: 'var(--text-error, #dc2626)', marginBottom: '1rem' }}>
                {error || 'Roadmap not found'}
              </p>
              <button onClick={() => navigate('/roadmaps')} className={styles.actionButton}>
                Back to Roadmaps
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.canvasContainer}>
        <div className={styles.canvasHeader}>
          <div className={styles.headerLeft}>
            <button
              onClick={() => navigate('/roadmaps')}
              className={styles.backButton}
              title="Back to roadmaps"
            >
              <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>
            <div>
              {roadmap && (
                <EditableTitle
                  initialTitle={roadmap.title}
                  onSave={saveRoadmapTitle}
                />
              )}
              {roadmap.description && (
                <p className={styles.canvasDescription}>{roadmap.description}</p>
              )}
            </div>
          </div>
          <div className={styles.canvasActions}>
            <button
              onClick={handleAddNode}
              className={styles.actionButton}
              title="Add new node"
            >
              <Plus style={{ width: "1.25rem", height: "1.25rem" }} />
              Add Node
            </button>
            <button
              onClick={saveRoadmap}
              className={styles.actionButton}
              disabled={isSaving}
              title="Save roadmap"
            >
              <Save style={{ width: "1.25rem", height: "1.25rem" }} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
              className={`${styles.actionButton} ${isAutoSaveEnabled ? styles.active : ''}`}
              title={isAutoSaveEnabled ? "Disable Auto Save" : "Enable Auto Save"}
              style={{
                backgroundColor: isAutoSaveEnabled ? 'var(--primary-color)' : 'transparent',
                color: isAutoSaveEnabled ? 'white' : 'var(--text-primary)',
                border: `1px solid ${isAutoSaveEnabled ? 'var(--primary-color)' : 'var(--border-color)'}`
              }}
            >
              <Save style={{ width: "1.25rem", height: "1.25rem" }} />
              {isAutoSaveEnabled ? 'Auto Save On' : 'Auto Save Off'}
            </button>
            <button
              onClick={() => setShowJsonViewer(!showJsonViewer)}
              className={styles.jsonViewerToggle}
              title={showJsonViewer ? "Hide JSON" : "Show JSON"}
            >
              <Code2 style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>
          </div>
        </div>

        <div className={styles.canvasWrapper} ref={reactFlowWrapper}>
          <TemplateSidebar
            isOpen={isTemplateSidebarOpen}
            onToggle={() => setIsTemplateSidebarOpen(!isTemplateSidebarOpen)}
            onAddNode={handleAddNodeFromSidebar}
          />

          <div className={styles.canvasContent}>
            <CanvasContext.Provider value={{ onEditNode, onViewNode, onDeleteNode, onDuplicateNode }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                deleteKeyCode="Delete"
              >
                <Background />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    if (node.type === 'customNode') {
                      return 'var(--primary-500)';
                    }
                    return '#ccc';
                  }}
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
              </ReactFlow>
            </CanvasContext.Provider>
          </div>

          {showJsonViewer && (
            <div className={styles.jsonViewer}>
              <div className={styles.jsonViewerHeader}>
                <h3 className={styles.jsonViewerTitle}>JSON Format</h3>
                <button
                  onClick={() => setShowJsonViewer(false)}
                  className={styles.jsonViewerToggle}
                  aria-label="Close JSON viewer"
                >
                  <X style={{ width: "1rem", height: "1rem" }} />
                </button>
              </div>
              <div className={styles.jsonContent}>
                <code>{currentJson}</code>
              </div>
            </div>
          )}
        </div>

        {/* Node Editor Modal */}
        <NodeEditor
          nodeData={editingNode?.data as NodeData | null}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingNode(null);
          }}
          onSave={handleNodeSave}
          onDelete={editingNode ? handleNodeDelete : undefined}
        />

        {/* Node Sidebar for minimal nodes */}
        <NodeSidebar
          nodeData={viewingNode?.data as NodeData | null}
          isOpen={isSidebarOpen}
          onClose={() => {
            setIsSidebarOpen(false);
            setViewingNode(null);
          }}
          onEdit={() => {
            if (viewingNode) {
              setEditingNode(viewingNode);
              setIsSidebarOpen(false);
              setIsEditorOpen(true);
            }
          }}
        />
      </div>
    </Layout>
  );
}
