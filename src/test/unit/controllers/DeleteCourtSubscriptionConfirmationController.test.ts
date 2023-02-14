import { Response } from 'express';
import { LocationService } from '../../../main/service/locationService';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtSubscriptionConfirmationController from '../../../main/controllers/DeleteCourtSubscriptionConfirmationController';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationByName');
const subDeleteStub = sinon.stub(SubscriptionService.prototype, 'deleteLocationSubscription');

const deleteCourtSubscriptionConfirmationController = new DeleteCourtSubscriptionConfirmationController();

const court = { locationId: 1, jurisdiction: 'test', region: 'test' };
sinon.stub(LocationService.prototype, 'formatCourtValue').returns(court);
courtStub.withArgs('1').resolves(court);
subDeleteStub.withArgs('1').resolves('success');
subDeleteStub.withArgs('2').resolves(null);

const i18n = { 'delete-court-subscription-confirmation': {} };

describe('Delete Court Subscription Controller', () => {
    it('should render confirmation page if unexpected error occurred', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '2', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-subscription-confirmation'],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete all the subscriptions for the court',
        };

        responseMock.expects('render').once().withArgs('delete-court-subscription-confirmation', expectedData);
        return deleteCourtSubscriptionConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render redirect to success page if subscription for  the court is deleted', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '2', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-subscription-confirmation'],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete all the subscriptions for the court',
        };

        responseMock.expects('render').once().withArgs('delete-court-subscription-confirmation', expectedData);
        return deleteCourtSubscriptionConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to success page', () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/delete-court-subscription-success');
        return deleteCourtSubscriptionConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render delete court reference data when No is selected', () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'no' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/delete-court-reference-data');
        return deleteCourtSubscriptionConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
