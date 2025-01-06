import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/grcWeeklyHearingList.json'), 'utf-8');
const rawJson = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'GRC_WEEKLY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);

describe('GRC Weekly Hearing List Page', () => {
    describe('on GET', () => {
        test('should return GRC weekly hearing list page', async () => {
            await request(app)
                .get('/grc-weekly-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
