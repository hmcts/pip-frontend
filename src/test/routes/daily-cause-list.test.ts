import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/dailyCauseList.json'), 'utf-8');
const dailyReferenceData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndivPubJson').resolves(dailyReferenceData);
sinon.stub(PublicationService.prototype, 'getIndivPubMetadata').resolves(dailyReferenceData);
sinon.stub(PublicationService.prototype, 'calculateHearingSessionTime').resolves(dailyReferenceData);

describe('Daily Cause List Page', () => {
  describe('on GET', () => {
    test('should return daily cause list page', () => {
      request(app)
        .get('/daily-cause-list?artefactId=test')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
