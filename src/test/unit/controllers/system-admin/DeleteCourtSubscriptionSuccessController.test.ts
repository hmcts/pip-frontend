import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtSubscriptionSuccessController from '../../../../main/controllers/system-admin/DeleteCourtSubscriptionSuccessController';
import { LocationService } from '../../../../main/service/LocationService';

const deleteCourtSubscriptionSuccessController = new DeleteCourtSubscriptionSuccessController();

const courtStub = sinon.stub(LocationService.prototype, 'getLocationByName');
const court = { locationId: 1, jurisdiction: 'test', region: 'test' };
sinon.stub(LocationService.prototype, 'formatCourtValue').returns(court);
courtStub.withArgs('1').resolves(court);

describe('Delete Court Subscription Data Controller', () => {
    it('should render the court subscription list page', () => {
        const i18n = {
            'system-admin': {
                'delete-court-subscription-success': {},
            },
        };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['system-admin']['delete-court-subscription-success'],
            court: court,
        };

        responseMock.expects('render').once().withArgs('system-admin/delete-court-subscription-success', expectedData);
        return deleteCourtSubscriptionSuccessController
            .get(request, response, 'delete-court-subscription-success')
            .then(() => {
                responseMock.verify();
            });
    });

    it('should render the court publication list page', () => {
        const i18n = {
            'system-admin': {
                'delete-court-publication-success': {},
            },
        };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['system-admin']['delete-court-publication-success'],
            court: court,
        };

        responseMock.expects('render').once().withArgs('system-admin/delete-court-publication-success', expectedData);
        return deleteCourtSubscriptionSuccessController
            .get(request, response, 'delete-court-publication-success')
            .then(() => {
                responseMock.verify();
            });
    });
});
