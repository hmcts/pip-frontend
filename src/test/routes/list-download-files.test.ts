import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ListDownloadService } from '../../main/service/listDownloadService';

const PAGE_URL = '/list-download-files?artefactId=123';
expressRequest['user'] = { roles: 'VERIFIED' };

describe('List download files', () => {
    sinon.stub(ListDownloadService.prototype, 'generateFiles').resolves({});
    sinon.stub(ListDownloadService.prototype, 'getFileSize').returns('100KB');

    describe('on GET', () => {
        test('should render list download files page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
