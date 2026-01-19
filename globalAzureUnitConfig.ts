// globalUnitConfig.ts
// This file runs for all unit tests and sets up global mocks

// ============================================================================
// MOCK: @azure/identity (Critical for Azure SDK tests in jsdom)
// ============================================================================
jest.mock('@azure/identity', () => {
    // Create a mock credential that works in both Node.js and browser-like environments
    const mockCredential = {
        getToken: jest.fn().mockResolvedValue({
            token: 'mock-azure-access-token',
            expiresOnTimestamp: Date.now() + 3600000,
        }),
    };

    return {
        DefaultAzureCredential: jest.fn().mockImplementation(() => mockCredential),
        InteractiveBrowserCredential: jest.fn(),
        ClientSecretCredential: jest.fn(),
        ManagedIdentityCredential: jest.fn(),
        // Export the mock for easy access in tests if needed
        __mockCredential: mockCredential,
    };
});

// ============================================================================
// MOCK: @azure/keyvault-secrets
// ============================================================================
jest.mock('@azure/keyvault-secrets', () => {
    const mockClient = {
        getSecret: jest.fn().mockImplementation((name: string) => {
            return Promise.resolve({
                value: `mock-secret-value-for-${name}`,
                name: name,
                properties: {
                    createdOn: new Date(),
                    updatedOn: new Date(),
                    enabled: true,
                },
            });
        }),
        setSecret: jest.fn().mockResolvedValue({
            value: 'mock-secret-value',
            name: 'test-secret',
        }),
        beginDeleteSecret: jest.fn(),
        pollUntilDone: jest.fn(),
    };

    return {
        SecretClient: jest.fn().mockImplementation(() => mockClient),
        // Export the mock for easy access in tests if needed
        __mockClient: mockClient,
    };
});
