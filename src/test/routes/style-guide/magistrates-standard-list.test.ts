import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';
import { MagistratesStandardListService } from '../../../main/service/listManipulation/MagistratesStandardListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/magistratesStandardList.json'), 'utf-8');
const magsStandardListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'MAGISTRATES_STANDARD_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(magsStandardListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(MagistratesStandardListService.prototype, 'manipulateData').resolves(magsStandardListData);
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
