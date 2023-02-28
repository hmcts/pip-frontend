import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { SjpPublicListService } from '../../main/service/listManipulation/SjpPublicListService';
import { SjpFilterService } from '../../main/service/sjpFilterService';

const mockJSON = JSON.parse(
    '{"artefactId": "664959fd-80ba-4dcc-ab92-38c5056327b6","provenance": "HellSJP","sourceArtefactId": "Ball4.json","type": "LIST","sensitivity": "PUBLIC","language": "ENGLISH","search": {},"displayFrom": "2022-01-28T18:29:18.298","displayTo": "2022-03-28T18:29:18.297","listType": "SJP_PUBLIC_LIST","locationId": "0","contentDate": "2022-02-15T18:29:18.29","isFlatFile": false,"payload": "https://pipsssastg.blob.core.windows.net/artefact/Ball4.json-HellSJP"}'
);
const mockSJPPublic = fs.readFileSync(path.resolve('src/test/unit/mocks/SJPMockPage.json'), 'utf-8');
sinon.stub(PublicationService.prototype, 'getIndividualPublicationFile').resolves(mockJSON);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockJSON);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(JSON.parse(mockSJPPublic));
sinon.stub(SjpPublicListService.prototype, 'formatSjpPublicList').resolves([]);

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

describe('Single Justice Procedure Public List', () => {
    describe('on GET', () => {
        test('should return list publication', async () => {
            await request(app)
                .get('/sjp-public-list?artefactId=0')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to Single Justice Procedure public page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .post('/sjp-public-list?artefactId=test&filterValues=AA1')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).contains('sjp-public-list');
                });
        });
    });
});
