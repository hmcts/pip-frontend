import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtReferenceDataSuccessController from '../../../main/controllers/DeleteCourtReferenceDataSuccessController';

const deleteCourtReferenceDataSuccessController = new DeleteCourtReferenceDataSuccessController();

const i18n = { 'delete-court-reference-data-success': {} };

describe('Delete Court Reference Data Controller', () => {
    it('should render the court reference data list page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-reference-data-success'],
        };

        responseMock.expects('render').once().withArgs('delete-court-reference-data-success', expectedData);
        return deleteCourtReferenceDataSuccessController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
