import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { MediaAccountApplicationService } from '../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import { dummyApplication } from '../helpers/testConsts';
import { request as expressRequest } from 'express';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

describe('Media Account Review Pages', () => {
    const applicationID = '1234';
    const imageID = '12345';

    const getApplicationByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
    const getImageByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getImageById');

    getApplicationByIdStub.withArgs(applicationID).resolves(dummyApplication);
    getImageByIdStub.withArgs(imageID).resolves('1234.jpg');

    describe('on GET', () => {
        test('should return the media account review page', async () => {
            await request(app)
                .get('/media-account-review?applicantId=' + applicationID)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on Approve', () => {
        test('should return the admin-media-account-approval page', async () => {
            await request(app)
                .post('/media-account-review/approve')
                .send({ applicantId: applicationID })
                .expect(res => expect(res.status).to.equal(302));
        });
    });

    describe('on Reject', () => {
        test('should return the admin-media-account-rejection page', async () => {
            await request(app)
                .post('/media-account-review/reject')
                .send({ applicantId: applicationID })
                .expect(res => expect(res.status).to.equal(302));
        });
    });

    describe('on View Image', () => {
        test('should return the image page', async () => {
            await request(app)
                .get('/media-account-review/image?imageId=' + imageID)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
