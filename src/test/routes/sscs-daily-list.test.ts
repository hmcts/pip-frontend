import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { describe } from '@jest/globals';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { SscsDailyListService } from '../../main/service/listManipulation/SscsDailyListService';

const userId = '2';
const sscDailyListUrl = '/sscs-daily-list';
const sscDailyListAdditionalHearingsUrl = '/sscs-daily-list-additional-hearings';
const artefactIdMap = new Map<string, string>([
    [sscDailyListUrl, 'abc'],
    [sscDailyListAdditionalHearingsUrl, 'def'],
]);

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/sscsDailyList.json'), 'utf-8');
const sscsData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSscs = JSON.parse(rawMetaData)[0];
metaDataSscs.listType = 'SSCS_DAILY_LIST';

const metaDataSscsAdditionalHearings = JSON.parse(rawMetaData)[0];
metaDataSscsAdditionalHearings.listType = 'SSCS_DAILY_LIST_ADDITIONAL_HEARINGS';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(sscsData);
sinon.stub(SscsDailyListService.prototype, 'manipulateSscsDailyListData').resolves(sscsData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(artefactIdMap.get(sscDailyListUrl), userId).returns(metaDataSscs);
metadataStub
    .withArgs(artefactIdMap.get(sscDailyListAdditionalHearingsUrl), userId)
    .returns(metaDataSscsAdditionalHearings);

describe.each([sscDailyListUrl, sscDailyListAdditionalHearingsUrl])("Sscs Daily List Page with path '%s'", url => {
    describe('on GET', () => {
        test('should return sscs daily list page', async () => {
            app.request['user'] = { userId: userId };
            await request(app)
                .get(url + '?artefactId=' + artefactIdMap.get(url))
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
