import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import sinon from 'sinon';
import { DownloadMiReportService } from '../../../main/service/DownloadMiReportService';

const PAGE_URL = '/download-mi-report';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Download MI report page', () => {
    describe('on GET', () => {
        test('should render download MI report page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should download MI report', async () => {
            sinon.stub(DownloadMiReportService.prototype, 'generateUserAccountsMiData').resolves({
                fileName: 'test.csv',
                buffer: Buffer.from('test'),
            });

            await request(app)
                .post(PAGE_URL)
                .send({
                    reportType: 'USER_ACCOUNTS',
                })
                .expect(200)
                .expect('Content-Type', /text\/csv/)
                .expect('Content-Disposition', /attachment/);
        });
    });
});
