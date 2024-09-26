import { Response } from 'express';
import { LocationService } from '../../../../main/service/LocationService';
import { SubscriptionService } from '../../../../main/service/SubscriptionService';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtSubscriptionConfirmationController from '../../../../main/controllers/system-admin/DeleteCourtSubscriptionConfirmationController';
import { PublicationService } from '../../../../main/service/PublicationService';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const subDeleteStub = sinon.stub(SubscriptionService.prototype, 'deleteLocationSubscription');
const pubDeleteStub = sinon.stub(PublicationService.prototype, 'deleteLocationPublication');

const deleteCourtSubscriptionConfirmationController = new DeleteCourtSubscriptionConfirmationController();

const court = { locationId: 1, jurisdiction: 'test', region: 'test' };
sinon.stub(LocationService.prototype, 'formatCourtValue').returns(court);
courtStub.withArgs('1').resolves(court);
subDeleteStub.withArgs('1').resolves('success');
subDeleteStub.withArgs('2').resolves(null);
pubDeleteStub.withArgs('1').resolves('success');
pubDeleteStub.withArgs('2').resolves(null);

const pageName = 'delete-court-subscription-confirmation';
const pagePublicationName = 'delete-court-publication-confirmation';
const i18n = {
    'delete-court-subscription-confirmation': {},
};

describe('Delete Court Subscription Controller', () => {
    it('should render confirmation page if unexpected error occurred when deleting a subscription', () => {
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

        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/delete-court-subscription-confirmation', expectedData);
        return deleteCourtSubscriptionConfirmationController.post(request, response, pageName).then(() => {
            responseMock.verify();
        });
    });

    it('should render confirmation page if unexpected error occurred when deleting the publication', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '2', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-publication-confirmation'],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete all the artefacts for the court',
        };

        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/delete-court-publication-confirmation', expectedData);
        return deleteCourtSubscriptionConfirmationController.post(request, response, pagePublicationName).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to success page when subscription is successfully deleted', () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/delete-court-subscription-success?locationId=1');
        return deleteCourtSubscriptionConfirmationController.post(request, response, pageName).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to success page when publication is successfully deleted', () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/delete-court-publication-success?locationId=1');
        return deleteCourtSubscriptionConfirmationController.post(request, response, pagePublicationName).then(() => {
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
        return deleteCourtSubscriptionConfirmationController.post(request, response, pageName).then(() => {
            responseMock.verify();
        });
    });
});
