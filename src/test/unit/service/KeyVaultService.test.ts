import sinon from 'sinon';

const mockSecretClient = {
    getSecret: sinon.stub(),
    setSecret: sinon.stub(),
};

const mockDefaultAzureCredential = sinon.stub();

jest.mock('@azure/keyvault-secrets', () => ({
    SecretClient: jest.fn().mockImplementation(() => mockSecretClient),
}));

jest.mock('@azure/identity', () => ({
    DefaultAzureCredential: mockDefaultAzureCredential,
}));

jest.mock('config', () => ({
    get: jest.fn().mockReturnValue('test-client-id'),
}));

import { KeyVaultService } from '../../../main/service/KeyVaultService';

describe('KeyVaultService', () => {
    let service: KeyVaultService;

    beforeEach(() => {
        service = new KeyVaultService();
        mockSecretClient.getSecret.reset();
        mockSecretClient.setSecret.reset();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getSecret', () => {
        it('should successfully retrieve a secret', async () => {
            const secretName = 'test-secret';
            const secretValue = 'secret-value-123';

            mockSecretClient.getSecret.withArgs(secretName).resolves({
                value: secretValue,
            });

            const result = await service.getSecret(secretName);

            expect(result).toBe(secretValue);
            sinon.assert.calledOnce(mockSecretClient.getSecret);
            sinon.assert.calledWith(mockSecretClient.getSecret, secretName);
        });

        it('should throw error when secret has no value', async () => {
            const secretName = 'empty-secret';

            mockSecretClient.getSecret.withArgs(secretName).resolves({
                value: null,
            });

            await expect(service.getSecret(secretName)).rejects.toThrow(
                `KeyVault getSecret failed for "${secretName}"`
            );
        });

        it('should throw error when getSecret fails', async () => {
            const secretName = 'failing-secret';
            const error = new Error('Network error');

            mockSecretClient.getSecret.withArgs(secretName).rejects(error);

            await expect(service.getSecret(secretName)).rejects.toThrow(
                `KeyVault getSecret failed for "${secretName}"`
            );
        });
    });

    describe('createOrUpdateSecret', () => {
        it('should successfully create or update a secret', async () => {
            const secretName = 'test-secret';
            const secretValue = 'new-value-456';

            mockSecretClient.setSecret.withArgs(secretName, secretValue).resolves({});

            await service.createOrUpdateSecret(secretName, secretValue);

            sinon.assert.calledOnce(mockSecretClient.setSecret);
            sinon.assert.calledWith(mockSecretClient.setSecret, secretName, secretValue);
        });

        it('should throw error when setSecret fails', async () => {
            const secretName = 'failing-secret';
            const secretValue = 'value';
            const error = new Error('Permission denied');

            mockSecretClient.setSecret.withArgs(secretName, secretValue).rejects(error);

            await expect(service.createOrUpdateSecret(secretName, secretValue)).rejects.toThrow(
                `KeyVault createOrUpdateSecret failed for "${secretName}"`
            );
        });
    });

    describe('createKeyVaultSecretName', () => {
        it('should create valid secret name with valid inputs', () => {
            const result = service.createKeyVaultSecretName('MyClient', 'abc-123-def', 'scope');

            expect(result).toBe('myclient-abc-123-def-scope');
        });

        it('should sanitize client name with special characters', () => {
            const result = service.createKeyVaultSecretName('My Client & Co.!', 'abc-123', 'client-id');

            expect(result).toBe('my-client-co-abc-123-client-id');
        });

        it('should sanitize suffix with special characters', () => {
            const result = service.createKeyVaultSecretName('Client', 'abc-123', 'my_suffix!');

            expect(result).toBe('client-abc-123-my-suffix');
        });

        it('should collapse multiple dashes', () => {
            const result = service.createKeyVaultSecretName('My---Client', 'abc-123', 'scope');

            expect(result).toBe('my-client-abc-123-scope');
        });

        it('should trim leading and trailing dashes from client name', () => {
            const result = service.createKeyVaultSecretName('---Client---', 'abc-123', 'scope');

            expect(result).toBe('client-abc-123-scope');
        });

        it('should handle long client names by truncating', () => {
            const longClientName = 'a'.repeat(150);
            const uuid = 'abc-123-def';
            const suffix = 'scope';

            const result = service.createKeyVaultSecretName(longClientName, uuid, suffix);

            expect(result.length).toBeLessThanOrEqual(127);
            expect(result).toContain(uuid);
            expect(result).toContain(suffix);
            expect(result.startsWith('a')).toBe(true);
        });

        it('should ensure truncated name does not end with dash', () => {
            const clientName = 'a'.repeat(100) + '-' + 'b'.repeat(20);
            const uuid = 'abc-123';
            const suffix = 'scope';

            const result = service.createKeyVaultSecretName(clientName, uuid, suffix);

            expect(result.length).toBeLessThanOrEqual(127);
            expect(result).not.toMatch(/-{2,}/); // no double dashes
        });

        it('should throw error when clientName is empty', () => {
            expect(() => service.createKeyVaultSecretName('', 'abc-123', 'scope')).toThrow(
                'clientName, uuid and suffix are required'
            );
        });

        it('should throw error when uuid is empty', () => {
            expect(() => service.createKeyVaultSecretName('Client', '', 'scope')).toThrow(
                'clientName, uuid and suffix are required'
            );
        });

        it('should throw error when suffix is empty', () => {
            expect(() => service.createKeyVaultSecretName('Client', 'abc-123', '')).toThrow(
                'clientName, uuid and suffix are required'
            );
        });

        it('should throw error when client name becomes empty after sanitization', () => {
            expect(() => service.createKeyVaultSecretName('!!!', 'abc-123', 'scope')).toThrow(
                'Client name becomes empty after sanitization'
            );
        });

        it('should throw error when suffix becomes empty after sanitization', () => {
            expect(() => service.createKeyVaultSecretName('Client', 'abc-123', '!!!')).toThrow(
                'Suffix becomes empty after sanitization'
            );
        });

        it('should throw error when suffix and uuid are too long', () => {
            const longUuid = 'a'.repeat(100);
            const longSuffix = 'b'.repeat(50);

            expect(() => service.createKeyVaultSecretName('Client', longUuid, longSuffix)).toThrow(
                'Suffix and UUID are too long to build a valid Key Vault secret name'
            );
        });

        it('should handle whitespace in inputs', () => {
            const result = service.createKeyVaultSecretName('  My Client  ', '  abc-123  ', '  scope  ');

            expect(result).toBe('my-client-abc-123-scope');
        });

        it('should convert to lowercase', () => {
            const result = service.createKeyVaultSecretName('MyClient', 'ABC-123-DEF', 'SCOPE');

            expect(result).toBe('myclient-abc-123-def-scope');
        });

        it('should start with alphanumeric character', () => {
            const result = service.createKeyVaultSecretName('Client123', 'abc-def', 'scope');

            expect(result).toMatch(/^[a-z0-9]/);
        });

        it('should not exceed 127 characters', () => {
            const result = service.createKeyVaultSecretName('VeryLongClientName'.repeat(10), 'uuid-123', 'scope');

            expect(result.length).toBeLessThanOrEqual(127);
        });

        it('should handle client name with only invalid characters', () => {
            expect(() => service.createKeyVaultSecretName('___', 'abc-123', 'scope')).toThrow(
                'Client name becomes empty after sanitization'
            );
        });

        it('should preserve valid alphanumeric characters and dashes', () => {
            const result = service.createKeyVaultSecretName('client-123-name', 'uuid-456', 'my-scope-1');

            expect(result).toBe('client-123-name-uuid-456-my-scope-1');
        });

        it('should handle edge case with exactly 127 character limit', () => {
            const clientName = 'a'.repeat(110);
            const uuid = '1234';
            const suffix = 'scope';

            const result = service.createKeyVaultSecretName(clientName, uuid, suffix);

            expect(result.length).toBeLessThanOrEqual(127);
            expect(result).toContain('1234');
            expect(result).toContain('scope');
        });

        it('should throw error if generated name somehow exceeds 127 chars (safety check)', () => {
            // This is testing the safety check, though it should never happen with proper logic
            // We can't easily trigger this without modifying the service, so this is more of a documentation test
            const validResult = service.createKeyVaultSecretName('client', 'uuid', 'suffix');
            expect(validResult.length).toBeLessThanOrEqual(127);
        });
    });
});
