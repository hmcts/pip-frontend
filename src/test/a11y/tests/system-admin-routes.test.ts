import { app } from '../../../main/app';
import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests//LocationRequests';
import { PublicationRequests } from '../../../main/resources/requests//PublicationRequests';
import { PublicationService } from '../../../main/service/PublicationService';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { FileHandlingService } from '../../../main/service/FileHandlingService';
import { SubscriptionRequests } from '../../../main/resources/requests//SubscriptionRequests';
import {
    testArtefactJsonData,
    testArtefactMetadata,
    testAuditData,
    testLocationData,
    testSubscriptionData,
    testUserData,
} from '../common/testData';
import { filterRoutes, testAccessibility } from '../common/pa11yHelper';
import { UserManagementService } from '../../../main/service/UserManagementService';
import { AuditLogService } from '../../../main/service/AuditLogService';
import fs from 'fs';
import path from 'path';

const userId = '1';
const name = 'Test';
const emailAddress = 'test@test.com';
const systemAdminRole = 'SYSTEM_ADMIN';
const fileName = 'test.csv';

const systemAdminRoutes = [
    { path: '/system-admin-dashboard' },
    { path: '/create-system-admin-account' },
    { path: '/create-system-admin-account-summary' },
    { path: '/blob-view-locations' },
    { path: '/blob-view-publications', parameter: '?locationId=123' },
    { path: '/blob-view-json', parameter: '?artefactId=abc' },
    { path: '/bulk-create-media-accounts', parameter: '?locationId=123' },
    { path: '/bulk-create-media-accounts-confirmation', parameter: '?artefactId=abc' },
    { path: '/bulk-create-media-accounts-confirmed' },
    { path: '/manual-reference-data-upload' },
    { path: '/manual-reference-data-upload-summary' },
    { path: '/manual-reference-data-upload-confirmation' },
    { path: '/manage-third-party-users' },
    { path: '/manage-third-party-users/view', parameter: `?userId=${userId}` },
    { path: '/manage-third-party-users/subscriptions', parameter: `?userId=${userId}` },
    { path: '/user-management' },
    { path: '/delete-court-reference-data' },
    { path: '/delete-court-reference-data-confirmation', parameter: '?locationId=123' },
    { path: '/delete-court-reference-data-success' },
    { path: '/delete-court-subscription-confirmation', parameter: '?locationId=123' },
    { path: '/delete-court-subscription-success', parameter: '?locationId=123' },
    { path: '/delete-court-publication-confirmation', parameter: '?locationId=123' },
    { path: '/delete-court-publication-success', parameter: '?locationId=123' },
    { path: '/audit-log-viewer', parameter: '?locationId=123' },
    { path: '/audit-log-details', parameter: '?id=123&timestamp=10/01/2024' },
];

const jsonData = testArtefactJsonData('dailyCauseList.json');
const metadata = testArtefactMetadata();
const locationData = testLocationData();
const subscriptionData = testSubscriptionData();
const userDataThirdParty = testUserData('THIRD_PARTY');
const auditData = testAuditData();

const rawUserPageData = fs.readFileSync(path.resolve(__dirname, '../common/mocks/userPageData.json'), 'utf-8');
const userPageData = JSON.parse(rawUserPageData);
const rawAuditLogPageData = fs.readFileSync(path.resolve(__dirname, '../common/mocks/auditLogPageData.json'), 'utf-8');
const auditLogPageData = JSON.parse(rawAuditLogPageData);

const countPerLocation = [
    {
        locationId: '1',
        totalArtefacts: 2,
    },
    {
        locationId: '3',
        totalArtefacts: 1,
    },
];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData[0]);
sinon.stub(LocationRequests.prototype, 'getFilteredCourts').resolves(locationData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').resolves(locationData);
sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').resolves(metadata);
sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationMetadata').returns(metadata[0]);
sinon.stub(PublicationRequests.prototype, 'getPubsPerLocation').returns(countPerLocation);
sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves(userDataThirdParty);
sinon.stub(AccountManagementRequests.prototype, 'getThirdPartyAccounts').returns([userDataThirdParty]);
sinon.stub(AccountManagementRequests.prototype, 'getAuditLogById').returns(auditData);
sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions').resolves(subscriptionData);
sinon.stub(SubscriptionRequests.prototype, 'retrieveSubscriptionChannels').resolves(['EMAIL', 'API']);
sinon.stub(FileHandlingService.prototype, 'readFileFromRedis').returns('testData');
sinon.stub(FileHandlingService.prototype, 'readCsvToArray').returns([
    ['email', 'firstName', 'surname'],
    [emailAddress, name, name],
]);
sinon.stub(UserManagementService.prototype, 'getFormattedData').resolves(userPageData);
sinon.stub(AuditLogService.prototype, 'getFormattedAuditData').returns(auditLogPageData);

describe('Accessibility - System Admin Routes', () => {
    app.request['cookies'] = {
        formCookie: JSON.stringify({ uploadFileName: fileName, fileName: fileName }),
        createAdminAccount: JSON.stringify({
            firstName: name,
            lastName: name,
            emailAddress: emailAddress,
            'user-role': 'system-admin',
        }),
    };

    app.request['user'] = testUserData('PI_AAD', systemAdminRole);

    filterRoutes(systemAdminRoutes).forEach(route => {
        describe(`Page ${route.path}`, () => {
            testAccessibility(route.path, route.parameter);
        });
    });
});
