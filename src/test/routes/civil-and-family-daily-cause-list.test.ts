import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import { LocationService } from '../../main/service/locationService';
import fs from 'fs';
import path from 'path';
import { CivilFamilyAndMixedListService } from '../../main/service/listManipulation/CivilFamilyAndMixedListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/civilAndFamilyDailyCauseList.json'), 'utf-8');
const civilAndFamilyDailyReferenceData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(civilAndFamilyDailyReferenceData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon
    .stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData')
    .resolves(civilAndFamilyDailyReferenceData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

describe('Civil and Family Daily Cause List Page', () => {
    describe('on GET', () => {
        test('should return civil and family daily cause list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/civil-and-family-daily-cause-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
