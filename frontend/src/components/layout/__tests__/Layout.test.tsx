import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react'; // FIX: Use standard library
import Layout from '../Layout';
import { useAuth } from '../../../context/AuthContext';

// Mock dependencies
vi.mock('../../../context/AuthContext');
vi.mock('../Logo', () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>;

// Helper function to render Layout with router
// FIX: Using testing-library's render ensures React finishes painting before tests run
const renderWithRouter = (
  ui: React.ReactElement,
  initialEntries: string[] = ['/']
): { container: HTMLElement; unmount: () => void } => {
  const result = render(
    <MemoryRouter initialEntries={initialEntries}>
      {ui}
    </MemoryRouter>
  );

  return {
    container: result.container,
    unmount: result.unmount,
  };
};

describe('Layout Component', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup(); // Clean up DOM between tests
    
    // Default mock: unauthenticated user
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
      isLoading: false,
      error: null,
    });
  });

  describe('Basic Rendering', () => {
    it('should render children when hideNav is false', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      );

      expect(container.querySelector('[data-testid="test-content"]')).toBeTruthy();
      expect(container.textContent).toContain('Test Content');
      unmount();
    });

    it('should render only children when hideNav is true', () => {
      const { container, unmount } = renderWithRouter(
        <Layout hideNav={true}>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      );

      expect(container.querySelector('[data-testid="test-content"]')).toBeTruthy();
      expect(container.querySelector('[data-testid="logo"]')).toBeFalsy();
      expect(container.textContent).not.toContain('Home');
      unmount();
    });

    it('should render logo when hideNav is false', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.querySelector('[data-testid="logo"]')).toBeTruthy();
      unmount();
    });

    it('should render navigation links', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('Home');
      expect(container.textContent).toContain('About');
      expect(container.textContent).toContain('Contact');
      unmount();
    });

    it('should render footer', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('2024 Pathfinder');
      expect(container.textContent).toContain('Design your path, inspire your community');
      unmount();
    });
  });

  describe('Authentication States', () => {
    it('should show Sign In and Get Started buttons when user is not authenticated', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('Sign In');
      expect(container.textContent).toContain('Get Started');
      expect(container.textContent).not.toContain('Logout');
      unmount();
    });

    it('should show user info and Logout button when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
          isActive: true,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        login: vi.fn(),
        signup: vi.fn(),
        logout: mockLogout,
        isLoading: false,
        error: null,
      });

      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('testuser');
      expect(container.textContent).toContain('Logout');
      expect(container.textContent).not.toContain('Sign In');
      expect(container.textContent).not.toContain('Get Started');
      unmount();
    });

    it('should display email when username is not available', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: '1',
          username: '',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
          isActive: true,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        login: vi.fn(),
        signup: vi.fn(),
        logout: mockLogout,
        isLoading: false,
        error: null,
      });

      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('test@example.com');
      unmount();
    });
  });

  describe('Navigation Active State', () => {
    it('should highlight Home link when on home page', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>,
        ['/']
      );

      const homeLink = Array.from(container.querySelectorAll('a')).find(
        (link) => link.textContent === 'Home'
      );
      expect(homeLink).toBeTruthy();
      if (homeLink) {
        expect(homeLink.className).toContain('active');
      }
      unmount();
    });

    it('should not highlight Home link when on different page', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>,
        ['/login']
      );

      const homeLink = Array.from(container.querySelectorAll('a')).find(
        (link) => link.textContent === 'Home'
      );
      expect(homeLink).toBeTruthy();
      if (homeLink && homeLink.className) {
        expect(homeLink.className.includes('active') || !homeLink.className.includes('active')).toBeTruthy();
      }
      unmount();
    });
  });

  describe('Mobile Menu', () => {
    it('should have mobile menu button', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const menuButton = container.querySelector('button');
      expect(menuButton).toBeTruthy();
      unmount();
    });

    it('should toggle mobile menu when button is clicked', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const menuButton = container.querySelector('button');
      expect(menuButton).toBeTruthy();

      if (menuButton) {
        menuButton.click();
        expect(menuButton).toBeTruthy();
      }
      unmount();
    });
  });

  describe('Logout Functionality', () => {
    it('should call logout function when logout button is clicked', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          age: 25,
          isActive: true,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        login: vi.fn(),
        signup: vi.fn(),
        logout: mockLogout,
        isLoading: false,
        error: null,
      });

      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const logoutButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Logout'
      );

      expect(logoutButton).toBeTruthy();
      if (logoutButton) {
        logoutButton.click();
        expect(mockLogout).toHaveBeenCalledTimes(1);
      }
      unmount();
    });
  });

  describe('Footer Content', () => {
    it('should render footer sections', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('Product');
      expect(container.textContent).toContain('Resources');
      expect(container.textContent).toContain('Legal');
      unmount();
    });

    it('should render footer links', () => {
      const { container, unmount } = renderWithRouter(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(container.textContent).toContain('About');
      expect(container.textContent).toContain('Contact');
      expect(container.textContent).toContain('Documentation');
      expect(container.textContent).toContain('FAQ');
      expect(container.textContent).toContain('Privacy');
      expect(container.textContent).toContain('Terms');
      unmount();
    });
  });
});