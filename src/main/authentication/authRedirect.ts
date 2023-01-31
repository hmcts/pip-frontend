import config = require('config');

export function getFlowName(env): string {
    return env ? process.env.B2C_FLOW_NAME : config.get('secrets.pip-ss-kv.B2C_FLOW_NAME');
}
