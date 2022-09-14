import process from 'process';
import { Logger } from '@hmcts/nodejs-logging';
import config = require('config');
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import {AUTH_RETURN_URL, MEDIA_VERIFICATION_RETURN_URL, CFT_IDAM_URL, FRONTEND_URL} from '../helpers/envUrls';

const AzureOIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const OIDCStrategy = require('passport-openidconnect');
const passport = require('passport');
const authenticationConfig = require('./authentication-config.json');
const logger = Logger.getLogger('authentication');

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
  let clientSecret;
  let clientId;
  let identityMetadata;
  let adminIdentityMetadata;
  let mediaVerificationIdentityMetadata;
  let cftIdamClientSecret;

  if(process.env.CLIENT_SECRET) {
    clientSecret = process.env.CLIENT_SECRET;
  } else {
    clientSecret = config.get('secrets.pip-ss-kv.CLIENT_SECRET') as string;
  }

  if(process.env.CLIENT_ID) {
    clientId = process.env.CLIENT_ID;
  } else {
    clientId = config.get('secrets.pip-ss-kv.CLIENT_ID') as string;
  }

  if(process.env.CONFIG_ENDPOINT) {
    identityMetadata = process.env.CONFIG_ENDPOINT;
  } else {
    identityMetadata = config.get('secrets.pip-ss-kv.CONFIG_ENDPOINT') as string;
  }

  if(process.env.CONFIG_ADMIN_ENDPOINT) {
    adminIdentityMetadata = process.env.CONFIG_ADMIN_ENDPOINT;
  } else {
    adminIdentityMetadata = config.get('secrets.pip-ss-kv.CONFIG_ADMIN_ENDPOINT') as string;
  }

  if(process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT) {
    mediaVerificationIdentityMetadata = process.env.MEDIA_VERIFICATION_CONFIG_ENDPOINT;
  } else {
    mediaVerificationIdentityMetadata = config.get('secrets.pip-ss-kv.MEDIA_VERIFICATION_CONFIG_ENDPOINT') as string;
  }

  if(process.env.CFT_IDAM_CLIENT_SECRET) {
    cftIdamClientSecret = process.env.CFT_IDAM_CLIENT_SECRET;
  } else {
    cftIdamClientSecret = config.get('secrets.pip-ss-kv.CFT_IDAM_CLIENT_SECRET') as string;
  }

  logger.info('secret', clientSecret ? clientSecret.substring(0,5) : 'client secret not set!' );

  const users = [];

  const findByOid = async function(oid, fn): Promise<any> {
    for (let i = 0, len = users.length; i < len; i++) {
      const user = users[i];
      if (user.oid === oid) {
        const returnedUser = await AccountManagementRequests.prototype.getPiUserByAzureOid(oid);
        user['piUserId'] = returnedUser.userId;
        user['piUserProvenance'] = returnedUser.userProvenance;
        return fn(user);
      }
    }
    return fn(null);
  };

  const passportStrategyFn = async function(iss, sub, profile, accessToken, refreshToken, done): Promise<any> {
    await findByOid(profile.oid, function(user) {
      if (!user) {
        // "Auto-registration"
        users.push(profile);
        return done(null, profile);
      }
      return done(null, user);
    });
  };

  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(async function(oid, done) {
    await findByOid(oid, function (user) {
      done(null, user);
    });
  });

  passport.use('login', new AzureOIDCStrategy({
    identityMetadata:  identityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: AUTH_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  passportStrategyFn,
  ));

  passport.use('admin-login', new AzureOIDCStrategy({
    identityMetadata:  adminIdentityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: AUTH_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  passportStrategyFn,
  ));

  passport.use('media-verification', new AzureOIDCStrategy({
    identityMetadata:  mediaVerificationIdentityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: MEDIA_VERIFICATION_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  passportStrategyFn,
  ));

  passport.use('cft-login', new OIDCStrategy({
    issuer: CFT_IDAM_URL + '/o',
    authorizationURL: CFT_IDAM_URL + '/o/authorize',
    tokenURL: CFT_IDAM_URL + '/o/token',
    userInfoURL: CFT_IDAM_URL + '/o/userinfo',
    clientID: 'app-pip-frontend',
    clientSecret: cftIdamClientSecret,
    callbackURL: FRONTEND_URL + '/cft-login/return',
  },
  passportStrategyFn,
  ));
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function(): void {
  oidcSetup();
}
