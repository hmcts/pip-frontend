import BulkCreateMediaAccountsConfirmedController from '../../../../main/controllers/system-admin/BulkCreateMediaAccountsConfirmedController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';

const bulkCreateMediaAccountsConfirmedController = new BulkCreateMediaAccountsConfirmedController();
const i18n = {
    'bulk-create-media-accounts-confirmed': {},
};
const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

describe('Bulk Create Media Accounts Confirmed Controller', () => {
    describe('GET request', () => {
        it('should render the bulk create media accounts confirmed page', () => {
            const responseMock = sinon.mock(response);
            const request = mockRequest(i18n);

            responseMock
                .expects('render')
                .once()
                .withArgs(
                    'system-admin/bulk-create-media-accounts-confirmed',
                    i18n['bulk-create-media-accounts-confirmed']
                );

            bulkCreateMediaAccountsConfirmedController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
