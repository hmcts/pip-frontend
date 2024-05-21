import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { CopDailyListService } from '../../../main/service/listManipulation/CopDailyListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/copDailyCauseList.json'), 'utf-8');
const copData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'COP_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(copData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(CopDailyListService.prototype, 'manipulateCopDailyCauseList').resolves(copData);

describe('Cop Daily Cause List Page', () => {
    describe('on GET', () => {
        test('should return cop daily cause list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/cop-daily-cause-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
