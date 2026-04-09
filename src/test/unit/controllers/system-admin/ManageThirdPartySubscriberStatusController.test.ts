import { Response } from 'express';
import sinon from 'sinon';
import ManageThirdPartySubscriberStatusController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriberStatusController';
import { mockRequest } from '../../mocks/mockRequest';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import { UserManagementService } from '../../../../main/service/UserManagementService';

const controller = new ManageThirdPartySubscriberStatusController();
const i18n = {
    'manage-third-party-subscriber-status': {},
    error: {},
};
const user = { userId: 'admin-user' };
const reqLng = 'en';

describe('ManageThirdPartySubscriberStatusController', () => {
    let getThirdPartyStub: sinon.SinonStub;
    let updateStatusStub: sinon.SinonStub;
    let auditActionStub: sinon.SinonStub;
    let response: Response;

    beforeEach(() => {
        getThirdPartyStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById');
        updateStatusStub = sinon.stub(ThirdPartyService.prototype, 'updateThirdPartySubscriberStatus');
        auditActionStub = sinon.stub(UserManagementService.prototype, 'auditAction').resolves();
        response = {
            render: sinon.stub(),
            redirect: sinon.stub(),
        } as unknown as Response;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render the status page if user is found (GET)', async () => {
        const userDetails = { id: 'user1', name: 'Test User' };
        getThirdPartyStub.resolves(userDetails);
        const req = mockRequest(i18n);
        req.user = user;
        req.query = { userId: 'user1' };
        req.lng = reqLng;
        req.i18n.getDataByLanguage = () => ({ 'manage-third-party-subscriber-status': {}, error: {} });

        await controller.get(req, response);
        sinon.assert.calledOnce(auditActionStub);
        sinon.assert.calledWith(
            response.render as sinon.SinonStub,
            'system-admin/manage-third-party-subscriber-status',
            sinon.match({ userDetails, statusOptions: ['PENDING', 'ACTIVE', 'SUSPENDED'] })
        );
    });

    it('should render error page if user is not found (GET)', async () => {
        getThirdPartyStub.resolves(null);
        const req = mockRequest(i18n);
        req.user = user;
        req.query = { userId: 'user1' };
        req.lng = reqLng;
        req.i18n.getDataByLanguage = () => ({ error: {} });

        await controller.get(req, response);
        sinon.assert.calledOnce(auditActionStub);
        sinon.assert.calledWith(response.render as sinon.SinonStub, 'error', sinon.match.any);
    });

    it('should redirect to success page if status update succeeds (POST)', async () => {
        updateStatusStub.resolves(true);
        const req = mockRequest(i18n);
        req.user = user;
        req.body = { userId: 'user1', status: 'Active' };
        req.lng = reqLng;
        req.i18n.getDataByLanguage = () => ({ error: {} });

        await controller.post(req, response);
        sinon.assert.calledWith(response.redirect as sinon.SinonStub, '/manage-third-party-subscriber-status-success');
    });

    it('should render error page if status update fails (POST)', async () => {
        updateStatusStub.resolves(false);
        const req = mockRequest(i18n);
        req.user = user;
        req.body = { userId: 'user1', status: 'Active' };
        req.lng = reqLng;
        req.i18n.getDataByLanguage = () => ({ error: {} });

        await controller.post(req, response);
        sinon.assert.calledWith(response.render as sinon.SinonStub, 'error', sinon.match.any);
    });
});
