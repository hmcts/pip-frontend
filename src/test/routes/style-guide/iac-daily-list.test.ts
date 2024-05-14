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
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'IAC_DAILY_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(iacData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(IacDailyListService.prototype, 'manipulateIacDailyListData').resolves(iacData);

describe('IAC Daily List Page', () => {
    describe('on GET', () => {
        test('should return IAC daily list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/iac-daily-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
