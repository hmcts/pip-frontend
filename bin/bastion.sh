ssh bastion-prod.platform.hmcts.net
# stg for staging, demo for demo, stg = prod demo = nonprod
env="stg"
vaultName="pip-ss-kv-${env}"
secretPrefix="data-management-POSTGRES-"

databaseName="datamanagement"
DB_HOST=$(az keyvault secret show --name "${secretPrefix}HOST" --vault-name $vaultName --query "value" -o tsv)
userName=$(az keyvault secret show --name "${secretPrefix}USER" --vault-name $vaultName --query "value" -o tsv)


export PGPASSWORD=$(az keyvault secret show --name "${secretPrefix}PASS" --vault-name $vaultName --query "value" -o tsv)

# you can get this from the portal, or determine it via the inputs your pass to this module in your code
POSTGRES_HOST="${hostName}"

# this matches the `database_name` parameter you pass in the module
DB_NAME="${databaseName}"

# Update the suffix after the @ to the server name
DB_USER="${userName}" # read access
#DB_USER="DTS\ Platform\ Operations@rpe-draft-store-aat" # operations team administrative access

psql "sslmode=require host=${DB_HOST} dbname=${DB_NAME} user=${DB_USER}"
