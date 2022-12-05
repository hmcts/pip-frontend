import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { DataManipulationService } from '../../main/service/dataManipulationService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/sscsDailyList.json'), 'utf-8');
const sscsData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(sscsData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(sscsData);
sinon.stub(DataManipulationService.prototype, 'manipulateSscsDailyListData').resolves(sscsData);

describe('Sscs Daily List Page', () => {
  describe('on GET', () => {
    test('should return sscs daily list page', async () => {
      app.request['user'] = {userId: '2'};
      await request(app)
        .get('/sscs-daily-list?artefactId=test')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});

