import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { MediaAccountApplicationService } from '../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

describe('Media Account Approval', () => {
    const applicationID = '1234';

    const dummyApplication = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const getApplicationByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
    const createAccountStub = sinon.stub(MediaAccountApplicationService.prototype, 'createAccountFromApplication');

    getApplicationByIdStub.withArgs(applicationID, 'PENDING').resolves(dummyApplication);
    createAccountStub.withArgs(applicationID, null).resolves(dummyApplication);

    describe('on view approval', () => {
        test('should return the media account approval page', async () => {
            await request(app)
                .get('/media-account-approval?applicantId=' + applicationID)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on submit approval', () => {
        test('should return success when approval is accept', async () => {
            await request(app)
                .post('/media-account-approval?applicantId=' + applicationID)
                .send({ approval: 'Yes' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return success when approval is reject', async () => {
            await request(app)
                .post('/media-account-approval?applicantId=' + applicationID)
                .send({ approval: 'No' })
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
