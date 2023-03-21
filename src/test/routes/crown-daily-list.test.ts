import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import { LocationService } from '../../main/service/locationService';
import fs from 'fs';
import path from 'path';
import { CrimeListsService } from '../../main/service/listManipulation/CrimeListsService';
import { CivilFamilyAndMixedListService } from '../../main/service/listManipulation/CivilFamilyAndMixedListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/crownDailyList.json'), 'utf-8');
const crownDailyData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(crownDailyData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(crownDailyData);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData').resolves(crownDailyData);
sinon.stub(CrimeListsService.prototype, 'manipulateCrimeListData').resolves(crownDailyData);
sinon.stub(CrimeListsService.prototype, 'findUnallocatedCasesInCrownDailyListData').resolves(crownDailyData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

describe('Crown Daily List Page', () => {
    describe('on GET', () => {
        test('should return crown daily list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-daily-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
