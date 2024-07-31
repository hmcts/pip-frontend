import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { SjpPublicListService } from '../../../main/service/listManipulation/SjpPublicListService';
import { v4 as uuidv4 } from 'uuid';

const sjpFullListUrl = '/sjp-public-list';
const sjpNewCasesUrl = '/sjp-public-list-new-cases';

const sjpFullListArtefactId = uuidv4();
const sjpNewCasesArtefactId = uuidv4();

const mockSJPPublic = fs.readFileSync(path.resolve('src/test/unit/mocks/sjp/minimalSjpPublicList.json'), 'utf-8');
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpFullList = JSON.parse(rawMetaData)[0];
metaDataSjpFullList.listType = 'SJP_PUBLIC_LIST';

const metaDataSjpNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpNewCases.listType = 'SJP_DELTA_PUBLIC_LIST';

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpFullListArtefactId).resolves(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesArtefactId).resolves(metaDataSjpNewCases);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(JSON.parse(mockSJPPublic));
sinon.stub(SjpPublicListService.prototype, 'formatSjpPublicList').resolves([]);

const sjpResourceMap = new Map<string, any>([
    [sjpFullListUrl, { artefactId: sjpFullListArtefactId }],
    [sjpNewCasesUrl, { artefactId: sjpNewCasesArtefactId }],
]);

describe.each([sjpFullListUrl, sjpNewCasesUrl])("Single Justice Procedure Public page with path '%s'", url => {
    const sjpResource = sjpResourceMap.get(url);

    describe('on GET', () => {
        test('should return list publication', async () => {
            await request(app)
                .get(`${url}?artefactId=` + sjpResource['artefactId'])
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to Single Justice Procedure public page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .post(`${url}?artefactId=${sjpResource['artefactId']}&filterValues=AA1`)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).contains(url.substring(1));
                });
        });
    });
});
