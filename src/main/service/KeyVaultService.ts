import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import process from 'process';
import config from 'config';

const kvEnv = process.env.KEY_VAULT_ENVIRONMENT || 'demo';
const MANAGED_IDENTITY_CLIENT_ID = config.get('secrets.pip-ss-kv.MANAGED_IDENTITY_CLIENT_ID');
const keyVaultUrl = "https://pip-bootstrap-" + kvEnv + "-kv.vault.azure.net/";

const nodeENV = process.env.NODE_ENV || 'development';

const credential = nodeENV === 'development'
    ? new DefaultAzureCredential()
    : new DefaultAzureCredential({
        managedIdentityClientId: MANAGED_IDENTITY_CLIENT_ID as string
    });

const client = new SecretClient(keyVaultUrl, credential);

export class KeyVaultService {
    public async getSecret(name: string): Promise<string> {
        try {
            const secret = await client.getSecret(name);

            if (!secret.value) {
                throw new Error(`Secret "${name}" has no value`);
            }

            return secret.value;
        } catch (err: any) {
            console.error(`Failed to get secret "${name}" from Key Vault`, err);
            throw new Error(`KeyVault getSecret failed for "${name}"`);
        }
    }

    public async createOrUpdateSecret(name: string, value: string): Promise<void> {
        try {
            await client.setSecret(name, value);
        } catch (err: any) {
            console.error(`Failed to create or update secret "${name}" in Key Vault`, err);
            throw new Error(`KeyVault createOrUpdateSecret failed for "${name}"`);
        }
    }

    /**
     * Creates a Key Vault compatible secret name.
     */
    public createKeyVaultSecretName(
        clientName: string,
        uuid: string,
        suffix: string
    ): string {
        if (!clientName || !uuid || !suffix) {
            throw new Error("clientName, uuid and suffix are required");
        }

        // 1. Normalize client name
        let safeClientName = clientName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, "-")   // replace invalid chars with -
            .replace(/-+/g, "-")           // collapse multiple -
            .replace(/^-+|-+$/g, "");      // trim - from start/end

        if (!safeClientName) {
            throw new Error("Client name becomes empty after sanitization");
        }

        // 2. Normalize suffix too (just in case)
        let safeSuffix = suffix
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (!safeSuffix) {
            throw new Error("Suffix becomes empty after sanitization");
        }

        // 3. Normalize UUID (safety)
        const safeUuid = uuid.toLowerCase().trim();

        // 4. Calculate max allowed client name length
        // total = client + "-" + uuid + "-" + suffix
        const maxTotalLength = 127;

        const fixedPartLength =
            safeUuid.length + 1 + safeSuffix.length + 1; // uuid + 2 dashes + suffix

        const maxClientLength = maxTotalLength - fixedPartLength;

        if (maxClientLength <= 0) {
            throw new Error("Suffix and UUID are too long to build a valid Key Vault secret name");
        }

        if (safeClientName.length > maxClientLength) {
            safeClientName = safeClientName.substring(0, maxClientLength);
            safeClientName = safeClientName.replace(/-+$/g, ""); // avoid ending with dash
        }

        const secretName = `${safeClientName}-${safeUuid}-${safeSuffix}`;

        if (secretName.length > 127) {
            // Safety check (should never happen)
            throw new Error("Generated secret name exceeds 127 characters");
        }

        // 5. Must start with alphanumeric
        if (!/^[a-z0-9]/i.test(secretName)) {
            throw new Error("Generated secret name does not start with alphanumeric");
        }

        return secretName;
    }

}

