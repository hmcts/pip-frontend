import { app } from '../../../main/app';
import sinon from 'sinon';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import { PublicationService } from '../../../main/service/publicationService';
import { ListDownloadService } from '../../../main/service/listDownloadService';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import { testArtefactMetadata, testLocationData, testSubscriptionData, testUserData } from '../common/testData';
import { filterRoutes, testAccessibility } from '../common/pa11yHelper';
import fs from 'fs';
import path from 'path';

const userId = '1';

const mediaRoutes = [
    { path: '/account-home', parameter: '?verified=true' },
    { path: '/bulk-unsubscribe' },
    { path: '/bulk-unsubscribe-confirmation' },
    { path: '/bulk-unsubscribe-confirmed' },
    { path: '/party-name-search' },
    { path: '/party-name-search-results', parameter: '?search=Surname' },
    { path: '/case-name-search' },
    { path: '/case-name-search-results', parameter: '?search=myCase' },
    { path: '/case-reference-number-search' },
    { path: '/case-reference-number-search-results', parameter: '?search-input=123&search-type=case-number' },
    { path: '/delete-subscription', parameter: '?subscription=123' },
    { path: '/list-download-disclaimer' },
    { path: '/list-download-files', parameter: '?artefactId=abc' },
    { path: '/location-name-search' },
    { path: '/pending-subscriptions' },
    { path: '/remove-subscription' },
    { path: '/subscription-add' },
    { path: '/subscription-confirmed' },
    { path: '/subscription-management' },
    { path: '/subscription-configure-list' },
    { path: '/subscription-configure-list-confirmed' },
    { path: '/unsubscribe-confirmation' },
    { path: '/session-expiring', parameter: '?currentPath=/view-option' },
];

const locationData = testLocationData();
const metadata = testArtefactMetadata();
const subscriptionsData = testSubscriptionData();

const rawCourtSubscriptionData = fs.readFileSync(
    path.resolve(__dirname, '../common/mocks/courtSubscriptions.json'),
    'utf-8'
);
const courtSubscriptionData = JSON.parse(rawCourtSubscriptionData);
const rawCaseSubscriptionData = fs.readFileSync(
    path.resolve(__dirname, '../common/mocks/caseSubscriptions.json'),
    'utf-8'
);
const caseSubscriptionData = JSON.parse(rawCaseSubscriptionData);

const subscriptionSearchResults = {
    caseNumber: 123,
    caseName: 'myCase',
    caseUrn: '',
    partyNames: 'Surname',
};

sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData[0]);
sinon.stub(LocationRequests.prototype, 'getFilteredCourts').resolves(locationData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').resolves(locationData);
sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').resolves(metadata);
sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationMetadata').returns(metadata[0]);
sinon.stub(PublicationService.prototype, 'getCasesByPartyName').resolves([subscriptionSearchResults]);
sinon.stub(PublicationService.prototype, 'getCasesByCaseName').resolves([subscriptionSearchResults]);
sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber').resolves(subscriptionSearchResults);
sinon.stub(ListDownloadService.prototype, 'checkUserIsAuthorised').resolves(true);
sinon.stub(ListDownloadService.prototype, 'getFileSize').returns('1 MB');
sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions').resolves(subscriptionsData);

const pendingSubscriptionStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
pendingSubscriptionStub.withArgs(userId, 'courts').resolves(courtSubscriptionData);
pendingSubscriptionStub.withArgs(userId, 'cases').resolves(caseSubscriptionData);

describe('Accessibility - Media User Routes', () => {
    app.request['user'] = testUserData();

    filterRoutes(mediaRoutes).forEach(route => {
        describe(`Page ${route.path}`, () => {
            testAccessibility(route.path, route.parameter);
        });
    });

    describe('Page with Errors', () => {
        describe('Party Name Search Page', () => {
            const url = '/party-name-search';

            beforeEach(() => {
                sinon.restore();
                sinon.stub(PublicationService.prototype, 'getCasesByPartyName').resolves([]);
            });

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'party-name': '' });
            });

            describe('with invalid input data', () => {
                testAccessibility(url, '', true, { 'party-name': 'Invalid party name' });
            });
        });

        describe('Case Name Search Page', () => {
            const url = '/case-name-search';

            beforeEach(() => {
                sinon.restore();
                sinon.stub(PublicationService.prototype, 'getCasesByCaseName').resolves([]);
            });

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'case-name': '' });
            });

            describe('with invalid input data', () => {
                testAccessibility(url, '', true, { 'case-name': 'Invalid case name' });
            });
        });

        describe('Case Reference Number Search Page', () => {
            const url = '/case-reference-number-search';

            beforeEach(() => {
                sinon.restore();
                sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber').resolves(null);
                sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn').resolves(null);
            });

            describe('with no input data', () => {
                testAccessibility(url, '', true, { 'search-input': '' });
            });

            describe('with invalid input data', () => {
                testAccessibility(url, '', true, { 'search-input': 'Invalid case number' });
            });
        });
    });
});
