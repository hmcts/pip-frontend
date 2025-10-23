import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/LocationRequests';
import { PublicationRequests } from '../../../main/resources/requests/PublicationRequests';
import { testArtefactMetadata, testLocationData } from '../common/testData';
import { filterRoutes, testAccessibility } from '../common/pa11yHelper';
import { app } from '../../../main/app';
import { ssoNotAuthorised } from '../../../main/helpers/consts';
import { PublicationService } from '../../../main/service/PublicationService';

const publicRoutes = [
    { path: '/' },
    { path: '/accessibility-statement' },
    { path: '/account-request-submitted' },
    { path: '/alphabetical-search' },
    { path: '/cookie-policy' },
    { path: '/create-media-account' },
    { path: '/password-change-confirmation', postMethod: true },
    { path: '/cancelled-password-reset' },
    { path: '/admin-rejected-login' },
    { path: '/media-rejected-login' },
    { path: '/session-expired', parameter: '?reSignInUrl=CFT' },
    { path: '/session-logged-out' },
    { path: '/not-found' },
    { path: '/search' },
    { path: '/sign-in' },
    { path: '/view-option' },
    { path: '/summary-of-publications', parameter: '?locationId=123' },
    { path: '/sso-rejected-login' },
];

const locationData = testLocationData();
const metadata = testArtefactMetadata();

sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData[0]);
sinon.stub(LocationRequests.prototype, 'getFilteredCourts').resolves(locationData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').resolves(locationData);
sinon.stub(PublicationRequests.prototype, 'getPublicationsByLocation').resolves(metadata[0]);
sinon.stub(PublicationService.prototype, 'getPublicationsByLocation').resolves(metadata);
sinon.stub(PublicationService.prototype, 'getListTypes').returns(
    new Map([
        ['CROWN_WARNED_LIST', { friendlyName: 'List A' }],
        ['SJP_PUBLIC_LIST', { friendlyName: 'List B' }],
    ])
);

describe('Accessibility - Public Routes', () => {
    app.request['session'] = { messages: [ssoNotAuthorised] };

    filterRoutes(publicRoutes).forEach(route => {
        describe(`Page ${route.path}`, () => {
            testAccessibility(route.path, route.parameter, route.postMethod);
        });
    });

    describe('Page with Errors', () => {
        describe('A-Z Search Page', () => {
            describe('with no input data', () => {
                const url = '/search';
                testAccessibility(url, '', true, { 'search-input': '' });
            });
        });

        describe('Sign-in Page', () => {
            describe('with no input data', () => {
                const url = '/sign-in';
                testAccessibility(url, '', true, { 'sign-in': '' });
            });
        });

        describe('View option  Page', () => {
            const url = '/view-option';

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'view-choice': '' });
            });
        });
    });
});
