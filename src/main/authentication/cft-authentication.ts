import {CFT_IDAM_URL, FRONTEND_URL} from "../helpers/envUrls";
import config = require('config');
import axios from "axios";
import jwt_decode from "jwt-decode";
var querystring = require('querystring');
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
const accountManagementRequests = new AccountManagementRequests();

let cftIdamClientSecret;
if(process.env.CFT_IDAM_CLIENT_SECRET) {
  cftIdamClientSecret = process.env.CFT_IDAM_CLIENT_SECRET;
} else {
  cftIdamClientSecret = config.get('secrets.pip-ss-kv.CFT_IDAM_CLIENT_SECRET') as string;
}

export async function processCftLogin(req, res, next) {

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
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = response.data;
    const jwtToken = jwt_decode(data.id_token);

    // @ts-ignore
    req.session.user = jwtToken;
  } catch (e) {
    console.log(e);
  }
  next();
}

export async function processCftAccount(req, res, next) {

  //Check if Account already exists in DB
  const user = await accountManagementRequests.getPiUserByCftID(req.session.user.uid);

  //If not, added them in
  if (!user) {

  }

  //Then set the expected fields
}
