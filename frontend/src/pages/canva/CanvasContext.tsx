import { createContext, useContext } from 'react';

interface CanvasContextType {
  onEditNode: (nodeId: string) => void;
  onViewNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};
