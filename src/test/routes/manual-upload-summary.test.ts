import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { ManualUploadService } from '../../main/service/manualUploadService';
import { FileHandlingService } from '../../main/service/fileHandlingService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/manual-upload-summary';
const mockCookie = {
    foo: 'blah',
    listType: '',
    'display-from': '01/07/2022 00:00:01',
    'display-to': '01/07/2022 23:59:59',
    'content-date-from': '01/06/2022 10:00:00',
};
const uploadStub = sinon.stub(ManualUploadService.prototype, 'uploadPublication');
sinon.stub(FileHandlingService.prototype, 'readFileFromRedis').resolves('');
sinon.stub(FileHandlingService.prototype, 'removeFileFromRedis').resolves('').resolves('');
sinon.stub(ManualUploadService.prototype, 'getListItemName').returns('');
uploadStub.withArgs({ ...mockCookie, listTypeName: '', file: '', userEmail: 'test@email.com' }, true).resolves(true);
uploadStub.withArgs({ ...mockCookie, listTypeName: '', file: '', userEmail: '2@email.com' }, true).resolves(false);

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Manual upload summary', () => {
    beforeEach(() => {
        app.request['user'] = { email: 'test@email.com', roles: 'SYSTEM_ADMIN' };
        app.request['cookies'] = { formCookie: JSON.stringify(mockCookie) };
    });

    describe('on GET', () => {
        test('should return file upload summary page', async () => {
            console.log('app', app.request);
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return file upload summary page with error summary', async () => {
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
            app.request['user'] = { email: '2@email.com', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post(PAGE_URL)
                .send({ data: 'invalid' })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to upload success page', async () => {
            app['file'] = 'arguments';
            await request(app)
                .post(PAGE_URL)
                .send({ data: 'valid' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('upload-confirmation');
                });
        });
    });
});
