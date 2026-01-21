
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublishRoadmapModal } from '../PublishRoadmapModal';
import { RoadmapApi } from '../../../features/roadmap/services/roadmapApi';

// Mock RoadmapApi
vi.mock('../../../features/roadmap/services/roadmapApi', () => ({
    RoadmapApi: {
        getAllRoadmaps: vi.fn(),
        updateRoadmap: vi.fn(),
    }
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    X: () => <div data-testid="icon-x" />,
    Check: () => <div data-testid="icon-check" />,
    Globe: () => <div data-testid="icon-globe" />,
    Lock: () => <div data-testid="icon-lock" />,
    Loader2: () => <div data-testid="icon-loader" />,
}));

describe('PublishRoadmapModal', () => {
    const mockOnClose = vi.fn();
    const mockRoadmaps = [
        { id: '1', title: 'Roadmap 1', isPublic: false },
        { id: '2', title: 'Roadmap 2', isPublic: true },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (RoadmapApi.getAllRoadmaps as any).mockResolvedValue(mockRoadmaps);
        (RoadmapApi.updateRoadmap as any).mockResolvedValue({ success: true });
    });

    it('does not render when isOpen is false', () => {
        render(<PublishRoadmapModal isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByText('Share to Feed')).not.toBeInTheDocument();
    });

    it('renders and fetches roadmaps when isOpen is true', async () => {
        render(<PublishRoadmapModal isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText('Share to Feed')).toBeInTheDocument();
        expect(RoadmapApi.getAllRoadmaps).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByText('Roadmap 1')).toBeInTheDocument();
            expect(screen.getByText('Roadmap 2')).toBeInTheDocument();
        });
    });

    it('allows selecting a roadmap', async () => {
        render(<PublishRoadmapModal isOpen={true} onClose={mockOnClose} />);

        await waitFor(() => expect(screen.getByText('Roadmap 1')).toBeInTheDocument());

        const roadmapBtn = screen.getByText('Roadmap 1').closest('button');
        fireEvent.click(roadmapBtn!);

        const publishBtn = screen.getByText('Publish to Feed').closest('button');
        expect(publishBtn).not.toBeDisabled();
    });

    it('calls publish logic when Publish button is clicked', async () => {
        render(<PublishRoadmapModal isOpen={true} onClose={mockOnClose} />);

        await waitFor(() => expect(screen.getByText('Roadmap 1')).toBeInTheDocument());

        fireEvent.click(screen.getByText('Roadmap 1'));

        const publishBtn = screen.getByText('Publish to Feed');
        fireEvent.click(publishBtn);

        // Expect updateRoadmap to be called
        await waitFor(() => {
            expect(RoadmapApi.updateRoadmap).toHaveBeenCalledWith('1', { isPublic: true });
        });

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
