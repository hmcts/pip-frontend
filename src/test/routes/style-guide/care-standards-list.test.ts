import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { TribunalNationalListsService } from '../../../main/service/listManipulation/TribunalNationalListsService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/careStandardsList.json'), 'utf-8');
const careStandardsListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CARE_STANDARDS_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(careStandardsListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metaData);
sinon.stub(TribunalNationalListsService.prototype, 'manipulateData').resolves(careStandardsListData);

describe('Care Standards List List Page', () => {
    describe('on GET', () => {
        test('should return care standards list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/care-standards-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
