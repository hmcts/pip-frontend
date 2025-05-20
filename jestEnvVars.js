import { TextDecoder, TextEncoder } from 'util';

process.env.CLIENT_SECRET = '1234';
process.env.FRONTEND_URL = 'https://localhost:8080';
process.env.REDIS_MOCK = true;
process.env.SESSION_SECRET = 'session-secret-jest';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
