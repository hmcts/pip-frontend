import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import process from 'process';
import config from 'config';

export class KeyVaultService {
    private client: SecretClient;

    constructor() {
        //BELOW TWO LINES WILL BE CHANGED WHEN PIP-INFRA REPO CHANGES WILL BE MERGED
        const kvEnv = process.env.KEY_VAULT_ENVIRONMENT || 'demo';
        const keyVaultUrl = 'https://pip-bootstrap-' + kvEnv + '-kv.vault.azure.net/';
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

    /**
     * Creates a Key Vault compatible secret name.
     */
    public createKeyVaultSecretName(clientName: string, uuid: string, suffix: string): string {
        if (!clientName || !uuid || !suffix) {
            throw new Error('clientName, uuid and suffix are required');
        }

        // 1. Normalize client name
        let safeClientName = clientName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-') // replace invalid chars with -
            .replace(/-+/g, '-'); // collapse multiple -

        // trim - from start/end using non-backtracking approach
        safeClientName = this.trimDashes(safeClientName);

        if (!safeClientName) {
            throw new Error('Client name becomes empty after sanitization');
        }

        // 2. Normalize suffix too (just in case)
        let safeSuffix = suffix
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-');

        safeSuffix = this.trimDashes(safeSuffix);

        if (!safeSuffix) {
            throw new Error('Suffix becomes empty after sanitization');
        }

        // 3. Normalize UUID (safety)
        const safeUuid = uuid.toLowerCase().trim();

        // 4. Calculate max allowed client name length
        // total = client + "-" + uuid + "-" + suffix
        const maxTotalLength = 127;

        const fixedPartLength = safeUuid.length + 1 + safeSuffix.length + 1; // uuid + 2 dashes + suffix

        const maxClientLength = maxTotalLength - fixedPartLength;

        if (maxClientLength <= 0) {
            throw new Error('Suffix and UUID are too long to build a valid Key Vault secret name');
        }

        if (safeClientName.length > maxClientLength) {
            safeClientName = safeClientName.substring(0, maxClientLength);
            // avoid ending with dash using non-backtracking approach
            safeClientName = this.trimTrailingDashes(safeClientName);
        }

        const secretName = `${safeClientName}-${safeUuid}-${safeSuffix}`;

        if (secretName.length > 127) {
            // Safety check (should never happen)
            throw new Error('Generated secret name exceeds 127 characters');
        }

        // 5. Must start with alphanumeric
        if (!/^[a-z0-9]/i.test(secretName)) {
            throw new Error('Generated secret name does not start with alphanumeric');
        }

        return secretName;
    }

    /**
     * Trim dashes from start and end of string without using backtracking regex
     */
    private trimDashes(str: string): string {
        let start = 0;
        let end = str.length;

        // Remove leading dashes
        while (start < end && str[start] === '-') {
            start++;
        }

        // Remove trailing dashes
        while (end > start && str[end - 1] === '-') {
            end--;
        }

        return str.substring(start, end);
    }

    /**
     * Trim only trailing dashes without using backtracking regex
     */
    private trimTrailingDashes(str: string): string {
        let end = str.length;

        // Remove trailing dashes
        while (end > 0 && str[end - 1] === '-') {
            end--;
        }

        return str.substring(0, end);
    }
}
