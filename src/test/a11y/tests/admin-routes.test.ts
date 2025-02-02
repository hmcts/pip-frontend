import { app } from '../../../main/app';
import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/LocationRequests';
import { PublicationRequests } from '../../../main/resources/requests/PublicationRequests';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { randomUUID } from 'crypto';
import { testArtefactMetadata, testLocationData, testMediaApplicationData, testUserData } from '../common/testData';
import { filterRoutes, testAccessibility } from '../common/pa11yHelper';
import { v4 as uuidv4 } from 'uuid';

const name = 'Test';
const emailAddress = 'test@test.com';
const superAdminCtscRole = 'INTERNAL_ADMIN_CTSC';
const userProvenance = 'SSO';
const uuid = randomUUID();
const rejectionReasons = 'Details provided do not match.';

const adminRoutes = [
    { path: '/admin-dashboard' },
    { path: '/manual-upload' },
    { path: '/manual-upload-summary' },
    { path: '/manual-upload-confirmation' },
    { path: '/manual-upload?non-strategic=true' },
    { path: '/manual-upload-summary?non-strategic=true' },
    { path: '/manual-upload-confirmation?non-strategic=true' },
    { path: '/media-applications' },
    { path: '/media-account-review', parameter: '?applicantId=' + uuidv4() },
    { path: '/media-account-approval', parameter: '?applicantId=' + uuidv4() },
    { path: '/media-account-rejection', parameter: '?applicantId=' + uuidv4() },
    { path: '/media-account-approval-confirmation', parameter: '?applicantId=' + uuidv4() },
    { path: '/media-account-rejection-reasons', parameter: `?applicantId=${uuid}` },
    { path: '/media-account-rejection-confirmation' },
    { path: '/remove-list-confirmation', parameter: '?artefact=123' },
    { path: '/remove-list-search' },
    { path: '/remove-list-search-results', parameter: '?locationId=123' },
    { path: '/remove-list-success' },
];

const locationData = testLocationData();
const metadata = testArtefactMetadata();
const mediaApplications = testMediaApplicationData();
const userData = testUserData();

sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData[0]);
sinon.stub(LocationRequests.prototype, 'getFilteredCourts').resolves(locationData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').resolves(locationData);
sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').resolves(metadata);
sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationMetadata').resolves(metadata[0]);
sinon.stub(AccountManagementRequests.prototype, 'getPendingMediaApplications').resolves(mediaApplications);
sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationById').resolves(mediaApplications[0]);
sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(userData);
sinon.stub(AccountManagementRequests.prototype, 'deleteUser').resolves('Success');

describe('Accessibility - Admin Routes', () => {
    app.request['cookies'] = {
        formCookie: JSON.stringify({ listType: 'CIVIL_DAILY_CAUSE_LIST' }),
        createAdminAccount: JSON.stringify({
            firstName: name,
            lastName: name,
            emailAddress: emailAddress,
            'user-role': 'super-admin-ctsc',
            userRoleObject: {
                key: 'super-admin-ctsc',
                text: 'Internal - Super Administrator - CTSC',
                mapping: superAdminCtscRole,
            },
        }),
    };

    app.request['user'] = testUserData(userProvenance, superAdminCtscRole);

    app.request['body'] = {
        applicantId: uuid,
        reasons: rejectionReasons,
    };

    filterRoutes(adminRoutes).forEach(route => {
        describe(`Page ${route.path}`, () => {
            testAccessibility(route.path, route.parameter, route.postMethod, route.postBody);
        });
    });

    describe('Page with Errors', () => {
        describe('Manual Upload Page', () => {
            const url = '/manual-upload';

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'input-autocomplete': '' });
            });

            describe('with invalid input data', () => {
                testAccessibility(url, '', true, { listType: 'EMPTY' });
            });
        });

        describe('Manual Upload Page for non strategic upload', () => {
            const url = '/manual-upload?non-strategic=true';

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'input-autocomplete': '' });
            });

            describe('with invalid input data', () => {
                testAccessibility(url, '', true, { listType: 'EMPTY' });
            });
        });

        describe('Remove List Search Page', () => {
            const url = '/remove-list-search';

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'input-autocomplete': '' });
            });
        });

        describe('Remove List Search Results Page', () => {
            const url = '/remove-list-search-results';

            describe('with no checkbox selected', () => {
                testAccessibility(url, '', true, { locationId: '123' });
            });
        });
    });
});
