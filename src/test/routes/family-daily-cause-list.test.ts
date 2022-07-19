import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { DataManipulationService } from '../../main/service/dataManipulationService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/familyDailyCauseList.json'), 'utf-8');
const dailyReferenceData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(dailyReferenceData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(dailyReferenceData);
sinon.stub(DataManipulationService.prototype, 'manipulatedDailyListData').resolves(dailyReferenceData);

describe('Daily Cause List Page', () => {
  describe('on GET', () => {
    test('should return daily cause list page', () => {
      request(app)
        .get('/family-daily-cause-list?artefactId=test')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
