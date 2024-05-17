import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import RemoveListConfirmationController from '../../../main/controllers/RemoveListConfirmationController';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';

const adminUserId = '1234-1234-1234-1234';

const mockArtefact = {
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    listTypeName: 'Civil Daily Cause List',
    contentDate: '2022-03-24T07:36:35',
    locationId: '5',
    artefactId: 'valid-artefact',
    dateRange: 'Invalid DateTime to Invalid DateTime',
    contDate: '24 Mar 2022',
};
const mockArtefactsArray = [
    {
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        listTypeName: 'Civil Daily Cause List',
        contentDate: '2022-03-24T07:36:35',
        locationId: '5',
        artefactId: 'valid-artefact',
        dateRange: 'Invalid DateTime to Invalid DateTime',
        contDate: '24 Mar 2022',
    },
    {
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        listTypeName: 'Civil And Family Daily Cause List',
        contentDate: '2022-03-24T07:36:35',
        locationId: '5',
        artefactId: 'valid-artefact',
        dateRange: 'Invalid DateTime to Invalid DateTime',
        contDate: '24 Mar 2022',
    },
    {
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        listTypeName: 'IAC Daily List',
        contentDate: '2022-03-24T07:36:35',
        locationId: '5',
        artefactId: 'valid-artefact',
        dateRange: 'Invalid DateTime to Invalid DateTime',
        contDate: '24 Mar 2022',
    },
];

const formData = {
    courtLists: mockArtefactsArray,
    locationId: '5',
};
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
} as unknown as Response;
const request = mockRequest(i18n);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefact);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(mockCourt);
const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
removePublicationStub.withArgs('valid-artefact', adminUserId).resolves(true);
removePublicationStub.withArgs('foo', adminUserId).resolves(false);

describe('Remove List Confirmation Controller', () => {
    it('should render remove list confirmation page', async () => {
        request['cookies'] = { formCookie: JSON.stringify(formData) };
        request.user = { userId: adminUserId };

        const responseMock = sinon.mock(response);

        const expectedOptions = {
            ...i18n['remove-list-confirmation'],
            removalList: mockArtefactsArray,
            locationId: '5',
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
        await removeListConfirmationController.get(request, response);
        await responseMock.verify();
    });

    it('should redirect to remove list success page if remove choice is yes', async () => {
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request.user = { userId: adminUserId };
        request.body = {
            'remove-choice': 'yes',
            artefactIds: 'valid-artefact',
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
            artefactIds: 'foo',
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
            artefactIds: 'valid-artefact',
        };
        const expectedOptions = {
            ...i18n['remove-list-confirmation'],
            court: mockCourt,
            removalList: [mockArtefact],
            displayError: true,
        };

        responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
        await removeListConfirmationController.post(request, response);
        await responseMock.verify();
    });
});
