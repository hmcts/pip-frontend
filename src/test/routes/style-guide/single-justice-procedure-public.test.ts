import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { SjpPublicListService } from '../../../main/service/listManipulation/SjpPublicListService';
import { SjpFilterService } from '../../../main/service/SjpFilterService';

const sjpFullListUrl = '/sjp-public-list';
const sjpNewCasesUrl = '/sjp-public-list-new-cases';

const mockSJPPublic = fs.readFileSync(path.resolve('src/test/unit/mocks/sjp-public-list.json'), 'utf-8');
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpFullList = JSON.parse(rawMetaData)[0];
metaDataSjpFullList.listType = 'SJP_PUBLIC_LIST';

const metaDataSjpNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpNewCases.listType = 'SJP_DELTA_PUBLIC_LIST';

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpFullListUrl).resolves(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesUrl).resolves(metaDataSjpNewCases);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(JSON.parse(mockSJPPublic));
sinon.stub(SjpPublicListService.prototype, 'formatSjpPublicList').resolves([]);

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

describe.each([sjpFullListUrl, sjpNewCasesUrl])("Single Justice Procedure Public page with path '%s'", url => {
    describe('on GET', () => {
        test('should return list publication', async () => {
            await request(app)
                .get(`${url}?artefactId=0`)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to Single Justice Procedure public page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .post(`${url}?artefactId=test&filterValues=AA1`)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).contains('sjp-public-list');
                });
        });
    });
});
