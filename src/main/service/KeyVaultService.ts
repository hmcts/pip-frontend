import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import process from 'process';

export class KeyVaultService {
    private client: SecretClient;

    constructor() {
        const thirdPartyKeyVault = process.env.THIRD_PARTY_KEY_VAULT || 'pip-ss-tp-kv-stg';
        const keyVaultUrl = 'https://' + thirdPartyKeyVault + '.vault.azure.net/';
        const nodeENV = process.env.NODE_ENV || 'development';


        const credential =
            nodeENV === 'development'
                ? new DefaultAzureCredential()
                : new DefaultAzureCredential({
                      managedIdentityClientId: '0e0c8682-a038-4aa8-9619-bb88a7ba9357',
                      tenantId: '531ff96d-0ae9-462a-8d2d-bec7c0b42082'
                  });

        credential.getToken('https://vault.azure.net/.default')
            .then(token => console.log('SUCCESS:', token))
            .catch(err => console.error('ERROR:', JSON.stringify(err, null, 2)));

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
