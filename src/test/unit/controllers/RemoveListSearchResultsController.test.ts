import sinon from 'sinon';
import { LocationService } from '../../../main/service/LocationService';
import { SummaryOfPublicationsService } from '../../../main/service/SummaryOfPublicationsService';
import { ManualUploadService } from '../../../main/service/ManualUploadService';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import RemoveListSearchResultsController from '../../../main/controllers/RemoveListSearchResultsController';
import { PublicationService } from '../../../main/service/PublicationService';

const i18n = {
    'remove-list-search-results': {},
    error: {},
};
const response = {
    render: () => {
        return '';
    },
    redirect: function () {
        return '';
    },
    cookie: (cookieName, cookieValue) => {
        return cookieName + cookieValue;
    },
} as unknown as Response;
const mockCourt = {
    locationId: '5',
    name: 'The court',
};
const adminUserId = '1234-1234-1234-1234';
const bulkListRemovalConfirmationUrl = '/remove-list-confirmation';
const mockArtefactsArray = [
    {
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        listTypeName: 'Civil Daily Cause List',
        contentDate: '2022-03-24T07:36:35',
        locationId: '5',
        artefactId: 'valid-artefact',
        dateRange: 'Invalid DateTime to Invalid DateTime',
        contDate: '24 Mar 2022'
    },
    {
        listType: 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
        listTypeName: 'Civil And Family Daily Cause List',
        contentDate: '2022-03-24T07:36:35',
        locationId: '5',
        artefactId: 'valid-artefact',
        dateRange: 'Invalid DateTime to Invalid DateTime',
        contDate: '24 Mar 2022'
    },
    {
        listType: 'IAC_DAILY_LIST',
        listTypeName: 'IAC Daily List',
        contentDate: '2022-03-24T07:36:35',
        locationId: '5',
        artefactId: 'valid-artefact',
        dateRange: 'Invalid DateTime to Invalid DateTime',
        contDate: '24 Mar 2022'
    },
];
const removeListFormData = { courtLists: ['valid-artefact', 'valid-artefact'], locationId: '5' };

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefactsArray);
sinon.stub(ManualUploadService.prototype, 'formatListRemovalValues').returns(mockArtefactsArray);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(mockCourt);
sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').withArgs('5', true, true).resolves([]);

const removeListSearchResultsController = new RemoveListSearchResultsController();

describe('Remove List Summary Controller', () => {
    describe('GET request', () => {
        it('should render remove list summary page', async () => {
            const responseMock = sinon.mock(response);
            const request = mockRequest(i18n);
            request.query = { locationId: '5' };
            const expectedOptions = {
                ...i18n['remove-list-search-results'],
                court: mockCourt,
                removalList: mockArtefactsArray,
                noOptionSelectedError: undefined,
            };

            responseMock.expects('render').once().withArgs('remove-list-search-results', expectedOptions);
            await removeListSearchResultsController.get(request, response);
            await responseMock.verify();
        });

        it('should render error page', async () => {
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);
            request.query = {};
            responseMock
                .expects('render')
                .once()
                .withArgs('error', { ...i18n.error });
            await removeListSearchResultsController.get(request, response);
            await responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the remove list summary page with error if no subscriptions selected', async () => {
            const request = mockRequest(i18n);
            request.user = { userId: adminUserId };
            request.body = { locationId: '5' };
            const responseMock = sinon.mock(response);
            responseMock
                .expects('redirect')
                .once()
                .withArgs(`remove-list-search-results?locationId=${mockCourt.locationId}&error=true`);

            await removeListSearchResultsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the remove list confirmation if a selection is made', async () => {
            const request = mockRequest(i18n);
            request.user = { userId: adminUserId };
            request.body = removeListFormData;
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs(bulkListRemovalConfirmationUrl);

            await removeListSearchResultsController.post(request, response);
            await responseMock.verify();
        });

        it('should render error page if there is no user defined', async () => {
            const request = mockRequest(i18n);
            request.user = undefined;

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', i18n.error);

            await removeListSearchResultsController.post(request, response);
            await responseMock.verify();
        });
    });
});
