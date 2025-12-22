import { afterEach, describe, it, expect } from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';
import { api } from '../axios'; 
import { setupInterceptors } from '../apiInterceptors';
import config from "../../../utils/envConfig";

setupInterceptors();
const mock = new MockAdapter(api);

describe("apiInterceptor Tests", () => {
  afterEach(() => {
    mock.reset();
  });

  it("calls refresh on 401 and retries the original Request", async () => {
    // Define full URLs for the Mock Matcher (so it knows exactly what to intercept)
    const protectedUrl = `${config.apiUrl}/protected`;
    const refreshUrl = `${config.apiUrl}/refresh`;

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

    // FIXED: Filter by the partial URL (relative path) or use .includes()
    // The history contains "/protected", not the full URL.
    const protectedCalls = mock.history.get.filter(c => c.url?.includes('/protected'));
    expect(protectedCalls.length).toBe(2);

    // FIXED: Same here, check for the relative path
    const refreshCalls = mock.history.post.filter(c => c.url?.includes('/refresh'));
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

      // FIXED: Use .includes() here as well for safety
      const refreshCalls = mock.history.post.filter(c => c.url?.includes('/refresh'));
      expect(refreshCalls.length).toBe(0);
    }
  });
});