import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import process from 'process';
import config from 'config';

export class KeyVaultService {
    private client: SecretClient;

    constructor() {
        const thirdPartyKeyVault = process.env.THIRD_PARTY_KEY_VAULT || 'pip-ss-tp-kv-stg';
        const keyVaultUrl = 'https://' + thirdPartyKeyVault + '.vault.azure.net/';
        const nodeENV = process.env.NODE_ENV || 'development';

        const MANAGED_IDENTITY_CLIENT_ID = config.get('secrets.pip-ss-kv.MANAGED_IDENTITY_CLIENT_ID');

        const credential =
            nodeENV === 'development'
                ? new DefaultAzureCredential()
                : new DefaultAzureCredential({
                      managedIdentityClientId: MANAGED_IDENTITY_CLIENT_ID as string,
                  });

        this.client = new SecretClient(keyVaultUrl, credential);
    }

    public async getSecret(name: string): Promise<string> {
        try {
            const secret = await this.client.getSecret(name);

            if (!secret.value) {
                throw new Error(`Secret "${name}" has no value`);
            }

            return secret.value;
        } catch (err: any) {
            if (err.statusCode === 404) {
                return '';
            }
            throw new Error(`KeyVault getSecret failed for "${name}" reason: ${err.message}`);
        }
    }

    public async createOrUpdateSecret(name: string, value: string): Promise<void> {
        try {
            await this.client.setSecret(name, value);
        } catch (err: any) {
            throw new Error(`KeyVault createOrUpdateSecret failed for "${name} reason: ${err.message}"`);
        }
    }

    public async deleteSecret(name: string): Promise<void> {
        try {
            await this.client.beginDeleteSecret(name);
        } catch (err: any) {
            if (err.statusCode !== 404) {
                throw new Error(`KeyVault deleteSecret failed for "${name} reason: ${err.message}"`);
            }
        }
    }
}
