import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../main/service/publicationService';
import { AccountManagementRequests } from '../../main/resources/requests/accountManagementRequests';
import { ListDownloadService } from '../../main/service/listDownloadService';

const PAGE_URL = '/list-download-files?artefactId=123';
expressRequest['user'] = { roles: 'VERIFIED' };

const mockArtefact = {
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

describe('List download files', () => {
    sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefact);
    sinon.stub(AccountManagementRequests.prototype, 'isAuthorised').resolves(true);
    sinon.stub(ListDownloadService.prototype, 'getFile').resolves('abc');
    sinon.stub(ListDownloadService.prototype, 'getFileSize').returns('100KB');

    describe('on GET', () => {
        test('should render list download files page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
