import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import { LocationService } from '../../main/service/locationService';
import fs from 'fs';
import path from 'path';
import { CivilFamilyAndMixedListService } from '../../main/service/listManipulation/CivilFamilyAndMixedListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/dailyCauseList.json'), 'utf-8');
const dailyReferenceData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(dailyReferenceData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData').resolves(dailyReferenceData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

describe('Daily Cause List Page', () => {
    describe('on GET', () => {
        test('should return daily cause list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/daily-cause-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
