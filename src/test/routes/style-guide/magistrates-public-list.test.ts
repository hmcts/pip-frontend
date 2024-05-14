import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';
import { CrimeListsService } from '../../../main/service/listManipulation/CrimeListsService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/magistratesPublicList.json'), 'utf-8');
const crownDailyData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'MAGISTRATES_PUBLIC_LIST';
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(crownDailyData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(CrimeListsService.prototype, 'manipulateCrimeListData').resolves(crownDailyData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

describe('Magistrates Public List Page', () => {
    describe('on GET', () => {
        test('should return magistrates public list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/magistrates-public-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
