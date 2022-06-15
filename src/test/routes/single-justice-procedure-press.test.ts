import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/SJPMockPage.json'), 'utf-8');
const sjpPressData = JSON.parse(rawData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(sjpPressData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(sjpPressData);
sinon.stub(PublicationService.prototype, 'formatSJPPressList').resolves(sjpPressData);

describe('Single Justice Procedure Press Page', () => {
  describe('on GET', () => {
    test('should return Single Justice Procedure Press page', () => {
      app.request['user'] = {piUserId: '2'};
      request(app)
        .get('/sjp-press-list?artefactId=test')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
