import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { api } from "../axios"; 
import { setupInterceptors } from "../apiInterceptors";
import { afterEach, beforeAll, afterAll,  describe, it, expect } from '@jest/globals';
import config from "../../../utils/envConfig";

// Mock import.meta.env pour Jest


setupInterceptors();

let refreshCalled = false;
let protectedCallCount = 0;


const server = setupServer(
    http.get(`${config.apiUrl}/protected`, () => {
        protectedCallCount++;
        if (protectedCallCount === 1) {
            return HttpResponse.json(
            { error: {
                code: "ACCESS_TOKEN_EXPIRED",  
                message: "Access token has expired"
            }},
            { status: 401 }
            )
        }
        return HttpResponse.json({ success: true });
  }),
    http.get(`${config.apiUrl}/token/empty`, () => {
        
            return HttpResponse.json(
            { error: {
                code: "NO_ACCESS_TOKEN",  
                message: "No Access Token Presented"
            }},
            { status: 401 }
            )
  }),

    http.post(`${config.apiUrl}/refresh`, () => {
    refreshCalled = true;
    return new HttpResponse(null, { status: 200 })
  })
)

beforeAll(() => server.listen());
afterEach(() => {
  refreshCalled = false;
  server.resetHandlers();
});
afterAll(() => server.close());

describe("apiInterceptor Tests", () => {
    it("calls refresh on 401 and retries the original Request", async () => {
        const res = await api.get('/protected').catch(() => {});
        expect(protectedCallCount).toBe(2);
        expect(refreshCalled).toBe(true);
        expect(res?.data.success).toBe(true)
  }),
  it("doesn't hit refresh because the error code != 'ACCESS_TOKEN_EXPIRED' ",async () => {
    const error = await api.get('/token/empty').catch(err => err);
    console.log(error?.response)
    expect(error.response?.data?.error?.code).toEqual("NO_ACCESS_TOKEN")
    expect(error.response?.status).toBe(401)
  })
})