import { Response } from 'express';
import { LocationService } from '../../../main/service/locationService';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtReferenceDataConfirmationController from '../../../main/controllers/DeleteCourtReferenceDataConfirmationController';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationByName');
const deleteStub = sinon.stub(LocationService.prototype, 'deleteLocationById');

const deleteCourtReferenceDataConfirmationController = new DeleteCourtReferenceDataConfirmationController();

const court = { locationId: 1, jurisdiction: 'test', region: 'test' };
sinon.stub(LocationService.prototype, 'formatCourtValue').returns(court);
courtStub.withArgs('1').resolves(court);
deleteStub.withArgs('1').resolves({ exists: true, errorMessage: 'test' });
deleteStub.withArgs('2').resolves(null);
deleteStub.withArgs('3').resolves({ exists: false, errorMessage: '' });

const pageName = 'delete-court-reference-data-confirmation';

describe('Delete Court Reference Data Controller', () => {
    it('should render the court reference data page', () => {
        const i18n = { pageName: {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.path = '/' + pageName;
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n[pageName],
            court: court,
            displayError: false,
        };
        responseMock.expects('render').once().withArgs(pageName, expectedData);
        return deleteCourtReferenceDataConfirmationController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the court subscription data page', () => {
        const i18n = { 'delete-court-subscription-confirmation': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.path = '/delete-court-subscription-confirmation';
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-subscription-confirmation'],
            court: court,
            displayError: false,
        };
        responseMock.expects('render').once().withArgs('delete-court-subscription-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the court publication data page', () => {
        const i18n = { 'delete-court-publication-confirmation': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.path = '/delete-court-publication-confirmation';
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-publication-confirmation'],
            court: court,
            displayError: false,
        };
        responseMock.expects('render').once().withArgs('delete-court-publication-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the court subscription deletion data page', () => {
        const i18n = { 'delete-court-subscription-confirmation': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.path = '/delete-court-subscription-confirmation';
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-subscription-confirmation'],
            court: court,
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('delete-court-subscription-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render confirmation page if active artefact or subscription is available', () => {
        const i18n = { pageName: {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n[pageName],
            court: court,
            apiError: true,
            errorMessage: 'test',
        };

        responseMock.expects('render').once().withArgs(pageName, expectedData);
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render confirmation page if unexpected error occurred', () => {
        const i18n = { pageName: {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '2', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n[pageName],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete the court from reference data',
        };

        responseMock.expects('render').once().withArgs(pageName, expectedData);
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render redirect to success page if court is deleted', () => {
        const i18n = { pageName: {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '2', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n[pageName],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete the court from reference data',
        };

        responseMock.expects('render').once().withArgs(pageName, expectedData);
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to confirmation page if no option is selected', () => {
        const i18n = { pageName: {} };
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '3', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/delete-court-reference-data-success');
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render delete court reference data when No is selected', () => {
        const i18n = { pageName: {} };
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'no' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('/delete-court-reference-data');
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
