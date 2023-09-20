import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { describe } from '@jest/globals';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { SjpPressListService } from '../../main/service/listManipulation/SjpPressListService';
import { SjpFilterService } from '../../main/service/sjpFilterService';

const sjpPressFullListUrl = '/sjp-press-list';
const sjpPressNewCasesUrl = '/sjp-press-list-new-cases';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/sjp-press-list.json'), 'utf-8');
const sjpPressData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpPressFullList = JSON.parse(rawMetaData)[0];
metaDataSjpPressFullList.listType = 'SJP_PRESS_LIST';

const metaDataSjpPressNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpPressNewCases.listType = 'SJP_DELTA_PRESS_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(sjpPressData);
sinon.stub(SjpPressListService.prototype, 'formatSJPPressList').resolves([]);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpPressFullListUrl).returns(metaDataSjpPressFullList);
metadataStub.withArgs(sjpPressNewCasesUrl).returns(metaDataSjpPressNewCases);

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("Single Justice Procedure Press page with path '%s'", url => {
    describe('on GET', () => {
        test('should return Single Justice Procedure Press page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get(url + '?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to Single Justice Procedure Press page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .post(url + '?artefactId=test&filterValues=AA1')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).contains('sjp-press-list');
                });
        });
    });
});
