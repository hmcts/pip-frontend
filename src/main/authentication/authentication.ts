import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import passportCustom from 'passport-custom';
import { cftIdamAuthentication } from './cftIdamAuthentication';
import { crimeIdamAuthentication } from './crimeIdamAuthentication';
import { getSsoConfig, ssoVerifyFunction } from './ssoAuthentication';
import { OIDCStrategy } from './extendedOidcStrategy';
import passport from 'passport';
import { getB2cConfig, getB2cMediaVerificationConfig, piAadVerifyFunction } from './b2cAuthentication';

const CustomStrategy = passportCustom.Strategy;
const accountManagementRequests = new AccountManagementRequests();

async function serializeUser(foundUser, done) {
    if (foundUser.flow === 'CFT') {
        const user = await accountManagementRequests.getPiUserByCftID(foundUser.uid);
        if (!user) {
            const piAccount = [
                {
                    userProvenance: 'CFT_IDAM',
                    email: foundUser['sub'],
                    roles: 'VERIFIED',
                    provenanceUserId: foundUser['uid'],
                    forenames: foundUser['given_name'],
                    surname: foundUser['family_name'],
                },
            ];

            await accountManagementRequests.createPIAccount(piAccount, '');
        }
        done(null, { uid: foundUser.uid, flow: 'CFT' });
    } else if (foundUser['flow'] === 'Crime') {
        const user = await accountManagementRequests.getPiUserByCrimeID(foundUser['subname']);

        if (!user) {
            const piAccount = [
                {
                    userProvenance: 'CRIME_IDAM',
                    email: foundUser['email'],
                    roles: 'VERIFIED',
                    provenanceUserId: foundUser['subname'],
                    forenames: foundUser['given_name'],
                    surname: foundUser['family_name'],
                },
            ];

            await accountManagementRequests.createPIAccount(piAccount, '');
        }
        done(null, { uid: foundUser['subname'], flow: 'Crime' });
    } else {
        done(null, { oid: foundUser.oid, flow: foundUser.flow === 'SSO' ? 'SSO' : 'AAD' });
    }
}

async function deserializeUser(userDetails, done) {
    let user;
    if (userDetails['flow'] === 'CFT') {
        user = await accountManagementRequests.getPiUserByCftID(userDetails['uid']);
    } else if (userDetails['flow'] === 'Crime') {
        user = await accountManagementRequests.getPiUserByCrimeID(userDetails['uid']);
    } else {
        user =
            userDetails['flow'] === 'SSO'
                ? await accountManagementRequests.getPiUserByAzureOid(userDetails['oid'], 'SSO')
                : await accountManagementRequests.getPiUserByAzureOid(userDetails['oid']);
    }
    return done(null, user);
}

/**
 * This sets up the authentication process for the different IDAM's and routes
 */
export async function oidcSetup(): Promise<void> {
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    console.log('Setting up OIDC Strategies for B2C, SSO, CFT IDAM, and Crime IDAM');
    passport.use('login', new OIDCStrategy(await getB2cConfig(), piAadVerifyFunction));
    console.log('Set up login');
    passport.use('media-verification', new OIDCStrategy(await getB2cMediaVerificationConfig(), piAadVerifyFunction));
    console.log('Set up media verification');
    passport.use('sso', new OIDCStrategy(await getSsoConfig(), ssoVerifyFunction));
    console.log('Set up SSO');
    passport.use('cft-idam', new CustomStrategy(cftIdamAuthentication));
    passport.use('crime-idam', new CustomStrategy(crimeIdamAuthentication));
}
