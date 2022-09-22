import process from 'process';
import { Logger } from '@hmcts/nodejs-logging';
import config = require('config');
import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import passportCustom from 'passport-custom';
import {
  AUTH_RETURN_URL,
  MEDIA_VERIFICATION_RETURN_URL,
  ADMIN_AUTH_RETURN_URL,
} from '../helpers/envUrls';
import {cftIdamAuthentication} from "./cftIdamAuthentication";

const AzureOIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');
const authenticationConfig = require('./authentication-config.json');
const logger = Logger.getLogger('authentication');
const CustomStrategy = passportCustom.Strategy;
const accountManagementRequests = new AccountManagementRequests();

/**
 * This sets up the OIDC version of authentication, integrating with Azure.
 */
function oidcSetup(): void {
  let clientSecret;
  let clientId;
  let identityMetadata;
  let adminIdentityMetadata;
  let mediaVerificationIdentityMetadata;

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

  logger.info('secret', clientSecret ? clientSecret.substring(0,5) : 'client secret not set!' );

  const piAadVerifyFunction = async function(iss, sub, profile, accessToken, refreshToken, done): Promise<any> {
    const returnedUser = await AccountManagementRequests.prototype.getPiUserByAzureOid(profile['oid']);

    if (returnedUser) {
      return done(null, profile);
    } else {
      return done(null, null);
    }
  };

  passport.serializeUser(async function(foundUser, done) {
    if(foundUser['flow'] === 'CFT') {
      const user = await accountManagementRequests.getPiUserByCftID(foundUser['uid']);

      if (!user) {
        const piAccount = [{
          'userProvenance': 'CFT_IDAM',
          'email': foundUser['sub'],
          'roles': 'VERIFIED',
          'provenanceUserId': foundUser['uid'],
        }];

        await accountManagementRequests.createPIAccount(piAccount, '');
      }
      done(null, {'uid': foundUser.uid, 'flow': 'CFT'});
    } else {
      done(null, {'oid': foundUser.oid, 'flow': 'AAD'});
    }
  });

  passport.deserializeUser(async function(userDetails, done) {
    let user;
    if (userDetails['flow'] === 'CFT') {
      user = await accountManagementRequests.getPiUserByCftID(userDetails['uid']);
    } else {
      user = await accountManagementRequests.getPiUserByAzureOid(userDetails['oid']);
    }

    return done(null, user);
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
  piAadVerifyFunction,
  ));

  passport.use('admin-login', new AzureOIDCStrategy({
    identityMetadata:  adminIdentityMetadata,
    clientID: clientId,
    responseType: authenticationConfig.RESPONSE_TYPE,
    responseMode: authenticationConfig.RESPONSE_MODE,
    redirectUrl: ADMIN_AUTH_RETURN_URL,
    allowHttpForRedirectUrl: true,
    clientSecret: clientSecret,
    isB2C: true,
  },
  piAadVerifyFunction,
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
  piAadVerifyFunction,
  ));

  passport.use('cft-idam', new CustomStrategy(cftIdamAuthentication));
}

/**
 * This function sets up the authentication service
 * Values are read from config, and from the environment passed in
 */
export default function(): void {
  oidcSetup();
}
