import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import RemoveListConfirmationController from '../../../main/controllers/RemoveListConfirmationController';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const i18n = {
    'remove-list-confirmation': {},
    error: {},
};
const removeListConfirmationController = new RemoveListConfirmationController();
const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;
const request = mockRequest(i18n);
const adminUserId = '1234-1234-1234-1234';

const mockArtefact = {
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    listTypeName: 'Civil Daily Cause List',
    contentDate: '2022-03-24T07:36:35',
    locationId: '5',
    artefactId: 'valid-artefact',
};
const mockCourt = { locationId: '5', name: 'Mock Court' };
const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(mockCourt);
removePublicationStub.withArgs('valid-artefact', adminUserId).resolves(true);
removePublicationStub.withArgs('foo', adminUserId).resolves(false);
metadataStub.withArgs('valid-artefact', adminUserId).resolves(mockArtefact);
metadataStub.withArgs('invalid-artefact', adminUserId).resolves({ ...mockArtefact, artefactId: 'invalid-artefact' });

describe('Remove List Confirmation Controller', () => {
    it('should render remove list confirmation page', async () => {
        request.query = { artefact: 'valid-artefact', court: '5' };
        request.user = { userId: adminUserId };

        const responseMock = sinon.mock(response);
        const expectedOptions = {
            ...i18n['remove-list-confirmation'],
            artefact: mockArtefact,
            court: mockCourt,
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
        await removeListConfirmationController.get(request, response);
        await responseMock.verify();
    });

    it('should render error page if artefact query param is not provided', async () => {
        request.query = { court: '5' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });
        await removeListConfirmationController.get(request, response);
        await responseMock.verify();
    });

    it('should redirect to remove list success page if remove choice is yes', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request.user = { userId: adminUserId };
        request.body = {
            'remove-choice': 'yes',
            artefactId: 'valid-artefact',
        };

        responseMock.expects('redirect').once().withArgs('/remove-list-success');
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });

    it('should render error if remove choice is yes and request fails', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request.user = { userId: adminUserId };
        request.body = {
            'remove-choice': 'yes',
            artefactId: 'foo',
        };

        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });

    it('should redirect to remove list summary if choice is no', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request.body = {
            'remove-choice': 'no',
            locationId: '5',
        };

        responseMock.expects('redirect').once().withArgs('/remove-list-search-results?locationId=5');
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });

    it('should render remove list confirmation with error if there is no choice', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request.user = { userId: adminUserId };
        request.body = {
            locationId: '5',
            artefactId: 'valid-artefact',
        };
        const expectedOptions = {
            ...i18n['remove-list-confirmation'],
            artefact: mockArtefact,
            court: mockCourt,
            displayError: true,
        };

        responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });
});
