import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import RemoveListConfirmationController from '../../../main/controllers/RemoveListConfirmationController';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import { ManualUploadService } from '../../../main/service/ManualUploadService';

const validArtefactId = '1';
const validArtefactId2 = '2';
const validArtefactId3 = '3';
const invalidArtefactId = '4';

const metadata = {
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    artefactId: validArtefactId,
};

const metadata2 = {
    listType: 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
    artefactId: validArtefactId2,
};

const metadata3 = {
    listType: 'IAC_DAILY_CAUSE_LIST',
    artefactId: validArtefactId3,
};

const mockArtefactsArray = [metadata, metadata2, metadata3];

const mockCourt = { locationId: '5', name: 'Mock Court' };
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
    cookie: (cookieName, cookieValue) => {
        return cookieName + cookieValue;
    },
    clearCookie: () => {
        return '';
    },
} as unknown as Response;
const request = mockRequest(i18n);

sinon.stub(LocationService.prototype, 'getLocationById').resolves(mockCourt);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(validArtefactId).resolves(metadata);
metadataStub.withArgs(validArtefactId2).resolves(metadata2);
metadataStub.withArgs(validArtefactId3).resolves(metadata3);

const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
removePublicationStub.withArgs(validArtefactId).resolves(true);
removePublicationStub.withArgs(invalidArtefactId).resolves(false);

const formatRemovalListStub = sinon.stub(ManualUploadService.prototype, 'formatListRemovalValues');
formatRemovalListStub.withArgs(mockArtefactsArray).returns(mockArtefactsArray);
formatRemovalListStub.withArgs([metadata]).returns([metadata]);

describe('Remove List Confirmation Controller', () => {
    it('should render remove list confirmation page', async () => {
        const formData = {
            courtLists: [validArtefactId, validArtefactId2, validArtefactId3],
            locationId: '5',
        };

        request['cookies'] = { formCookie: JSON.stringify(formData) };

        const responseMock = sinon.mock(response);

        const expectedOptions = {
            ...i18n['remove-list-confirmation'],
            removalList: mockArtefactsArray,
            locationId: '5',
            court: mockCourt,
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
        await removeListConfirmationController.get(request, response);
        await responseMock.verify();
    });

    it('should redirect to remove list success page if remove choice is yes', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);

        request.body = {
            'remove-choice': 'yes',
            artefactIds: validArtefactId,
            locationId: '5',
        };

        responseMock.expects('redirect').once().withArgs('/remove-list-success');
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });

    it('should render error if remove choice is yes and request fails', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);

        request.body = {
            'remove-choice': 'yes',
            artefactIds: invalidArtefactId,
            locationId: '5',
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
            artefactIds: validArtefactId,
            locationId: '5',
        };

        responseMock.expects('redirect').once().withArgs('/remove-list-search-results?locationId=5');
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });

    it('should render remove list confirmation with error if there is no choice', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);

        request.body = {
            artefactIds: validArtefactId,
            locationId: '5',
        };
        const expectedOptions = {
            ...i18n['remove-list-confirmation'],
            court: mockCourt,
            removalList: [metadata],
            displayError: true,
        };

        responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });
});
