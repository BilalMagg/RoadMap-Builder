
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoadmapCard, type RoadmapFeedItem } from '../RoadmapCard';

// Mock Lucide icons to avoid rendering issues and keep snapshots clean
vi.mock('lucide-react', () => ({
    Heart: () => <div data-testid="icon-heart" />,
    User: () => <div data-testid="icon-user" />,
    Share2: () => <div data-testid="icon-share" />,
    MessageSquare: () => <div data-testid="icon-message" />,
    BarChart: () => <div data-testid="icon-barchart" />,
    Clock: () => <div data-testid="icon-clock" />, // Added missing mock
}));

const mockRoadmap: RoadmapFeedItem = {
    id: '1',
    title: 'Test Roadmap',
    description: 'Test Description',
    status: 'published',
    views: 100,
    likes: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    author: {
        id: 'user1',
        username: 'testuser',
    },
    isLiked: false,
    category: 'Programming',
    stepCount: 10,
    progress: 50,
};

describe('RoadmapCard', () => {
    const mockOnLike = vi.fn();

    it('renders roadmap details correctly', () => {
        render(
            <MemoryRouter>
                <RoadmapCard roadmap={mockRoadmap} onLike={mockOnLike} />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Roadmap')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('Programming')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('calls onLike when like button is clicked', () => {
        render(
            <MemoryRouter>
                <RoadmapCard roadmap={mockRoadmap} onLike={mockOnLike} />
            </MemoryRouter>
        );

        const likeBtn = screen.getByText('10').closest('button');
        fireEvent.click(likeBtn!);
        expect(mockOnLike).toHaveBeenCalledWith('1');
    });

    it('displays progress bar when progress > 0', () => {
        render(
            <MemoryRouter>
                <RoadmapCard roadmap={mockRoadmap} onLike={mockOnLike} />
            </MemoryRouter>
        );
        expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('does not display progress bar when progress is undefined', () => {
        const noProgressRoadmap = { ...mockRoadmap, progress: undefined };
        render(
            <MemoryRouter>
                <RoadmapCard roadmap={noProgressRoadmap} onLike={mockOnLike} />
            </MemoryRouter>
        );
        expect(screen.queryByText('In Progress')).not.toBeInTheDocument();
        expect(screen.getByText('10 Steps')).toBeInTheDocument();
    });
});
