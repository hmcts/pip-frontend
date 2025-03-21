import BlobViewSubscriptionResubmitConfirmationController from '../../../../main/controllers/system-admin/BlobViewSubscriptionResubmitConfirmationController';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { SubscriptionService } from '../../../../main/service/SubscriptionService';

const blobViewSubscriptionResubmitConfirmationController = new BlobViewSubscriptionResubmitConfirmationController();
const userId = '1';
const artefactId1 = '123';
const artefactId2 = '124';
const locationName = 'Location name';

const metadata = {
    locationId: 1,
    type: 'LIST',
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    provenance: 'MANUAL_UPLOAD',
    language: 'ENGLISH',
    sensitivity: 'PUBLIC',
    contentDate: '2025-03-20T00:00:00Z',
    displayFrom: '2025-03-20T00:00:00Z',
    displayTo: '2025-03-21T00:00:00Z',
};

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: locationName });

const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'fulfillSubscriptions');
subscriptionStub.withArgs(artefactId1, userId).resolves('success');
subscriptionStub.withArgs(artefactId2, userId).resolves(null);

const i18n = {
    'blob-view-subscription-resubmit-confirmation': {
        title: 'Confirm subscription re-submission',
    },
    error: {
        title: 'Error',
    },
};

describe('Blob view subscription re-submit confirmation controller', () => {
    describe('GET request', () => {
        it('should render blob view subscription re-submit confirmation page', async () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const request = mockRequest(i18n);
            request.query = { artefactId: artefactId1 };
            request.user = { userId: userId };

            const expectedData = {
                ...i18n['blob-view-subscription-resubmit-confirmation'],
                locationName,
                metadata,
            };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/blob-view-subscription-resubmit-confirmation', expectedData);
            blobViewSubscriptionResubmitConfirmationController.get(request, response);
            responseMock.verify;
        });
    });

    describe('POST request', () => {
        const response = {
            render: () => {
                return '';
            },
            redirect: () => {
                return '';
            },
        } as unknown as Response;

        it('should redirect to blob view subscription resubmit confirmed page if subscriptions fulfilled', async () => {
            const request = mockRequest(i18n);
            request.query = { artefactId: artefactId1 };
            request.user = { userId: userId };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('blob-view-subscription-resubmit-confirmed');
            await blobViewSubscriptionResubmitConfirmationController.post(request, response);
            responseMock.verify;
        });

        it('should redirect to error page if subscriptions not fulfilled', async () => {
            const request = mockRequest(i18n);
            request.query = { artefactId: artefactId2 };
            request.user = { userId: userId };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', { title: 'Error' });
            await blobViewSubscriptionResubmitConfirmationController.post(request, response);
            responseMock.verify;
        });
    });
});
