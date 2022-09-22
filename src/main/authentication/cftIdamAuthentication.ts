import {CFT_IDAM_URL, FRONTEND_URL} from "../helpers/envUrls";
import axios from "axios";
import jwt_decode from "jwt-decode";
import config = require('config');
import process from "process";

const querystring = require('querystring');

let cftIdamClientSecret;

if(process.env.CFT_IDAM_CLIENT_SECRET) {
  cftIdamClientSecret = process.env.CFT_IDAM_CLIENT_SECRET;
} else {
  cftIdamClientSecret = config.get('secrets.pip-ss-kv.CFT_IDAM_CLIENT_SECRET') as string;
}

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

  const tokenRequest = axios.create({baseURL: CFT_IDAM_URL, timeout: 10000});

  try {
    const response = await tokenRequest.post('/o/token', querystring.stringify(params), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;
    const jwtToken = jwt_decode(data.id_token);
    jwtToken['flow'] = 'CFT';

    callback(null, jwtToken);

  } catch (e) {
    console.log(e);
  }
}
