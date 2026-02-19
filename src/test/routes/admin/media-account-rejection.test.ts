import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MediaAccountApplicationService } from '../../../main/service/MediaAccountApplicationService';
import sinon from 'sinon';
import { UserManagementService } from '../../../main/service/UserManagementService';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
const applicationIDNotFound = uuidv4();
const applicationIDFound = uuidv4();
const applicationIDRejectionFails = uuidv4();

const getApplicationByIdStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
getApplicationByIdStub.withArgs(applicationIDFound).resolves({});
getApplicationByIdStub.withArgs(applicationIDRejectionFails).resolves({});
getApplicationByIdStub.withArgs(applicationIDNotFound).resolves(undefined);

const rejectionStub = sinon.stub(MediaAccountApplicationService.prototype, 'rejectApplication');
rejectionStub.withArgs(applicationIDFound).resolves(true);
rejectionStub.withArgs(applicationIDRejectionFails).resolves(undefined);

sinon.stub(UserManagementService.prototype, 'auditAction');

describe('Media Account Rejection', () => {
    test('Should render media account rejection page if no response provided', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=' + applicationIDFound)
            .send({ reasons: '' })
            .expect(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contain('Are you sure you want to reject this application?');
            });
    });

    test('Should redirect to media account review page if response is No', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=' + applicationIDFound)
            .send({ reasons: '', 'reject-confirmation': 'No' })
            .expect(res => {
                expect(res.status).to.equal(302);
                expect(res.header['location']).to.contain('media-account-review');
            });
    });

    test('Should render media account rejection confirmation if Yes', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=' + applicationIDFound)
            .send({ reasons: 'notMedia', 'reject-confirmation': 'Yes' })
            .expect(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contain('Account has been rejected');
            });
    });

    test('Should render error page if Yes but rejection fails', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=' + applicationIDRejectionFails)
            .send({ reasons: 'notMedia', 'reject-confirmation': 'Yes' })
            .expect(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contain('Sorry, there is a problem');
            });
    });

    test('Should render error page if unknown applicantId is provided', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=' + applicationIDNotFound)
            .send({})
            .expect(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contain('Sorry, there is a problem');
            });
    });

    test('Should render error page if invalid applicantId provided', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=1234')
            .send({})
            .expect(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contain('Sorry, there is a problem');
            });
    });

    test('Should render error page when no body provided', async () => {
        await request(app)
            .post('/media-account-rejection?applicantId=' + applicationIDFound)
            .expect(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contain('Sorry, there is a problem');
            });
    });
});
