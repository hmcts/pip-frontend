import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { MediaAccountApplicationService } from '../../../main/service/MediaAccountApplicationService';
import sinon from 'sinon';
import { request as expressRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

describe('Media Account Rejection Reasons', () => {
    const applicationID = uuidv4();

    const dummyApplication = {
        id: applicationID,
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

    getApplicationByIdStub.withArgs(applicationID, 'PENDING').resolves(dummyApplication);

    describe('on view approval', () => {
        test('should return the media account rejection reasons page', async () => {
            await request(app)
                .get('/media-account-rejection-reasons?applicantId=' + applicationID)
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Why are you rejecting this application?');
                });
        });
    });

    describe('on submit approval', () => {
        test('should return same page when no options provided', async () => {
            await request(app)
                .post('/media-account-rejection-reasons?applicantId=' + applicationID)
                .send({ })
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Why are you rejecting this application?');
                });
        });

        test('should return success when approval is reject', async () => {
            await request(app)
                .post('/media-account-rejection-reasons?applicantId=' + applicationID)
                .send({ 'rejection-reasons': 'reasons', 'applicantId': '1234' })
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Are you sure you want to reject this application?');
                });
        });

        test('should return error when no body is supplied', async () => {
            await request(app)
                .post('/media-account-rejection-reasons?applicantId=' + applicationID)
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Why are you rejecting this application?');
                });
        });
    });
});
