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
deleteStub.withArgs('1').resolves({ isExists: true, errorMessage: 'test' });
deleteStub.withArgs('2').resolves(null);
deleteStub.withArgs('3').resolves({ isExists: false, errorMessage: '' });

const i18n = { 'delete-court-reference-data-confirmation': {} };

describe('Delete Court Reference Data Controller', () => {
    it('should render the court reference data page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-reference-data-confirmation'],
            court: court,
            displayError: false,
        };

        responseMock.expects('render').once().withArgs('delete-court-reference-data-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render confirmation page if active artefact or subscription is available', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '1', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-reference-data-confirmation'],
            court: court,
            apiError: true,
            errorMessage: 'test',
        };

        responseMock.expects('render').once().withArgs('delete-court-reference-data-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

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
            ...i18n['delete-court-reference-data-confirmation'],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete the court from reference data',
        };

        responseMock.expects('render').once().withArgs('delete-court-reference-data-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render redirect to success page if court is deleted', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { locationId: '2', 'delete-choice': 'yes' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-reference-data-confirmation'],
            court: court,
            apiError: true,
            errorMessage: 'Unknown error when attempting to delete the court from reference data',
        };

        responseMock.expects('render').once().withArgs('delete-court-reference-data-confirmation', expectedData);
        return deleteCourtReferenceDataConfirmationController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to confirmation page if no option is selected', () => {
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
