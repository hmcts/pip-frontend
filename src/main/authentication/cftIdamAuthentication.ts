import {FRONTEND_URL} from '../helpers/envUrls';
import jwt_decode from 'jwt-decode';
import config = require('config');
import process from 'process';
import {cftIdamTokenApi} from '../resources/requests/utils/axiosConfig';
import {Logger} from '@hmcts/nodejs-logging';

const querystring = require('querystring');

const acceptedRoles = ['IDAM_ADMIN_USER'];

let cftIdamClientSecret;

if(process.env.CFT_IDAM_CLIENT_SECRET) {
  cftIdamClientSecret = process.env.CFT_IDAM_CLIENT_SECRET;
} else {
  cftIdamClientSecret = config.get('secrets.pip-ss-kv.CFT_IDAM_CLIENT_SECRET') as string;
}

//Added logging temporarily to check if it is being picked up
const logger = Logger.getLogger('cftIdamAuthentication');
logger.info(cftIdamClientSecret.substring(0,2));

/**
 * This function authenticates with CFT IDAM, and returns the user in a decoded JWT token, that can then be parsed
 * by passport serialise / deserialise methods
 *
 * @param req The inbound request from the IDAM.
 * @param callback The passport callback to call once the function is complete
 */
export async function cftIdamAuthentication(req, callback) {

  const params = {
    client_id: 'app-pip-frontend',
    client_secret: cftIdamClientSecret,
    grant_type: 'authorization_code',
    redirect_uri: FRONTEND_URL + '/cft-login/return',
    code: req.query.code as string,
  };

  try {
    const response = await cftIdamTokenApi.post('/o/token', querystring.stringify(params), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;
    const jwtToken = jwt_decode(data.id_token);
    jwtToken['flow'] = 'CFT';

    if (jwtToken['roles'].some(role => acceptedRoles.includes(role))) {
      callback(null, jwtToken);
    } else {
      callback(null, null);
    }
  } catch (cftIdamException) {
    //Temporarily logging exception
    logger.info(cftIdamException);
    callback(null, null);
  }
}
