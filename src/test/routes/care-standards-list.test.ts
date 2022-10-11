import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { PrimaryHealthListService } from '../../main/service/listManipulation/primaryHealthListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/careStandardsList.json'), 'utf-8');
const careStandardsListData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(careStandardsListData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(careStandardsListData);
sinon.stub(PrimaryHealthListService.prototype, 'manipulateData').resolves(careStandardsListData);

describe('Care Standards List List Page', () => {
  describe('on GET', () => {
    test('should return case standards list page', async () => {
      app.request['user'] = {piUserId: '2'};
      await request(app)
        .get('/case-standards-list?artefactId=test')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});

