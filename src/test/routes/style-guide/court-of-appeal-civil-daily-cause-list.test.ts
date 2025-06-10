import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../unit/mocks/courtOfAppealCivilDailyCauseList.json'),
    'utf-8'
);
const rawJson = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'COURT_OF_APPEAL_CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);

describe('Court of Appeal (Civil Division) Daily Cause List Page', () => {
    describe('on GET', () => {
        test('should return Court of Appeal (Civil Division) Daily Cause List page', async () => {
            await request(app)
                .get('/court-of-appeal-civil-daily-cause-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
