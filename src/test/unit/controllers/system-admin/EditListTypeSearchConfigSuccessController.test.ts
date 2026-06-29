import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import EditListTypeSearchConfigSuccessController from '../../../../main/controllers/system-admin/EditListTypeSearchConfigSuccessController';

const editListTypeSearchConfigSuccessController = new EditListTypeSearchConfigSuccessController();

const i18n = {
    'edit-list-type-search-config-success': {},
};

describe('Edit List Type Search Config Success Controller', () => {
    it('should render the edit list type search config success page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs(
                'system-admin/edit-list-type-search-config-success',
                i18n['edit-list-type-search-config-success']
            );

        editListTypeSearchConfigSuccessController.get(request, response);
        responseMock.verify();
    });
});
