import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import { testArtefactMetadata, testLocationData } from '../common/testData';
import { filterRoutes, testAccessibility } from '../common/pa11yHelper';

const publicRoutes = [
    { path: '/' },
    { path: '/accessibility-statement' },
    { path: '/account-request-submitted' },
    { path: '/alphabetical-search' },
    { path: '/cookie-policy' },
    { path: '/create-media-account' },
    { path: '/password-change-confirmation', parameter: '/false', postMethod: true },
    { path: '/cancelled-password-reset', parameter: '/false' },
    { path: '/admin-rejected-login' },
    { path: '/media-rejected-login' },
    { path: '/session-expired', parameter: '?reSignInUrl=CFT' },
    { path: '/session-logged-out' },
    { path: '/not-found' },
    { path: '/unprocessed-request' },
    { path: '/search' },
    { path: '/sign-in' },
    { path: '/view-option' },
    { path: '/summary-of-publications', parameter: '?locationId=123' },
];

const locationData = testLocationData();
const metadata = testArtefactMetadata();

sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData[0]);
sinon.stub(LocationRequests.prototype, 'getFilteredCourts').resolves(locationData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').resolves(locationData);
sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').resolves(metadata[0]);

describe('Accessibility - Public Routes', () => {
    filterRoutes(publicRoutes).forEach(route => {
        describe(`Page ${route.path}`, () => {
            testAccessibility(route.path, route.parameter, route.postMethod);
        });
    });

    describe('Page with Errors', () => {
        describe('A-Z Search Page', () => {
            describe('with no input data', () => {
                const url = '/search';
                testAccessibility(url, '', true, { 'input-autocomplete': '' });
            });
        });
    });
});
