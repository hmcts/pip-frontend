import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { IacDailyListService } from '../../../main/service/listManipulation/IacDailyListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/iacDailyList.json'), 'utf-8');
const iacData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

const dailyListMetaData = JSON.parse(rawMetaData)[0];
dailyListMetaData.listType = 'IAC_DAILY_LIST';

const additionalCasesMetadata = JSON.parse(rawMetaData)[0];
additionalCasesMetadata.listType = 'IAC_DAILY_LIST_ADDITIONAL_CASES';

const iacDailyListUrl = '/iac-daily-list';
const iacAdditionalCasesUrl = '/iac-daily-list-additional-cases';

const artefactId = '1234';
const additionalCasesArtefactId = '12345';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(iacData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(artefactId).resolves(dailyListMetaData);
metadataStub.withArgs(additionalCasesArtefactId).resolves(additionalCasesMetadata);

sinon.stub(IacDailyListService.prototype, 'manipulateIacDailyListData').resolves(iacData);

describe.each([iacDailyListUrl, iacAdditionalCasesUrl])('IAC Daily List Page with path %s', url => {
    describe('on GET', () => {
        test('should return IAC list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get(url + '?artefactId=' + (url == iacDailyListUrl ? artefactId : additionalCasesArtefactId))
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
