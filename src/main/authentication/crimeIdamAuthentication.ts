import { FRONTEND_URL } from '../helpers/envUrls';
import config = require('config');
import process from 'process';
import { crimeIdamTokenApi } from '../resources/requests/utils/axiosConfig';

const querystring = require('querystring');

let crimeIdamClientId;
let crimeIdamClientSecret;

if (process.env.CRIME_IDAM_CLIENT_ID) {
    crimeIdamClientId = process.env.CRIME_IDAM_CLIENT_ID;
} else {
    crimeIdamClientId = config.get('secrets.pip-ss-kv.CRIME_IDAM_CLIENT_ID');
}

if (process.env.CRIME_IDAM_CLIENT_SECRET) {
    crimeIdamClientSecret = process.env.CRIME_IDAM_CLIENT_SECRET;
} else {
    crimeIdamClientSecret = config.get('secrets.pip-ss-kv.CRIME_IDAM_CLIENT_SECRET');
}

/**
 * This function authenticates with Crime IDAM, and returns the user in a decoded JWT token, that can then be parsed
 * by passport serialise / deserialise methods
 *
 * @param req The inbound request from the IDAM.
 * @param callback The passport callback to call once the function is complete
 */
export function crimeIdamAuthentication(req, callback) {
    const params = {
        client_id: crimeIdamClientId,
        client_secret: crimeIdamClientSecret,
        grant_type: 'authorization_code',
        redirect_uri: FRONTEND_URL + '/crime-login/return',
        code: req.query.code as string,
    };

    crimeIdamTokenApi
        .post('/idp/oauth2/access_token', querystring.stringify(params), {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(async response => {
            const data = response.data;
            let userInfo = await getCrimeIdamUserInfo(data.access_token);
            userInfo['flow'] = 'Crime';
            callback(null, userInfo);
        })
        .catch(error => {
            console.log(error);
            callback(null, null);
        });
}

export async function getCrimeIdamUserInfo(access_token): Promise<any> {
    let userInfo;
    await crimeIdamTokenApi
        .get('/idp/oauth2/userinfo', {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + access_token,
            },
        })
        .then(response => {
            userInfo = response.data;
        })
        .catch((err: Error) => {
            userInfo = null;
        });
    return userInfo;
}
