import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { CourtService } from '../../main/service/courtService';
import { SummaryOfPublicationsService } from '../../main/service/summaryOfPublicationsService';
import { ManualUploadService } from '../../main/service/manualUploadService';

const URL = '/remove-list-search';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
const courtServiceStub = sinon.stub(CourtService.prototype, 'getCourtById');
sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').withArgs('2', true, true).resolves([]);
sinon.stub(ManualUploadService.prototype, 'formatListRemovalValues').withArgs([]).returns([]);
courtServiceStub.withArgs('2').resolves(true);
courtServiceStub.withArgs('888').resolves(false);

describe('Remove list summary page', () => {
  test('should return remove list summary page page', async () => {
    await request(app)
      .get(URL+ '?locationId=2')
      .expect((res) => expect(res.status).to.equal(200));
  });

  test('should return error page', async () => {
    await request(app)
      .get(URL+ '?locationId=888')
      .expect((res) => expect(res.status).to.equal(200));
  });
});
