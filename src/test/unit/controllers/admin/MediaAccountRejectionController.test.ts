import { expect } from 'chai';
import sinon from 'sinon';
import MediaAccountRejectionController from '../../../../main/controllers/admin/MediaAccountRejectionController';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';
import { UserManagementService } from '../../../../main/service/UserManagementService';
import { v4 as uuidv4 } from 'uuid';

describe('MediaAccountRejectionController', () => {
    const applicantId = uuidv4();

    // @ts-ignore: otherwise starts a whole chain of things
    let controller;
    // eslint-disable-next-line prefer-const
    controller = new MediaAccountRejectionController();
    const applicantData = {
        id: applicantId,
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.jpg',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    afterEach(() => {
        sinon.restore();
    });

    describe('#get()', () => {
        it('should render media-account-rejection view when applicant data is found', async () => {
            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
            const req = {
                body: {
                    reasons: 'noMatch',
                    applicantId: applicantId,
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ admin: { 'media-account-rejection': {} } }),
                },
                lng: 'en',
            };
            const res = {
                render: sinon.spy(),
            };

            appIdAndStatus.withArgs(applicantId, 'PENDING').resolves(applicantData);

            await controller.get(req, res);

            expect(res.render.calledWith('admin/media-account-rejection')).to.be.true;
        });

        it('should render error view when applicant data is not found', async () => {
            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
            const req = {
                body: {
                    reasons: 'Some reasons',
                    applicantId: applicantId,
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ error: {} }),
                },
                lng: 'en',
            };
            const res = {
                render: sinon.spy(),
            };

            appIdAndStatus.resolves(null);

            await controller.get(req, res);

            expect(res.render.calledWith('error')).to.be.true;
        });
    });

    describe('#post()', () => {
        it('should render error view when applicant data is not found', async () => {
            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
            const req = {
                query: {
                    applicantId: applicantId,
                },
                body: {
                    'reject-confirmation': 'Yes',
                    reasons: 'noMatch, expired',
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ error: {} }),
                },
                lng: 'en',
            };
            const res = {
                render: sinon.spy(),
            };

            appIdAndStatus.resolves(null);

            await controller.post(req, res);

            expect(res.render.calledWith('error')).to.be.true;
        });
        it('should redirect to media-account-review when rejected is No', async () => {
            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');

            const req = {
                query: {
                    applicantId: applicantId,
                },
                body: {
                    'reject-confirmation': 'No',
                    reasons: 'Some reasons',
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({}),
                },
                lng: 'en',
            };
            const res = {
                redirect: sinon.spy(),
            };
            const applicantData = { id: applicantId, status: 'PENDING' };

            appIdAndStatus.withArgs(applicantId, 'PENDING').resolves(applicantData);
            await controller.post(req, res);

            expect(res.redirect.calledWith('/media-account-review?applicantId=' + applicantId)).to.be.true;
        });
        it('should render media-account-rejection view with displayRadioError when rejected is not provided', async () => {
            const req = {
                query: {
                    applicantId: applicantId,
                },
                body: {
                    'reject-confirmation': undefined,
                    reasons: 'Some reasons',
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ admin: { 'media-account-rejection': {} } }),
                },
                lng: 'en',
            };
            const res = {
                render: sinon.spy(),
            };
            const applicantData = { id: applicantId, status: 'PENDING' };

            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
            appIdAndStatus.withArgs(applicantId, 'PENDING').resolves(applicantData);

            await controller.post(req, res);

            expect(res.render.calledWith('admin/media-account-rejection', sinon.match.has('displayRadioError', true)))
                .to.be.true;
        });
        it('should render media-account-rejection-confirmation view when rejected is Yes and the application is rejected successfully', async () => {
            const req = {
                query: {
                    applicantId: applicantId,
                },
                body: {
                    'reject-confirmation': 'Yes',
                    reasons: 'noMatch,expired',
                },
                i18n: {
                    getDataByLanguage: sinon
                        .stub()
                        .returns({ admin: { admin: { 'media-account-rejection-confirmation': {} } } }),
                },
                lng: 'en',
                user: {
                    userId: '456',
                },
            };
            const res = {
                render: sinon.spy(),
            };
            const applicantData = { id: applicantId, status: 'PENDING' };
            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
            const rejectAppStub = sinon.stub(MediaAccountApplicationService.prototype, 'rejectApplication');
            const userManStub = sinon.stub(UserManagementService.prototype, 'auditAction');
            userManStub.resolves();
            appIdAndStatus.resolves(applicantData);
            rejectAppStub.resolves(true);

            await controller.post(req, res);

            expect(res.render.calledWith('admin/media-account-rejection-confirmation')).to.be.true;
            expect(
                userManStub.calledWith(
                    req.user,
                    'REJECT_MEDIA_APPLICATION',
                    `Media application with id ${applicantId} rejected`
                )
            ).to.be.true;
        });
        it('should render error view when rejected is Yes and the application rejection fails', async () => {
            const req = {
                query: {
                    applicantId: applicantId,
                },
                body: {
                    'reject-confirmation': 'Yes',
                    reasons: 'expired,noMatch',
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ error: {} }),
                },
                lng: 'en',
                user: {
                    userId: '456',
                },
            };
            const res = {
                render: sinon.spy(),
            };
            const applicantData = { id: applicantId, status: 'PENDING' };

            const appIdAndStatus = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
            const rejectAppStub = sinon.stub(MediaAccountApplicationService.prototype, 'rejectApplication');
            appIdAndStatus.resolves(applicantData);
            rejectAppStub.resolves(false);
            await controller.post(req, res);

            expect(res.render.calledWith('error')).to.be.true;
        });

        it('should render error view when invalid applicant ID provided', async () => {
            const req = {
                query: {
                    applicantId: 'abcd',
                },
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ error: {} }),
                },
                lng: 'en',
                user: {
                    userId: '456',
                },
            };
            const res = {
                render: sinon.spy(),
            };

            await controller.post(req, res);
            expect(res.render.calledWith('error')).to.be.true;
        });

        it('should render error view when no applicant ID provided', async () => {
            const req = {
                i18n: {
                    getDataByLanguage: sinon.stub().returns({ error: {} }),
                },
                lng: 'en',
                user: {
                    userId: '456',
                },
            };
            const res = {
                render: sinon.spy(),
            };

            await controller.post(req, res);
            expect(res.render.calledWith('error')).to.be.true;
        });
    });
});
