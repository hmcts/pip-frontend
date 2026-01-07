jest.mock('openid-client', () => ({
    discovery: jest.fn(),
}));

import { discovery } from 'openid-client';

(discovery as jest.Mock).mockResolvedValue({ issuer: 'test-issuer' });

jest.mock('./src/main/authentication/extendedOidcStrategy', () => {
    return {
        OIDCStrategy: jest.fn().mockImplementation(() => {
            return () => {};
        }),
    };
});
