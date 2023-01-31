import sinon from 'sinon';
import { LocationService } from '../../../main/service/locationService';
import { SummaryOfPublicationsService } from '../../../main/service/summaryOfPublicationsService';
import { ManualUploadService } from '../../../main/service/manualUploadService';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import RemoveListSearchResultsController from '../../../main/controllers/RemoveListSearchResultsController';

const i18n = {
    'remove-list-search-results': {},
    error: {},
};
const mockCourt = {
    locationId: '5',
    name: 'The court',
};
sinon.stub(LocationService.prototype, 'getLocationById').resolves(mockCourt);
sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').withArgs('5', true, true).resolves([]);
sinon.stub(ManualUploadService.prototype, 'formatListRemovalValues').returns([]);
const removeListSearchResultsController = new RemoveListSearchResultsController();

describe('Remove List Summary Controller', () => {
    it('should render remove list summary page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request.query = { locationId: '5' };
        const expectedOptions = {
            ...i18n['remove-list-search-results'],
            court: mockCourt,
            removalList: [],
        };

        responseMock.expects('render').once().withArgs('remove-list-search-results', expectedOptions);
        await removeListSearchResultsController.get(request, response);
        await responseMock.verify();
    });

    it('should render error page', async () => {
        const request = mockRequest(i18n);
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
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
