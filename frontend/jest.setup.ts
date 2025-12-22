// jest.setup.ts
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
// Import the Web Streams API from Node.js
import { TransformStream, ReadableStream, WritableStream } from 'node:stream/web';

// 1. Polyfill TextEncoder/Decoder
Object.assign(global, { TextDecoder, TextEncoder });

// 2. Polyfill Web Streams (The fix for your current error)
Object.assign(global, {
  TransformStream,
  ReadableStream,
  WritableStream,
});