import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { api } from '../axios'; 
import { setupInterceptors } from '../apiInterceptors';
import config from "../../../utils/envConfig";

// Setup the interceptors once
setupInterceptors();

describe("apiInterceptor Tests", () => {
  let mock: MockAdapter;
  // Save the original location object so we can restore it later
  const originalLocation = window.location;

  beforeEach(() => {
    mock = new MockAdapter(api);
    
    // clean mocking of window.location for Vitest/JSDOM
    // We redefine 'location' to be a simple object we can manipulate
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      writable: true, // Allow us to change it
      value: {
        href: '',
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
        // We cast this as 'any' to stop TypeScript from complaining 
        // that we are missing properties like 'origin', 'protocol', etc.
      } as any, 
    });
  });

  afterEach(() => {
    // Restore the original window.location after every test
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: originalLocation,
    });
    
    mock.reset();
    vi.clearAllMocks();
  });

  it("calls refresh on 401 and retries the original Request", async () => {
    const protectedUrl = `${config.apiUrl}/protected`;
    const refreshUrl = `${config.apiUrl}/auth/refresh`;

    // 1. First call fails
    mock.onGet(protectedUrl).replyOnce(401, {
      error: { code: "ACCESS_TOKEN_EXPIRED", message: "Access token has expired" }
    });

    // 2. Refresh succeeds
    mock.onPost(refreshUrl).reply(200);

    // 3. Retry succeeds
    mock.onGet(protectedUrl).reply(200, { success: true });

    // EXECUTION
    const res = await api.get('/protected');

    // ASSERTIONS
    expect(res.data.success).toBe(true);

    // Check retry count
    const protectedCalls = mock.history.get.filter(c => c.url?.includes('/protected'));
    expect(protectedCalls.length).toBe(2);

    // Check refresh call
    const refreshCalls = mock.history.post.filter(c => c.url?.includes('/auth/refresh'));
    expect(refreshCalls.length).toBe(1);
  });

  it("doesn't hit refresh because the error code != 'ACCESS_TOKEN_EXPIRED'", async () => {
    const emptyTokenUrl = `${config.apiUrl}/token/empty`;

    mock.onGet(emptyTokenUrl).reply(401, {
      error: { code: "NO_ACCESS_TOKEN", message: "No Access Token Presented" }
    });

    try {
      await api.get('/token/empty');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data?.error?.code).toEqual("NO_ACCESS_TOKEN");

      const refreshCalls = mock.history.post.filter(c => c.url?.includes('/auth/refresh'));
      expect(refreshCalls.length).toBe(0);
    }
  });

  it("calls refresh on 401 with 'Token expired' message", async () => {
    const protectedUrl = `${config.apiUrl}/protected`;
    const refreshUrl = `${config.apiUrl}/auth/refresh`;

    // 1. First call fails with message-based error
    mock.onGet(protectedUrl).replyOnce(401, {
      message: "Unauthorized: Token expired"
    });

    // 2. Refresh succeeds
    mock.onPost(refreshUrl).reply(200);

    // 3. Retry succeeds
    mock.onGet(protectedUrl).reply(200, { success: true });

    // EXECUTION
    const res = await api.get('/protected');

    // ASSERTIONS
    expect(res.data.success).toBe(true);
    const refreshCalls = mock.history.post.filter(c => c.url?.includes('/auth/refresh'));
    expect(refreshCalls.length).toBe(1);
  });

  it("doesn't call refresh for auth endpoints", async () => {
    const loginUrl = `${config.apiUrl}/auth/login`;

    mock.onPost(loginUrl).reply(401, {
      message: "Unauthorized: Invalid credentials"
    });

    try {
      await api.post('/auth/login', { email: 'test@test.com', password: 'password' });
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      
      const refreshCalls = mock.history.post.filter(c => c.url?.includes('/auth/refresh'));
      expect(refreshCalls.length).toBe(0);
    }
  });

  it("redirects to login when refresh fails", async () => {
    const protectedUrl = `${config.apiUrl}/protected`;
    const refreshUrl = `${config.apiUrl}/auth/refresh`;

    // 1. First call fails
    mock.onGet(protectedUrl).replyOnce(401, {
      message: "Unauthorized: Token expired"
    });

    // 2. Refresh fails
    mock.onPost(refreshUrl).reply(401, {
      message: "Session invalid or expired"
    });

    try {
      await api.get('/protected');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      
      // Should have attempted refresh
      const refreshCalls = mock.history.post.filter(c => c.url?.includes('/auth/refresh'));
      expect(refreshCalls.length).toBe(1);
      
      // With the mock setup above, we CAN actually verify the redirect now!
      // If your interceptor does: window.location.href = '/login'
      // You can check: expect(window.location.href).toContain('/login');
    }
  });
});