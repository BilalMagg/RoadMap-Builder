import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateRoadmapModal } from '../CreateRoadmapModal';
import { RoadmapApi } from '../../../features/roadmap/services/roadmapApi';
import { RoadmapCategory } from '../../../features/roadmap/types/roadmap.types';

// Mock RoadmapApi
vi.mock('../../../features/roadmap/services/roadmapApi', () => ({
  RoadmapApi: {
    getCategories: vi.fn().mockResolvedValue([
      { key: 'FRONTEND', value: 'Frontend' },
      { key: 'BACKEND', value: 'Backend' }
    ]),
    createRoadmap: vi.fn(),
  }
}));

// Mock Lucide icons for stability
vi.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader" />,
  Sparkles: () => <div data-testid="sparkles" />,
  Target: () => <div data-testid="target" />,
  Type: () => <div data-testid="type" />,
  AlignLeft: () => <div data-testid="align-left" />,
  AlertCircle: () => <div data-testid="alert-circle" />,
}));

// Need to mock Radix UI components because they often have issues in JSDOM/HappyDOM
// especially triggers and portal contents
vi.mock('../../ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../ui/select', () => ({
  Select: ({ children, onValueChange, value, defaultValue }: any) => {
    // We render a simple input that calls onValueChange to simulate the select
    return (
      <div data-testid="mock-select-wrapper">
        <input 
          data-testid="mock-select-input" 
          onChange={(e) => onValueChange(e.target.value)}
          defaultValue={value || defaultValue || ''}
        />
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
  SelectGroup: ({ children }: any) => <div>{children}</div>,
}));

describe('CreateRoadmapModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockCategories = [
    { key: 'FRONTEND', value: 'Frontend' },
    { key: 'BACKEND', value: 'Backend' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (RoadmapApi.getCategories as any).mockResolvedValue(mockCategories);
    (RoadmapApi.createRoadmap as any).mockResolvedValue('new-roadmap-id');
  });

  it('renders correctly when open', async () => {
    render(
      <CreateRoadmapModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );

    expect(screen.getByText('Create Roadmap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Frontend Masterclass 2024')).toBeInTheDocument();
    expect(screen.getByText('Career Path')).toBeInTheDocument();
    
    // Check if categories are fetched
    await waitFor(() => {
      expect(RoadmapApi.getCategories).toHaveBeenCalled();
    });
  });

  it('shows validation error for short title', async () => {
    render(
      <CreateRoadmapModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );

    const input = screen.getByPlaceholderText('e.g. Frontend Masterclass 2024');
    fireEvent.change(input, { target: { value: 'ab' } });
    
    const submitBtn = screen.getByText('Launch Roadmap');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });
  });

  it('handles successful submission', async () => {
    // Force specific mock behavior for this test - must return an object with an id
    const mockCreatedRoadmap = { id: 'new-roadmap-id', title: 'test', data: {} } as any;
    vi.mocked(RoadmapApi.createRoadmap).mockResolvedValue(mockCreatedRoadmap);

    // Render
    render(
      <CreateRoadmapModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );

    // Fill title
    const titleInput = screen.getByPlaceholderText('e.g. Frontend Masterclass 2024');
    fireEvent.change(titleInput, { target: { value: 'My Awesome Roadmap' } });

    // Select category (Value must match enum: 'Frontend')
    const selectInput = screen.getByTestId('mock-select-input');
    fireEvent.change(selectInput, { target: { value: 'Frontend' } });

    // Fill description
    const descInput = screen.getByPlaceholderText('Describe the goals and impact of this learning journey...');
    fireEvent.change(descInput, { target: { value: 'This is a description' } });

    // Submit
    const submitBtn = screen.getByText('Launch Roadmap');
    fireEvent.click(submitBtn);

    // Verify API call
    await waitFor(() => {
      expect(RoadmapApi.createRoadmap).toHaveBeenCalledWith(
        'My Awesome Roadmap',
        'This is a description',
        'Frontend'
      );
    }, { timeout: 3000 });

    // Verify callbacks
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('new-roadmap-id');
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('calls onClose when Cancel is clicked', () => {
    render(
      <CreateRoadmapModal 
        isOpen={true} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
