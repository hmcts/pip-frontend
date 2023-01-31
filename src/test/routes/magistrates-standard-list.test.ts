import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import { LocationService } from '../../main/service/locationService';
import fs from 'fs';
import path from 'path';
import { MagistratesStandardListService } from '../../main/service/listManipulation/MagistratesStandardListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/magsStandardList.json'), 'utf-8');
const magsStandardListData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(magsStandardListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(magsStandardListData);
sinon.stub(MagistratesStandardListService.prototype, 'manipulatedMagsStandardListData').resolves(magsStandardListData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

describe('Magistrate Standard List Page', () => {
    describe('on GET', () => {
        test('should return magistrate standard list page', async () => {
            await request(app)
                .get('/magistrates-standard-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
