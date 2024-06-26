import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { TribunalNationalListsService } from '../../../main/service/listManipulation/TribunalNationalListsService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/primaryHealthList.json'), 'utf-8');
const primaryHealthListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'PRIMARY_HEALTH_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(primaryHealthListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(TribunalNationalListsService.prototype, 'manipulateData').resolves(primaryHealthListData);

describe('Primary Health List Page', () => {
    describe('on GET', () => {
        test('should return primary health list page', async () => {
            await request(app)
                .get('/primary-health-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
