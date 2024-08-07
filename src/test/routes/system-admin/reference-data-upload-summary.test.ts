import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { ManualUploadService } from '../../../main/service/ManualUploadService';
import { FileHandlingService } from '../../../main/service/FileHandlingService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/reference-data-upload-summary';
const mockCookie = { foo: 'blah' };
const successCookie = { cookie: 'cookie' };

const uploadStub = sinon.stub(ManualUploadService.prototype, 'uploadLocationDataPublication');
sinon.stub(FileHandlingService.prototype, 'readFileFromRedis').resolves('');
sinon.stub(FileHandlingService.prototype, 'removeFileFromRedis').resolves('').resolves('');
sinon.stub(ManualUploadService.prototype, 'getListItemName').returns('');
uploadStub.withArgs({ ...successCookie, file: '' }).resolves(true);
uploadStub.withArgs({ ...mockCookie, file: '' }).resolves(false);

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Reference data Manual upload summary', () => {
    beforeEach(() => {
        app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
        app.request['cookies'] = { formCookie: JSON.stringify(mockCookie) };
    });

    describe('on GET', () => {
        test('should return reference data manual upload summary page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return location data manual upload summary page with error summary', async () => {
            await request(app)
                .get(`${PAGE_URL}?query=true`)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return summary page if query param is check', async () => {
            app['file'] = 'arguments';
            await request(app)
                .post(`${PAGE_URL}?check=true`)
                .send({ data: 'valid' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return summary page if upload fails', async () => {
            app.request['user'] = { roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post(PAGE_URL)
                .send({ data: 'invalid' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to location data upload success page', async () => {
            app.request['cookies'] = { formCookie: JSON.stringify(successCookie) };
            app['file'] = 'arguments';
            await request(app)
                .post(PAGE_URL)
                .send({ data: 'valid' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('reference-data-upload-confirmation');
                });
        });
    });
});
