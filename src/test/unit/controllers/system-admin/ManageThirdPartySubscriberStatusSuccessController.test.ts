import { Response } from 'express';
import sinon from 'sinon';
import ManageThirdPartySubscriberStatusSuccessController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberStatusSuccessController';
import { mockRequest } from '../../mocks/mockRequest';

describe('ManageThirdPartySubscriberStatusSuccessController', () => {
    it('should render the success page with correct data', () => {
        const controller = new ManageThirdPartySubscriberStatusSuccessController();
        const i18n = {
            'manage-third-party-subscriber-status-success': { title: 'Success', message: 'Status updated.' },
        };
        const req = mockRequest(i18n);
        req.lng = 'en';
        req.i18n.getDataByLanguage = () => i18n;
        const res = { render: sinon.stub() } as unknown as Response;

        controller.get(req, res);

        sinon.assert.calledWith(
            res.render as sinon.SinonStub,
            'system-admin/manage-third-party-subscriber-status-success',
            { title: 'Success', message: 'Status updated.' }
        );
    });
});
