import config = require('config');
import * as process from 'process';

export function getRedirectURL(env): string {
  let redirectURL = '';
  (env) ?
    redirectURL = process.env.B2C_AUTH_ENDPOINT+ '?p='
        + process.env.B2C_FLOW_NAME + '&client_id='
        + process.env.CLIENT_ID + '&nonce=defaultNonce&redirect_uri='
        + encodeURIComponent(process.env.AUTH_RETURN_URL) + '&scope=openid&response_type=id_token&prompt=login' :
    redirectURL = config.get('secrets.pip-ss-kv.B2C_AUTH_ENDPOINT') + '?p='
        + config.get('secrets.pip-ss-kv.B2C_FLOW_NAME') + '&client_id='
        + config.get('secrets.pip-ss-kv.CLIENT_ID') + '&nonce=defaultNonce&redirect_uri='
        + encodeURIComponent(config.get('secrets.pip-ss-kv.AUTH_RETURN_URL')) + '&scope=openid&response_type=id_token&prompt=login';
  return redirectURL;
}

export function getFlowName(env): string {
  return (env) ? process.env.B2C_FLOW_NAME : config.get('secrets.pip-ss-kv.B2C_FLOW_NAME');
}
