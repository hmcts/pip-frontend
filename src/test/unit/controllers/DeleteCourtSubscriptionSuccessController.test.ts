import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtSubscriptionSuccessController from '../../../main/controllers/DeleteCourtSubscriptionSuccessController';
import { LocationService } from '../../../main/service/locationService';

const deleteCourtSubscriptionSuccessController = new DeleteCourtSubscriptionSuccessController();

const courtStub = sinon.stub(LocationService.prototype, 'getLocationByName');
const court = { locationId: 1, jurisdiction: 'test', region: 'test' };
sinon.stub(LocationService.prototype, 'formatCourtValue').returns(court);
courtStub.withArgs('1').resolves(court);

describe('Delete Court Subscription Data Controller', () => {
    it('should render the court subscription list page', () => {
        const i18n = { 'delete-court-subscription-success': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.path = '/delete-court-subscription-success';
        request.query = { locationId: '1' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-subscription-success'],
            court: court,
        };

        responseMock.expects('render').once().withArgs('delete-court-subscription-success', expectedData);
        return deleteCourtSubscriptionSuccessController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the court publication list page', () => {
        const i18n = { 'delete-court-publication-success': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.path = '/delete-court-publication-success?locationId=1';
        request.query = { locationId: '1' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-publication-success'],
            court: court,
        };

        responseMock.expects('render').once().withArgs('delete-court-publication-success?locationId=1', expectedData);
        return deleteCourtSubscriptionSuccessController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
