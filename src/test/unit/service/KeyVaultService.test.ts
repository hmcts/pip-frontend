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
                `KeyVault createOrUpdateSecret failed for "${secretName} reason: Permission denied"`
            );
        });
    });
});
