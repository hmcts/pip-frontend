import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../unit/mocks/utLandsChamberDailyHearingList.json'),
    'utf-8'
);
const rawJson = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Upper Tribunal (Lands Chamber) Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'UT_LC_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return Upper Tribunal (Lands Chamber) daily hearing list page', async () => {
            await request(app)
                .get('/ut-lc-daily-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
