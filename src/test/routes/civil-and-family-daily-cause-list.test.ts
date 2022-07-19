import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { DataManipulationService } from '../../main/service/dataManipulationService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/civilAndFamilyDailyCauseList.json'), 'utf-8');
const civilAndFamilyDailyReferenceData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(civilAndFamilyDailyReferenceData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(civilAndFamilyDailyReferenceData);
sinon.stub(DataManipulationService.prototype, 'manipulatedDailyListData').resolves(civilAndFamilyDailyReferenceData);

describe('Civil and Family Daily Cause List Page', () => {
  describe('on GET', () => {
    test('should return civil and family daily cause list page', () => {
      app.request['user'] = {piUserId: '2'};
      request(app)
        .get('/civil-and-family-daily-cause-list?artefactId=test')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
